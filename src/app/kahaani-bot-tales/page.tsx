"use client";

import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FilterType, languageOption } from "@/app/lib/types/types";
import { LANGUAGE_OPTIONS } from "../lib/types/constant";

const KahaaniBotTalesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedLanguage, setSelectedLanguage] =
    useState<languageOption | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLanguageLabel = selectedLanguage
    ? LANGUAGE_OPTIONS.find((option) => option.value === selectedLanguage)
        ?.label
    : null;

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center px-4 gap-2">
        <div className="w-full text-center">
          <h1 className="text-3xl md:text-[40px] text-primary font-medium">
            KahnaaniBot Tales
          </h1>

          <p className="text-secondary/70 text-center font-normal">
            Prebuilt stories, tailored for you—filter by format or language
            <br />
            and start exploring instantly.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-center mt-20">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for agents, skills, or job types..."
              id="moral"
              className="pl-10 outline-none p-2 border border-primary rounded-full w-112 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <CiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            {["all", "video", "textual", "language"].map((filter) => {
              if (filter !== "language") {
                return (
                  <button
                    key={filter}
                    className={`px-4 py-1 w-fit rounded-full cursor-pointer transition-all ${
                      activeFilter === filter
                        ? "bg-primary text-white"
                        : "border border-primary text-primary hover:bg-primary hover:text-white"
                    }`}
                    onClick={() => setActiveFilter(filter as FilterType)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                );
              }

              return (
                <div
                  className="relative"
                  key={filter}
                  ref={languageDropdownRef}
                >
                  <button
                    id="language-filter"
                    type="button"
                    className={`px-3 py-1 rounded-full cursor-pointer transition-all border border-primary flex items-center gap-1 ${
                      selectedLanguage
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-primary hover:text-white"
                    }`}
                    onClick={() => setIsLanguageOpen((prevState) => !prevState)}
                    aria-haspopup="listbox"
                    aria-expanded={isLanguageOpen}
                  >
                    {selectedLanguageLabel ?? "Language"}
                    <MdOutlineKeyboardArrowDown
                      className={`transition ${isLanguageOpen ? "rotate-180" : ""}`}
                      size={18}
                    />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 min-w-52 bg-background border border-primary rounded-xl shadow-lg z-20 overflow-hidden">
                      <div
                        className="max-h-56 overflow-y-auto scrollbar-brand"
                        role="listbox"
                      >
                        {LANGUAGE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSelectedLanguage(option.value);
                              setActiveFilter(option.value);
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 transition hover:bg-primary/10 ${
                              selectedLanguage === option.value
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-secondary"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KahaaniBotTalesPage;
