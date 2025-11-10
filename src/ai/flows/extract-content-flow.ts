
'use server';

/**
 * @fileOverview A Genkit flow for extracting content and image URLs from a given website URL.
 *
 * - extractContentFromUrl - A function that takes a URL and returns the main text content and image URLs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractContentInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to extract content from.'),
});

const ExtractContentOutputSchema = z.object({
  textContent: z.string().describe('The main textual content extracted from the webpage.'),
  imageUrls: z.array(z.string().url()).describe('A list of image URLs found in the main content of the webpage.'),
});

export type ExtractContentOutput = z.infer<typeof ExtractContentOutputSchema>;

const extractContentPrompt = ai.definePrompt(
  {
    name: 'extractContentPrompt',
    input: { schema: ExtractContentInputSchema },
    output: { schema: ExtractContentOutputSchema, format: 'json' },
    prompt: `You are a web content extraction expert. Your task is to visit the provided URL, analyze its content, and extract the main article or body text, along with all the image URLs present within that main content.

- Ignore navigation menus, sidebars, footers, and advertisements.
- Focus solely on the primary content of the page (e.g., the blog post, the product description).
- Extract all text from the main content.
- Extract the source URLs of all images (<img> tags) within the main content.

URL to process: {{{url}}}

Respond with ONLY a valid JSON object that conforms to the output schema. Do not include any other text, markdown, or explanations.`,
    config: {
        model: 'googleai/gemini-2.5-flash',
    }
  },
);

export const extractContentFlow = ai.defineFlow(
  {
    name: 'extractContentFlow',
    inputSchema: ExtractContentInputSchema,
    outputSchema: ExtractContentOutputSchema,
  },
  async (input) => {
    const { output } = await extractContentPrompt(input);
    return output!;
  }
);
