import { TaskStatus } from '../../constants/enum';
import { buildPlanningPrompt } from '../../llm/llm.prompt';
import { generateContent } from '../../llm/llm.service';
import { Task } from './task.model';
import { CreateTaskRecordInput } from './task.types';
import { createTaskRecord, saveRepoSummary, understandRepo, updateTaskStatus } from './task.utils';


export async function createTask(input: CreateTaskRecordInput) {
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

export async function setTaskAction(taskId: string, action: string, userInput: string) {
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

export async function generatePlan(taskId: string) {
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