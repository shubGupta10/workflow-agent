import { CreateTaskRecordInput, RepoSummary } from "./task.types";
import { Task } from "./task.model";
import { execAsync, INTERNAL_ANALYSIS_SCRIPT } from "../../constants/repoIngest";

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
    const containerName = `sandbox-${taskId}`
    const image = `node:18-alpine`

    try {
        // start sandbox
        await execAsync(`docker run -d --name ${containerName} --rm --workdir /app ${image} tail -f /dev/null`);

        //install git and clonse
        await execAsync(`docker exec ${containerName} apk add --no-cache git`)
        await execAsync(`docker exec ${containerName} git clone --depth 1 ${repoUrl}`)

        //run analysis script
        const { stdout } = await execAsync(
            `docker exec -i ${containerName} node -e "${INTERNAL_ANALYSIS_SCRIPT.replace(/"/g, '\\"')}"`
        )

        //cleanup
        await execAsync(`docker stop ${containerName}`)

        const result = JSON.parse(stdout.trim());
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