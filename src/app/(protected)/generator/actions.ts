
"use server";

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Definição de Input movida para cá
const GeneratePageInputSchema = z.object({
  pageType: z.string().describe('The type of page to generate (e.g., "Review" or "Sales").'),
  productName: z.string().describe('The name of the product.'),
  videoReviewLink: z.string().optional().describe('An optional link to a video review for context.'),
  salesPageLink: z.string().describe('A link to the product\'s sales page, used as a primary source of information.'),
  affiliateLink: z.string().describe('The affiliate link that should be used for calls to action.'),
  description: z.string().optional().describe('Additional details or benefits about the product.'),
  advancedSettings: z.string().optional().describe('Extra instructions for the AI (e.g., tone, specific sections to include).'),
  language: z.string().describe('The target language for the generated content (e.g., "pt-BR").'),
});
export type GeneratePageInput = z.infer<typeof GeneratePageInputSchema>;

// Definição de Output movida para cá
const GeneratePageOutputSchema = z.object({
  superPrompt: z.string().describe('The detailed, generated super prompt.'),
});
export type GeneratePageOutput = z.infer<typeof GeneratePageOutputSchema>;


// Definição do Prompt movida para cá
const prompt = ai.definePrompt({
  name: 'generatePagePrompt_v2', // Novo nome para evitar conflitos
  input: { schema: GeneratePageInputSchema },
  output: { schema: GeneratePageOutputSchema },
  prompt: `
    You are a world-class digital marketing expert specializing in copywriting and creating high-converting landing pages. Your task is to generate a "Super Prompt" that will be used in another AI (like ChatGPT or Gemini) to create a complete, effective, and persuasive page.

    **Goal:** Create a detailed, structured, and comprehensive prompt based on the user's input. The final output of THIS flow must be ONLY the generated "Super Prompt" itself.

    **Analyze the following user input:**
    - **Page Type:** {{{pageType}}}
    - **Product Name:** {{{productName}}}
    - **Language:** {{{language}}}
    - **Primary Information Source (Sales Page):** {{{salesPageLink}}}
    - **Affiliate Link (for CTAs):** {{{affiliateLink}}}
    {{#if videoReviewLink}}- **Secondary Information Source (Video Review):** {{{videoReviewLink}}}{{/if}}
    {{#if description}}- **User-provided Description:** {{{description}}}{{/if}}
    {{#if advancedSettings}}- **Advanced Instructions:** {{{advancedSettings}}}{{/if}}

    **"Super Prompt" Generation Rules:**

    1.  **Role and Goal:** Start the prompt by defining the role for the target AI. Example: "You are a specialist copywriter in [Product Niche]. Your goal is to create a complete HTML page for a [Page Type] about '[Product Name]'..."
    2.  **Structure:** The prompt must instruct the AI to generate a complete HTML file, including <html>, <head> (with a compelling title and meta description), and <body> tags.
    3.  **Content Sections:** Instruct the AI to create logical sections.
        *   **For a 'Review' page:** Headline, Introduction (hook), What is [Product Name]?, How it Works, Benefits, Pros and Cons, Testimonials/Social Proof, Who is it for?, Price/Bonuses, and a final Call to Action (CTA).
        *   **For a 'Sales' page:** Headline, Sub-headline with a hook, Problem/Solution, Product Presentation, Core Benefits, How it Works/Modules, Social Proof, FAQ, Offer Details, Strong Guarantee, and multiple CTAs.
    4.  **Information Sourcing:** Instruct the AI to base its content PRIMARILY on the provided "Sales Page Link" and "Video Review Link" (if available). It should act as if it has "visited" and "analyzed" these links.
    5.  **Call to Action (CTA):** All CTA buttons and links within the generated page MUST use the provided "Affiliate Link": {{{affiliateLink}}}. This is critical.
    6.  **Language:** The entire final HTML page must be in the specified language: {{{language}}}.
    7.  **Tone & Style:** Incorporate the user's "Advanced Instructions" to guide the tone (e.g., formal, informal, urgent).
    8.  **Formatting:** The prompt should ask for clean, well-structured HTML with modern CSS for styling (using a style tag in the head). It should be visually appealing.
    9.  **Final Output Format:** The "Super Prompt" must be a single block of text, ready to be copied and pasted into another AI. Do not include any other text or explanation in your final response.

    **Example Snippet of the "Super Prompt" you should generate:**
    "You are an expert copywriter... Create a complete HTML file for a 'Review' page for the product 'Super Course'. The language is 'pt-BR'. Base all content on the information found at [salesPageLink]... The headline should be compelling... All CTA buttons must use the link '.../affiliate-link...'."

    Now, generate the "Super Prompt" based on all the user's input and the rules above.
  `,
});

// Definição do Flow movida para cá
const generatePageFlow = ai.defineFlow(
  {
    name: 'generatePageFlow_v2', // Novo nome para evitar conflitos
    inputSchema: GeneratePageInputSchema,
    outputSchema: GeneratePageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate prompt. The AI model did not return a valid output.');
    }
    return output!;
  }
);


// Função exportada que a página irá chamar
export async function generatePage(input: GeneratePageInput): Promise<string> {
    try {
        const result = await generatePageFlow(input);
        return result.superPrompt;
    } catch (error) {
        console.error("Error in generatePage server action:", error);
        throw new Error("Failed to get prompt from AI.");
    }
}
