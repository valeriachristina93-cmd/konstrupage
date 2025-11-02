"use server";

import { suggestImageLayout, type SuggestImageLayoutInput } from "@/ai/flows/suggest-image-layout";

export async function getSuggestedLayout(input: SuggestImageLayoutInput) {
    try {
        const result = await suggestImageLayout(input);
        return result;
    } catch (error) {
        console.error("Error in getSuggestedLayout server action:", error);
        throw new Error("Failed to get layout suggestion from AI.");
    }
}
