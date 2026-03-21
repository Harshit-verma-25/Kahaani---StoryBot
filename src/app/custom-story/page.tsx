import type { Metadata } from "next";
import CustomStoryClient from "./customStoryClient";

export const metadata: Metadata = {
  title: "Create Custom Story",
  description:
    "Generate a personalized kids story with AI by choosing your own prompt, moral, and language.",
  alternates: {
    canonical: "/custom-story",
  },
};

export default function CustomStoryPage() {
  return <CustomStoryClient />;
}
