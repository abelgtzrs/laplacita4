// components/GoogleReviewsCarousel.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

// Sample review data - you can replace this with data fetched from an API
const allReviews = [
  {
    id: 1,
    author: "Maria G.",
    rating: 5,
    text_es: "¡Los mejores tacos al pastor que he probado en Florida! La carne es súper sabrosa y las tortillas frescas. ¡Volveré pronto!",
    text_en: "The best al pastor tacos I've had in Florida! The meat is super flavorful and the tortillas are fresh. I'll be back soon!",
    avatar: "/avatars/avatar-1.png", // Example path, replace with real ones
  },
  {
    id: 2,
    author: "John D.",
    rating: 5,
    text_es: "Un servicio al cliente increíble y una gran selección de productos latinos que no encuentro en ningún otro lugar. ¡Totalmente recomendado!",
    text_en: "Incredible customer service and a great selection of Latin products I can't find anywhere else. Totally recommended!",
    avatar: "/avatars/avatar-2.png",
  },
  {
    id: 3,
    author: "Carlos R.",
    rating: 4,
    text_es: "Muy conveniente para enviar dinero a mi familia. El proceso es rápido y las tarifas son justas. El personal es muy amable.",
    text_en: "Very convenient for sending money to my family. The process is fast and the fees are fair. The staff is very friendly.",
    avatar: "/avatars/avatar-3.png",
  },
  {
    id: 4,
    author: "Ana P.",
    rating: 5,
    text_es: "La comida preparada es deliciosa, ¡sabe como hecha en casa! Las carnitas del fin de semana son obligatorias.",
    text_en: "The prepared food is delicious, it tastes homemade! The weekend carnitas are a must-try.",
    avatar: "/avatars/avatar-4.png",
  },
  {
    id: 5,
    author: "David S.",
    rating: 5,
    text_es: "¡Qué bueno encontrar todos los chiles y especias que necesito para mis recetas! Una joya de tienda en Fort Pierce.",
    text_en: "So great to find all the chiles and spices I need for my recipes! A gem of a store in Fort Pierce.",
    avatar: "/avatars/avatar-5.png",
  },
  {
    id: 6,
    author: "Sofia L.",
    rating: 4,
    text_es: "El servicio de pago de biles es muy útil. Me ahorra mucho tiempo poder pagar todo en un solo lugar mientras hago mis compras.",
    text_en: "The bill payment service is very useful. It saves me a lot of time to be able to pay everything in one place while I do my shopping.",
    avatar: "/avatars/avatar-6.png",
  },
  // Add more reviews here...
];

// Reusable component for star ratings
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

// The main carousel component
export default function GoogleReviewsCarousel() {
  const { language } = useLanguage();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  // --- Filter for positive reviews (4 or 5 stars) ---
  const positiveReviews = allReviews.filter((review) => review.rating >= 4);

  // --- Group reviews into pairs for the 2-row layout ---
  const reviewPairs = positiveReviews.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, [] as typeof positiveReviews[]);

  return (
    <div className="embla-reviews" ref={emblaRef}>
      <div className="embla-reviews__container">
        {reviewPairs.map((pair, index) => (
          <div className="embla-reviews__slide" key={index}>
            {/* Each slide now contains a flex column with two review cards */}
            <div className="flex flex-col gap-4 h-full">
              {pair.map((review) => (
                <Card
                  key={review.id}
                  className="bg-white flex-1 p-6 rounded-lg shadow-md border"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">{review.author}</h4>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 mt-2">
                        {language === "es" ? review.text_es : review.text_en}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}