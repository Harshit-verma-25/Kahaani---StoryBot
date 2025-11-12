"use client";

import Image from "next/image";
import { FaMagic } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GeneratedStory, StoryData } from "@/app/lib/types";
import { toast } from "react-toastify";
import { generateStory } from "@/app/actions/GenerateStory";
import StoryReader from "../components/storyReader";
import { RiLoader2Fill } from "react-icons/ri";

const GenerateStoryPage = () => {
  const loadingMessages = [
    "Generating...",
    "Thinking...",
    "Creating magic...",
    "Weaving your tale...",
    "Gathering ideas...",
  ];

  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [storyData, setStoryData] = useState<StoryData>({
    prompt: "",
    moral: "",
    language: "hindi",
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<GeneratedStory>({
    story: "",
    summary: "",
    title: "",
    moral: "",
  });
  const [activeTab, setActiveTab] = useState<
    "Full Story" | "Summary" | "Moral"
  >("Full Story");

  useEffect(() => {
    let intervalId = null;

    if (loading) {
      intervalId = setInterval(() => {
        setCurrentMessage((prevMessage) => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 1500);
    } else {
      setCurrentMessage(loadingMessages[0]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loading]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setStoryData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = ["prompt", "moral", "language"];
    for (const field of requiredFields) {
      if (!storyData[field as keyof StoryData]) {
        toast.warning(`Missing required field: ${field}`);
        return;
      }
    }

    try {
      const response = await generateStory(storyData);

      if (response) {
        setOutput({
          story: response.story,
          summary: response.summary,
          title: response.title,
          moral: response.moral,
        });
        toast.success("Story generated successfully!");
      } else {
        toast.error("Failed to generate story. Please try again.");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Oops! The storyteller got a little lost. Please try asking again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-6 md:gap-10 px-4">
        {!output.story && (
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
              className="w-full max-w-2xl mx-auto mt-4 flex flex-col gap-6"
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
                  className="outline-none p-2 border border-primary rounded-xl w-full"
                  value={storyData.prompt}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="moral" className="text-md font-medium">
                  Enter Moral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Example: Honesty"
                  id="moral"
                  className="outline-none p-2 border border-primary rounded-xl w-full"
                  value={storyData.moral}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="language" className="text-md font-medium">
                  Choose Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="language"
                  className="outline-none p-2 border border-primary rounded-xl w-full :focus:border-secondary transition"
                  value={storyData.language}
                  onChange={handleChange}
                >
                  {["hindi", "english"].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

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

        {output.story && (
          <>
            <div className="text-center max-w-3xl">
              <h1 className="text-xl sm:text-2xl lg:text-4xl text-primary font-medium">
                &quot;{output.title}&quot;
              </h1>
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
                  activeTab === "Moral"
                    ? "bg-primary text-white"
                    : "text-primary"
                }`}
                onClick={() => setActiveTab("Moral")}
              >
                Moral
              </p>
            </div>
            <div className="bg-transparent rounded-xl max-w-3xl w-full flex flex-col items-center justify-center">
              {activeTab === "Full Story" && (
                <StoryReader
                  story={output.story}
                  language={storyData.language}
                />
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
          </>
        )}
      </div>
    </section>
  );
};

export default GenerateStoryPage;
