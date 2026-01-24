import { Router } from "express";
import { getModels } from "../../modules/llm/llm.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/llm/models", requireAuth, getModels);

export default router;
