import { Request, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper";
import { TaskService } from "./task.service";

const createTask = errorWrapper(
    async (req: Request, res: Response) => {
        const { repoUrl, status, userId } = req.body;

        const task = await TaskService.createTask({ repoUrl, status, userId });
        res.status(201).json({
            message: "Task created successfully",
            data: task
        })
    }
)

const setTaskAction = errorWrapper(
    async (req: Request, res: Response) => {
        const { taskId, action, userInput } = req.body;
        const updatedTask = await TaskService.setTaskAction(taskId, action, userInput);
        res.status(200).json({
            message: "Task action set successfully",
            data: updatedTask
        })
    }
)

const generatePlan = errorWrapper(
    async (req: Request, res: Response) => {
        const { taskId } = req.params;
        const plan = await TaskService.generatePlan(taskId);
        res.status(200).json({
            message: "Plan generated successfully",
            data: plan
        })
    }
)

const approvePlan = errorWrapper(
    async (req: Request, res: Response) => {
        const { taskId, approvedBy } = req.body;
        const updatedTask = await TaskService.approvePlan(taskId, approvedBy);
        res.status(200).json({
            message: "Plan approved successfully",
            data: updatedTask
        })
    }
)

const executeTask = errorWrapper(
    async (req: Request, res: Response) => {
        const { taskId } = req.params;
        const executionResult = await TaskService.executeTask(taskId);
        res.status(200).json({
            message: "Task executed successfully",
            data: executionResult
        })
    }
)

export {
    createTask,
    setTaskAction,
    generatePlan,
    approvePlan,
    executeTask
}