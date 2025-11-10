
'use server';

/**
 * @fileOverview A Genkit flow for generating a presell page configuration from a text description.
 *
 * - generatePageFlow - A function that takes a description and returns a PageConfig-like JSON object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StructuredPromptSchema = z.object({
  pageType: z.string().describe("The type of page to create (e.g., 'Página presell robusta', 'Página review')."),
  productName: z.string().optional().describe("The name of the product."),
  videoReviewLink: z.string().optional().describe("The URL for a video review."),
  salesPageLink: z.string().optional().describe("The URL for the main sales page."),
  affiliateLink: z.string().optional().describe("The main affiliate link to be used."),
  description: z.string().describe("The detailed description or extracted content for the page."),
  advancedSettings: z.object({
    facebookPixelId: z.string().optional(),
    googleAdsId: z.string().optional(),
    customHtml: z.string().optional(),
  }).describe("Advanced tracking and custom code settings."),
});

const PageConfigSchema = z.object({
  desktopImage: z.string().describe("URL for a high-resolution desktop background image. Should be royalty-free."),
  mobileImage: z.string().describe("URL for a high-resolution mobile background image (vertical aspect ratio). Should be royalty-free."),
  imageHeightDesktop: z.number().describe("Height of the desktop image in vh units (e.g., 100)."),
  imageHeightMobile: z.number().describe("Height of the mobile image in vh units (e.g., 100)."),
  affiliateLink: z.string().describe("An affiliate link, use the one from the input or a placeholder like 'https://AFFILIATE-LINK-HERE.com'."),
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
      input: { schema: StructuredPromptSchema },
      output: { schema: PageConfigSchema, format: 'json' },
      prompt: `
        You are a Senior Digital Solutions Architect, UX/UI Specialist, and High-Performance Copywriter. Your task is to generate a JSON configuration for a premium, high-conversion review page based on the structured Product Requirements Document (PRD) provided below. Your output MUST be a valid JSON object that conforms to the schema.

        ## 1. Context and Input Data

        | Field                       | Value                                 |
        | :-------------------------- | :------------------------------------ |
        | **Page Type**               | {{{pageType}}}                       |
        | **Product Name**            | {{{productName}}}                    |
        | **Sales Page (Source)**     | {{{salesPageLink}}}                  |
        | **Affiliate Link (CTA)**    | {{{affiliateLink}}}                  |
        | **Video Review (Optional)** | {{{videoReviewLink}}}                |
        | **Content/Description**     | {{{description}}}                    |
        | **Facebook Pixel ID**       | {{{advancedSettings.facebookPixelId}}} |
        | **Google Ads ID**           | {{{advancedSettings.googleAdsId}}}     |
        | **Custom HTML/JS/CSS**      | {{{advancedSettings.customHtml}}}      |

        ## 2. Your Directives

        1.  **Analyze & Synthesize**: Read all the input data. The 'Page Type' and 'Content/Description' are your primary guides.
        2.  **Generate a Cohesive Page Configuration**: Populate ALL fields in the output JSON schema. Make logical, professional choices for any unspecified details.
        3.  **Content Generation**: Use the 'Content/Description' to create compelling text for titles, descriptions, and pop-ups. If the description is brief, expand upon it to create a full page.
        4.  **Activate Pop-ups Strategically**:
            *   For a 'Página review' or 'Artigo estilo blog', focus on content. Consider activating a 'discount' or 'exit' pop-up.
            *   For a 'Página presell robusta', activate more interactive pop-ups like 'ageVerification', 'choice', or 'captcha' if they fit the product context.
            *   If the product seems targeted at an adult audience, activate 'ageVerification'.
        5.  **Design Choices**:
            *   **Images**: Find high-quality, royalty-free placeholder image URLs from services like Unsplash or Pexels that match the product's theme. Generate different URLs for desktop and mobile if it improves the design.
            *   **Colors**: Choose a modern, professional color palette that fits the product. A "detox" product might use green/white; a tech product might use blue/dark gray. Define a primary color for CTAs, a text color, and a background color for pop-ups.
        6.  **Tracking & SEO**:
            *   Populate the \`tracking\` object with the provided Facebook and Google IDs.
            *   Populate the \`customization.customHtml\` field with any provided custom code.
            *   Generate a compelling SEO title and description based on the product name and content.

        ## 7. Final Output

        Respond with ONLY a valid JSON object that conforms to the output schema. Do not include any other text, markdown, or explanations.
      `,
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
    inputSchema: StructuredPromptSchema,
    outputSchema: PageConfigSchema,
  },
  async (structuredPrompt) => {
    const { output } = await generatePagePrompt(structuredPrompt);
    return output!;
  }
);
