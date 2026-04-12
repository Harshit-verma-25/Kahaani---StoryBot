"use client";

import NextImage from "next/image";
import { FaMagic } from "react-icons/fa";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GeneratedStory, StoryFormData } from "@/app/lib/types/types";
import { toast } from "react-toastify";
import StoryReader from "@/app/components/storyReader";
import { RiLoader2Fill } from "react-icons/ri";
import CustomSelect from "@/app/components/forms/customSelect";
import {
  EMPTY_OUTPUT,
  LOADING_MESSAGES,
  LANGUAGE_OPTIONS,
} from "@/app/lib/types/constant";

// ---------------------------------------------------------------------------
// SSE parsing helpers
// ---------------------------------------------------------------------------

interface AudioData {
  url: string;
  contentType: string;
  size: number;
}

interface VideoData {
  url: string;
  mimeType: string;
  size?: number;
}

function parseSseChunk(
  chunk: string,
): { event: string; data: unknown } | null {
  let event = "";
  let dataLine = "";
  for (const line of chunk.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLine = line.slice(5).trim();
  }
  if (!event || !dataLine) return null;
  try {
    return { event, data: JSON.parse(dataLine) };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Page content (uses useSearchParams – must be inside <Suspense>)
// ---------------------------------------------------------------------------

const GenerateStoryPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [formData, setFormData] = useState<StoryFormData>({
    prompt: "",
    moral: "",
    format: "text_story_with_visuals",
    language: "hindi",
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<GeneratedStory>(EMPTY_OUTPUT);
  const [activeTab, setActiveTab] = useState<"Full Story" | "Summary" | "Moral">(
    "Full Story",
  );

  // Progressive media state
  const [images, setImages] = useState<string[]>([]);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // Rotate loading message while generating
  useEffect(() => {
    if (!loading) {
      setCurrentMessage(LOADING_MESSAGES[0]);
      return;
    }
    const id = setInterval(() => {
      setCurrentMessage((prev) => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(idx + 1) % LOADING_MESSAGES.length];
      });
    }, 1750);
    return () => clearInterval(id);
  }, [loading]);

  // Reset when navigating to /custom-story?reset=1
  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;
    setOutput(EMPTY_OUTPUT);
    setImages([]);
    setAudioData(null);
    setVideoData(null);
    setActiveTab("Full Story");
    router.replace("/custom-story", { scroll: false });
  }, [searchParams, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ─── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.prompt.trim()) {
      toast.warning("Please enter a prompt.");
      return;
    }
    if (!formData.language.trim()) {
      toast.warning("Please select a language.");
      return;
    }

    // Clear previous output
    setOutput(EMPTY_OUTPUT);
    setImages([]);
    setAudioData(null);
    setVideoData(null);
    setActiveTab("Full Story");

    try {
      setLoading(true);

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt,
          moral: formData.moral,
          format: formData.format,
          language: formData.language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Story generation request failed.");
      }

      // ── Stream SSE events ────────────────────────────────────────────────
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by \n\n)
        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          const parsed = parseSseChunk(chunk);
          if (parsed) {
            const { event, data } = parsed;

            if (event === "story") {
              setOutput(data as GeneratedStory);
            } else if (event === "images") {
              setImages(data as string[]);
            } else if (event === "audio") {
              setAudioData(data as AudioData);
            } else if (event === "video") {
              setVideoData(data as VideoData);
            } else if (event === "done") {
              setLoading(false);
            } else if (event === "error") {
              toast.error(
                (data as { message: string }).message ||
                  "Story generation failed.",
              );
              setLoading(false);
            }
          }

          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error(
        "Oops! The storyteller got a little lost. Please try asking again!",
      );
      setLoading(false);
    }
  };

  // Whether to show the output panel (story received, even while still streaming)
  const showOutput = Boolean(output.story);

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center px-4 gap-6 md:gap-10">

        {/* ── Story generation form (hidden once story starts arriving) ──── */}
        {!showOutput && (
          <>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-primary font-medium">
                Make Your Own{" "}
                <span className="relative inline-block max-sm:mt-1">
                  Kahaani
                  <div className="absolute max-sm:-top-1 max-sm:-right-3 -top-3 -right-5 rotate-y-180">
                    <NextImage
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
                  value={formData.prompt}
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
                  value={formData.moral}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="format" className="text-md font-medium">
                  Story Format
                </label>
                <CustomSelect
                  id="format"
                  value={formData.format}
                  options={[
                    {
                      value: "text_story_with_visuals",
                      label: "Text Story with Visuals",
                    },
                    { value: "video_story", label: "Video Story" },
                  ]}
                  placeholder="Select story format"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, format: value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="language" className="text-md font-medium">
                  Choose Language <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  id="language"
                  value={formData.language}
                  options={LANGUAGE_OPTIONS}
                  placeholder="Select language"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                />
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

        {/* ── Output panel ─────────────────────────────────────────────────── */}
        {showOutput && (
          <>
            {/* Title */}
            <div className="text-center max-w-3xl">
              <h1 className="text-xl sm:text-2xl lg:text-4xl text-primary font-medium">
                &quot;{output.title}&quot;
              </h1>
            </div>

            {/* ── text_story_with_visuals ───────────────────────────────── */}
            {formData.format === "text_story_with_visuals" && (
              <>
                {/* Story / Summary / Moral tabs */}
                <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
                  {(["Full Story", "Summary", "Moral"] as const).map((tab) => (
                    <p
                      key={tab}
                      className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                        activeTab === tab
                          ? "bg-primary text-white"
                          : "text-primary"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </p>
                  ))}
                </div>

                <div className="bg-transparent rounded-xl max-w-3xl w-full flex flex-col items-center justify-center">
                  {activeTab === "Full Story" && (
                    <StoryReader
                      story={output.story}
                      language={formData.language}
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

                {/* AI-generated illustrations */}
                {images.length > 0 ? (
                  <div className="w-full max-w-3xl">
                    <h2 className="text-primary font-medium text-lg mb-3">
                      Illustrations
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {images.map((url, i) => (
                        <div
                          key={i}
                          className="relative w-full aspect-video rounded-xl overflow-hidden"
                        >
                          <NextImage
                            src={url}
                            alt={`Story illustration ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : loading ? (
                  <p className="text-sm text-secondary/60 animate-pulse">
                    Generating illustrations…
                  </p>
                ) : null}

                {/* AI-generated narration */}
                {audioData ? (
                  <div className="w-full max-w-3xl">
                    <h2 className="text-primary font-medium text-lg mb-2">
                      AI Narration
                    </h2>
                    <audio
                      controls
                      src={audioData.url}
                      className="w-full rounded-full"
                    />
                  </div>
                ) : loading ? (
                  <p className="text-sm text-secondary/60 animate-pulse">
                    Generating narration…
                  </p>
                ) : null}
              </>
            )}

            {/* ── video_story ───────────────────────────────────────────── */}
            {formData.format === "video_story" && (
              <>
                {/* Video player */}
                {videoData ? (
                  <div className="w-full max-w-3xl">
                    <video
                      controls
                      src={videoData.url}
                      className="w-full rounded-xl"
                    />
                  </div>
                ) : loading ? (
                  <div className="w-full max-w-3xl flex flex-col items-center gap-2">
                    <div className="w-full aspect-video rounded-xl bg-primary/10 animate-pulse" />
                    <p className="text-sm text-secondary/60 animate-pulse">
                      Generating video…
                    </p>
                  </div>
                ) : null}

                {/* Summary / Moral tabs */}
                <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
                  {(["Summary", "Moral"] as const).map((tab) => (
                    <p
                      key={tab}
                      className={`px-3 py-1 rounded-full w-fit font-medium cursor-pointer ${
                        activeTab === tab
                          ? "bg-primary text-white"
                          : "text-primary"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </p>
                  ))}
                </div>

                <div className="bg-transparent rounded-xl max-w-3xl w-full flex flex-col items-center justify-center">
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

            {/* Still-streaming indicator */}
            {loading && (
              <p className="text-sm text-secondary/60 flex items-center gap-1 animate-pulse">
                <RiLoader2Fill className="animate-spin" />
                {currentMessage}
              </p>
            )}
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
