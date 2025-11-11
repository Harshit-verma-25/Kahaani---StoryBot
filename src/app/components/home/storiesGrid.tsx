import Image from "next/image";

const StoriesGridSection = () => {
  const stories = [
    { title: "The Brave Little Elephant", thumbnail: "/placeholder.png" },
    { title: "The Clever Rabbit and the Lion", thumbnail: "/placeholder.png" },
    { title: "The Wise Parrot's Lesson", thumbnail: "/placeholder.png" },
    { title: "The Monkey and the Crocodile", thumbnail: "/placeholder.png" },
    { title: "The Golden Deer", thumbnail: "/placeholder.png" },
    { title: "The Magic Pot", thumbnail: "/placeholder.png" },
  ];

  return (
    <section id="storiesGrid" className="bg-background lg:px-16 sm:px-10 px-4 scroll-mt-10 md:scroll-mt-24">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 items-start">
        {stories.map((story, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
          >
            <Image
              src={story.thumbnail}
              alt={story.title}
              width={400}
              height={250}
              className="w-full h-auto object-cover rounded-xl"
              priority={index < 3}
            />

            {index >= stories.length - 3 && (
              <div className="absolute inset-0 opacity-90 bg-[#545454E0] flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
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
