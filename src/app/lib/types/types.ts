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
  audioBase64: string;
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
  language: languageOption;
  title: string;
  videoUrl: string;
  summary: string;
  moral: string;
  contentType: "mp4" | "webm" | "ogg";
  size: number; // in bytes
}

export interface TextStoryFormat {
  language: languageOption;
  title: string;
  story: string;
  summary: string;
  moral: string;
  images: string[]; // Array of image URLs
  audioUrl: string;
  contentType: "mp3" | "wav" | "ogg";
  size: number; // in bytes
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  enquiry: string;
  message: string;
}

export interface JoinOurTeamFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  resume: File | null;
}
