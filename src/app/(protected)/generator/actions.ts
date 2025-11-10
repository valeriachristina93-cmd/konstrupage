
"use server";

import { generatePageFlow } from "@/ai/flows/generate-page-flow";
import { extractContentFlow } from "@/ai/flows/extract-content-flow";
import { z } from 'zod';

const ExtractContentInputSchema = z.object({
  url: z.string().url(),
});

export async function generatePage(description: string) {
    try {
        const result = await generatePageFlow(description);
        return result;
    } catch (error) {
        console.error("Error in generatePage server action:", error);
        throw new Error("Failed to get page structure from AI.");
    }
}

export async function extractContentFromUrl(url: string) {
    try {
        const validatedInput = ExtractContentInputSchema.parse({ url });
        const result = await extractContentFlow(validatedInput);
        return result;
    } catch (error) {
        console.error("Error in extractContentFromUrl server action:", error);
        if (error instanceof z.ZodError) {
            throw new Error("URL inválida. Por favor, insira uma URL válida.");
        }
        throw new Error("Falha ao extrair conteúdo da URL.");
    }
}
