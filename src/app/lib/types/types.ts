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

export interface inBuiltStory {
  [key: string]: Partial<Record<StoryFormData["language"], GeneratedStory>>;
}
