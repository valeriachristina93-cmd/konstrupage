
"use server";

import { generatePageFlow } from "@/ai/flows/generate-page-flow";
import { extractContentFlow } from "@/ai/flows/extract-content-flow";
import { z } from 'zod';

const ExtractContentInputSchema = z.object({
  url: z.string().url(),
});

const StructuredPromptSchema = z.object({
  pageType: z.string(),
  productName: z.string().optional(),
  videoReviewLink: z.string().optional(),
  salesPageLink: z.string().optional(),
  affiliateLink: z.string().optional(),
  description: z.string(),
  advancedSettings: z.object({
    facebookPixelId: z.string().optional(),
    googleAdsId: z.string().optional(),
    customHtml: z.string().optional(),
  }),
});


export async function generatePage(structuredPrompt: z.infer<typeof StructuredPromptSchema>) {
    try {
        const result = await generatePageFlow(structuredPrompt);
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

export async function generatePageFromApi(apiUrl: string, apiKey?: string) {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`A chamada à API falhou com status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        // Aqui, assumimos que a API retorna um objeto compatível com PageConfig.
        // Validações adicionais com Zod podem ser adicionadas aqui se necessário.
        return data;

    } catch (error: any) {
        console.error("Error in generatePageFromApi server action:", error);
        throw new Error(error.message || "Falha ao buscar dados da API externa.");
    }
}
