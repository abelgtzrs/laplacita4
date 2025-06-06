"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  Utensils,
  CreditCard,
  Star,
  MessageCircle,
  Facebook,
  MapPin,
  FileText,
  Smartphone,
  Bus,
  CircleDollarSign,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import ImageSlideshow from "@/components/ImageSlideshow";

const storeImages = [
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
  "/store/verdura.jpg",
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularFood, setPopularFood] = useState([]); // <-- New state for food items
  const [currentPromotions, setCurrentPromotions] = useState([]);

  const services = [
    {
      icon: Landmark,
      titleKey: "services.money_transfers",
      descriptionKey: "services.money_transfers_desc",
      partners: [
        { name: "Intermex", logoUrl: "/logos/intermex_logo.png" },
        { name: "MoneyGram", logoUrl: "/logos/moneygram_logo.png" },
        { name: "Ria", logoUrl: "/logos/ria_logo.png" },
      ],
    },
    {
      icon: FileText,
      titleKey: "services.bill_payments",
      descriptionKey: "services.bill_payments_desc",
      partners: [
        { name: "FPUA", logoUrl: "/logos/fpua_logo.png" },
        { name: "FPL", logoUrl: "/logos/fpl_logo.png" },
        { name: "Comcast", logoUrl: "/logos/comcast_logo.png" },
        { name: "Dish Network", logoUrl: "/logos/dish_logo.png" },
      ],
    },
    {
      icon: Smartphone,
      titleKey: "services.mobile_topups",
      descriptionKey: "services.mobile_topups_desc",
      partners: [
        { name: "Boss Revolution", logoUrl: "/logos/br_logo.svg" },
        { name: "Telcel", logoUrl: "/logos/telcel_logo.png" },
        { name: "Tigo", logoUrl: "/logos/tigo_logo.png" },
      ],
    },
    {
      icon: Bus,
      titleKey: "services.bus_tickets",
      descriptionKey: "services.bus_tickets_desc",
      partners: [
        { name: "Sultana", logoUrl: "/logos/sultana_logo.webp" },
        { name: "Tornado", logoUrl: "/logos/tornado_logo.png" },
      ],
    },
    {
      icon: CircleDollarSign,
      titleKey: "services.check_cashing",
      descriptionKey: "services.check_cashing_desc",
      partners: [],
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        // Use Promise.all to fetch data concurrently
        const [productsRes, promotionsRes, foodRes] = await Promise.all([
          fetch("/api/admin/products?featured=true"),
          fetch("/api/admin/promotions?activeOnly=true"),
          fetch("/api/admin/products?category=Comida&featured=true"), // Fetch featured food
        ]);

        if (productsRes.ok) {
          const allFeatured = await productsRes.json();
          // Filter out food items from the general featured products list
          setFeaturedProducts(
            allFeatured
              .filter(
                (p: any) =>
                  p.category_es !== "Comida" && p.category_en !== "Food"
              )
              .slice(0, 6)
          );
        }

        if (foodRes.ok) setPopularFood((await foodRes.json()).slice(0, 6));
        if (promotionsRes.ok)
          setCurrentPromotions((await promotionsRes.json()).slice(0, 2));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section remains the same */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600">
            <ImageSlideshow slides={storeImages} />
            <div className="h-full flex items-center justify-center"></div>
          </div>
        </div>
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg bg-color-red-600">
              {t("home.welcome")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t("home.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Link href="/productos">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("home.view_products")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-green-600 hover:bg-white hover:text-green-600"
              >
                <Link href="/servicios">
                  <CreditCard className="mr-2 h-5 w-5" />
                  {t("home.our_services")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- UPDATED: Featured Products & Popular Food Section --- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {/* Left Column: Featured Products */}
            <div>
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t("home.featured_products")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto lg:mx-0"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {featuredProducts.length > 0
                  ? featuredProducts.map((product: any) => (
                      <Card
                        key={product._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square relative bg-gray-200">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={
                              language === "es"
                                ? product.name_es
                                : product.name_en
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {language === "es"
                              ? product.name_es
                              : product.name_en}
                          </h3>
                          <p className="text-lg font-bold text-green-600">
                            ${product.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <CardContent className="p-3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
              <div className="text-center lg:text-left">
                <Button asChild variant="outline" size="lg">
                  <Link href="/productos">
                    Ver Todos los Productos{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Popular Food */}
            <div>
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t("food.title")} Popular
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto lg:mx-0"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {popularFood.length > 0
                  ? popularFood.map((product: any) => (
                      <Card
                        key={product._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square relative bg-gray-200">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={
                              language === "es"
                                ? product.name_es
                                : product.name_en
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {language === "es"
                              ? product.name_es
                              : product.name_en}
                          </h3>
                          <p className="text-lg font-bold text-green-600">
                            ${product.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <CardContent className="p-3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
              <div className="text-center lg:text-left">
                <Button asChild variant="outline" size="lg">
                  <Link href="/comida">
                    Ver Todo el Menú
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- UPDATED: Interactive Services Section --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.our_services")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-lg border-2 border-gray-100 p-6 text-center transition-all duration-300 hover:border-green-500 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <ServiceIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t(service.titleKey)}
                    </h3>
                  </div>
                  {/* Expanding section */}
                  <div className="pt-4 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96">
                    <p className="text-gray-600 text-sm mb-4">
                      {t(service.descriptionKey)}
                    </p>
                    {service.partners.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                          Nuestros Socios
                        </h4>
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                          {service.partners.map((partner) => (
                            <div
                              key={partner.name}
                              className="relative h-8 w-16"
                            >
                              <Image
                                src={partner.logoUrl}
                                alt={partner.name}
                                fill
                                className="object-contain"
                                sizes="10vw"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* About Snippet */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Nuestra Historia
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t("home.about_snippet")}
          </p>
        </div>
      </section>

      {/* WhatsApp Printing Service */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Servicio de Impresión por WhatsApp
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              ¿Necesitas imprimir documentos? Envíanos tus archivos por WhatsApp
              y los tendremos listos para recoger.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600"
            >
              <a
                href="https://wa.me/1772421416"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Documentos por WhatsApp
              </a>
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Formatos aceptados: PDF, Word, Excel, PowerPoint, Imágenes
            </p>
          </div>
        </div>
      </section>

      {/* Facebook Feed & Google Maps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Facebook Feed */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📘 Síguenos en Facebook
              </h2>
              <Card className="h-96">
                <CardContent className="p-6 h-full flex flex-col items-center justify-center bg-blue-50">
                  <Facebook className="h-16 w-16 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">La Placita FTP</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Mantente al día con nuestras últimas ofertas, productos
                    nuevos y eventos especiales.
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a
                      href="https://facebook.com/laplacitaftp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Seguir en Facebook
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Google Maps */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📍 Encuéntranos
              </h2>
              <Card className="h-96">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                    <MapPin className="h-16 w-16 text-red-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      La Placita FTP
                    </h3>
                    <p className="text-gray-600 text-center mb-4 px-4">
                      1508 Delaware Ave
                      <br />
                      Fort Pierce, FL 34950
                    </p>
                    <Button asChild variant="outline">
                      <a
                        href="https://maps.google.com/?q=123+Main+Street,+Fort+Pierce,+FL+34950"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Ver en Google Maps
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Promotions */}
      {currentPromotions.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t("home.current_promotions")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentPromotions.map((promotion: any) => (
                <Card key={promotion._id} className="overflow-hidden">
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
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {language === "es"
                        ? promotion.title_es
                        : promotion.title_en}
                    </h3>
                    <p className="text-gray-600">
                      {language === "es"
                        ? promotion.description_es
                        : promotion.description_en}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
