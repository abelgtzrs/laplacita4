"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Utensils, Clock, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

export default function FoodPage() {
  const { t, language } = useLanguage();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Specialties can remain hardcoded or be fetched from another collection if needed
  const specialties = [
    {
      title: "Comida Casera Diaria",
      description:
        "Preparamos comida fresca todos los días con recetas familiares tradicionales.",
      icon: Heart,
    },
    {
      title: "Pedidos Especiales",
      description:
        "Aceptamos pedidos especiales para eventos y celebraciones familiares.",
      icon: Star,
    },
    {
      title: "Ingredientes Frescos",
      description:
        "Utilizamos solo los ingredientes más frescos y auténticos disponibles.",
      icon: Utensils,
    },
  ];

  // Fetch food products from the API
  useEffect(() => {
    async function loadFoodProducts() {
      setLoading(true);
      try {
        // Fetch products specifically from the 'Comida' category
        const response = await fetch("/api/admin/products?category=Comida");
        if (response.ok) {
          const data = await response.json();
          setFoodItems(data);
        } else {
          console.error("Failed to fetch food products");
        }
      } catch (error) {
        console.error("Error fetching food products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFoodProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("food.title")}
          </h1>
          <h2 className="text-2xl text-red-600 font-semibold mb-4">
            {t("food.subtitle")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("food.description")}
          </p>
        </div>

        {/* Food Items Grid - Now dynamically rendered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : foodItems.length > 0 ? (
            foodItems.map((item: any) => (
              <Card
                key={item._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative bg-gray-200">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={language === "es" ? item.name_es : item.name_en}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {item.is_featured && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">
                      {language === "es" ? item.name_es : item.name_en}
                    </h3>
                    <Badge variant="secondary">
                      {language === "es" ? item.category_es : item.category_en}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {language === "es"
                      ? item.description_es
                      : item.description_en}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${Number.parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Disponible: Todos los días</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No hay platillos de comida disponibles en este momento.
            </p>
          )}
        </div>
        {/* Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {specialties.map((specialty, index) => (
            <Card
              key={index}
              className="text-center border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
            >
              <CardContent className="p-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <specialty.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {specialty.title}
                </h3>
                <p className="text-gray-600">{specialty.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gradient-to-r from-red-600 to-green-600 text-white mb-12">
          <CardContent className="p-8 text-center">
            <Utensils className="h-16 w-16 mx-auto mb-6 text-white" />

            <h2 className="text-3xl font-bold mb-4">Especiales de la Semana</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="font-bold text-lg">Lunes - Miércoles</div>

                <div className="text-sm opacity-90">Caldo de Res</div>
              </div>

              <div className="text-center">
                <div className="font-bold text-lg">Jueves</div>

                <div className="text-sm opacity-90">Birria de Res</div>
              </div>

              <div className="text-center">
                <div className="font-bold text-lg">Viernes</div>

                <div className="text-sm opacity-90">Mojarra Frita</div>
              </div>

              <div className="text-center">
                <div className="font-bold text-lg">Sábado - Domingo</div>

                <div className="text-sm opacity-90">Menudo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catering Info */}

        <Card className="border-2 border-yellow-400">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Servicios de Catering
            </h2>

            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              ¿Planeas una fiesta o evento especial? Ofrecemos servicios de
              catering para bodas, quinceañeras, cumpleaños y eventos
              corporativos. Comida auténtica que hará de tu evento algo
              memorable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <span className="font-semibold">
                  📞 Llama para cotizar: (772) 242-1416
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
