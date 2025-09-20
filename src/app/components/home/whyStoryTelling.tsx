import { LuHandCoins } from "react-icons/lu";

const WhyStoryTellingSection = () => {
  const content = [
    {
      title: ["Builds", "Imagination"],
      description: "Children visualize characters, settings, and adventures.",
    },
    {
      title: ["Teaches", "Values"],
      description:
        "Every story carries morals from Indian mythology and culture.",
    },
    {
      title: ["Encourages", "Creativity"],
      description:
        "Kids can craft their own unique stories and a world of imagination.",
    },
    {
      title: ["Boosts", "Language Skills"],
      description:
        "Available in both Hindi and English with natural narration.",
    },
  ];

  return (
    <section className="bg-background lg:px-16 sm:px-10 px-4">
      <div className="w-full flex flex-col items-center gap-6 md:pb-20 pb-10">
        <h1 className="text-primary text-4xl md:text-5xl font-medium text-center">
          Why Storytelling?
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-28">
          {content.map((item, index) => (
            <div
              key={index}
              className="bg-[#FEECFF] rounded-xl flex flex-col gap-3 md:gap-6 md:p-10 p-6"
            >
              <LuHandCoins className="text-primary" size={48} />
              <h2 className="text-secondary text-2xl font-medium">
                {item.title[0]} <br /> {item.title[1]}
              </h2>
              <p className="text-secondary/70 font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStoryTellingSection;
