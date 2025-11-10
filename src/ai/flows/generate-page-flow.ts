
'use server';

/**
 * @fileOverview A Genkit flow for generating a presell page configuration from a text description.
 *
 * - generatePageFlow - A function that takes a description and returns a PageConfig-like JSON object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PageConfigSchema = z.object({
  desktopImage: z.string().describe("URL for a high-resolution desktop background image. Should be royalty-free."),
  mobileImage: z.string().describe("URL for a high-resolution mobile background image (vertical aspect ratio). Should be royalty-free."),
  imageHeightDesktop: z.number().describe("Height of the desktop image in vh units (e.g., 100)."),
  imageHeightMobile: z.number().describe("Height of the mobile image in vh units (e.g., 100)."),
  affiliateLink: z.string().describe("A placeholder for the affiliate link, like 'https://AFFILIATE-LINK-HERE.com'."),
  newTab: z.boolean().describe("Whether the affiliate link should open in a new tab."),
  autoRedirect: z.object({
    active: z.boolean(),
    time: z.number().describe("Time in seconds for auto-redirect (5-15)."),
  }).describe("Configuration for automatic redirection."),
  popups: z.object({
    cookies: z.object({ active: z.boolean(), message: z.string(), buttonText: z.string() }),
    ageVerification: z.object({ active: z.boolean(), message: z.string(), yesButtonText: z.string(), noButtonText: z.string(), yesButtonColor: z.string().describe("Hex color code"), noButtonColor: z.string().describe("Hex color code"), buttonWidth: z.number() }),
    discount: z.object({ active: z.boolean(), text: z.string(), description: z.string(), icon: z.enum(['none', 'percent', 'shopping-bag', 'ticket-percent', 'clock', 'shopping-cart', 'heart', 'gift']) }),
    exit: z.object({ active: z.boolean(), imageUrl: z.string().describe("Royalty-free image URL for exit intent popup."), redirectLink: z.string().describe("Optional redirect link for the exit popup.") }),
    custom: z.object({ active: z.boolean(), title: z.string(), description: z.string(), buttonText: z.string() }),
    choice: z.object({ active: z.boolean(), title: z.string(), description: z.string(), useCustomImages: z.boolean(), image1Url: z.string().describe("URL for the first choice image."), image2Url: z.string().describe("URL for the second choice image."), customImageWidth: z.number() }),
    captcha: z.object({ active: z.boolean(), title: z.string(), description: z.string(), captchaType: z.enum(['checkbox', 'slide']) }),
  }).describe("Configuration for various popups. Only activate the popups requested by the user."),
  footer: z.object({ active: z.boolean(), privacyLink: z.string(), termsLink: z.string(), backgroundColor: z.string().describe("Hex color code"), textColor: z.string().describe("Hex color code") }),
  disclaimer: z.object({ active: z.boolean(), text: z.string(), backgroundColor: z.string().describe("Hex color code"), textColor: z.string().describe("Hex color code") }),
  overlay: z.object({ active: z.boolean(), opacity: z.number().min(0.1).max(1) }),
  blur: z.object({ active: z.boolean(), intensity: z.number().min(1).max(50) }),
   tracking: z.object({
        facebookPixelId: z.string().optional(),
        googleAdsId: z.string().optional(),
    }),
  seo: z.object({
    title: z.string().describe("The title of the page for SEO."),
    description: z.string().describe("The meta description of the page for SEO."),
    favicon: z.string().describe("The URL for the page's favicon."),
  }),
  customization: z.object({
    button: z.object({
      color: z.string().describe("Hex color code for the button."),
      textColor: z.string().describe("Hex color code for the button text."),
      width: z.number().min(10).max(100),
      borderRadius: z.number().min(0).max(30),
      alignment: z.enum(['left', 'center', 'right']),
      shadow: z.object({ active: z.boolean(), intensity: z.number() }),
    }),
    typography: z.object({
        titleColor: z.string().describe("Hex color for popup titles."),
        textColor: z.string().describe("Hex color for popup text."),
        titleSize: z.number().min(16).max(48),
        textSize: z.number().min(12).max(24),
    }),
    popupColor: z.string().describe("Hex color for the popup background."),
    popupPosition: z.enum(['center', 'bottom']),
    customHtml: z.string().describe("Custom HTML/CSS/JS code to be injected."),
    showCloseButton: z.boolean(),
    popupContour: z.object({ active: z.boolean(), width: z.number(), style: z.enum(['solid', 'dashed', 'dotted']), color: z.string().describe("Hex color code") }),
    popupAnimation: z.enum(['fadeIn', 'slideInDown', 'slideInUp', 'zoomIn']),
    popupAnimationDuration: z.number().min(0.1).max(2),
    shadow: z.object({ active: z.boolean(), intensity: z.number() }),
  }),
}).describe("A JSON object representing the full configuration for a presell page.");


const generatePagePrompt = ai.definePrompt(
    {
      name: 'generatePagePrompt',
      input: { schema: z.string() },
      output: { schema: PageConfigSchema, format: 'json' },
      prompt: `You are an expert in creating high-converting presell pages. Based on the user's structured request, generate a complete page configuration in JSON format.

The user's request is a "super prompt" containing all the information needed. Your task is to interpret this structured input and populate all the fields in the provided JSON schema to create a cohesive and effective presell page.

**User's Structured Request:**
\`\`\`
{{prompt}}
\`\`\`

**Your instructions:**

1.  **Analyze the Request:** Carefully read all sections of the user's request: Page Type, Product Info, Content, and Advanced Settings.
2.  **Page Type:** Use the specified page type (e.g., 'Página de Review', 'Presell Robusta') as a primary guide for the overall structure and which pop-ups to activate. For a 'Review' page, focus on content. For a 'Robusta' page, activate more interactive elements like age verification or choice pop-ups if they make sense.
3.  **Product Info:** Use the product name, sales page, and affiliate link to inform the content and links.
4.  **Content:** This is the core. Use the provided description to generate titles, texts for pop-ups, and the main page content. If images are mentioned, find relevant, royalty-free placeholder URLs from services like Unsplash or Pexels.
5.  **Advanced Settings:**
    *   If a Facebook Pixel ID or Google Ads ID is provided, populate the \`tracking\` object accordingly.
    *   If custom HTML/CSS/JS is provided, place it in the \`customization.customHtml\` field.
6.  **Make Logical Choices:** For any unspecified details (like colors, exact popup text if not detailed), make logical choices that fit the product and page type. For example, a "detox" product might use a green and white color scheme. An "18+" product should have the age verification pop-up activated.
7.  **Output:** Respond with ONLY a valid JSON object that conforms to the output schema. Do not include any other text, markdown, or explanations.`,
      config: {
        safetySettings: [
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
            }
        ]
      }
    },
  );


export const generatePageFlow = ai.defineFlow(
  {
    name: 'generatePageFlow',
    inputSchema: z.string(),
    outputSchema: PageConfigSchema,
  },
  async (description) => {
    const { output } = await generatePagePrompt(description);
    return output!;
  }
);

    