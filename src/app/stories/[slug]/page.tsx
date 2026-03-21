import type { Metadata } from "next";
import { inBuiltStory } from "@/app/lib/types/types";
import StoryFormData from "@/app/data/stories.json";
import StoryPageClient from "./storyPageClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const stories = StoryFormData as inBuiltStory;
  return Object.keys(stories).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = (StoryFormData as inBuiltStory)[slug]?.english;

  if (!story) {
    return {
      title: "Story Not Found",
      description: "The requested story was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: story.title,
    description: story.summary,
    alternates: {
      canonical: `/stories/${slug}`,
    },
    openGraph: {
      title: story.title,
      description: story.summary,
      type: "article",
      url: `/stories/${slug}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.summary,
      images: ["/og-image.png"],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <StoryPageClient slug={slug} />;
}
