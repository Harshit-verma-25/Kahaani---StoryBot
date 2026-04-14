import { GeneratedStory, languageOption } from "./types";

export const LOADING_MESSAGES = [
  "Generating...",
  "Thinking...",
  "Creating magic...",
  "Weaving your tale...",
  "Gathering ideas...",
  "Almost there...",
  "Putting on the finishing touches...",
  "Finalizing your story...",
  "Just a moment more...",
];

export const LANGUAGE_OPTIONS: Array<{
  value: languageOption;
  label: string;
}> = [
  { value: "hindi", label: "हिंदी (Hindi)" },
  { value: "english", label: "English" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "bangla", label: "বাংলা (Bengali)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "telugu", label: "తెలుగు (Telugu)" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "malayalam", label: "മലയാളം (Malayalam)" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
];
