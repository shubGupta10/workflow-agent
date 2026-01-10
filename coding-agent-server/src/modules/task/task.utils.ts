import { CreateTaskRecordInput, RepoSummary } from "./task.types";
import { Task } from "./task.model";
import { execAsync, INTERNAL_ANALYSIS_SCRIPT } from "../../constants/repoIngest";
import { executeLLM } from "../../llm/llm.executor";
import octokit from "../../lib/Octokit";
import crypto from "crypto";
import redis, { CACHE_TTL_SECONDS } from "../../lib/redis";

function normalizeRepoUrl(repoUrl: string) {
    return repoUrl
        .trim()
        .replace(/\.git$/, "")
        .toLowerCase();
}

function getRepoCacheKey(repoUrl: string) {
    const normalized = normalizeRepoUrl(repoUrl);
    const hash = crypto.createHash("sha256").update(normalized).digest("hex");
    return `repo:summary:${hash}`;
}

export async function createTaskRecord(taskData: CreateTaskRecordInput) {
    const { repoUrl, status, userId } = taskData;

    if (!repoUrl || !status) {
        throw new Error("Missing required fields to create a task record");
    }

    const newTask = await Task.create({
        repoUrl,
        status,
        userId
    })

    return newTask;
}

export async function updateTaskStatus(taskId: string, status: string) {
    if (!taskId || !status) {
        throw new Error("Missing required fields to update task status");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }
    )

    return updatedTask;
}

export async function understandRepo(repoUrl: string, taskId: string) {

    const cacheKey = getRepoCacheKey(repoUrl);

    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            return {
                taskId,
                repoUrl,
                ...JSON.parse(cached),
                _cached: true
            };
        }
    } catch (error) {
        console.warn("[REDIS] Cache read failed, continuing without cache");
    }

    const containerName = `sandbox-${taskId}`
    const image = `node:18-alpine`

    try {
        console.log(`[DEBUG] Starting docker container: ${containerName}`)
        // Start sandbox
        const { stdout: runOut } = await execAsync(`docker run -d --name ${containerName} --rm --workdir /app ${image} tail -f /dev/null`);
        console.log(`[DEBUG] Container created: ${runOut.trim()}`)

        // Install git
        console.log(`[DEBUG] Installing git...`)
        await execAsync(`docker exec ${containerName} apk add --no-cache git`)

        console.log(`[DEBUG] Cloning repo: ${repoUrl}`)
        const { stdout: cloneOut, stderr: cloneErr } = await execAsync(`docker exec ${containerName} git clone --depth 1 ${repoUrl} .`)
        console.log(`[DEBUG] Clone stdout: ${cloneOut}`)
        // Git writes progress to stderr, so we only log it, we don't treat it as a crash
        if (cloneErr) console.log(`[DEBUG] Clone stderr: ${cloneErr}`)

        // --- FIX START ---
        console.log(`[DEBUG] Creating analysis script...`)
        const scriptPath = '/tmp/analyze.js'

        // 1. Base64 encode the script to bypass all shell escaping issues
        const scriptBase64 = Buffer.from(INTERNAL_ANALYSIS_SCRIPT).toString('base64');

        // 2. Decode it inside the container and run it
        // We use 'base64 -d' (standard in Alpine Linux) to decode
        const { stdout, stderr } = await execAsync(
            `docker exec ${containerName} sh -c "echo '${scriptBase64}' | base64 -d > ${scriptPath} && node ${scriptPath}"`
        )
        // --- FIX END ---

        console.log(`[DEBUG] Script stdout: ${stdout}`)
        console.log(`[DEBUG] Script stderr: ${stderr}`)

        // Cleanup
        await execAsync(`docker stop ${containerName}`)

        const trimmedOutput = stdout.trim();

        if (!trimmedOutput) {
            // If stderr has content, it might be a Node runtime error
            throw new Error(`No output from analysis script. Stderr says: ${stderr || 'Empty'}`);
        }

        const result = JSON.parse(trimmedOutput);

        await redis.set(
            cacheKey,
            JSON.stringify(result),
            'EX',
            CACHE_TTL_SECONDS
        )
        return {
            taskId,
            repoUrl,
            ...result
        };
    } catch (error) {
        try { await execAsync(`docker stop ${containerName}`); } catch (e) { }
        throw error;
    }
}

export async function saveRepoSummary(taskId: string, repoSummary: RepoSummary) {
    if (!taskId || !repoSummary) {
        throw new Error("Missing required fields to save repo summary");
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    existingTask.repoSummary = repoSummary as any;
    existingTask.updatedAt = new Date();


    return await existingTask.save();
}

export async function generateCodeFromPlan(plan: string, repoUrl: string) {
    const prompt = `
    You are an expert coding assistant.
    
    Here is the APPROVED PLAN for a task on repository ${repoUrl}:
    
    ${plan}
    
    ==================================================
    YOUR GOAL:
    Convert this textual plan into a machine-readable JSON array of execution steps.
    
    RULES:
    1. RETURN ONLY VALID JSON. No markdown code blocks, no explanation text before or after.
    2. The output must be a valid JSON array of steps.
    3. Each step must have:
       - "description": string (required)
       - "fileChanges": array of { "path": string, "content": string } (optional)
       - "command": string (optional - e.g. "npm install")
    4. CRITICAL: Ensure all strings are properly escaped for JSON (escape quotes, backslashes, newlines, etc.)
    5. CRITICAL: File content should use proper JSON escape sequences: \\n for newlines, \\" for quotes, \\\\ for backslashes
    6. Do NOT wrap the JSON in markdown code blocks.
    7. Ensure the JSON is compact and valid.
    
    Example Output Format:
    [
        {
            "description": "Install dependencies",
            "command": "npm install zod"
        },
        {
            "description": "Create validation file",
            "fileChanges": [
                {
                    "path": "lib/validation.ts",
                    "content": "import { z } from 'zod';\\n\\nexport const schema = z.object({\\n  name: z.string()\\n});"
                }
            ]
        }
    ]
    
    START YOUR RESPONSE WITH [ AND END WITH ] - NO OTHER TEXT.
    `;

    const llmResponse = await executeLLM({
        prompt,
        useCase: "CODE_GENERATION"
    });

    const response = llmResponse.text;

    console.log('[DEBUG] Raw LLM Response (first 500 chars):', response.substring(0, 500));

    // Remove markdown code blocks if present
    let cleanJson = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Remove any leading/trailing text that's not part of JSON
    const jsonStart = cleanJson.indexOf('[');
    const jsonEnd = cleanJson.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
        console.error('[ERROR] No valid JSON array found in response');
        console.error('[ERROR] Response:', cleanJson.substring(0, 500));
        throw new Error("LLM response does not contain a valid JSON array");
    }

    cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);

    console.log('[DEBUG] Cleaned JSON (first 500 chars):', cleanJson.substring(0, 500));

    try {
        const parsed = JSON.parse(cleanJson);

        // Validate the structure
        if (!Array.isArray(parsed)) {
            throw new Error("Response is not an array");
        }

        for (const step of parsed) {
            if (!step.description) {
                throw new Error("Step missing required 'description' field");
            }
        }

        console.log(`[DEBUG] Successfully parsed ${parsed.length} steps`);
        return parsed;
    } catch (e: any) {
        console.error('[ERROR] JSON Parse Error:', e.message);
        console.error('[ERROR] Failed JSON (first 1000 chars):', cleanJson.substring(0, 1000));

        // Try to provide a helpful error message
        const match = e.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            const context = cleanJson.substring(Math.max(0, pos - 50), Math.min(cleanJson.length, pos + 50));
            console.error(`[ERROR] Error near position ${pos}: ...${context}...`);
        }

        throw new Error(`Failed to parse LLM response as JSON: ${e.message}. Check server logs for details.`);
    }
}

export async function fetchPRsDiff(prUrl: string) {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;
    const match = prUrl.match(regex);

    if (!match) {
        throw new Error("Invalid GitHub PR URL");
    }

    const [_, owner, repo, pull_Number] = match;

    try {
        const response = await octokit.pulls.get({
            owner,
            repo,
            pull_number: parseInt(pull_Number),
            mediaType: {
                format: "diff"
            }
        });

        return response.data as unknown as string
    } catch (error: any) {
        throw new Error(`Failed to fetch PR diff: ${error.message}`);
    }
}