"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Tag, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { type Promotion } from "@/lib/mongodb"; // Import the Promotion type

export default function PromotionsPage() {
  const { t, language } = useLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromotions() {
      try {
        // Fetch from the API route to ensure we get data from MongoDB
        const response = await fetch("/api/admin/promotions");
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        }
      } catch (error) {
        console.error("Error loading promotions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  const isPromotionActive = (
    activeFrom: string | Date,
    activeTo: string | Date
  ) => {
    const now = new Date();
    const from = new Date(activeFrom);
    const to = new Date(activeTo);
    return now >= from && now <= to;
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando promociones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("promotions.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestras ofertas especiales y promociones exclusivas para
            la comunidad.
          </p>
        </div>

        {/* Promotions Grid */}
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => {
              const isActive = isPromotionActive(
                promotion.active_from,
                promotion.active_to
              );

              return (
                <Card
                  key={promotion._id?.toString()} // Use _id for MongoDB
                  className={`overflow-hidden hover:shadow-lg transition-shadow ${
                    isActive
                      ? "border-2 border-green-500"
                      : "border-2 border-gray-200"
                  }`}
                >
                  {promotion.image_url && (
                    <div className="aspect-video relative">
                      <Image
                        src={promotion.image_url || "/placeholder.svg"}
                        alt={
                          language === "es"
                            ? promotion.title_es
                            : promotion.title_en
                        }
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className={isActive ? "bg-green-500" : ""}
                        >
                          {isActive ? "Activa" : "Expirada"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">
                      {language === "es"
                        ? promotion.title_es
                        : promotion.title_en}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {language === "es"
                        ? promotion.description_es
                        : promotion.description_en}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(promotion.active_from)} -{" "}
                        {formatDate(promotion.active_to)}
                      </span>
                    </div>
                    {isActive && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <Gift className="h-4 w-4 mr-2" />
                          <span className="font-semibold">
                            ¡Promoción activa!
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("promotions.no_active")}
            </h3>
            <p className="text-gray-500">
              Mantente atento a nuestras redes sociales para conocer las últimas
              ofertas.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-8 text-center">
            <Gift className="h-16 w-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl font-bold mb-4">
              ¡No te pierdas nuestras ofertas!
            </h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Síguenos en Facebook y WhatsApp para recibir notificaciones de
              nuestras promociones especiales y ofertas exclusivas para la
              comunidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="font-semibold">
                  📘 Facebook: La Placita FTP
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-semibold">
                  📱 WhatsApp: (772) 123-4567
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
