"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoPauseCircleOutline } from "react-icons/io5";
import { RiRestartLine } from "react-icons/ri";
import { FaRegCircleStop } from "react-icons/fa6";

type Props = {
  story: string;
  audioUrl?: string;
  isAudioLoading?: boolean;
};

function splitIntoSentences(text: string): string[] {
  const parts =
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?।]+[.!?।]?/g) || [];

  return parts.map((sentence) => sentence.trim()).filter(Boolean);
}

function getSentenceWeight(sentence: string) {
  const normalized = sentence.replace(/\s+/g, " ").trim();
  return Math.max(normalized.length, 1);
}

export default function StoryReader({
  story,
  audioUrl,
  isAudioLoading = false,
}: Props) {
  const sentences = useMemo(() => splitIntoSentences(story), [story]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const hasAudio = Boolean(audioUrl?.trim());

  const sentenceStartFractions = useMemo(() => {
    if (!sentences.length) return [];

    const weights = sentences.map(getSentenceWeight);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let runningWeight = 0;

    return weights.map((weight) => {
      const startFraction = totalWeight === 0 ? 0 : runningWeight / totalWeight;
      runningWeight += weight;
      return { startFraction, weight };
    });
  }, [sentences]);

  useEffect(() => {
    setCurrent(0);
    setIsPlaying(false);
    setDuration(0);
    setAudioError(null);

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, [story, audioUrl]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    const updateCurrentSentence = () => {
      if (!sentenceStartFractions.length || !audio.duration) {
        setCurrent(0);
        return;
      }

      const progress = Math.min(audio.currentTime / audio.duration, 0.999999);
      let activeSentence = 0;

      for (let index = 0; index < sentenceStartFractions.length; index += 1) {
        if (progress >= sentenceStartFractions[index].startFraction) {
          activeSentence = index;
        } else {
          break;
        }
      }

      setCurrent(activeSentence);
    };

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      updateCurrentSentence();
    };

    const handleTimeUpdate = () => {
      updateCurrentSentence();
    };

    const handlePlay = () => {
      setAudioError(null);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      updateCurrentSentence();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrent(Math.max(sentences.length - 1, 0));
    };

    const handleError = () => {
      setIsPlaying(false);
      setAudioError("This audio format could not be played in the browser.");
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [hasAudio, sentenceStartFractions, sentences.length]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio || !sentences.length) return;

    if (audio.ended || audio.currentTime >= duration) {
      audio.currentTime = 0;
      setCurrent(0);
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setAudioError(null);
      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setAudioError("Audio playback failed. Please try generating the story again.");
      console.error("Audio playback failed:", error);
    }
  };

  const handleRestart = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    audio.currentTime = 0;
    setCurrent(0);

    try {
      setAudioError(null);
      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setAudioError("Audio playback failed. Please try generating the story again.");
      console.error("Audio restart failed:", error);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrent(0);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center px-4 py-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

      <div className="max-h-[380px] w-full overflow-y-auto scrollbar-none">
        <div className="space-y-3 text-center leading-relaxed">
        {sentences.map((sentence, index) => {
          const isActive = index === current;
          const isRead = index < current;

          return (
            <div
              key={`${index}-${sentence.slice(0, 24)}`}
              ref={isActive ? activeRef : null}
              className={[
                "transition-colors duration-200",
                isActive
                  ? "text-black text-xl font-semibold"
                  : "text-neutral-400 text-xs",
                isRead ? "opacity-70" : "opacity-100",
                "text-lg sm:text-xl",
              ].join(" ")}
            >
              {sentence}
            </div>
          );
        })}
        </div>
      </div>

      {hasAudio && (
        <div
          className="mt-6 flex items-center gap-2 rounded-full border-2 border-primary bg-primary/20 p-1"
          role="group"
          aria-label="Story controls"
        >
          <button
            onClick={handlePlayPause}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white shadow transition hover:opacity-90"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <IoPauseCircleOutline className="text-lg" />
            ) : (
              <span className="inline-flex items-center gap-1">
                Read Aloud
                <HiMiniSpeakerWave className="text-lg" />
              </span>
            )}
          </button>
          <button
            onClick={handleRestart}
            className="rounded-full px-3 py-2 text-sm text-neutral-900 transition"
            aria-label="Restart audio"
          >
            <RiRestartLine className="text-lg" />
          </button>
          <button
            onClick={handleStop}
            className="rounded-full px-3 py-2 text-sm text-neutral-900 transition"
            aria-label="Stop audio"
          >
            <FaRegCircleStop className="text-lg" />
          </button>
        </div>
      )}

      {!hasAudio && isAudioLoading && (
        <div className="mt-6 flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 p-1">
          <div className="h-10 w-28 animate-pulse rounded-full bg-primary/15" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-primary/15" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-primary/15" />
        </div>
      )}

      {audioError && (
        <p className="mt-3 text-center text-sm text-red-600">{audioError}</p>
      )}

      {!hasAudio && !isAudioLoading && !audioError && (
        <p className="mt-4 text-sm text-neutral-500 text-center">
          Audio is not available for this story yet.
        </p>
      )}
    </div>
  );
}
