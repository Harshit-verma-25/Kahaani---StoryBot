import genAI from "../genAI";

export async function generateEmbedding(text: string) {
  return genAI.models.embedContent({
    model: process.env.EMBEDDING_MODEL || "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
}
