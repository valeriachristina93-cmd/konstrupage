
"use server";

import { generatePageFlow } from "@/ai/flows/generate-page-flow";

export async function generatePage(description: string) {
    try {
        const result = await generatePageFlow(description);
        return result;
    } catch (error) {
        console.error("Error in generatePage server action:", error);
        throw new Error("Failed to get page structure from AI.");
    }
}
