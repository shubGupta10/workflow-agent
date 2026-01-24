import { Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper";
import { TaskService } from "./task.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const createTask = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { repoUrl } = req.body;
        const userId = req.user.userId;

        const task = await TaskService.createTask({ repoUrl, userId });
        res.status(201).json({
            message: "Task created successfully",
            data: task
        })
    }
)

const setTaskAction = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId, action, userInput } = req.body;
        const updatedTask = await TaskService.setTaskAction(taskId, action, userInput);
        res.status(200).json({
            message: "Task action set successfully",
            data: updatedTask
        })
    }
)

const generatePlan = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;
        const { modelId } = req.body;

        // Set headers for NDJSON streaming
        res.setHeader("Content-Type", "application/x-ndjson");
        res.setHeader("Transfer-Encoding", "chunked");

        const generator = await TaskService.generatePlan(taskId, modelId);
        const iterator = generator[Symbol.asyncIterator]();

        // Manual iteration to capture the return value (usage data)
        let result = await iterator.next();

        while (!result.done) {
            const chunk = result.value;
            // Send text chunk as JSON line
            res.write(JSON.stringify({ type: "chunk", content: chunk }) + "\n");
            result = await iterator.next();
        }

        // Send usage data as final JSON line
        if (result.value) {
            res.write(JSON.stringify({ type: "usage", data: result.value }) + "\n");
        }

        res.end();
    }
)

const approvePlan = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId, approvedBy } = req.body;
        const updatedTask = await TaskService.approvePlan(taskId, approvedBy);
        res.status(200).json({
            message: "Plan approved successfully",
            data: updatedTask
        })
    }
)

const executeTask = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;
        const executionResult = await TaskService.executeTask(taskId);
        res.status(200).json({
            message: "Task executed successfully",
            data: executionResult
        })
    }
)

const listSidebarTasks = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;

        const tasks = await TaskService.listSidebarTasks(userId);
        if (!tasks) {
            return res.status(400).json({
                message: "No Tasks found for this user"
            })
        }

        return res.status(200).json({
            message: "Tasks fetched successfully",
            data: tasks
        })
    }
)

const deleteTask = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;

        await TaskService.deleteTask(taskId);
        return res.status(200).json({
            message: "Task deleted successfully"
        })
    }
)

const taskDetails = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;

        const task = await TaskService.taskDetails(taskId);
        if (!task) {
            return res.status(400).json({
                message: "Task not found"
            })
        }

        return res.status(200).json({
            message: "Task details fetched successfully",
            data: task,
        })
    }
)

export {
    createTask,
    setTaskAction,
    generatePlan,
    approvePlan,
    executeTask,
    listSidebarTasks,
    deleteTask,
    taskDetails
}