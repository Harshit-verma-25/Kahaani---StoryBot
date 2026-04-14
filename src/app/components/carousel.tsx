"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageCarouselProps {
  images: string[];
  interval?: number; // ms
}

const ImageCarousel = ({ images, interval = 3000 }: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images.length) return null;

  return (
    <div className="relative w-full max-w-[684px]">
      {/* Image */}
      <Image
        src={images[current]}
        alt={`Story ${current}`}
        width={400}
        height={300}
        className="rounded-lg shadow-md object-cover w-full h-[468px] transition-all duration-500"
      />

      {/* Dots */}
      <div className="flex justify-center mt-2 gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === current ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
