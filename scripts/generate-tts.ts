import fs from "fs";
import path from "path";
import generateSpeech from "../src/app/lib/ai/models/ttsModel";
import { supabaseAdmin } from "../src/app/lib/supabase/admin";

const BUCKET_NAME = "stories";
const STORIES_FILE = path.join(process.cwd(), "src/app/data/stories.json");

async function main() {
  console.log(
    "-------------------------------------------------------------------",
  );
  console.log(
    "Command to run this script: npx tsx --env-file=.env ./scripts/generate-tts.ts",
  );
  console.log(
    "-------------------------------------------------------------------\n",
  );

  if (!fs.existsSync(STORIES_FILE)) {
    console.error(`Stories file not found at ${STORIES_FILE}`);
    process.exit(1);
  }

  const storiesData = JSON.parse(fs.readFileSync(STORIES_FILE, "utf-8"));

  for (const [storyName, storyObj] of Object.entries(storiesData)) {
    // storyObj has properties like "english", "hindi", etc., and "videoUrl", "images"
    const languages = Object.keys(storyObj as Record<string, unknown>).filter(
      (k) => k !== "images" && k !== "videoUrl",
    );

    for (const lang of languages) {
      const entry = (storyObj as Record<string, any>)[lang];

      // Skip if audioUrl is already populated or if there's no story text
      if (entry.audioUrl || !entry.story) {
        console.log(
          `Skipping ${storyName} - ${lang} (either already has audioUrl or no story text).`,
        );
        continue;
      }

      console.log(`Generating TTS for ${storyName} - ${lang}...`);

      try {
        const ttsOutput = await generateSpeech(entry.story);

        // ttsOutput contains base64 audio and mimeType
        const audioBuffer = Buffer.from(ttsOutput.audioBase64, "base64");

        // Ensure accurate extension, default to wav since normalizeAudioPayload converts to audio/wav
        const extension =
          ttsOutput.mimeType.split("/")[1]?.split(";")[0] ?? "wav";

        // The path in Supabase Storage. Using the exact path requested by user.
        // If BUCKET_NAME is 'stories', the path inside is 'tts/{storyName}-{lang}.{extension}'
        // If the user meant bucket 'stories' and path 'stories/tts/...', then it's 'stories/tts/...'
        // Let's use 'tts/{storyName}-{lang}.{extension}' since the bucket covers the first part,
        // but to be safe we follow the string literally by uploading to 'tts/...' inside 'stories'.
        const filePath = `tts/${storyName}-${lang}.${extension}`;

        console.log(`Uploading ${filePath} to bucket ${BUCKET_NAME}...`);

        const { error } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(filePath, audioBuffer, {
            contentType: ttsOutput.mimeType,
            upsert: true,
          });

        if (error) {
          throw new Error(`Audio upload failed: ${error.message}`);
        }

        const { data } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);
        console.log(
          `Successfully generated and uploaded! Public URL: ${data.publicUrl}`,
        );

        entry.audioUrl = data.publicUrl;
      } catch (err) {
        console.error(`Failed to process ${storyName} - ${lang}:`, err);
      }
    }
  }

  fs.writeFileSync(STORIES_FILE, JSON.stringify(storiesData, null, 2), "utf-8");
  console.log("Finished processing stories and updated stories.json.");
}

main().catch((err) => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
