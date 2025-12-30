import { Router } from "express";

const router = Router();

import { createTask, approvePlan, executeTask, generatePlan, setTaskAction } from "../../modules/task/task.controller";

router.post("/tasks/create-task", createTask);
router.post("/tasks/set-action/:taskId", setTaskAction);
router.get("/tasks/generate-plan/:taskId", generatePlan);
router.post("/tasks/approve-plan/:taskId", approvePlan);
router.post("/tasks/execute/:taskId", executeTask);
export default router;