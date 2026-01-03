import { Router } from "express";

const router = Router();

import { createTask, approvePlan, executeTask, generatePlan, setTaskAction } from "../../modules/task/task.controller";
import { requireAuth } from "../../middleware/auth.middleware";

router.post("/tasks/create-task", requireAuth, createTask);
router.post("/tasks/set-action", requireAuth, setTaskAction);
router.get("/tasks/generate-plan/:taskId", requireAuth, generatePlan);
router.post("/tasks/approve-plan", requireAuth, approvePlan);
router.post("/tasks/execute/:taskId", requireAuth, executeTask);
export default router;