import { Task } from "../task/task.model"

const fetchLLMUsage = async (userId: string) => {
    const result = await Task.aggregate([
        { $match: { userId: userId } },
        { $match: { llmUsage: { $exists: true, $ne: null } } },

        {
            $group: {
                _id: null,
                totalInputTokens: { $sum: "$llmUsage.inputTokens" },
                totalOutputTokens: { $sum: "$llmUsage.outputTokens" },
                totalTokens: { $sum: "$llmUsage.totalTokens" },
                taskCount: { $sum: 1 }
            }
        }
    ]);

    const byPurpose = await Task.aggregate([
        { $match: { userId: userId, llmUsage: { $exists: true } } },
        {
            $group: {
                _id: "$llmUsage.purpose",
                inputTokens: { $sum: "llmUsage.inputTokens" },
                outputTokens: { $sum: "llmUsage.outputTokens" },
                totalTokens: { $sum: "llmUsage.totalTokens" },
                count: { $sum: 1 }
            }
        }
    ]);


    const byModel = await Task.aggregate([
        { $match: { userId: userId, llmUsage: { $exists: true } } },
        {
            $group: {
                _id: "$llmUsage.model",
                inputTokens: { $sum: "$llmUsage.inputTokens" },
                outputTokens: { $sum: "$llmUsage.outputTokens" },
                totalTokens: { $sum: "$llmUsage.totalTokens" },
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        totalInputTokens: result[0].totalInputTokens || 0,
        totalOutputTokens: result[0].totalOutputTokens || 0,
        totalTokens: result[0].totalTokens || 0,
        taskCount: result[0].taskCount || 0,
        byPurpose: byPurpose,
        byModel: byModel
    };
}

export const UserService = {
    fetchLLMUsage
}