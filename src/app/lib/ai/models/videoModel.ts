"use server";

import genAI from "../genAI";

export default async function generateStoryVideo(prompt: string) {
  const enhancedPrompt = `
    Create a short animated cinematic video for a children's story.
    Scene: ${prompt}
    Style: Pixar-style animation, smooth motion, warm lighting
  `;

  let operation = await genAI.models.generateVideos({
    model: "veo-3.1-lite-generate-preview",
    prompt: enhancedPrompt,
    config: {
      aspectRatio: "16:9",
      resolution: "1080p",
      numberOfVideos: 1,
      durationSeconds: 8,
    },
  });

  while (!operation.done) {
    console.log("Waiting for video generation to complete...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await genAI.operations.getVideosOperation({
      operation: operation,
    });
  }

  if (!operation.response?.generatedVideos?.length) {
    throw new Error("Failed to generate video. AI returned an empty response.");
  }

  console.log("Video generation response:", operation.response.generatedVideos);

  const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
  const apiKey = process.env.GEMINI_API_KEY;
  const videoUrl = uri && apiKey ? `${uri}&key=${apiKey}` : uri;

  return {
    videoUrl: videoUrl,
  };
}
