import { VideoStoryFormat } from "../lib/types/types";

interface VideoStoryOutputProps {
  activeTab: "Full Story" | "Summary" | "Moral" | "Full Video";
  setActiveTab: (
    tab: "Full Story" | "Summary" | "Moral" | "Full Video",
  ) => void;
  output: VideoStoryFormat;
}

const VideoStoryOutput = ({
  activeTab,
  setActiveTab,
  output,
}: VideoStoryOutputProps) => {
  return null;
};

export default VideoStoryOutput;
