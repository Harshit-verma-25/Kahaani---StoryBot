import { GeneratedTTS } from "../../types/types";
import genAI from "../genAI";

export default async function generateSpeech(
  story: string,
): Promise<GeneratedTTS> {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: story,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Kore",
          },
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const audioBuffer = data ? Buffer.from(data, "base64") : null;
  const mimeType =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;

  if (!audioBuffer || !mimeType) {
    console.error("Failed to generate speech. AI response:", response);
    throw new Error("Failed to generate speech. AI returned incomplete data.");
  }

  return {
    audioBuffer,
    mimeType,
  };
}
