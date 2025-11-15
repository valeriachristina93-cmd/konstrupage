"use server";

import { generatePage as generatePageFlow, type GeneratePageInput } from "@/ai/flows/generate-page-flow";

export async function generatePage(input: GeneratePageInput): Promise<string> {
    try {
        const result = await generatePageFlow(input);
        return result;
    } catch (error) {
        console.error("Error in generatePage server action:", error);
        throw new Error("Failed to get prompt from AI.");
    }
}
