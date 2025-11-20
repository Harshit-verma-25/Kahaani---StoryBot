export interface StoryData {
  prompt: string;
  moral: string;
  language: "hindi" | "english";
}

export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  moral: string;
}

export interface inBuiltStory {
  [key: string]: {
    english: GeneratedStory;
    hindi: GeneratedStory;
  };
}