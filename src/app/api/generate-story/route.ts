/**
 * POST /api/generate-story
 *
 * Streaming story-generation endpoint (Server-Sent Events).
 *
 * Flow
 * ────
 * 1. Generate a 768-dim embedding for the user prompt.
 * 2. Query the `generated_stories` table for a similar story
 *    (cosine similarity ≥ 0.85, same language & format).
 *    • Found  → emit cached events and close.
 *    • Not found → generate fresh content.
 * 3a. format = text_story_with_visuals
 *     • story model + image model start in PARALLEL.
 *     • TTS model starts as soon as the story text is ready.
 *     • Each result is emitted as it arrives.
 * 3b. format = video_story
 *     • story model + video model run in PARALLEL.
 *     • Each result is emitted as it arrives.
 * 4. The generated story is saved to the DB (including uploaded asset URLs).
 *
 * SSE event types  (content-type: text/event-stream)
 * ──────────────────────────────────────────────────
 *   story   → { title, story, summary, moral }
 *   images  → string[]           (public storage URLs)
 *   audio   → { url, contentType, size }
 *   video   → { url, mimeType, size }
 *   done    → { cached?: true }
 *   error   → { message }
 *
 * Required Supabase setup
 * ───────────────────────
 * 1. Enable the pgvector extension:
 *      CREATE EXTENSION IF NOT EXISTS vector;
 *
 * 2. Create the `generated_stories` table (adjust column names if needed):
 *      CREATE TABLE generated_stories (
 *        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *        prompt              TEXT NOT NULL,
 *        prompt_embedding    vector(768),
 *        language            TEXT NOT NULL,
 *        format              TEXT NOT NULL,
 *        title               TEXT,
 *        summary             TEXT,
 *        moral               TEXT,
 *        story               TEXT,
 *        images              TEXT[],
 *        audio_url           TEXT,
 *        audio_content_type  TEXT,
 *        audio_size          INT,
 *        video_url           TEXT,
 *        thumbnail_url       TEXT,
 *        video_content_type  TEXT,
 *        video_size          INT,
 *        created_at          TIMESTAMPTZ DEFAULT NOW()
 *      );
 *
 * 3. Create the RPC function for similarity search:
 *      CREATE OR REPLACE FUNCTION match_generated_stories(
 *        query_embedding   vector(768),
 *        match_threshold   FLOAT,
 *        match_count       INT,
 *        filter_language   TEXT,
 *        filter_format     TEXT
 *      )
 *      RETURNS TABLE (
 *        id                  UUID,
 *        title               TEXT,
 *        summary             TEXT,
 *        moral               TEXT,
 *        story               TEXT,
 *        images              TEXT[],
 *        audio_url           TEXT,
 *        audio_content_type  TEXT,
 *        audio_size          INT,
 *        video_url           TEXT,
 *        thumbnail_url       TEXT,
 *        video_content_type  TEXT,
 *        video_size          INT,
 *        similarity          FLOAT
 *      )
 *      LANGUAGE plpgsql AS $$
 *      BEGIN
 *        RETURN QUERY
 *        SELECT
 *          gs.id, gs.title, gs.summary, gs.moral,
 *          gs.story, gs.images,
 *          gs.audio_url, gs.audio_content_type, gs.audio_size,
 *          gs.video_url, gs.thumbnail_url, gs.video_content_type, gs.video_size,
 *          1 - (gs.prompt_embedding <=> query_embedding) AS similarity
 *        FROM generated_stories gs
 *        WHERE
 *          gs.language = filter_language
 *          AND gs.format = filter_format
 *          AND 1 - (gs.prompt_embedding <=> query_embedding) > match_threshold
 *        ORDER BY gs.prompt_embedding <=> query_embedding
 *        LIMIT match_count;
 *      END;
 *      $$;
 *
 * 4. Create a public Supabase Storage bucket named "story-assets".
 */

import { NextResponse } from "next/server";
import generateStory from "@/app/lib/ai/models/storyModel";
import generateStoryImage from "@/app/lib/ai/models/imageModel";
import generateSpeech from "@/app/lib/ai/models/ttsModel";
import generateStoryVideo from "@/app/lib/ai/models/videoModel";
import generateEmbedding from "@/app/lib/ai/models/embeddingModel";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { uploadImage, uploadAudio } from "@/app/lib/supabase/storage";
import type { GeneratedStory, languageOption, StoryFormat } from "@/app/lib/types/types";

// Similarity threshold: 0 = no match, 1 = identical
const SIMILARITY_THRESHOLD = 0.85;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of a single embedding from the Gemini embedContent response. */
interface ContentEmbedding {
  values: number[];
}

/** Minimal shape of the Gemini embedContent response we rely on. */
interface EmbedContentResponse {
  embeddings?: ContentEmbedding[];
}

interface RequestBody {
  prompt: string;
  moral?: string;
  format: StoryFormat;
  language: languageOption;
}

interface MatchedStory {
  id: string;
  title: string;
  summary: string;
  moral: string;
  story: string | null;
  images: string[] | null;
  audio_url: string | null;
  audio_content_type: string | null;
  audio_size: number | null;
  video_url: string | null;
  thumbnail_url: string | null;
  video_content_type: string | null;
  video_size: number | null;
  similarity: number;
}

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, moral, format, language } = body;

  if (!prompt?.trim()) {
    return NextResponse.json(
      { message: "prompt is required" },
      { status: 400 },
    );
  }
  if (!language?.trim()) {
    return NextResponse.json(
      { message: "language is required" },
      { status: 400 },
    );
  }
  if (format !== "text_story_with_visuals" && format !== "video_story") {
    return NextResponse.json({ message: "invalid format" }, { status: 400 });
  }

  // Stable ID for storage paths in this request
  const requestId = crypto.randomUUID();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        try {
          controller.enqueue(sseEvent(event, data));
        } catch {
          // Client may have disconnected; swallow the error
        }
      };

      try {
        // ── 1. Embedding ──────────────────────────────────────────────────
        const embeddingResult = (await generateEmbedding(prompt)) as EmbedContentResponse;
        const embedding: number[] = embeddingResult?.embeddings?.[0]?.values ?? [];

        // ── 2. Cache check ────────────────────────────────────────────────
        if (embedding.length > 0) {
          // supabaseAdmin is typed against the generated Database schema; use
          // the untyped `.rpc()` overload for the custom pgvector function.
          const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
            "match_generated_stories",
            {
              query_embedding: embedding,
              match_threshold: SIMILARITY_THRESHOLD,
              match_count: 1,
              filter_language: language,
              filter_format: format,
            },
          );
          const cached = rpcData as MatchedStory[] | null;

          if (!rpcError && cached && cached.length > 0) {
            const hit = cached[0];
            emit("story", {
              title: hit.title,
              story: hit.story ?? "",
              summary: hit.summary,
              moral: hit.moral,
            } satisfies GeneratedStory);

            if (hit.images?.length) emit("images", hit.images);
            if (hit.audio_url)
              emit("audio", {
                url: hit.audio_url,
                contentType: hit.audio_content_type ?? "audio/wav",
                size: hit.audio_size ?? 0,
              });
            if (hit.video_url)
              emit("video", {
                url: hit.video_url,
                mimeType: hit.video_content_type ?? "video/mp4",
                size: hit.video_size ?? undefined,
              });

            emit("done", { cached: true });
            controller.close();
            return;
          }
        }

        // ── 3. Build story prompt (includes optional moral) ──────────────
        const storyPrompt = moral?.trim()
          ? `${prompt}. The moral of the story should emphasize: ${moral}`
          : prompt;

        // ── 4a. text_story_with_visuals ───────────────────────────────────
        if (format === "text_story_with_visuals") {
          // Story + images start in parallel
          const storyPromise = generateStory(storyPrompt, language).then(
            (story) => {
              emit("story", story);
              return story;
            },
          );

          const imagesPromise = generateStoryImage(prompt).then(
            async (images) => {
              const uploadResults = await Promise.allSettled(
                images.map((img, i) =>
                  uploadImage(
                    img.image.imageBytes,
                    img.image.mimeType,
                    `images/${requestId}/image-${i}`,
                  ),
                ),
              );
              const urls = uploadResults
                .filter(
                  (r): r is PromiseFulfilledResult<string> =>
                    r.status === "fulfilled",
                )
                .map((r) => r.value);
              if (urls.length > 0) emit("images", urls);
              return urls;
            },
          );

          // TTS depends on story text
          const audioPromise = storyPromise.then(async (story) => {
            const tts = await generateSpeech(story.story);
            const audio = await uploadAudio(
              tts.audioBuffer,
              tts.mimeType,
              `audio/${requestId}/audio`,
            );
            emit("audio", audio);
            return audio;
          });

          const [storyResult, imagesResult, audioResult] =
            await Promise.allSettled([storyPromise, imagesPromise, audioPromise]);

          // ── Save to DB ──────────────────────────────────────────────────
          if (storyResult.status === "fulfilled") {
            const savedStory = storyResult.value;
            const imageUrls =
              imagesResult.status === "fulfilled" ? imagesResult.value : [];
            const audioData =
              audioResult.status === "fulfilled" ? audioResult.value : null;

            await supabaseAdmin.from("generated_stories").insert({
              prompt,
              prompt_embedding: embedding.length > 0 ? embedding : undefined,
              language,
              format,
              title: savedStory.title,
              summary: savedStory.summary,
              moral: savedStory.moral,
              story: savedStory.story,
              images: imageUrls,
              audio_url: audioData?.url ?? null,
              audio_content_type: audioData?.contentType ?? null,
              audio_size: audioData?.size ?? null,
            });
          }

          // ── 4b. video_story ─────────────────────────────────────────────
        } else {
          const storyPromise = generateStory(storyPrompt, language).then(
            (story) => {
              emit("story", story);
              return story;
            },
          );

          const videoPromise = generateStoryVideo(prompt).then((video) => {
            if (video.videoUrl) {
              emit("video", {
                url: video.videoUrl,
                mimeType: video.mimeType ?? "video/mp4",
                size: video.size,
              });
            }
            return video;
          });

          const [storyResult, videoResult] = await Promise.allSettled([
            storyPromise,
            videoPromise,
          ]);

          // ── Save to DB ──────────────────────────────────────────────────
          if (storyResult.status === "fulfilled") {
            const story = storyResult.value;
            const video =
              videoResult.status === "fulfilled" ? videoResult.value : null;

            await supabaseAdmin.from("generated_stories").insert({
              prompt,
              prompt_embedding: embedding.length > 0 ? embedding : undefined,
              language,
              format,
              title: story.title,
              summary: story.summary,
              moral: story.moral,
              video_url: video?.videoUrl ?? null,
              video_content_type: video?.mimeType ?? null,
              video_size: video?.size ?? null,
            });
          }
        }

        emit("done", {});
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Story generation failed";
        emit("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable Nginx buffering for SSE
    },
  });
}
