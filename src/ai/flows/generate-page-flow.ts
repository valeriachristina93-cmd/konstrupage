
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
      prompt: `You are an expert in creating high-converting presell pages. Based on the user's description, generate a complete page configuration in JSON format.

User Description: "{{prompt}}"

Your task is to populate all the fields in the provided JSON schema to create a cohesive and effective presell page. Make logical choices for colors, text, and images.

- Images: Use placeholder URLs from an image service like unsplash or picsum. Make sure the images are relevant to the user's description.
- Popups: Only activate the popups that are explicitly or implicitly requested in the description. For example, if the user mentions "18+", activate the age verification popup. If they mention cookies, activate the cookie popup.
- Colors: Choose a color scheme that matches the product or theme. Use hex color codes.
- Text: Write compelling and relevant text for titles, descriptions, and buttons.

Respond with ONLY a valid JSON object that conforms to the output schema. Do not include any other text, markdown, or explanations.`,
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
