import { Router } from "express";
import { getSummary, getByModel, getByUseCase } from "../../modules/llm-usage/llm-usage.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/llm-usage/summary", requireAuth, getSummary);
router.get("/llm-usage/by-model", requireAuth, getByModel);
router.get("/llm-usage/by-usecase", requireAuth, getByUseCase);

export default router;
