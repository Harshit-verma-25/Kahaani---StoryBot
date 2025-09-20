import HeroSection from "@/app/components/home/hero";
import StoriesGridSection from "@/app/components/home/storiesGrid";
import OurStorySection from "@/app/components/home/ourStory";
import WhyStoryTellingSection from "@/app/components/home/whyStoryTelling";

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
