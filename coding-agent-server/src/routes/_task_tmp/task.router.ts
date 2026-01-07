import { Router } from "express";

const router = Router();

import { createTask, approvePlan, executeTask, generatePlan, setTaskAction, listSidebarTasks, deleteTask, taskDetails } from "../../modules/task/task.controller";
import { requireAuth } from "../../middleware/auth.middleware";

router.post("/tasks/create-task", requireAuth, createTask);
router.post("/tasks/set-action", requireAuth, setTaskAction);
router.get("/tasks/generate-plan/:taskId", requireAuth, generatePlan);
router.post("/tasks/approve-plan", requireAuth, approvePlan);
router.post("/tasks/execute/:taskId", requireAuth, executeTask);
router.get('/tasks/sidebar', requireAuth, listSidebarTasks);
router.delete('/tasks/:taskId', requireAuth, deleteTask)
router.get('/tasks/details/:taskId', requireAuth, taskDetails)
export default router;