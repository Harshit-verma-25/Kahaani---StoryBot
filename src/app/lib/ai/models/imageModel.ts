"use server";

import { PersonGeneration } from "@google/genai";
import genAI from "../genAI";
import { GeneratedImage } from "../../types/types";

function buildSafeImagePrompt(prompt: string): string {
  const normalizedPrompt = prompt.replace(/\s+/g, " ").trim();
  const lowerPrompt = normalizedPrompt.toLowerCase();

  // Mythological stories that mention fire, death, or violence often get
  // filtered by image models even when the intended result is family friendly.
  // When we detect that pattern, steer the prompt toward symbolic festival
  // imagery instead of depicting harm directly.
  if (
    lowerPrompt.includes("holika") ||
    lowerPrompt.includes("prahlada") ||
    lowerPrompt.includes("hiranyakashipu")
  ) {
    return [
      "A joyful Holika Dahan celebration in an Indian village at night.",
      "Show a ceremonial bonfire, glowing lanterns, colorful rangoli, families in traditional festive clothing, and young Prahlada praying peacefully with divine protection.",
      "Keep the scene symbolic, spiritual, and celebratory.",
      "Do not show injury, death, cruelty, or anyone inside the fire.",
    ].join(" ");
  }

  return normalizedPrompt
    .replace(/\bkill(ed|ing|s)?\b/gi, "defeat")
    .replace(/\bdeath\b/gi, "downfall")
    .replace(/\bdie(d|s)?\b/gi, "was overcome")
    .replace(/\bburn(t|ed)? to (death|ashes)\b/gi, "was defeated")
    .replace(/\bpyre\b/gi, "ceremonial bonfire")
    .replace(/\bcruel\b/gi, "harsh")
    .replace(/\bpunishments?\b/gi, "challenges");
}

export default async function generateStoryImage(
  prompt: string,
): Promise<GeneratedImage[]> {
  const safePrompt = buildSafeImagePrompt(prompt);
  const enhancedPrompt = `
    Create a colorful, animated, Disney-Pixar style illustration for a children's story without violent or scary elements.
    Scene: ${safePrompt}
    Style: soft lighting, vibrant colors, friendly characters, completely family friendly.
    Safety: avoid graphic harm, injury, death, threats, fear, or dangerous acts. Prefer symbolic, celebratory, and peaceful moments.
  `;

  const response = await genAI.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: enhancedPrompt,
    config: {
      numberOfImages: 4,
      aspectRatio: "16:9",
      personGeneration: PersonGeneration.ALLOW_ALL,
      includeSafetyAttributes: true,
      includeRaiReason: true,
    },
  });

  const filteredReasons =
    response?.generatedImages
      ?.map((img, index) =>
        img.raiFilteredReason
          ? {
              index,
              raiFilteredReason: img.raiFilteredReason,
              safetyAttributes: img.safetyAttributes,
            }
          : null,
      )
      .filter((item) => !!item) ?? [];

  const validImages: GeneratedImage[] =
    response?.generatedImages
      ?.map((img) => img.image)
      .filter(
        (image): image is { imageBytes: string; mimeType: string } => !!image,
      )
      .map((image) => ({
        image,
      })) ?? [];

  if (!response || validImages.length === 0) {
    console.error("Failed to generate images.", {
      prompt: safePrompt,
      filteredReasons,
      positivePromptSafetyAttributes: response?.positivePromptSafetyAttributes,
      sdkHttpResponse: response?.sdkHttpResponse,
    });
    throw new Error(
      "Failed to generate images. The image model returned no usable images.",
    );
  }

  return validImages;
}
