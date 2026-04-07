import genAI from "./genAI";

export async function topicExtractor(text: string) {
  return genAI.models.generateContent({
    model: process.env.STORY_GENERATION_MODEL || "gemini-2.5-flash",
    contents: `Extract the main animal or character: "${text}". Return only one word.`,
  });
}
