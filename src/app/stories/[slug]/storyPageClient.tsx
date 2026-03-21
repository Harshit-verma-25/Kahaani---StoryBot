"use client";

import { useState } from "react";
import { GeneratedStory, inBuiltStory } from "@/app/lib/types/types";
import StoryReader from "@/app/components/storyReader";
import StoryFormData from "@/app/data/stories.json";

type StoryPageClientProps = {
  slug: string;
};

const EMPTY_STORY: GeneratedStory = {
  story: "",
  summary: "",
  title: "",
  moral: "",
};

const StoryPageClient = ({ slug }: StoryPageClientProps) => {
  const [activeTab, setActiveTab] = useState<
    "Full Story" | "Summary" | "Moral"
  >("Full Story");
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const storyInfo = (StoryFormData as inBuiltStory)[slug];
  const output = storyInfo?.[language] ?? EMPTY_STORY;

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-xl sm:text-2xl lg:text-4xl text-primary font-medium">
            &quot;{output.title || "Story"}&quot;
          </h1>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
            <p
              className={`px-3 py-1 rounded-full w-fit text-xs cursor-pointer ${
                language === "english"
                  ? "bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setLanguage("english")}
            >
              English
            </p>
            <p
              className={`px-3 py-1 rounded-full w-fit text-xs cursor-pointer ${
                language === "hindi" ? "bg-primary text-white" : "text-primary"
              }`}
              onClick={() => setLanguage("hindi")}
            >
              हिंदी
            </p>
          </div>

          <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
            <p
              className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                activeTab === "Full Story"
                  ? "bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveTab("Full Story")}
            >
              Full Story
            </p>
            <p
              className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                activeTab === "Summary"
                  ? "bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveTab("Summary")}
            >
              Summary
            </p>
            <p
              className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                activeTab === "Moral" ? "bg-primary text-white" : "text-primary"
              }`}
              onClick={() => setActiveTab("Moral")}
            >
              Moral
            </p>
          </div>
        </div>

        <div className="bg-transparent rounded-xl max-w-3xl w-full flex flex-col items-center justify-center">
          {activeTab === "Full Story" && (
            <StoryReader story={output.story} language={language} />
          )}
          {activeTab === "Summary" && (
            <p className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
              {output.summary}
            </p>
          )}
          {activeTab === "Moral" && (
            <p className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
              {output.moral}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryPageClient;
