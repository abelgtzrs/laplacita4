// components/ImageSlideshow.tsx
"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type PropType = {
  slides: string[];
  options?: any;
};

const ImageSlideshow: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel({ loop: true, ...options }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((src, index) => (
          <div className="embla__slide" key={index}>
            <Image
              src={src}
              alt={`La Placita FTP Store Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0} // Prioritize loading the first image
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
