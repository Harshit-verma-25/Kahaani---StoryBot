import HeroSection from "@/app/components/home/hero";
import StoriesGridSection from "@/app/components/home/storiesGrid";
import OurStorySection from "@/app/components/home/ourStory";
import WhyStoryTellingSection from "@/app/components/home/whyStoryTelling";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Read curated mythology stories and create custom stories for children in multiple Indian languages.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <StoriesGridSection />
      <OurStorySection />
      <WhyStoryTellingSection />
    </>
  );
}
