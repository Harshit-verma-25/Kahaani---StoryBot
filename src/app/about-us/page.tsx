import Image from "next/image";

const AboutUsPage = () => {
  const teamDetails = [
    {
      profile: "/Riddhi.png",
      name: "Riddhi Soni",
      role: "Designer",
      shape: "/shape-1.png",
      enrollment: "06529802023",
      description1: "A creative designer passionate",
      description2: "about crafting innovative & visually",
      description3: "compelling digital experiences.",
    },
    {
      profile: "/Harshit.png",
      name: "Harshit Verma",
      role: "Developer",
      shape: "/shape-1.png",
      enrollment: "09429802023",
      description1: "A creative developer passionate",
      description2: "about crafting innovative & visually",
      description3: "compelling digital experiences.",
    },
  ];

  const techStack = [
    {
      name: "Figma",
      logo: "/tech-stack/figma.png",
      description: "Design and prototyping tool for UI/UX design.",
    },
    {
      name: "Next.js",
      logo: "/tech-stack/next.png",
      description:
        "React framework for server-side rendering and static site generation.",
    },
    {
      name: "TypeScript",
      logo: "/tech-stack/typescript.png",
      description:
        "Typed superset of JavaScript that compiles to plain JavaScript.",
    },
    {
      name: "Tailwind CSS",
      logo: "/tech-stack/tailwind.png",
      description: "Utility-first CSS framework for rapid UI development.",
    },
    {
      name: "Gemini LLM Models",
      logo: "/tech-stack/gemini.png",
      description:
        "Google's advanced language models for AI-powered content generation.",
    },
  ];

  const futureScope = [
    {
      title: ["Expand the", "Story Library"],
      description:
        "We add more Indian folktales, epics, and regional legends so every child discovers new adventures.",
    },
    {
      title: ["Add More", "Languages"],
      description:
        "We bring stories in multiple languages to reach children across India and beyond.",
    },
    {
      title: ["Personalize", "with AI"],
      description:
        "We enhance stories with AI-powered narration and animations.",
    },
    {
      title: ["Light &", "Dark Themes"],
      description:
        "We provide customizable themes for a more personalized reading experience.",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center gap-12 md:gap-20 bg-background lg:px-16 sm:px-10 px-4">
      <div className="pt-10">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-primary font-medium">
            The Minds Behind KahaaniBot
          </h2>
          <p className="text-secondary text-base md:text-lg">
            Young storytellers and tech enthusiasts creating an interactive
            mythology platform
            <br className="hidden md:inline" /> for kids, blending ancient tales
            with modern technology.
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl flex items-center justify-evenly">
        {teamDetails.map((teamDetail, index) => (
          <div className="flex items-end" key={index}>
            {/* Profile */}
            <div className="max-w-44 h-44 flex bg-[#FEECFF] pt-1 overflow-hidden relative cursor-pointer hover:shadow-lg transition hover:scale-[1.02]">
              <Image
                src={teamDetail.profile}
                alt={teamDetail.name}
                className="h-full w-full object-cover relative z-10"
                width={120}
                height={120}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <div className="h-16 w-[6rem]">
                <Image
                  width={100}
                  height={100}
                  className="invert-[100%]"
                  src="/arrow.png"
                  alt=""
                />
              </div>
              <div className="flex flex-col pl-8 text-2xl">
                <p className="text-primary font-semibold">
                  {teamDetail.name} • {teamDetail.role}
                </p>
                <p className="inline-flex items-center gap-2 text-gray-600 text-base">
                  <span className="text-primary font-extrabold">→</span>{" "}
                  Enrollment No. - {teamDetail.enrollment}
                </p>
                <p className="inline-flex gap-2 text-gray-600 text-base">
                  <span className="text-primary font-extrabold">→</span>{" "}
                  {teamDetail.description1}
                  <br />
                  {teamDetail.description2} <br /> {teamDetail.description3}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-7xl flex flex-col items-center gap-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-primary font-medium">
          Project Tech Stack
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-[#FEECFF] rounded-xl flex items-center gap-4 p-4 md:p-6 cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
            >
              {/* UPDATED: Responsive image size */}
              <Image
                src={tech.logo}
                alt={`${tech.name} Logo`}
                width={48}
                height={48}
                className="object-contain w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
              />
              <div>
                <h2 className="text-secondary text-xl md:text-2xl font-medium">
                  {tech.name}
                </h2>
                <p className="text-secondary/70 font-normal text-sm md:text-base">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col items-center gap-6 md:pb-28 pb-10">
        <h1 className="text-primary text-3xl md:text-4xl lg:text-5xl font-medium text-center">
          Future Scope
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {futureScope.map((item, index) => (
            <div
              key={index}
              className="bg-[#FEECFF] rounded-xl flex flex-col gap-3 md:gap-4 md:p-10 p-6 cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
            >
              <span className="text-5xl md:text-6xl text-primary">
                0{index + 1}
              </span>

              <h2 className="text-secondary text-xl md:text-2xl font-medium">
                {item.title[0]} <br /> {item.title[1]}
              </h2>
              <p className="text-secondary/70 font-normal text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
