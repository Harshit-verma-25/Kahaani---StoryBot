import { STORIES_LIST } from "@/app/lib/types/constant";
import Image from "next/image";
import Link from "next/link";
import { CiImageOn, CiVideoOn } from "react-icons/ci";

const StoriesGridSection = () => {
  return (
    <section
      id="storiesGrid"
      className="bg-background lg:px-16 sm:px-10 px-4 scroll-mt-10 md:scroll-mt-24"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 items-start">
        {STORIES_LIST.slice(0, 6).map((story, index) => (
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
        ))}
      </div>

      <div className="flex items-center justify-end">
        <Link href="/kahaani-bot-tales">
          <button className="mt-4 w-fit px-6 py-3 border-2 font-medium border-primary text-primary rounded-full transition cursor-pointer hover:scale-105">
            View All
          </button>
        </Link>
      </div>
    </section>
  );
};

export default StoriesGridSection;
