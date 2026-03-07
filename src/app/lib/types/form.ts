export interface StoryFormData {
  prompt: string;
  moral: string | null;
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
