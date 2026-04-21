import { languageOption } from "./types";
import InBuildStories from "@/app/data/stories.json";

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
    hasVideo: InBuildStories["the-birth-of-ganesha"].videoUrl ? true : false,
    hasImages:
      InBuildStories["the-birth-of-ganesha"].images.length > 0 ? true : false,
  },
  {
    title: "Holi ka Dahan",
    thumbnail: "/story-poster/holi-ka-dahan.png",
    slug: "holi-ka-dahan",
    hasVideo: InBuildStories["holi-ka-dahan"].videoUrl ? true : false,
    hasImages: InBuildStories["holi-ka-dahan"].images.length > 0 ? true : false,
  },
  {
    title: "Krishna's Butter Story",
    thumbnail: "/story-poster/krishna-butter-story.png",
    slug: "krishna-butter-story",
    hasVideo: InBuildStories["krishna-butter-story"].videoUrl ? true : false,
    hasImages:
      InBuildStories["krishna-butter-story"].images.length > 0 ? true : false,
  },
  {
    title: "The Story of Ramayana",
    thumbnail: "/story-poster/the-story-of-ramayana.png",
    slug: "the-story-of-ramayana",
    hasVideo: InBuildStories["the-story-of-ramayana"].videoUrl ? true : false,
    hasImages:
      InBuildStories["the-story-of-ramayana"].images.length > 0 ? true : false,
  },
  {
    title: "The Story of Mahabharata",
    thumbnail: "/story-poster/the-story-of-mahabharata.png",
    slug: "the-story-of-mahabharata",
    hasVideo: InBuildStories["the-story-of-mahabharata"].videoUrl
      ? true
      : false,
    hasImages:
      InBuildStories["the-story-of-mahabharata"].images.length > 0
        ? true
        : false,
  },
  {
    title: "The Story of Shiva",
    thumbnail: "/story-poster/the-story-of-shiva.png",
    slug: "the-story-of-shiva",
    hasVideo: InBuildStories["the-story-of-shiva"].videoUrl ? true : false,
    hasImages:
      InBuildStories["the-story-of-shiva"].images.length > 0 ? true : false,
  },
  {
    title: "Ganesha and the Broken Tusk",
    thumbnail: "/story-poster/ganesha-and-the-broken-tusk.png",
    slug: "ganesha-and-the-broken-tusk",
    hasVideo: InBuildStories["ganesha-and-the-broken-tusk"].videoUrl
      ? true
      : false,
    hasImages:
      InBuildStories["ganesha-and-the-broken-tusk"].images.length > 0
        ? true
        : false,
  },
  {
    title: "Surya and his Son Karna",
    thumbnail: "/story-poster/surya-and-his-son-karna.png",
    slug: "surya-and-his-son-karna",
    hasVideo: InBuildStories["surya-and-his-son-karna"].videoUrl ? true : false,
    hasImages:
      InBuildStories["surya-and-his-son-karna"].images.length > 0
        ? true
        : false,
  },
  {
    title: "The Churning of the Ocean",
    thumbnail: "/story-poster/the-churning-of-the-ocean.png",
    slug: "the-churning-of-the-ocean",
    hasVideo: InBuildStories["the-churning-of-the-ocean"].videoUrl
      ? true
      : false,
    hasImages:
      InBuildStories["the-churning-of-the-ocean"].images.length > 0
        ? true
        : false,
  },
  {
    title: "Hanuman's Leap to Lanka",
    thumbnail: "/story-poster/hanuman's-leap-to-lanka.png",
    slug: "hanuman's-leap-to-lanka",
    hasVideo: InBuildStories["hanuman's-leap-to-lanka"].videoUrl ? true : false,
    hasImages:
      InBuildStories["hanuman's-leap-to-lanka"].images.length > 0
        ? true
        : false,
  },
];
