import StoryReader from "../components/storyReader";
import { TextStoryFormat } from "../lib/types/types";
import ImageCarousel from "../components/carousel";

interface TextStoryOutputProps {
  activeTab: "Full Story" | "Summary" | "Moral" | "Full Video";
  setActiveTab: (
    tab: "Full Story" | "Summary" | "Moral" | "Full Video",
  ) => void;
  output: TextStoryFormat;
}

const TextStoryOutput = ({
  activeTab,
  setActiveTab,
  output,
}: TextStoryOutputProps) => {
  return (
    <>
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
            activeTab === "Summary" ? "bg-primary text-white" : "text-primary"
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
      <div className="bg-transparent w-full flex flex-col items-center justify-center">
        {activeTab === "Full Story" && (
          <div className="flex w-full items-center gap-6">
            <div className="w-full max-w-3xl">
              <ImageCarousel images={output.images} interval={10000} />
            </div>
            <StoryReader story={output.story} audioUrl={output.audioUrl} />
          </div>
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
  );
};

export default TextStoryOutput;
