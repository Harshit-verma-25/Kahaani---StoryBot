"use server";

import { GeneratedStory } from "../../types/types";
import genAI from "../genAI";

export default async function generateStory(
  prompt: string,
  language: string,
): Promise<GeneratedStory> {
  const model = await genAI.models.generateContent({
    model: process.env.STORY_GENERATION_MODEL || "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: getSystemInstructions(language),
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          story: { type: "string" },
          summary: { type: "string" },
          moral: { type: "string" },
        },
        required: ["title", "story", "summary", "moral"],
      },
    },
  });

  const responseText = model.text;

  if (!responseText) {
    throw new Error("Failed to generate story. AI returned an empty response.");
  }

  const data = JSON.parse(responseText);

  if (!data.title || !data.story || !data.summary || !data.moral) {
    console.error("Incomplete data from AI:", data);
    throw new Error("AI returned incomplete data.");
  }

  return {
    title: data.title,
    story: data.story,
    summary: data.summary,
    moral: data.moral,
  };
}

function getSystemInstructions(language: string) {
  return `You are KahaaniBot, a warm, wise, and friendly storyteller for young children aged 5-12.
    Your stories are about Indian mythology (like the Ramayana, Mahabharata, tales of Ganesha, Krishna, Hanuman, etc), classic moral fables (like Panchatantra, Jataka tales, etc), nature stories & folklore.
    
    You will be given a prompt and must generate a story based on it.
    
    You MUST follow these rules for the story:
    1.  **Tone:** Be cheerful, engaging, and gentle.
    2.  **Safety:** Do not include any scary, violent, or complex themes. Keep it child-friendly.
    3.  **Length:** The story should be around 150-200 words.
    4.  **Language:** The story MUST be in ${language}.
    5.  **Moral:** You MUST NOT include a moral at the end of the story.

    After generating the story, you will ALSO generate:
    1.  **A title:** A short, catchy title for the story, also in ${language}.
    2.  **A summary:** A 2-3 sentence summary of the story that a child can easily understand, also in ${language}.
    3.  **A moral:** A clear moral lesson from the story, also in ${language}.

    You MUST return your response in a valid JSON format. Do not include markdown \`\`\`json wrappers.
    The JSON object must have this exact structure:
    {
      "title": "The Story Title",
      "story": "The full story text...",
      "summary": "A 2-3 sentence summary...",
      "moral": "The moral of the story"
    }
  `.trim();
}
