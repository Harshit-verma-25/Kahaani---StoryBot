"use server";

import { PersonGeneration } from "@google/genai";
import genAI from "../genAI";
import { GeneratedImage } from "../../types/types";

export default async function generateStoryImage(
  prompt: string,
): Promise<GeneratedImage[]> {
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

  if (
    !response ||
    !response.generatedImages ||
    response.generatedImages.length === 0
  ) {
    console.error("Failed to generate images. AI response:", response);
    throw new Error(
      "Failed to generate images. AI returned an empty response.",
    );
  }

  const validImages: GeneratedImage[] = response.generatedImages
    .map((img) => img.image)
    .filter(
      (image): image is { imageBytes: string; mimeType: string } => !!image,
    )
    .map((image) => ({
      image,
    }));

  return validImages;
}
