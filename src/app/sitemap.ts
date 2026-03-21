import type { MetadataRoute } from "next";
import StoryFormData from "@/app/data/stories.json";
import { inBuiltStory } from "@/app/lib/types/types";

const baseUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://kahaani-story-bot.vercel.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-story`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const storyRoutes: MetadataRoute.Sitemap = Object.keys(
    StoryFormData as inBuiltStory,
  ).map((slug) => ({
    url: `${baseUrl}/stories/${slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...storyRoutes];
}
