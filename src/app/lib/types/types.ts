export type languageOption =
  | "hindi"
  | "english"
  | "marathi"
  | "bangla"
  | "tamil"
  | "telugu"
  | "kannada"
  | "malayalam"
  | "gujarati"
  | "punjabi";

export type languageCode =
  | "hi"
  | "en"
  | "mr"
  | "bn"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "gu"
  | "pa";

export type LanguageCodeMapType = {
  hindi: "hi";
  english: "en";
  marathi: "mr";
  bangla: "bn";
  tamil: "ta";
  telugu: "te";
  kannada: "kn";
  malayalam: "ml";
  gujarati: "gu";
  punjabi: "pa";
};

export type StoryFormat = "video_story" | "text_story_with_visuals";

export type FilterType = "all" | "video" | "textual" | languageOption;
export interface StoryFormData {
  prompt: string;
  moral: string;
  format: StoryFormat;
  language: languageOption;
}
export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  moral: string;
}

export interface GeneratedTTS {
  audioBuffer: Buffer<ArrayBuffer>;
  mimeType: string;
}

export interface GeneratedImage {
  image: {
    imageBytes: string; // base64 string
    mimeType: string;
  };
}

export interface inBuiltStory {
  [key: string]: Partial<Record<StoryFormData["language"], GeneratedStory>>;
}

export interface VideoStoryFormat {
  title: string;
  videoUrl: string;
  summary: string;
  moral: string;
  thumbnailUrl: string;
  contentType: "mp4" | "webm" | "ogg";
  size: number; // in bytes
}

export interface TextStoryFormat {
  title: string;
  story: string;
  summary: string;
  moral: string;
  images: string[]; // Array of image URLs
  audioUrl: string;
  contentType: "mp3" | "wav" | "ogg";
  size: number; // in bytes
}

/** Row shape for the `generated_stories` Supabase table. */
export interface GeneratedStoryRow {
  id: string;
  prompt: string;
  prompt_embedding?: number[];
  language: languageOption;
  format: StoryFormat;
  title: string;
  summary: string;
  moral: string;
  // text_story_with_visuals fields
  story?: string;
  images?: string[];
  audio_url?: string;
  audio_content_type?: string;
  audio_size?: number;
  // video_story fields
  video_url?: string;
  thumbnail_url?: string;
  video_content_type?: string;
  video_size?: number;
  created_at: string;
}

/** Data carried in each SSE event from /api/generate-story. */
export type SSEEvent =
  | { type: "story"; data: GeneratedStory }
  | { type: "images"; data: string[] }
  | { type: "audio"; data: { url: string; contentType: string; size: number } }
  | { type: "video"; data: { url: string; mimeType: string; size?: number } }
  | { type: "done"; data: { cached?: boolean } }
  | { type: "error"; data: { message: string } };
