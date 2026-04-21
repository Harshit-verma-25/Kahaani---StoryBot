"use client";

import { useEffect, useRef, useState } from "react";
import { CiImageOn, CiSearch, CiVideoOn } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FilterType, languageOption } from "@/app/lib/types/types";
import { LANGUAGE_OPTIONS, STORIES_LIST } from "../lib/types/constant";
import Link from "next/link";
import Image from "next/image";

const KahaaniBotTalesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  // const [selectedLanguage, setSelectedLanguage] =
  //   useState<languageOption | null>(null);
  // const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  // const languageDropdownRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       languageDropdownRef.current &&
  //       !languageDropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsLanguageOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const selectedLanguageLabel = selectedLanguage
  //   ? LANGUAGE_OPTIONS.find((option) => option.value === selectedLanguage)
  //       ?.label
  //   : null;

  const filteredStories = STORIES_LIST.filter((story) => {
    // 1. Search Query Filter
    if (
      searchQuery &&
      !story.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 2. Active Tab Filter
    if (activeFilter === "video" && !story.hasVideo) {
      return false;
    }
    if (activeFilter === "textual" && !story.hasImages) {
      return false;
    }

    return true;
  });

  return (
    <section className="min-h-screen bg-background flex items-center justify-center mt-4 mb-20">
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
                        ? "border border-primary bg-primary text-white"
                        : "border border-primary text-primary hover:bg-primary hover:text-white"
                    }`}
                    onClick={() => setActiveFilter(filter as FilterType)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                );
              }

              // return (
              //   <div
              //     className="relative"
              //     key={filter}
              //     ref={languageDropdownRef}
              //   >
              //     <button
              //       id="language-filter"
              //       type="button"
              //       className={`px-3 py-1 rounded-full cursor-pointer transition-all border border-primary flex items-center gap-1 ${
              //         selectedLanguage
              //           ? "bg-primary text-white"
              //           : "text-primary hover:bg-primary hover:text-white"
              //       }`}
              //       onClick={() => setIsLanguageOpen((prevState) => !prevState)}
              //       aria-haspopup="listbox"
              //       aria-expanded={isLanguageOpen}
              //     >
              //       {selectedLanguageLabel ?? "Language"}
              //       <MdOutlineKeyboardArrowDown
              //         className={`transition ${isLanguageOpen ? "rotate-180" : ""}`}
              //         size={18}
              //       />
              //     </button>

              //     {isLanguageOpen && (
              //       <div className="absolute right-0 mt-2 min-w-52 bg-background border border-primary rounded-xl shadow-lg z-20 overflow-hidden">
              //         <div
              //           className="max-h-56 overflow-y-auto scrollbar-brand"
              //           role="listbox"
              //         >
              //           {LANGUAGE_OPTIONS.map((option) => (
              //             <button
              //               key={option.value}
              //               type="button"
              //               onClick={() => {
              //                 setSelectedLanguage(option.value);
              //                 setActiveFilter(option.value);
              //                 setIsLanguageOpen(false);
              //               }}
              //               className={`w-full text-left px-3 py-2 transition hover:bg-primary/10 ${
              //                 selectedLanguage === option.value
              //                   ? "bg-primary/10 text-primary font-medium"
              //                   : "text-secondary"
              //               }`}
              //             >
              //               {option.label}
              //             </button>
              //           ))}
              //         </div>
              //       </div>
              //     )}
              //   </div>
              // );
            })}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 items-start mt-4">
          {filteredStories.length > 0 ? (
            filteredStories.map((story, index) => (
              <Link
                href={`/stories/${story.slug}`}
                className="block w-full h-full"
                key={index}
              >
                <div className="relative rounded-xl h-[250px] overflow-hidden cursor-pointer hover:shadow-lg transition hover:scale-[1.02]">
                  <Image
                    src={story.thumbnail}
                    alt={story.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-fill rounded-xl"
                    priority
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="block mt-2 text-lg font-medium text-primary">
                    {story.title}
                  </span>

                  <div className="flex items-center gap-2">
                    {story.hasVideo && (
                      <>
                        <CiVideoOn
                          className="text-2xl text-primary"
                          title="Has Video"
                        />
                        <div className="w-px h-6 bg-primary rounded-full" />
                      </>
                    )}

                    {story.hasImages && (
                      <CiImageOn
                        className="text-2xl text-primary"
                        title="Has Images"
                      />
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-secondary/70">
              No stories found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KahaaniBotTalesPage;
