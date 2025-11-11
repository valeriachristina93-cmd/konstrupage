
"use server";

import { z } from 'zod';
import { generatePageFlow } from '@/ai/flows/generate-page-flow';


const StructuredPromptSchema = z.object({
  pageType: z.string(),
  productName: z.string().optional(),
  videoReviewLink: z.string().optional(),
  salesPageLink: z.string().optional(),
  affiliateLink: z.string().optional(),
  description: z.string(),
  language: z.string().optional(),
  advancedSettings: z.object({
    facebookPixelId: z.string().optional(),
    googleAdsId: z.string().optional(),
    customHtml: z.string().optional(),
  }),
});


export async function generatePage(structuredPrompt: z.infer<typeof StructuredPromptSchema>) {
    try {
        // This function now acts as a "super prompt" generator.
        // It takes structured data and merges it with a template.
        const result = await generatePageFlow(structuredPrompt);
        return result;
    } catch (error) {
        console.error("Error in generatePage server action:", error);
        throw new Error("Failed to get page structure from AI.");
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
        // Here, we assume the API returns an object compatible with PageConfig.
        // Additional Zod validations could be added here if needed.
        return data;

    } catch (error: any) {
        console.error("Error in generatePageFromApi server action:", error);
        throw new Error(error.message || "Falha ao buscar dados da API externa.");
    }
}


    