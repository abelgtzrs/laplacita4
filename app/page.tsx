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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import ImageSlideshow from "@/components/ImageSlideshow";

// ... inside your page component, define the list of your images
const storeImages = [
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
  "/store/verdura.jpg",
];
export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentPromotions, setCurrentPromotions] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load featured products
        const productsResponse = await fetch(
          "/api/admin/products?featured=true"
        );
        if (productsResponse.ok) {
          const products = await productsResponse.json();
          setFeaturedProducts(products.slice(0, 12));
        }

        // Load active promotions
        const promotionsResponse = await fetch(
          "/api/admin/promotions?activeOnly=true"
        );
        if (promotionsResponse.ok) {
          const promotions = await promotionsResponse.json();
          setCurrentPromotions(promotions.slice(0, 2));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {/* Slideshow container */}
          <div className="relative h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600">
            {/* The Slideshow Component in the background */}
            <ImageSlideshow slides={storeImages} />

            {/* Your centered text overlay, which now sits on top */}
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
                className="border-white text-white hover:bg-white hover:text-green-600"
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

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.featured_products")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {featuredProducts.length > 0
              ? featuredProducts.map((product: any) => (
                  <Card
                    key={product._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative bg-gray-200">
                      {product.image_url ? (
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
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {language === "es" ? product.name_es : product.name_en}
                      </h3>
                      <p className="text-gray-600 text-xs mb-1">
                        {language === "es"
                          ? product.category_es
                          : product.category_en}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${product.price}
                      </p>
                    </CardContent>
                  </Card>
                ))
              : // Placeholder products
                Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1">Producto</h3>
                      <p className="text-gray-600 text-xs mb-1">Categoría</p>
                      <p className="text-lg font-bold text-green-600">$0.00</p>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/productos">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.services_highlights")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("services.money_transfers")}
              </h3>
              <p className="text-gray-600">
                {t("services.money_transfers_desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("food.title")}</h3>
              <p className="text-gray-600">
                Comida fresca preparada diariamente
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("services.bill_payments")}
              </h3>
              <p className="text-gray-600">
                {t("services.bill_payments_desc")}
              </p>
            </div>
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
