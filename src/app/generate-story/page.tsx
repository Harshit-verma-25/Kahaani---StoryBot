"use client";

import Image from "next/image";
import { FaMagic } from "react-icons/fa";
import { useState } from "react";
import { StoryData } from "@/app/lib/types";

const GenerateStoryPage = () => {
  const [storyData, setStoryData] = useState<StoryData>({
    prompt: "",
    moral: "",
    language: "hindi",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setStoryData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-6 md:gap-10 px-4">
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

        {/* UPDATED: Used a <form> tag and constrained its width for better readability on large screens */}
        <form className="w-full max-w-2xl mx-auto mt-4 flex flex-col gap-6">
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
              className="outline-none p-2 border border-primary rounded-xl w-full"
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
          >
            Generate Custom Story
            <FaMagic className="inline-block ml-2 mb-1" size={18} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default GenerateStoryPage;
