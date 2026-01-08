import { TaskStatus } from '../../constants/enum';
import { applyFileChanges, cloneRepoInSandbox, commitChange, createAndCheckoutBranch, createPullRequest, pushBranch } from '../../lib/github/repoUtils';
import { runSandboxCommand, startSandbox, stopSandbox } from '../../lib/sandbox/sandBoxUtils';
import { buildPlanningPrompt, buildReviewPrompt } from '../../llm/llm.prompt';
import { generatePlanLLM, reviewPullRequest } from '../../llm/llm.service';
import { User } from '../user/user.model';
import { Task, TaskAction } from './task.model';
import { CreateTaskRecordInput } from './task.types';
import { createTaskRecord, fetchPRsDiff, generateCodeFromPlan, saveRepoSummary, understandRepo, updateTaskStatus } from './task.utils';


const createTask = async (input: CreateTaskRecordInput) => {
    const { repoUrl, userId } = input;

    //create task
    const task = await createTaskRecord({
        repoUrl,
        status: TaskStatus.CREATED,
        userId
    })


    //move to repo understanding
    await updateTaskStatus(task._id.toString(), TaskStatus.UNDERSTANDING_REPO);

    //understand repo
    const repoSummary = await understandRepo(repoUrl, task._id.toString());

    //persist understanding
    await saveRepoSummary(task._id.toString(), repoSummary);

    //ready for user action
    await updateTaskStatus(task._id.toString(), TaskStatus.AWAITING_ACTION);

    await Task.create({
        repoUrl: repoUrl,
        repoBranch: task.repoBranch,
        status: TaskStatus.AWAITING_ACTION,
        userId: userId
    })

    return task._id.toString();
}

const setTaskAction = async (taskId: string, action: string, userInput: string) => {
    if (!taskId || !action) {
        throw new Error("Missing required fields to set task action");
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    if (existingTask.status !== TaskStatus.AWAITING_ACTION) {
        throw new Error("Task is not in a state to set action");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            action,
            userInput: userInput,
            status: TaskStatus.PLANNING
        },
        { new: true }
    )

    await Task.findByIdAndUpdate(
        taskId,
        {
            action: action,
            userInput: userInput,
            status: TaskStatus.PLANNING
        },
        { new: true }
    )

    return updatedTask;
}

const generatePlan = async (taskId: string) => {
    // fetch Task by taskId
    if (!taskId) {
        throw new Error("Missing taskId to generate plan");
    }

    //  ensure task.status == PLANNING
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    if (existingTask.status !== TaskStatus.PLANNING) {
        throw new Error("Task is not in a state to generate plan");
    }

    //  ensure required data exists
    if (!existingTask.repoSummary || !existingTask.action) {
        throw new Error("Insufficient data to generate plan");
    }

    //  build planning prompt
    let prompt;
    let nextStatus = TaskStatus.AWAITING_APPROVAL;

    if (existingTask.action === TaskAction.REVIEW_PR) {
        let prUrl = existingTask.userInput || "";
        try {
            const parsed = JSON.parse(prUrl as string);
            if (parsed.prUrl) prUrl = parsed.prUrl;
        } catch (error) {
            // ignore JSON parse error
        }


        const diff = await fetchPRsDiff(prUrl as string);

        prompt = buildReviewPrompt({
            repoSummary: existingTask.repoSummary,
            diff: diff,
            userInput: typeof existingTask.userInput === 'string' ? existingTask.userInput : JSON.stringify(existingTask.userInput)
        });

        nextStatus = TaskStatus.COMPLETED
    } else {
        prompt = await buildPlanningPrompt({
            repoSummary: existingTask.repoSummary,
            action: existingTask.action,
            // Ensure userInput is a string for the prompt
            userInput: existingTask.userInput
                ? (typeof existingTask.userInput === 'string' ? existingTask.userInput : JSON.stringify(existingTask.userInput))
                : undefined
        });

        nextStatus = TaskStatus.AWAITING_APPROVAL;
    }

    //  call LLM
    let llmResponse;

    if (llmResponse.action === TaskAction.REVIEW_PR) {
        llmResponse = await reviewPullRequest(prompt);
    } else {
        llmResponse = await generatePlanLLM(prompt);
    }

    if (!llmResponse) {
        throw new Error("Failed to generate plan from LLM");
    }

    //store llm usage
    const usage = llmResponse.usage;

    const llmUsagePayload = usage
        ? {
            purpose:
                existingTask.action === TaskAction.REVIEW_PR
                    ? "PR_REVIEW"
                    : "PLAN_GENERATION",
            model: llmResponse.model,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            totalTokens: usage.totalTokens,
            createdAt: new Date(),
        }
        : undefined;

    //  save plan on Task
    await Task.findByIdAndUpdate(
        taskId,
        {
            plan: llmResponse.text,
            status: nextStatus,
            llmUsage: llmUsagePayload,
            updatedAt: new Date(),
            ...(nextStatus === TaskStatus.COMPLETED ? {
                result: { review: llmResponse.text },
                executionLog: { message: "Review generated successfully. No execution required." }
            } : {})
        },
        { new: true }
    )

    return llmResponse;
}

const approvePlan = async (taskId: string, approvedBy: string) => {
    //  validate inputs
    if (!taskId || !approvedBy) {
        throw new Error("Missing required fields to approve plan");
    }

    //fetch task by its taskId
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    //ensure status is AWAITING_APPROVAL
    if (existingTask.status !== TaskStatus.AWAITING_APPROVAL) {
        throw new Error("Task is not in a state to approve plan");
    }

    //ensure plan exists
    if (!existingTask.plan) {
        throw new Error("No plan found to approve");
    }

    //mark approval
    existingTask.approvedAt = new Date();
    existingTask.approvedBy = approvedBy;

    //move task to executing
    existingTask.status = TaskStatus.EXECUTING;

    await existingTask.save();

    return existingTask;
}

const executeTask = async (taskId: string) => {
    // validate inputs
    if (!taskId) {
        throw new Error("Missing taskId to execute task");
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    // Get GitHub token for push operations
    let githubToken: string | undefined;

    // Only query user if userId is a valid MongoDB ObjectId
    if (existingTask.userId && /^[0-9a-fA-F]{24}$/.test(existingTask.userId)) {
        try {
            const user = await User.findById(existingTask.userId).select('+githubAccessToken');
            githubToken = user?.githubAccessToken;
        } catch (err) {
            console.warn('[WARNING] Failed to fetch user GitHub token:', err);
        }
    }

    // Fallback to environment variable for testing (until OAuth is implemented)
    if (!githubToken) {
        githubToken = process.env.GITHUB_ACCESS_TOKEN;
        if (!githubToken) {
            console.warn('[WARNING] No GitHub token available. Push and PR creation will fail.');
            console.warn('[INFO] Add GITHUB_ACCESS_TOKEN to .env or implement OAuth to enable these features.');
        }
    }

    //ensure task is in EXECUTING state
    if (existingTask.status !== TaskStatus.EXECUTING) {
        throw new Error("Task is not in a state to execute");
    }

    //ensure plan is approved
    if (!existingTask.plan || !existingTask.approvedBy) {
        throw new Error("Plan not approved or missing to execute task");
    }

    //generate code from plan
    const excutablePlan = await generateCodeFromPlan(
        (existingTask.plan as unknown) as string,
        existingTask.repoUrl
    )

    //start sandbox
    let containerId: string | null = null;
    let repoName: string | null = null;
    const logs: string[] = [];

    try {
        logs.push("Starting sandbox environment...");
        containerId = await startSandbox(taskId);

        logs.push(`Cloning repository ${existingTask.repoUrl}...`);
        repoName = await cloneRepoInSandbox(containerId, existingTask.repoUrl, githubToken);
        logs.push(`Repository cloned as: ${repoName}`);

        const branchName = `task-${taskId}-changes`;
        logs.push(`Creating and Checking out branch: ${branchName}...`)
        await createAndCheckoutBranch(containerId, branchName, repoName);

        //interate plan
        if (Array.isArray(excutablePlan) && repoName) {
            for (const step of excutablePlan) {
                logs.push(`Executing step: ${step.description}...`);

                if (step.fileChanges) {
                    for (const file of step.fileChanges) {
                        logs.push(`Writing file: ${file.path}`);
                        await applyFileChanges(containerId, file.path, file.content, repoName)
                    }
                    // Stage all changes to git after writing files
                    logs.push(`Staging changes to git...`);
                    await runSandboxCommand(containerId, `cd ${repoName} && git add .`);
                }

                if (step.command) {
                    logs.push(`Running command: ${step.command}`);
                    try {
                        // Ensure commands run inside the repo directory
                        const output = await runSandboxCommand(containerId, `cd ${repoName} && ${step.command}`);
                        logs.push(`Output: ${output.slice(0, 200)}...`);
                    } catch (cmdError: any) {
                        // Handle git mv failure with fallback to regular mv
                        if (step.command.includes('git mv') && cmdError.stderr?.includes('bad source')) {
                            logs.push(`[FALLBACK] git mv failed, trying regular mv instead...`);
                            const mvCommand = step.command.replace('git mv', 'mv');
                            const output = await runSandboxCommand(containerId, `cd ${repoName} && ${mvCommand}`);
                            logs.push(`[FALLBACK] File moved successfully: ${output.slice(0, 100)}...`);
                            // Stage the changes
                            await runSandboxCommand(containerId, `cd ${repoName} && git add .`);
                            logs.push(`Changes staged after fallback mv`);
                        } else {
                            throw cmdError;
                        }
                    }
                }
            }
        }

        logs.push("Committing changes...");
        await commitChange(containerId, `Task ${taskId} - Applied planned changes`, repoName!);

        logs.push("Pushing branch to remote...");
        await pushBranch(containerId, branchName, repoName!, githubToken);

        logs.push("Creating Pull Request...");
        const prUrl = await createPullRequest(
            existingTask.repoUrl,
            branchName,
            githubToken
        );

        existingTask.executionLog = {
            prUrl,
            branchName,
            logs,
        };
        existingTask.status = TaskStatus.COMPLETED;
        await existingTask.save();

        return existingTask;

    } catch (error: any) {
        console.error("Task Execution Failed:", error);
        logs.push(`ERROR: ${error.message}`);

        await Task.findByIdAndUpdate(taskId, {
            status: TaskStatus.FAILED,
            executionLog: { status: 'FAILED', logs, error: error.message },
            error: error.message
        });
        throw error;
    } finally {
        if (containerId) await stopSandbox(containerId);
    }
}

const listSidebarTasks = async (userId: string) => {
    const tasks = await Task.find({
        userId: userId
    }, {
        _id: 1,
        repoUrl: 1,
        userId: 1,
        status: 1,
        action: 1,
        createdAt: 1,
        updatedAt: 1
    }).sort({ createdAt: -1 });

    return tasks.map(task => {
        return {
            taskId: task._id.toString(),
            userId: task.userId,
            repoUrl: task.repoUrl,
            status: task.status,
            action: task.action,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }
    })
}

const deleteTask = async (taskId: string) => {
    if (!taskId) {
        throw new Error("TaskId is required to delete task");
    }

    const deleted = await Task.findByIdAndDelete(taskId);
    if (!deleted) {
        throw new Error("Task not found or already deleted");
    }

    return true;
}

const taskDetails = async (taskId: string) => {
    if (!taskId) {
        throw new Error("TaskId is required to fetch task details");
    }

    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }

    const payload = {
        taskId: task._id.toString(),
        status: task.status,
        action: task.action,
        userInput: task.userInput,
        repoSummary: task.repoSummary,
        plan: task.plan,
        executionLog: task.executionLog,
        result: task.result,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }

    return payload;
}

export const TaskService = {
    createTask,
    setTaskAction,
    generatePlan,
    approvePlan,
    executeTask,
    listSidebarTasks,
    deleteTask,
    taskDetails
}