import { PersonGeneration } from "@google/genai";
import genAI from "../genAI";

export async function generateStoryImage(prompt: string) {
  const enhancedPrompt = `
    Create a colorful, animated, Disney-Pixar style illustration for a children's story.
    Scene: ${prompt}
    Style: soft lighting, vibrant colors, friendly characters
  `;

  const response = await genAI.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: enhancedPrompt,
    config: {
      numberOfImages: 4,
      aspectRatio: "16:9",
      personGeneration: PersonGeneration.ALLOW_ALL,
    },
  });

  return response.generatedImages?.[0]?.image?.imageBytes;
}
