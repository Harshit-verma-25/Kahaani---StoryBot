"use client";

import { useState } from "react";
import {
  inBuiltStory,
  inBuiltStoryVideoAudio,
  languageOption,
} from "@/app/lib/types/types";
import StoryReader from "@/app/components/storyReader";
import StoryFormData from "@/app/data/stories.json";
import CustomSelect from "@/app/components/forms/customSelect";
import { LANGUAGE_OPTIONS } from "@/app/lib/types/constant";
import ImageCarousel from "@/app/components/carousel";

type StoryPageClientProps = {
  slug: string;
};

const StoryPageClient = ({ slug }: StoryPageClientProps) => {
  const [activeTab, setActiveTab] = useState<
    "Full Story" | "Summary" | "Moral" | "Full Video"
  >("Full Story");
  const [language, setLanguage] = useState<languageOption>("hindi");

  const storyInfo = (StoryFormData as inBuiltStory)[slug];
  const output = storyInfo?.[language] as inBuiltStoryVideoAudio;
  const videoUrl = storyInfo?.videoUrl;
  const images = storyInfo?.images ?? [];

  return (
    <section className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-xl sm:text-2xl lg:text-4xl text-primary font-medium">
            &quot;{output?.title || "Story"}&quot;
          </h1>
        </div>

        <div className="flex flex-col items-center gap-2">
          <CustomSelect
            name="language"
            value={language}
            options={LANGUAGE_OPTIONS}
            placeholder="Select a language"
            onChange={(value) => setLanguage(value as languageOption)}
            className="w-full max-w-xs"
            buttonClassName="w-full px-8 bg-primary/20 border-2 border-primary rounded-full p-2 flex items-center"
          />

          <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
            {videoUrl && (
              <p
                className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                  activeTab === "Full Video"
                    ? "bg-primary text-white"
                    : "text-primary"
                }`}
                onClick={() => setActiveTab("Full Video")}
              >
                Full Video
              </p>
            )}
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

        <div className="bg-transparent w-full flex flex-col items-center justify-center">
          {activeTab === "Full Video" && videoUrl && (
            <div className="flex w-full max-w-[1126px] h-[300px] lg:h-[634px] items-center justify-center gap-6 max-lg:flex-col overflow-hidden rounded-2xl bg-black">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
                autoPlay
              />
            </div>
          )}

          {activeTab === "Full Story" && (
            <div className="flex w-full items-center gap-6 max-lg:flex-col">
              <div className="w-full max-w-3xl">
                {!images.length || images.length === 0 ? (
                  <>
                    <div className="animate-pulse rounded-lg bg-primary/10 w-full h-[468px]" />
                    <div className="mt-3 flex justify-center gap-2">
                      {[0, 1, 2].map((dot) => (
                        <div
                          key={dot}
                          className="h-2 w-2 rounded-full bg-primary/15 animate-pulse"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <ImageCarousel images={images} interval={10000} />
                )}
              </div>

              <StoryReader story={output.story} audioUrl={output.audioUrl} />
            </div>
          )}
          {activeTab === "Summary" && (
            <div className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
              {output.summary}
            </div>
          )}
          {activeTab === "Moral" && (
            <div className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
              {output.moral}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryPageClient;
