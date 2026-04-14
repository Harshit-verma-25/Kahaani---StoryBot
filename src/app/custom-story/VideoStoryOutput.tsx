import { VideoStoryFormat } from "../lib/types/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface VideoStoryOutputProps {
  activeTab: "Full Story" | "Summary" | "Moral" | "Full Video";
  setActiveTab: (
    tab: "Full Story" | "Summary" | "Moral" | "Full Video",
  ) => void;
  output: VideoStoryFormat;
  isStoryLoading?: boolean;
  isVideoLoading?: boolean;
}

const VideoStoryOutput = ({
  activeTab,
  setActiveTab,
  output,
  isStoryLoading,
  isVideoLoading,
}: VideoStoryOutputProps) => {
  return (
    <>
      <div className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center">
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
      <div className="bg-transparent w-full flex flex-col items-center justify-center md:pb-28 pb-10">
        {activeTab === "Full Video" && (
          <div className="flex w-full max-w-[1126px] h-[300px] lg:h-[634px] items-center justify-center gap-6 max-lg:flex-col overflow-hidden rounded-2xl bg-black">
            {isVideoLoading ? (
              <div className="flex flex-col items-center justify-center text-white">
                <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4 text-primary" />
                <p className="animate-pulse">
                  Generating your video... Please wait.
                </p>
              </div>
            ) : output.videoUrl ? (
              <video
                src={output.videoUrl}
                controls
                className="w-full h-full object-contain"
                autoPlay
              />
            ) : (
              <p className="text-white text-lg">Video not available.</p>
            )}
          </div>
        )}
        {activeTab === "Summary" && (
          <p className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line px-4">
            {isStoryLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-2 mt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-full"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              </div>
            ) : (
              output.summary
            )}
          </p>
        )}
        {activeTab === "Moral" && (
          <p className="space-y-3 text-center text-lg sm:text-xl font-semibold leading-relaxed text-secondary whitespace-pre-line px-4">
            {isStoryLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-2 mt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-1/2"></div>
              </div>
            ) : (
              output.moral
            )}
          </p>
        )}
      </div>
    </>
  );
};

export default VideoStoryOutput;
