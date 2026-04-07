import genAI from "../genAI";

export async function generateSpeech(story: string) {
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

  return {
    audioBuffer,
    mimeType:
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType,
  };
}
