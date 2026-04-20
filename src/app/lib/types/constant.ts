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

export const STORIES_LIST = [
  {
    title: "The Birth of Ganesha",
    thumbnail: "/story-poster/birth-of-ganesha.png",
    type: "video",
    slug: "the-birth-of-ganesha",
  },
  {
    title: "Holi ka Dahan",
    thumbnail: "/story-poster/holi-ka-dahan.png",
    slug: "holi-ka-dahan",
  },
  {
    title: "Krishna's Butter Story",
    thumbnail: "/story-poster/krishna-butter-story.png",
    slug: "krishna-butter-story",
  },
  {
    title: "The Story of Ramayana",
    thumbnail: "/story-poster/the-story-of-ramayana.png",
    slug: "the-story-of-ramayana",
  },
  {
    title: "The Story of Mahabharata",
    thumbnail: "/story-poster/the-story-of-mahabharata.png",
    slug: "the-story-of-mahabharata",
  },
  {
    title: "The Story of Shiva",
    thumbnail: "/story-poster/the-story-of-shiva.png",
    slug: "the-story-of-shiva",
  },
  {
    title: "Ganesha and the Broken Tusk",
    thumbnail: "/story-poster/ganesha-and-the-broken-tusk.png",
    slug: "ganesha-and-the-broken-tusk",
  },
  {
    title: "Surya and his Son Karna",
    thumbnail: "/story-poster/surya-and-his-son-karna.png",
    slug: "surya-and-his-son-karna",
  },
  {
    title: "The Churning of the Ocean",
    thumbnail: "/story-poster/the-churning-of-the-ocean.png",
    slug: "the-churning-of-the-ocean",
  },
  {
    title: "Hanuman's Leap to Lanka",
    thumbnail: "/story-poster/hanuman's-leap-to-lanka.png",
    slug: "hanuman's-leap-to-lanka",
  },
];
