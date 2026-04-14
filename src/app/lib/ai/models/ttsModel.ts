"use server";

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
  const mimeType =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;

  if (!data || !mimeType) {
    console.error("Failed to generate speech. AI response:", response);
    throw new Error("Failed to generate speech. AI returned incomplete data.");
  }

  const normalizedAudio = normalizeAudioPayload(data, mimeType);

  return {
    audioBase64: normalizedAudio.audioBase64,
    mimeType: normalizedAudio.mimeType,
  };
}

function normalizeAudioPayload(audioBase64: string, mimeType: string) {
  const mimeTypeLower = mimeType.toLowerCase();

  if (
    mimeTypeLower.startsWith("audio/pcm") ||
    mimeTypeLower.startsWith("audio/l16") ||
    mimeTypeLower.startsWith("audio/x-l16")
  ) {
    const sampleRate = extractSampleRate(mimeType) ?? 24000;
    const pcmBuffer = Buffer.from(audioBase64, "base64");
    const wavBuffer = pcmToWav(pcmBuffer, sampleRate);

    return {
      audioBase64: wavBuffer.toString("base64"),
      mimeType: "audio/wav",
    };
  }

  return { audioBase64, mimeType };
}

function extractSampleRate(mimeType: string): number | null {
  const match = mimeType.match(/rate=(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function pcmToWav(pcmBuffer: Buffer, sampleRate: number): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;

  const wav = Buffer.alloc(44 + dataSize);

  wav.write("RIFF", 0, "ascii");
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8, "ascii");
  wav.write("fmt ", 12, "ascii");
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(numChannels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(byteRate, 28);
  wav.writeUInt16LE(blockAlign, 32);
  wav.writeUInt16LE(bitsPerSample, 34);
  wav.write("data", 36, "ascii");
  wav.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(wav, 44);

  return wav;
}
