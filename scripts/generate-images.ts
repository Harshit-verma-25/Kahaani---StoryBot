import fs from "fs";
import path from "path";
import generateStoryImage from "../src/app/lib/ai/models/imageModel";
import { supabaseAdmin } from "../src/app/lib/supabase/admin";

const BUCKET_NAME = "stories";
const STORIES_FILE = path.join(process.cwd(), "src/app/data/stories.json");

async function main() {
  console.log(
    "-------------------------------------------------------------------",
  );
  console.log(
    "Command to run this script: npx tsx --env-file=.env ./scripts/generate-images.ts",
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
    const entry = storyObj as Record<string, any>;

    // Skip if images array is already populated
    if (entry.images && entry.images.length > 0) {
      console.log(`Skipping ${storyName} - already has images.`);
      continue;
    }

    console.log(`Generating images for ${storyName}...`);

    const englishEntry = entry.english;
    if (!englishEntry || !englishEntry.summary) {
      console.log(
        `Skipping ${storyName} - no english summary found to use as an image prompt.`,
      );
      continue;
    }

    try {
      // Use the English summary as the prompt for image generation
      const generatedImages = await generateStoryImage(englishEntry.summary);
      entry.images = [];

      for (let i = 0; i < generatedImages.length; i++) {
        // Based on the imageModel return type mapping:
        // { image: { imageBytes: string, mimeType: string } }
        const imgData = generatedImages[i].image;
        if (!imgData || !imgData.imageBytes) {
          console.warn(`  Skipping index ${i} - Invalid image data returned`);
          continue;
        }

        const base64Data = imgData.imageBytes;
        const mimeType = imgData.mimeType || "image/jpeg";

        const imageBuffer = Buffer.from(base64Data, "base64");
        const extension = mimeType.split("/")[1]?.split(";")[0] || "jpeg";
        const filePath = `images/${storyName}-image-${i + 1}.${extension}`;

        console.log(`Uploading ${filePath} to bucket ${BUCKET_NAME}...`);

        const { error } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(filePath, imageBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (error) {
          throw new Error(
            `Image upload failed for index ${i + 1}: ${error.message}`,
          );
        }

        const { data } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);
        console.log(`  Uploaded: ${data.publicUrl}`);
        entry.images.push(data.publicUrl);
      }
    } catch (err) {
      console.error(`Failed to process images for ${storyName}:`, err);
    }
  }

  fs.writeFileSync(STORIES_FILE, JSON.stringify(storiesData, null, 2), "utf-8");
  console.log("Finished processing and updated stories.json.");
}

main().catch((err) => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
