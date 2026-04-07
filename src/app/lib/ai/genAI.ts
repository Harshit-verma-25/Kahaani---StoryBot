import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenAI({ apiKey });

export default genAI;