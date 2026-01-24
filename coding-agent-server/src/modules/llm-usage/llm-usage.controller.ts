import { Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LLMUsageService } from "./llm-usage.service";

const getSummary = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const summary = await LLMUsageService.getUserSummary(userId, start, end);

        res.status(200).json({
            message: "Usage summary fetched successfully",
            data: summary
        });
    }
);

const getByModel = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const breakdown = await LLMUsageService.getUsageByModel(userId, start, end);

        res.status(200).json({
            message: "Usage by model fetched successfully",
            data: breakdown
        });
    }
);

const getByUseCase = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const breakdown = await LLMUsageService.getUsageByUseCase(userId, start, end);

        res.status(200).json({
            message: "Usage by use case fetched successfully",
            data: breakdown
        });
    }
);

export {
    getSummary,
    getByModel,
    getByUseCase
};
