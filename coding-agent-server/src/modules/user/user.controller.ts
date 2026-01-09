import { AuthRequest } from "../../middleware/auth.middleware";
import { errorWrapper } from "../../middleware/errorWrapper";
import { UserService } from "./user.service";
import { Response } from "express";

const fetchLLMUsage = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const usage = await UserService.fetchLLMUsage(userId);
        if (!usage) {
            return res.status(400).json({
                message: "No LLM usage data found for this user"
            })
        }
        return res.status(200).json({
            message: "LLM usage data fetched successfully",
            data: usage
        })
    }
)

export {
    fetchLLMUsage
}