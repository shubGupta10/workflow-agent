import { Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LLMService } from "./llm.service";

const getModels = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const data = LLMService.getModels();
        res.status(200).json({
            message: "Models fetched successfully",
            data
        });
    }
);

export {
    getModels
};
