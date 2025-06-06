"use client";

import Image from "next/image";
import { Utensils, Clock, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

export default function FoodPage() {
  const { t } = useLanguage();

  const foodItems = [
    {
      name: "Tamales Tradicionales",
      description:
        "Tamales hechos a mano con masa de maíz y rellenos auténticos",
      price: "$2.50",
      image: "/placeholder.svg?height=300&width=400",
      category: "Tradicional",
      available: "Sábados y Domingos",
      popular: true,
    },
    {
      name: "Carnitas Frescas",
      description:
        "Cerdo cocido lentamente con especias tradicionales mexicanas",
      price: "$12.99/lb",
      image: "/placeholder.svg?height=300&width=400",
      category: "Carnes",
      available: "Todos los días",
      popular: true,
    },
    {
      name: "Pollo Asado",
      description: "Pollo entero marinado y asado con hierbas y especias",
      price: "$8.99",
      image: "/placeholder.svg?height=300&width=400",
      category: "Carnes",
      available: "Todos los días",
      popular: false,
    },
    {
      name: "Pozole Rojo",
      description: "Sopa tradicional mexicana con maíz pozolero y chile rojo",
      price: "$6.99",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sopas",
      available: "Fines de semana",
      popular: true,
    },
    {
      name: "Quesadillas Gigantes",
      description: "Quesadillas grandes con queso Oaxaca y tu relleno favorito",
      price: "$4.99",
      image: "/placeholder.svg?height=300&width=400",
      category: "Antojitos",
      available: "Todos los días",
      popular: false,
    },
    {
      name: "Mole Poblano",
      description:
        "Pollo bañado en auténtico mole poblano con más de 20 ingredientes",
      price: "$13.99",
      image: "/placeholder.svg?height=300&width=400",
      category: "Tradicional",
      available: "Domingos",
      popular: true,
    },
  ];

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
        "Acepta pedidos especiales para eventos y celebraciones familiares.",
      icon: Star,
    },
    {
      title: "Ingredientes Frescos",
      description:
        "Utilizamos solo los ingredientes más frescos y auténticos disponibles.",
      icon: Utensils,
    },
  ];

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

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {foodItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.popular && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    {item.price}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Disponible: {item.available}</span>
                </div>
              </CardContent>
            </Card>
          ))}
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
        {/* Daily Specials */}
        <Card className="bg-gradient-to-r from-red-600 to-green-600 text-white mb-12">
          <CardContent className="p-8 text-center">
            <Utensils className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">Especiales de la Semana</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="font-bold text-lg">Lunes - Miércoles</div>
                <div className="text-sm opacity-90">Pozole y Menudo</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Jueves</div>
                <div className="text-sm opacity-90">Birria de Res</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Viernes</div>
                <div className="text-sm opacity-90">Pescado Frito</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Sábado - Domingo</div>
                <div className="text-sm opacity-90">Tamales y Barbacoa</div>
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
                  📞 Llama para cotizar: (772) 123-4567
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
