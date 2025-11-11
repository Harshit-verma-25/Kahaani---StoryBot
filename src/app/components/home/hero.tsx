import Image from "next/image";
import Link from "next/link";
import { FaMagic } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-background flex items-center justify-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 md:gap-8 px-4">
        <div className="relative flex justify-center items-center">
          <div className="flex items-center justify-center gap-2">
            {/* Purple lines top-left */}
            <div className="absolute -top-3 -left-3 md:-left-5">
              <Image
                src="/home/home-4.png"
                width={25}
                height={25}
                alt="3 Purple Lines"
              />
            </div>

            {/* Overlapping profile images */}
            <div className="flex -space-x-2">
              {["/home/home-3.png", "/home/home-2.png", "/home/home-1.png"].map(
                (src, index) => (
                  <div
                    key={index}
                    className="relative h-10 w-10 rounded-full overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Home Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 10vw, 5vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )
              )}
            </div>

            {/* Text */}
            <p className="text-secondary/60 font-normal min-w-fit">
              Over 1.5k+ happy children
            </p>
          </div>
        </div>

        <div className="relative text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-secondary">
            Where timeless tales <br />
            meet modern{" "}
            <span className="relative inline-block">
              storytelling
              <Image
                src="/home/home-5.png"
                alt="Purple Line"
                width={150}
                height={20}
                className="absolute -right-3 -bottom-3 md:-bottom-5"
              />
            </span>
          </h1>
        </div>

        <p className="text-secondary/70 text-center font-normal">
          Explore Indian mythology, discover morals, and create your own stories{" "}
          <br />
          in Hindi or English — all brought to life with natural voice
          narration.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/generate-story">
            <button className="px-6 py-3 font-medium bg-primary text-white rounded-full cursor-pointer hover:scale-105 transition-all">
              Generate Custom Story
              <FaMagic className="inline-block ml-2 mb-1" size={18} />
            </button>
          </Link>

          <div className="relative">
            <Link href="#storiesGrid">
              <button className="w-full px-6 py-3 border-2 font-medium border-primary text-primary rounded-full transition cursor-pointer hover:scale-105">
                KahaaniBot Tales
              </button>
            </Link>

            <Image
              src="/home/home-4.png"
              alt="Purple Lines"
              width={25}
              height={25}
              className="absolute -top-3 -right-4 rotate-y-180"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
