"use client";

import Image from "next/image";
import { FaMagic } from "react-icons/fa";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  StoryFormData,
  TextStoryFormat,
  VideoStoryFormat,
} from "@/app/lib/types/types";
import { toast } from "react-toastify";
import { RiLoader2Fill } from "react-icons/ri";
import CustomSelect from "@/app/components/forms/customSelect";
import { LOADING_MESSAGES, LANGUAGE_OPTIONS } from "@/app/lib/types/constant";
import TextStoryOutput from "./TextStoryOutput";
import VideoStoryOutput from "./VideoStoryOutput";
import generateStory from "@/app/lib/ai/models/storyModel";
import generateStoryImage from "@/app/lib/ai/models/imageModel";
import generateSpeech from "@/app/lib/ai/models/ttsModel";
import generateStoryVideo from "../lib/ai/models/videoModel";

const GenerateStoryPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [storyFormData, setStoryFormData] = useState<StoryFormData>({
    prompt: "",
    moral: "",
    format: "text_story_with_visuals",
    language: "hindi",
  });

  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<
    VideoStoryFormat | TextStoryFormat | null
  >(null);
  const [activeTab, setActiveTab] = useState<
    "Full Story" | "Summary" | "Moral" | "Full Video"
  >("Full Story");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (loading) {
      intervalId = setInterval(() => {
        setCurrentMessage((prevMessage) => {
          const currentIndex = LOADING_MESSAGES.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 1750);
    } else {
      setCurrentMessage(LOADING_MESSAGES[0]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loading, LOADING_MESSAGES]);

  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;

    setOutput(null);
    setActiveTab("Full Story");
    router.replace("/custom-story", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (storyFormData.format === "video_story" && activeTab === "Full Story") {
      setActiveTab("Full Video");
    }

    if (
      storyFormData.format === "text_story_with_visuals" &&
      activeTab === "Full Video"
    ) {
      setActiveTab("Full Story");
    }
  }, [storyFormData.format, activeTab]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { id, value } = e.target;
    setStoryFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storyFormData.prompt.trim()) {
      toast.warning("Please enter a prompt.");
      return;
    }

    if (!storyFormData.language.trim()) {
      toast.warning("Please select a language.");
      return;
    }

    try {
      setLoading(true);

      if (storyFormData.format === "text_story_with_visuals") {
        setActiveTab("Full Story");
        setIsStoryLoading(true);
        setIsImageLoading(true);
        setIsTTSLoading(true);

        const newOutput: TextStoryFormat = {
          language: storyFormData.language,
          title: "",
          story: "",
          summary: "",
          moral: "",
          images: [],
          audioUrl: "",
          contentType: "mp3",
          size: 0,
        };
        setOutput(newOutput);

        const promptParam = storyFormData.prompt;

        const imagePromise = generateStoryImage(promptParam)
          .then((imagesData) => {
            const imageUrls = imagesData.map(
              (img) =>
                `data:${img.image.mimeType};base64,${img.image.imageBytes}`,
            );
            setOutput((prev) =>
              prev
                ? ({
                    ...prev,
                    images: (prev as TextStoryFormat).images
                      ? (prev as TextStoryFormat).images.concat(imageUrls)
                      : imageUrls,
                  } as TextStoryFormat)
                : prev,
            );
          })
          .catch((err) => console.error("Image generation failed:", err))
          .finally(() => setIsImageLoading(false));

        const generatedStory = await generateStory(
          promptParam,
          storyFormData.language,
        );

        setOutput((prev) =>
          prev
            ? ({
                ...prev,
                title: generatedStory.title,
                story: generatedStory.story,
                summary: generatedStory.summary,
                moral: generatedStory.moral,
              } as TextStoryFormat)
            : prev,
        );
        setIsStoryLoading(false);
        setLoading(false);

        const ttsPromise = generateSpeech(generatedStory.story)
          .then((ttsData) => {
            const resolvedMimeType = ttsData.mimeType || "audio/mp3";
            const audioUrl = `data:${resolvedMimeType};base64,${ttsData.audioBase64}`;
            setOutput((prev) =>
              prev
                ? ({
                    ...prev,
                    audioUrl,
                    contentType: resolvedMimeType.includes("wav")
                      ? "wav"
                      : "mp3",
                  } as TextStoryFormat)
                : prev,
            );
          })
          .catch((err) => console.error("TTS generation failed:", err))
          .finally(() => setIsTTSLoading(false));

        await Promise.all([imagePromise, ttsPromise]);
      } else if (storyFormData.format === "video_story") {
        setActiveTab("Full Video");
        setIsVideoLoading(true);
        setIsStoryLoading(true);

        const newOutput: VideoStoryFormat = {
          language: "english",
          title: "",
          summary: "",
          moral: "",
          videoUrl: "",
          contentType: "mp4",
          size: 0,
        };
        setOutput(newOutput);

        const promptParam = storyFormData.prompt;

        const generatedStory = await generateStory(
          promptParam,
          storyFormData.language,
        );

        setOutput((prev) =>
          prev
            ? ({
                ...prev,
                title: generatedStory.title,
                story: generatedStory.story,
                summary: generatedStory.summary,
                moral: generatedStory.moral,
              } as TextStoryFormat)
            : prev,
        );
        setIsStoryLoading(false);
        setLoading(false);

        const videoData = await generateStoryVideo(promptParam);

        setOutput((prev) =>
          prev
            ? ({
                ...prev,
                videoUrl: videoData.videoUrl || "",
                contentType: "mp4",
                size: 0,
              } as VideoStoryFormat)
            : prev,
        );
        setIsVideoLoading(false);
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error(
        "Oops! The storyteller got a little lost. Please try asking again!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center px-4 gap-6 md:gap-10">
        {!output && (
          <>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-primary font-medium">
                Make Your Own{" "}
                <span className="relative inline-block max-sm:mt-1">
                  Kahaani
                  <div className="absolute max-sm:-top-1 max-sm:-right-3 -top-3 -right-5 rotate-y-180">
                    <Image
                      src="/home/home-4.png"
                      width={16}
                      height={16}
                      alt="3 Purple Lines"
                      className="w-4 h-4 sm:w-[25px] sm:h-[25px]"
                    />
                  </div>
                </span>
              </h1>
            </div>

            <form
              className="w-full max-w-2xl mx-auto flex mt-2 flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt" className="text-md font-medium">
                  Enter Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  placeholder="Example: A brave little elephant who overcomes challenges to find his way back home."
                  id="prompt"
                  className="outline-none resize-none p-2 border border-primary rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={storyFormData.prompt}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="moral" className="text-md font-medium">
                  Enter Moral
                </label>
                <input
                  type="text"
                  placeholder="Example: Honesty"
                  id="moral"
                  className="outline-none p-2 border border-primary rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={storyFormData.moral}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="format" className="text-md font-medium">
                  Story Format
                </label>
                <CustomSelect
                  id="format"
                  value={storyFormData.format}
                  options={[
                    {
                      value: "text_story_with_visuals",
                      label: "Text Story with Visuals",
                    },
                    { value: "video_story", label: "Video Story" },
                  ]}
                  placeholder="Select story format"
                  onChange={(value) =>
                    setStoryFormData((prev) => ({ ...prev, format: value }))
                  }
                />
              </div>

              {storyFormData.format === "text_story_with_visuals" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="language" className="text-md font-medium">
                    Choose Language <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    id="language"
                    value={storyFormData.language}
                    options={LANGUAGE_OPTIONS}
                    placeholder="Select language"
                    onChange={(value) =>
                      setStoryFormData((prev) => ({ ...prev, language: value }))
                    }
                  />
                </div>
              )}

              <button
                type="submit"
                className="mx-auto w-fit px-6 py-3 font-medium bg-primary text-white rounded-full cursor-pointer hover:scale-105 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {currentMessage}
                    <RiLoader2Fill className="inline-block ml-2 mb-1 animate-spin" />
                  </>
                ) : (
                  <>
                    Generate Custom Story
                    <FaMagic className="inline-block ml-2 mb-1" size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {output && (
          <>
            <div className="text-center max-w-3xl">
              {isStoryLoading ? (
                <div className="mx-auto h-10 w-72 max-w-full animate-pulse rounded-full bg-primary/15 sm:h-12 sm:w-96" />
              ) : (
                <h1 className="text-xl sm:text-2xl lg:text-4xl text-primary font-medium pt-8">
                  &quot;{output.title}&quot;
                </h1>
              )}
            </div>

            {storyFormData.format === "text_story_with_visuals" ? (
              <TextStoryOutput
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                output={output as TextStoryFormat}
                isStoryLoading={isStoryLoading}
                isImageLoading={isImageLoading}
                isTTSLoading={isTTSLoading}
              />
            ) : storyFormData.format === "video_story" ? (
              <VideoStoryOutput
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                output={output as VideoStoryFormat}
                isStoryLoading={isStoryLoading}
                isVideoLoading={isVideoLoading}
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

const CustomStoryClient = () => {
  return (
    <Suspense fallback={null}>
      <GenerateStoryPageContent />
    </Suspense>
  );
};

export default CustomStoryClient;
