import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/app/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  const { prompt, language } = await request.json();

  if (!prompt || !language) {
    return NextResponse.json(
      { error: "Prompt and language are required" },
      { status: 400 },
    );
  }

  let result: {
    id: number;
    title: string;
    story: string;
    summary: string;
    moral: string;
  };

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

  try {
    const topicPrompt = `
Extract the main animal or character from this prompt.
Return only one word.

Prompt: "${prompt}"
`;

    const topicRes = await genAI.models.generateContent({
      model: process.env.TOPIC_EXTRACTION_MODEL || "gemini-2.5-flash",
      contents: topicPrompt,
    });

    if (!topicRes || !topicRes.text) {
      throw new Error("Failed to extract topic from the prompt.");
    }

    const topic = topicRes.text.trim().toLowerCase();

    const embeddingResponse = await genAI.models.embedContent({
      model: process.env.EMBEDDING_MODEL || "gemini-embedding-001",
      contents: prompt,
      config: {
        outputDimensionality: 768,
      },
    });

    if (!embeddingResponse || !embeddingResponse.embeddings) {
      throw new Error("Failed to generate embedding for the prompt.");
    }

    const embedding = embeddingResponse.embeddings[0].values;

    const { data: similarStories } = await supabase.rpc(
      "match_story_embeddings",
      {
        query_embedding: embedding,
        query_topic: topic,
        match_threshold: 0.25,
        match_count: 1,
      },
    );

    if (similarStories && similarStories.length > 0) {
      result = {
        id: similarStories[0].id,
        title: similarStories[0].title,
        story: similarStories[0].story_text,
        summary: similarStories[0].summary,
        moral: similarStories[0].moral,
      };

      return NextResponse.json(result, { status: 200 });
    }

    const model = await genAI.models.generateContent({
      model: process.env.STORY_GENERATION_MODEL || "gemini-2.5-flash",
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

    const responseText = model.text;

    if (!responseText) {
      throw new Error(
        "Failed to generate story. AI returned an empty response.",
      );
    }

    const data = JSON.parse(responseText);

    if (!data.title || !data.story || !data.summary) {
      console.error("Incomplete data from AI:", data);
      throw new Error("AI returned incomplete data.");
    }

    const { data: story } = await supabase
      .from("stories")
      .insert({
        title: data.title,
        prompt,
        story_text: data.story,
        language,
        summary: data.summary,
        moral: data.moral,
        topic,
        character_count: data.story.length,
      })
      .select()
      .single();

    if (!story) {
      throw new Error("Failed to save story");
    }

    const { error } = await supabase.from("story_vectors").insert({
      story_id: story.id,
      embedding,
    });

    if (error) {
      console.error("Error saving story embedding:", error);
      throw new Error("Failed to save story embedding");
    }

    result = {
      id: story.id,
      title: data.title,
      story: data.story,
      summary: data.summary,
      moral: data.moral,
    };

    return NextResponse.json(result, { status: 200 });
    // return NextResponse.json({ staus: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 },
    );
  }
}
