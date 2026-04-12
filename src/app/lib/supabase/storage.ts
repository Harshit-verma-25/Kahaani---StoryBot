import { supabaseAdmin } from "./admin";

const BUCKET = "story-assets";

// ---------------------------------------------------------------------------
// Image upload
// ---------------------------------------------------------------------------

/**
 * Uploads a base-64-encoded image to Supabase Storage and returns its public URL.
 *
 * @param base64    Raw base-64 string (no data-URI prefix)
 * @param mimeType  e.g. "image/png"
 * @param storagePath  Path inside the bucket, WITHOUT extension (e.g. "images/abc/0")
 */
export async function uploadImage(
  base64: string,
  mimeType: string,
  storagePath: string,
): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const extension = mimeType.split("/")[1]?.split(";")[0] ?? "png";
  const filePath = `${storagePath}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Audio upload  (handles PCM → WAV conversion)
// ---------------------------------------------------------------------------

/**
 * Uploads audio to Supabase Storage and returns the public URL and metadata.
 * If the mimeType indicates raw PCM (audio/pcm, audio/l16, audio/L16), the
 * buffer is first wrapped in a WAV container so browsers can play it.
 *
 * @param audioBuffer  Node.js Buffer with audio data
 * @param mimeType     e.g. "audio/pcm;rate=24000" or "audio/wav"
 * @param storagePath  Path inside the bucket, WITHOUT extension
 */
export async function uploadAudio(
  audioBuffer: Buffer | Buffer<ArrayBuffer>,
  mimeType: string,
  storagePath: string,
): Promise<{ url: string; contentType: string; size: number }> {
  // Normalise to a plain Buffer so downstream assignments stay type-safe
  let buffer: Buffer = Buffer.from(audioBuffer);
  let contentType = mimeType;

  // Gemini TTS returns raw 16-bit PCM; wrap it in a WAV container
  const mimeTypeLower = mimeType.toLowerCase();
  if (
    mimeTypeLower.startsWith("audio/pcm") ||
    mimeTypeLower.startsWith("audio/l16") ||
    mimeTypeLower.startsWith("audio/x-l16")
  ) {
    const sampleRate = extractSampleRate(mimeType) ?? 24000;
    buffer = pcmToWav(audioBuffer, sampleRate);
    contentType = "audio/wav";
  }

  const extension = contentType.split("/")[1]?.split(";")[0] ?? "wav";
  const filePath = `${storagePath}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType, upsert: true });

  if (error) throw new Error(`Audio upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
  return { url: data.publicUrl, contentType, size: buffer.length };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractSampleRate(mimeType: string): number | null {
  const match = mimeType.match(/rate=(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Prepends a standard 44-byte WAV header to a raw 16-bit, mono PCM buffer.
 */
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
  wav.writeUInt32LE(16, 16); // PCM chunk size
  wav.writeUInt16LE(1, 20); // PCM format = 1
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
