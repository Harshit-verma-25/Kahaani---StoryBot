import genAI from "../genAI";

export default async function generateStoryVideo(prompt: string) {
  const enhancedPrompt = `
    Create a short animated cinematic video for a children's story.
    Scene: ${prompt}
    Style: Pixar-style animation, smooth motion, warm lighting
  `;

  const response = await genAI.models.generateVideos({
    model: "veo-3.1-fast-generate-preview",
    prompt: enhancedPrompt,
    config: {
      aspectRatio: "16:9",
      resolution: "720p",
      durationSeconds: 90,
    },
  });

  if (!response.response) {
    throw new Error("Failed to generate video. AI returned an empty response.");
  }

  return {
    videoUrl: response.response?.generatedVideos?.[0]?.video?.uri,
    mimeType: response.response?.generatedVideos?.[0]?.video?.mimeType,
    size: response.response?.generatedVideos?.[0]?.video?.videoBytes?.length,
  };
}
