import { STORIES_LIST } from "@/app/lib/types/constant";
import Image from "next/image";
import Link from "next/link";

const StoriesGridSection = () => {
  return (
    <section
      id="storiesGrid"
      className="bg-background lg:px-16 sm:px-10 px-4 scroll-mt-10 md:scroll-mt-24"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 items-start">
        {STORIES_LIST.slice(0, 6).map((story, index) => (
          <div
            key={index}
            className="relative rounded-xl h-[250px] overflow-hidden cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
          >
            <Link
              href={`/stories/${story.slug}`}
              className="block w-full h-full"
            >
              <Image
                src={story.thumbnail}
                alt={story.title}
                width={400}
                height={250}
                className="w-full h-full object-fill rounded-xl"
                priority
              />
            </Link>
          </div>
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
