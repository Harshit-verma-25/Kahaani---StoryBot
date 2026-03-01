"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoPauseCircleOutline } from "react-icons/io5";
import { RiRestartLine } from "react-icons/ri";
import { FaRegCircleStop } from "react-icons/fa6";
import { StoryData } from "@/app/lib/types";

type Props = {
  story: string;
  language?: StoryData["language"];
  rate?: number;
  pitch?: number;
};

const LANGUAGE_VOICE_CONFIG: Record<
  StoryData["language"],
  {
    langPrefixes: string[];
    preferredVoiceNameIncludes: string[];
    fallbackUtteranceLang: string;
  }
> = {
  english: {
    langPrefixes: ["en-gb", "en-in", "en"],
    preferredVoiceNameIncludes: [
      "google uk english",
      "google english",
      "microsoft heera",
    ],
    fallbackUtteranceLang: "en-IN",
  },
  hindi: {
    langPrefixes: ["hi"],
    preferredVoiceNameIncludes: ["google हिन्दी", "hindi", "microsoft swara"],
    fallbackUtteranceLang: "hi-IN",
  },
  marathi: {
    langPrefixes: ["mr"],
    preferredVoiceNameIncludes: ["marathi"],
    fallbackUtteranceLang: "mr-IN",
  },
  bengali: {
    langPrefixes: ["bn"],
    preferredVoiceNameIncludes: ["bengali", "bangla"],
    fallbackUtteranceLang: "bn-IN",
  },
  tamil: {
    langPrefixes: ["ta"],
    preferredVoiceNameIncludes: ["tamil"],
    fallbackUtteranceLang: "ta-IN",
  },
  telugu: {
    langPrefixes: ["te"],
    preferredVoiceNameIncludes: ["telugu"],
    fallbackUtteranceLang: "te-IN",
  },
  kannada: {
    langPrefixes: ["kn"],
    preferredVoiceNameIncludes: ["kannada"],
    fallbackUtteranceLang: "kn-IN",
  },
  malayalam: {
    langPrefixes: ["ml"],
    preferredVoiceNameIncludes: ["malayalam"],
    fallbackUtteranceLang: "ml-IN",
  },
  gujarati: {
    langPrefixes: ["gu"],
    preferredVoiceNameIncludes: ["gujarati"],
    fallbackUtteranceLang: "gu-IN",
  },
  punjabi: {
    langPrefixes: ["pa"],
    preferredVoiceNameIncludes: ["punjabi", "panjabi"],
    fallbackUtteranceLang: "pa-IN",
  },
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

    const config = LANGUAGE_VOICE_CONFIG[language];

    const preferredByName = voices.find((voice) =>
      config.preferredVoiceNameIncludes.some((keyword) =>
        voice.name?.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
    if (preferredByName) return preferredByName;

    const fallbackByLanguageCode = voices.find((voice) =>
      config.langPrefixes.some((prefix) =>
        voice.lang?.toLowerCase().startsWith(prefix),
      ),
    );
    if (fallbackByLanguageCode) return fallbackByLanguageCode;

    // final fallback
    return voices.find((v) => v.default) || voices[0];
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
  const speakCurrent = (index: number, useSafeFallback = false) => {
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
    if (useSafeFallback) {
      const defaultVoice = voices.find((voice) => voice.default) || voices[0];
      if (defaultVoice) {
        u.voice = defaultVoice;
        u.lang = defaultVoice.lang;
      }
    } else {
      if (chosenVoice) {
        u.voice = chosenVoice;
        u.lang = chosenVoice.lang;
      }
    }
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

      if (!useSafeFallback) {
        setTimeout(() => {
          if (!isPlayingRef.current) return;
          speakCurrent(index, true);
        }, 30);
        return;
      }

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
          Tip: your browser&apos;s TTS voice for “{language}” wasn&apos;t found.
          It will use the default voice.
        </p>
      )}
    </div>
  );
}
