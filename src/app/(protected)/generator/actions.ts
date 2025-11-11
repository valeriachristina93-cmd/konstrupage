"use server";

import { generatePage, type GeneratePageInput } from "@/ai/flows/generate-page-flow";

export async function generateSuperPrompt(input: GeneratePageInput) {
    try {
        const result = await generatePage(input);
        return result;
    } catch (error) {
        console.error("Error in generateSuperPrompt server action:", error);
        throw new Error("Failed to get prompt from AI.");
    }
}
