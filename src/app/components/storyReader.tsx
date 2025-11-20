"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoPauseCircleOutline } from "react-icons/io5";
import { RiRestartLine } from "react-icons/ri";
import { FaRegCircleStop } from "react-icons/fa6";

type Props = {
  story: string;
  language?: "english" | "hindi";
  rate?: number;
  pitch?: number;
};

function splitIntoSentences(text: string): string[] {
  const parts =
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?।]+[.!?।]?/g) || [];
  return parts.map((s) => s.trim()).filter(Boolean);
}

export default function StoryReader({
  story,
  language = "english",
  rate = 1,
  pitch = 1,
}: Props) {
  const sentences = useMemo(() => splitIntoSentences(story), [story]);
  
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false); // synchronous mirror of isPlaying
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Stop and reset player whenever language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    // keep ref + state in sync so playback won't resume unexpectedly
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrent(0);
  }, [language]);

  const activeRef = useRef<HTMLDivElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingRef = useRef(false); // prevents overlapping speaks

  // Helper to set both state and ref together
  const setPlaying = (v: boolean) => {
    isPlayingRef.current = v;
    setIsPlaying(v);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    const handleVoices = () => setVoices(synth.getVoices());
    handleVoices();
    synth.onvoiceschanged = handleVoices;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current]);

  const chosenVoice = useMemo(() => {
    if (!voices.length) return undefined;

    // Prefer specific Google voices first
    if (language === "hindi") {
      // Prefer "Google हिन्दी" if it exists
      const googleHindi = voices.find((v) => v.name === "Google हिन्दी");
      if (googleHindi) return googleHindi;

      // fallback: any Hindi voice
      const fallbackHindi = voices.find((v) =>
        v.lang?.toLowerCase().startsWith("hi")
      );
      if (fallbackHindi) return fallbackHindi;
    } else if (language === "english") {
      // Prefer Google UK English
      const googleUK = voices.find(
        (v) =>
          v.name?.toLowerCase().includes("google uk english") ||
          v.name === "Google UK English Female" ||
          v.name === "Google UK English Male"
      );
      if (googleUK) return googleUK;

      // fallback: any English (India or UK)
      const fallbackEnglish =
        voices.find((v) => v.lang?.toLowerCase().startsWith("en-gb")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en-in")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
      if (fallbackEnglish) return fallbackEnglish;
    }

    // final fallback
    return voices.find((v) => v.default);
  }, [voices, language]);

  // Cancel any existing speech and clear refs
  const cancelSpeech = () => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    synth.cancel();
    utterRef.current = null;
    speakingRef.current = false;
  };

  // Speak a sentence index. Defensive: cancel prior, guard double-calls.
  const speakCurrent = (index: number) => {
    if (typeof window === "undefined") return;
    if (!sentences[index]) {
      setPlaying(false);
      return;
    }

    // If another speak is in progress, cancel it first (defensive).
    cancelSpeech();

    // small guard
    if (speakingRef.current) return;
    speakingRef.current = true;

    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(sentences[index]);
    utterRef.current = u;
    if (chosenVoice) u.voice = chosenVoice;
    u.rate = rate;
    u.pitch = pitch;

    let ended = false;

    u.onend = () => {
      if (ended) return;
      ended = true;

      utterRef.current = null;
      speakingRef.current = false;

      setCurrent((prev) => {
        const next = prev + 1;
        if (next < sentences.length) {
          setTimeout(() => {
            // If something else started speaking meanwhile, don't start.
            if (typeof window === "undefined") return;
            if (
              window.speechSynthesis.speaking ||
              window.speechSynthesis.pending
            ) {
              return;
            }
            // Use ref for the latest user intention
            if (!isPlayingRef.current) return;
            speakCurrent(next);
          }, 80);
        } else {
          setPlaying(false);
        }
        return next;
      });
    };

    u.onerror = () => {
      utterRef.current = null;
      speakingRef.current = false;
      setPlaying(false);
    };

    try {
      synth.speak(u);
    } catch (err) {
      utterRef.current = null;
      speakingRef.current = false;
      setPlaying(false);
      console.error("TTS speak error:", err);
    }
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined") return;
    if (!sentences.length) return;

    const synth = window.speechSynthesis;

    // If currently playing audio, pause it
    if (isPlayingRef.current && synth.speaking && !synth.paused) {
      synth.pause();
      setPlaying(false);
      return;
    }

    // If paused, resume
    if (synth.paused) {
      setPlaying(true);
      synth.resume();
      return;
    }

    // Start fresh from current pointer
    cancelSpeech();
    setPlaying(true);

    // Slight delay to ensure cancel takes effect in all browsers.
    // Use the ref here (not state) so we don't depend on async setState.
    setTimeout(() => {
      if (!isPlayingRef.current) return; // user may have toggled meanwhile
      speakCurrent(current);
    }, 30);
  };

  const handleRestart = () => {
    cancelSpeech();
    setCurrent(0);
    // Start playing immediately after restart
    setPlaying(true);
    setTimeout(() => {
      if (!isPlayingRef.current) return;
      speakCurrent(0);
    }, 30);
  };

  const handleStop = () => {
    cancelSpeech();
    setCurrent(0);
    setPlaying(false);
  };

  return (
    <div className="mx-auto max-h-[200px] overflow-y-auto scrollbar-none px-4 py-6">
      <div
        className="bg-primary/20 border-2 border-primary rounded-full p-1 flex items-center gap-2 mb-5 bottom-4 left-1/2 transform -translate-x-1/2 absolute z-20"
        role="group"
        aria-label="Story controls"
      >
        <button
          onClick={handlePlayPause}
          className="rounded-full bg-violet-600 text-white text-sm px-4 py-2 shadow hover:opacity-90 transition"
          aria-label="Read aloud"
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
        {isPlaying && (
          <button
            onClick={handleRestart}
            className="rounded-full text-neutral-900 text-sm px-3 py-2 transition"
          >
            <RiRestartLine className="text-lg" />
          </button>
        )}
        {isPlaying && (
          <button
            onClick={handleStop}
            className="rounded-full text-neutral-900 text-sm px-3 py-2 transition"
          >
            <FaRegCircleStop className="text-lg" />
          </button>
        )}
      </div>

      <div className="space-y-3 text-center leading-relaxed">
        {sentences.map((s, i) => {
          const isActive = i === current;
          const isRead = i < current;
          return (
            <div
              key={i}
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
              {s}
            </div>
          );
        })}
      </div>

      {!chosenVoice && (
        <p className="mt-4 text-sm text-neutral-500">
          Tip: your browser&apos;s TTS voice for “{language}” wasn&apos;t found. It will
          use the default voice.
        </p>
      )}
    </div>
  );
}
