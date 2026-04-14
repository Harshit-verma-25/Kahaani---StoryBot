import StoryReader from "../components/storyReader";
import { TextStoryFormat } from "../lib/types/types";
import ImageCarousel from "../components/carousel";

interface TextStoryOutputProps {
  activeTab: "Full Story" | "Summary" | "Moral" | "Full Video";
  setActiveTab: (
    tab: "Full Story" | "Summary" | "Moral" | "Full Video",
  ) => void;
  output: TextStoryFormat;
  isStoryLoading?: boolean;
  isImageLoading?: boolean;
  isTTSLoading?: boolean;
}

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-primary/15 ${className}`} />
);

const TextStoryOutputSkeleton = ({
  isStoryLoading,
}: {
  isStoryLoading: boolean;
}) => (
  <div className="mx-auto flex w-full flex-col items-center px-4 py-6">
    <div className="max-w-[684px] w-full space-y-4">
      {isStoryLoading ? (
        <>
          <SkeletonBar className="h-6 w-11/12 mx-auto" />
          <SkeletonBar className="h-6 w-10/12 mx-auto" />
          <SkeletonBar className="h-6 w-full mx-auto" />
          <SkeletonBar className="h-6 w-9/12 mx-auto" />
          <SkeletonBar className="h-6 w-8/12 mx-auto" />
        </>
      ) : null}
    </div>
  </div>
);

const TextStoryOutput = ({
  activeTab,
  setActiveTab,
  output,
  isStoryLoading = false,
  isImageLoading = false,
  isTTSLoading = false,
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
          <div className="flex w-full items-center gap-6 max-lg:flex-col">
            <div className="w-full max-w-3xl">
              {isImageLoading && !output.images.length ? (
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
                <ImageCarousel images={output.images} interval={10000} />
              )}
            </div>

            {isStoryLoading && !output.story ? (
              <TextStoryOutputSkeleton isStoryLoading={isStoryLoading} />
            ) : (
              <StoryReader
                story={output.story}
                audioUrl={output.audioUrl}
                isAudioLoading={isTTSLoading}
              />
            )}
          </div>
        )}
        {activeTab === "Summary" && (
          <div className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
            {isStoryLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-2 mt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-full"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              </div>
            ) : (
              output.summary
            )}
          </div>
        )}
        {activeTab === "Moral" && (
          <div className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line">
            {isStoryLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-2 mt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-1/2"></div>
              </div>
            ) : (
              output.moral
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TextStoryOutput;
