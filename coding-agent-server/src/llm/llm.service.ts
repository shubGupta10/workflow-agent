import genAI from "./llm.client";

export const generateContent = async (prompt: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        })

        const result = await model.generateContent(prompt);

        const response = result.response;

        return response.text();
    } catch (error) {
        console.error('LLM generation failed:', error);
        throw new Error('Failed to generate response from Gemini');
    }
}