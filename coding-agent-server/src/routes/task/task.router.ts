import { Router } from "express";

const router = Router();

import { createTask, approvePlan, executeTask, generatePlan, setTaskAction, listSidebarTasks, deleteTask, taskDetails } from "../../modules/task/task.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { rateLimit } from "../../middleware/ratelimit.middleware";

router.post("/tasks/create-task", requireAuth, rateLimit({ key: "create-task", limit: 5, windowInSeconds: 60 }), createTask);

router.post("/tasks/set-action", requireAuth, setTaskAction);

router.post("/tasks/generate-plan/:taskId", requireAuth, rateLimit({ key: "generate-plan", limit: 5, windowInSeconds: 60 }), generatePlan);

router.post("/tasks/approve-plan", requireAuth, rateLimit({ key: "approve-plan", limit: 5, windowInSeconds: 60 }), approvePlan);

router.post("/tasks/execute/:taskId", requireAuth, rateLimit({ key: "execute-task", limit: 5, windowInSeconds: 60 }), executeTask);

router.get('/tasks/sidebar', requireAuth, listSidebarTasks);

router.delete('/tasks/:taskId', requireAuth, deleteTask)

router.get('/tasks/details/:taskId', requireAuth, taskDetails)
export default router;