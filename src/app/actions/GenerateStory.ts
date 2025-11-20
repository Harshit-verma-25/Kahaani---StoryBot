"use server";

import { GoogleGenAI } from "@google/genai";
import { StoryData } from "@/app/lib/types";

export async function generateStory({ prompt, language }: StoryData) {
  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenAI({ apiKey });

  const SYSTEM_INSTRUCTIONS = `
    You are KahaaniBot, a warm, wise, and friendly storyteller for young children aged 5-12.
    Your stories are about Indian mythology (like the Ramayana, Mahabharata, tales of Ganesha, Krishna, Hanuman, etc) and classic moral fables (like Panchatantra or Jataka tales).
    
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

  // Get the generative model
  const model = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
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

  try {
    const responseText = model.text;

    if (!responseText) {
      throw new Error(
        "Failed to generate story. AI returned an empty response."
      );
    }

    // The responseText is now a JSON string. We just need to parse it.
    const data = JSON.parse(responseText);

    // Validate the data from the AI
    if (!data.title || !data.story || !data.summary) {
      console.error("Incomplete data from AI:", data);
      throw new Error("AI returned incomplete data.");
    }

    // Return the single, structured response
    return {
      story: data.story,
      summary: data.summary,
      title: data.title,
      moral: data.moral,
    };
  } catch (error) {
    console.error("Error generating story:", error);
    // You could throw a more specific error here to show the user
    throw new Error("Failed to generate story. Please try again later.");
  }
}
