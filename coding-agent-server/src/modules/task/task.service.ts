import { TaskStatus } from '../../constants/enum';
import { applyFileChanges, cloneRepoInSandbox, commitChange, createAndCheckoutBranch, createPullRequest, pushBranch } from '../../lib/github/repoUtils';
import { runSandboxCommand, startSandbox, stopSandbox } from '../../lib/sandbox/sandBoxUtils';
import { buildPlanningPrompt } from '../../llm/llm.prompt';
import { generateContent } from '../../llm/llm.service';
import { Task } from './task.model';
import { CreateTaskRecordInput } from './task.types';
import { createTaskRecord, saveRepoSummary, understandRepo, updateTaskStatus } from './task.utils';


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
            userInput: JSON.parse(userInput),
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
    const prompt = await buildPlanningPrompt({
        repoSummary: existingTask.repoSummary,
        action: existingTask.action,
        userInput: existingTask.userInput ? JSON.stringify(existingTask.userInput) : undefined
    })

    //  call LLM
    const llmResponse = await generateContent(prompt);
    if (!llmResponse) {
        throw new Error("Failed to generate plan from LLM");
    }

    //  save plan on Task
    await Task.findByIdAndUpdate(
        taskId,
        {
            plan: JSON.parse(llmResponse),
            status: TaskStatus.AWAITING_APPROVAL,
            updatedAt: new Date()
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

    //ensure task is in EXECUTING state
    if (existingTask.status !== TaskStatus.EXECUTING) {
        throw new Error("Task is not in a state to execute");
    }

    //ensure plan is approved
    if (!existingTask.plan || !existingTask.approvedBy) {
        throw new Error("Plan not approved or missing to execute task");
    }

    //start sandbox
    let containerId: string | null = null;
    const logs: string[] = [];

    try {
        logs.push("Starting sandbox environment...");
        containerId = await startSandbox(taskId);

        logs.push(`Cloning repository ${existingTask.repoUrl}...`);
        await cloneRepoInSandbox(containerId, existingTask.repoUrl);

        const branchName = `task-${taskId}-changes`;
        logs.push(`Creating and Checking out branch: ${branchName}...`)
        await createAndCheckoutBranch(containerId, branchName);

        //interate plan
        if (Array.isArray(existingTask.plan)) {
            for (const step of existingTask.plan) {
                logs.push(`Executing step: ${step.description}...`);

                if (step.fileChanges) {
                    for (const file of step.fileChanges) {
                        logs.push(`Writing file: ${file.path}`);
                        await applyFileChanges(containerId, file.path, file.content)
                    }
                }

                if (step.command) {
                    logs.push(`Running command: ${step.command}`);
                    const output = await runSandboxCommand(containerId, step.command);
                    logs.push(`Output: ${output.slice(0, 200)}...`);
                }
            }
        }

        logs.push("Committing changes...");
        await commitChange(containerId, `Task ${taskId} - Applied planned changes`);

        logs.push("Pushing branch to remote...");
        await pushBranch(containerId, branchName);

        logs.push("Creating Pull Request...");
        const prUrl = await createPullRequest(
            existingTask.repoUrl,
            branchName,
        )

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
            executionResult: { status: 'FAILED', logs, error: error.message }
        });
        throw error;
    } finally {
        if (containerId) await stopSandbox(containerId);
    }
}

export const TaskService = {
    createTask,
    setTaskAction,
    generatePlan,
    approvePlan,
    executeTask
}