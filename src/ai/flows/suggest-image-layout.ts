'use server';

/**
 * @fileOverview A Genkit flow for suggesting optimal layout and image sizes for a presell page.
 *
 * - suggestImageLayout - A function that suggests layout and image sizes.
 * - SuggestImageLayoutInput - The input type for the suggestImageLayout function.
 * - SuggestImageLayoutOutput - The return type for the suggestImageLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImageLayoutInputSchema = z.object({
  desktopImage: z.string().describe('URL of the desktop image.'),
  mobileImage: z.string().describe('URL of the mobile image.'),
  imageHeightDesktop: z.number().describe('Current height of the desktop image.'),
  imageHeightMobile: z.number().describe('Current height of the mobile image.'),
  overlayActive: z.boolean().describe('Whether overlay is active or not'),
});

export type SuggestImageLayoutInput = z.infer<typeof SuggestImageLayoutInputSchema>;

const SuggestImageLayoutOutputSchema = z.object({
  suggestedLayout: z.string().describe('Suggested layout type.'),
  suggestedDesktopHeight: z.number().describe('Suggested desktop image height.'),
  suggestedMobileHeight: z.number().describe('Suggested mobile image height.'),
});

export type SuggestImageLayoutOutput = z.infer<typeof SuggestImageLayoutOutputSchema>;

export async function suggestImageLayout(input: SuggestImageLayoutInput): Promise<SuggestImageLayoutOutput> {
  return suggestImageLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImageLayoutPrompt',
  input: {schema: SuggestImageLayoutInputSchema},
  output: {schema: SuggestImageLayoutOutputSchema},
  prompt: `Given the following information about a presell page, suggest an optimal layout and image sizes.

Desktop Image URL: {{{desktopImage}}}
Mobile Image URL: {{{mobileImage}}}
Desktop Image Height: {{{imageHeightDesktop}}}
Mobile Image Height: {{{imageHeightMobile}}}
Overlay Active: {{{overlayActive}}}

Consider these factors when suggesting layout and image sizes:
- Visual appeal
- Effectiveness in driving conversions
- Responsiveness across different devices

Suggest a layout type (e.g., 'image-text', 'two-column', 'full-screen-image') and specific height in pixels for the desktop and mobile images.

Ensure that your suggestion is precise and practical for implementation.

Layout Type: {{suggestedLayout}}
Desktop Image Height: {{suggestedDesktopHeight}}
Mobile Image Height: {{suggestedMobileHeight}}`,
});

const suggestImageLayoutFlow = ai.defineFlow(
  {
    name: 'suggestImageLayoutFlow',
    inputSchema: SuggestImageLayoutInputSchema,
    outputSchema: SuggestImageLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

