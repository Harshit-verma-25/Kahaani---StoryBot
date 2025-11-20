import Image from "next/image";
import Link from "next/link";

const StoriesGridSection = () => {
  const stories = [
    { title: "The Birth of Ganesha", thumbnail: "/story-poster/birth-of-ganesha.png", slug: "the-birth-of-ganesha" },
    { title: "Holi ka Dahan", thumbnail: "/story-poster/holi-ka-dahan.png", slug: "holi-ka-dahan" },
    { title: "Krishna's Butter Story", thumbnail: "/story-poster/krishna-butter-story.png", slug: "krishna-butter-story" },
    { title: "The Monkey and the Crocodile", thumbnail: "/placeholder.png", slug: "the-monkey-and-the-crocodile" },
    { title: "The Golden Deer", thumbnail: "/placeholder.png", slug: "the-golden-deer" },
    { title: "The Magic Pot", thumbnail: "/placeholder.png", slug: "the-magic-pot" },
  ];

  return (
    <section id="storiesGrid" className="bg-background lg:px-16 sm:px-10 px-4 scroll-mt-10 md:scroll-mt-24">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 items-start">
        {stories.map((story, index) => (
          <div
            key={index}
            className="relative rounded-xl h-[250px] overflow-hidden cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
          >
            <Link href={`/stories/${story.slug}`} className="block w-full h-full">
              <Image
                src={story.thumbnail}
                alt={story.title}
                width={400}
                height={250}
                className="w-full h-full object-fill rounded-xl"
                priority={index < 3}
              />
            </Link>

            {index >= stories.length - 3 && (
              <div className="absolute inset-0 opacity-90 bg-[#545454E0] flex items-center justify-center">
                <span className="text-white text-2xl md:text-4xl font-semibold">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoriesGridSection;
