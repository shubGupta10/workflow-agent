import { Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper";
import { TaskService } from "./task.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { subscriptionService } from "../subscription/subscription.service";

const createTask = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const { repoUrl, action, userInput } = req.body;
        const userId = req.user.userId;

        const taskId = await TaskService.createTask({ repoUrl, userId });

        await subscriptionService.incrementUsage(userId);

        let responseData;
        if (action) {
            const updatedTask = await TaskService.setTaskAction(taskId, action, userInput);
            responseData = {
                taskId: updatedTask._id.toString(),
                status: updatedTask.status,
                action: updatedTask.action,
                userInput: updatedTask.userInput
            };
        } else {
            const taskDetails = await TaskService.taskDetails(taskId);
            responseData = taskDetails;
        }

        res.status(201).json({
            message: "Task created successfully",
            data: responseData
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

        res.setHeader("Content-Type", "application/x-ndjson");
        res.setHeader("Transfer-Encoding", "chunked");

        const generator = await TaskService.generatePlan(taskId, modelId);
        const iterator = generator[Symbol.asyncIterator]();

        let result = await iterator.next();

        while (!result.done) {
            const chunk = result.value;
            res.write(JSON.stringify({ type: "chunk", content: chunk }) + "\n");
            result = await iterator.next();
        }

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