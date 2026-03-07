export interface StoryFormData {
  prompt: string;
  moral: string;
  language:
    | "hindi"
    | "english"
    | "marathi"
    | "bengali"
    | "tamil"
    | "telugu"
    | "kannada"
    | "malayalam"
    | "gujarati"
    | "punjabi";
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
