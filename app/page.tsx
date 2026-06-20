/**
 * HOMEPAGE COMPONENT - LA PLACITA FTP
 * ===================================
 *
 * Main landing page for La Placita FTP website featuring multiple sections:
 *
 * 1. HERO SECTION
 *    - Image slideshow background with store photos
 *    - Welcome message and call-to-action buttons
 *    - Responsive design for all screen sizes
 *
 * 2. FEATURED PRODUCTS & POPULAR FOOD
 *    - Dual-column layout showcasing products
 *    - Left: Non-food featured products
 *    - Right: Popular food items
 *    - Loading states with skeleton animations
 *
 * 3. INTERACTIVE SERVICES SECTION
 *    - 6 service cards with hover/tap interactions
 *    - Partner logos revealed on interaction
 *    - Mobile-friendly expandable cards
 *
 * 4. WHATSAPP PRINTING SERVICE
 *    - Dedicated promotion for printing services
 *    - Direct WhatsApp integration
 *
 * 5. LOCATION MAP & FACEBOOK FEED
 *    - Google Maps integration for store location
 *    - Facebook page feed for social proof
 *
 * 6. GOOGLE REVIEWS CAROUSEL
 *    - Customer testimonials and ratings
 *    - Carousel display for multiple reviews
 *
 * 7. ABOUT SNIPPET
 *    - Brief company history and description
 *
 * 8. CURRENT PROMOTIONS
 *    - Dynamic display of active promotions
 *    - Conditionally rendered based on available data
 *
 * TECHNICAL FEATURES:
 * - Multi-language support via useLanguage context
 * - Responsive design with Tailwind CSS
 * - Dynamic data fetching from API endpoints
 * - Interactive elements with state management
 * - SEO-optimized structure and content
 */

"use client";

// === IMPORTS ===
// React and Next.js core
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Icons from Lucide React
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
  Printer,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Context and Custom Components
import { useLanguage } from "@/contexts/language-context";
import ImageSlideshow from "@/components/ImageSlideshow";
import GoogleReviewsCarousel from "@/components/GoogleReviewsCarousel";

// ===========================
// CONSTANTS & CONFIGURATION
// ===========================

/**
 * Store Images Configuration
 * Array of image paths used in the hero slideshow
 */
const storeImages = [
  "/store/verdura.jpg",
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
];

// =========================
// MAIN COMPONENT FUNCTION
// =========================

export default function HomePage() {
  // ========================
  // STATE MANAGEMENT
  // ========================

  /**
   * Language and translation context
   */
  const { t, language } = useLanguage();

  /**
   * Featured products state - stores non-food featured products
   */
  const [featuredProducts, setFeaturedProducts] = useState([]);

  /**
   * Popular food items state - stores featured food products
   */
  const [popularFood, setPopularFood] = useState([]);

  /**
   * Current promotions state - stores active promotions
   */
  const [currentPromotions, setCurrentPromotions] = useState([]);

  /**
   * Active service state - tracks which service card is expanded on mobile
   */
  const [activeService, setActiveService] = useState<number | null>(null);

  // ======================
  // EVENT HANDLERS
  // ======================

  /**
   * Handle service card click/tap
   * Toggles the expanded state of service cards on mobile devices
   */
  const handleServiceClick = (index: number) => {
    setActiveService((prev) => (prev === index ? null : index));
  };

  // ======================
  // SERVICES CONFIGURATION
  // ======================

  /**
   * Services array configuration
   * Defines all available services with their icons, descriptions, and partner logos
   */
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
    {
      icon: Printer,
      titleKey: "services.faxes",
      descriptionKey: "services.faxes_desc",
      partners: [],
    },
  ];

  // ======================
  // DATA FETCHING EFFECT
  // ======================

  /**
   * Load data from API endpoints
   * Fetches featured products, promotions, and popular food items
   * Runs once on component mount
   */
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
                  p.category_es !== "Comida" && p.category_en !== "Food",
              )
              .slice(0, 6),
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

  // ======================
  // COMPONENT RENDER
  // ======================

  return (
    <div className="min-h-screen">
      {/* ================================================ */}
      {/* HERO SECTION                                     */}
      {/* ================================================ */}
      <section className="relative h-[460px] sm:h-[520px] lg:h-[800px] overflow-hidden">
        {/* Background Slideshow with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <ImageSlideshow slides={storeImages} />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 backdrop-blur-[2px]" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
              <span className="block text-white mb-2">{t("home.welcome")}</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {t("home.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white border-none shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 rounded-full"
              >
                <Link href="/productos">
                  <ShoppingCart className="mr-2 h-6 w-6" />
                  {t("home.view_products")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white backdrop-blur-md border-white/50 text-green-600 hover:bg-gray-200 hover:text-green-700 shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 rounded-full"
              >
                <Link href="/servicios">
                  <CreditCard className="mr-2 h-6 w-6" />
                  {t("home.our_services")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Wave Decoration (SVG) */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg
            className="w-full h-12 md:h-24 fill-gray-50"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* ================================================ */}
      {/* FEATURED PRODUCTS SECTION                        */}
      {/* ================================================ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {t("home.featured_products")}
              </h2>
              <div className="h-1 w-24 bg-green-500 rounded mt-2"></div>
            </div>
            <Button
              asChild
              variant="ghost"
              className="hidden md:flex text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Link href="/productos" className="flex items-center gap-2">
                Ver Todos los Productos <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
            {featuredProducts.length > 0
              ? featuredProducts.slice(0, 4).map((product: any) => (
                  <Card
                    key={product._id}
                    className="group overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1"
                  >
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={
                          language === "es" ? product.name_es : product.name_en
                        }
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Quick Add Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-white text-green-600 hover:bg-green-50 rounded-full font-bold"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 line-clamp-2 text-base group-hover:text-green-600 transition-colors">
                          {language === "es"
                            ? product.name_es
                            : product.name_en}
                        </h3>
                      </div>
                      <p className="text-xl font-extrabold text-green-600">
                        ${product.price}
                      </p>
                    </CardContent>
                  </Card>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <Card
                    key={i}
                    className="rounded-2xl border-0 shadow-sm overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Button
              asChild
              variant="outline"
              className="w-full border-green-500 text-green-600"
            >
              <Link href="/productos">Ver Todos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* POPULAR FOOD SECTION                             */}
      {/* ================================================ */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm">
              Delicious & Fresh
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
              {t("food.title")} <span className="text-orange-500">Popular</span>
            </h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {popularFood.length > 0
              ? popularFood.map((product: any) => (
                  <Card
                    key={product._id}
                    className="flex flex-col md:flex-row overflow-hidden border-0 shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl sm:rounded-2xl group bg-white h-full"
                  >
                    <div className="w-full md:w-2/5 relative aspect-video md:aspect-auto">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={
                          language === "es" ? product.name_es : product.name_en
                        }
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5 sm:p-6 md:w-3/5 flex flex-col justify-center">
                      <div className="mb-auto">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-500">
                            Top Rated
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                          {language === "es"
                            ? product.name_es
                            : product.name_en}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                          {language === "es"
                            ? product.description_es
                            : product.description_en}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3 sm:mt-4 border-t pt-3 sm:pt-4 border-gray-100">
                        <span className="text-2xl font-black text-orange-500">
                          ${product.price}
                        </span>
                        <Button
                          size="icon"
                          className="rounded-full bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-100 rounded-2xl animate-pulse"
                  ></div>
                ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 shadow-lg shadow-orange-200"
            >
              <Link href="/comida" className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Ver Todo el Menú
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* INTERACTIVE SERVICES SECTION                   */}
      {/* ================================================ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 relative inline-block">
              {t("home.our_services")}
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600">
              More than just a store — we offer essential services to make your
              life easier.
            </p>
          </div>

          {/* Service Cards Grid - Improved Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              const isActive = activeService === index;

              return (
                <div
                  key={index}
                  onClick={() => handleServiceClick(index)}
                  className={`
                    group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer overflow-hidden
                    ${isActive ? "ring-2 ring-green-500 shadow-2xl scale-[1.02]" : "hover:shadow-xl hover:-translate-y-1 border border-gray-100"}
                  `}
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 p-3 sm:p-4 bg-green-100 rounded-2xl group-hover:bg-green-600 transition-colors duration-300">
                      <ServiceIcon className="h-9 w-9 sm:h-10 sm:w-10 text-green-600 group-hover:text-white transition-colors duration-300" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {t(service.titleKey)}
                    </h3>

                    <div
                      className={`
                      overflow-hidden transition-all duration-500 ease-in-out w-full
                      ${isActive ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 group-hover:mt-4"}
                    `}
                    >
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {t(service.descriptionKey)}
                      </p>

                      {service.partners.length > 0 && (
                        <div className="border-t border-gray-100 pt-6 mt-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Available Providers
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center items-center grayscale group-hover:grayscale-0 transition-all duration-500">
                            {service.partners.map((partner) => (
                              <div
                                key={partner.name}
                                className="relative h-10 w-20 hover:scale-110 transition-transform bg-white rounded-md p-1 shadow-sm"
                              >
                                <Image
                                  src={partner.logoUrl}
                                  alt={partner.name}
                                  fill
                                  className="object-contain"
                                  sizes="80px"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Read More Indicator (Visible when collapsed) */}
                    <div
                      className={`mt-4 ${isActive ? "hidden" : "group-hover:hidden"}`}
                    >
                      <span className="text-green-500 text-sm font-medium flex items-center">
                        More Info <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* BRANDED WHATSAPP PROMO SECTION                 */}
      {/* ================================================ */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800 text-white">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-bounce delay-700">
            <Printer className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            {t("whatsapp.title")}
          </h2>

          <p className="text-xl md:text-2xl text-green-50 max-w-2xl mx-auto mb-10 font-light">
            {t("whatsapp.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-7 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <a
                href="https://wa.me/7722421416"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <div className="bg-green-500 text-white rounded-full p-1">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span>{t("whatsapp.button")}</span>
              </a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-green-200/80 bg-black/20 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">
            {t("whatsapp.format")}
          </p>
        </div>
      </section>

      {/* ================================================ */}
      {/* LOCATION MAP & FACEBOOK FEED SECTION           */}
      {/* ================================================ */}
      <section className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Map & Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 rounded-full text-red-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t("contact.title")}
                    </h2>
                    <p className="text-gray-500">Come visit us today!</p>
                  </div>
                </div>

                <div className="aspect-w-16 aspect-h-9 w-full h-[300px] sm:h-[380px] lg:h-[420px] bg-gray-200 rounded-2xl overflow-hidden shadow-inner mb-6 relative group">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.816216717518!2d-80.3419831237173!3d27.443837776334753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88def194f69636f3%3A0x3b810b158ab0f8dc!2sLa%20Placita%20FTP!5e0!3m2!1sen!2sus!4v1749439130255!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                  ></iframe>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>1508 Delaware Ave, Fort Pierce, FL 34950</span>
                  </div>
                  <Button
                    asChild
                    variant="link"
                    className="text-red-500 p-0 h-auto font-semibold hover:text-red-600"
                  >
                    <a
                      href="https://maps.google.com?q=La+Placita+FTP"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Get Directions <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Facebook Feed */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-full min-h-[360px] sm:min-h-[500px] transform hover:scale-[1.01] transition-transform duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <Facebook className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("fb")}
                  </h2>
                  <p className="text-gray-500">Follow us for updates!</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-gray-50 flex-grow w-full">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php?id=100057713580575&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="100%"
                  style={{
                    border: "none",
                    overflow: "hidden",
                    minHeight: "500px",
                  }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* GOOGLE REVIEWS CAROUSEL SECTION               */}
      {/* ================================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Our Customers
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </div>
          <GoogleReviewsCarousel />
        </div>
      </section>

      {/* ================================================ */}
      {/* ABOUT SNIPPET SECTION                          */}
      {/* ================================================ */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-800 z-0"></div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <div className="w-20 h-1 bg-green-500 mx-auto mb-8 rounded-full"></div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {t("home.history_title")}
          </h2>
          <p className="text-lg md:text-xl text-green-50 leading-relaxed font-light mb-12">
            {t("home.about_snippet")}
          </p>
        </div>
      </section>

      {/* ================================================ */}
      {/* CURRENT PROMOTIONS SECTION                     */}
      {/* ================================================ */}
      {currentPromotions.length > 0 && (
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("home.current_promotions")}
                </h2>
                <p className="text-gray-500 mt-2">
                  Don't miss out on these limited time offers!
                </p>
              </div>
              <Button variant="outline" className="hidden sm:flex">
                View All Offers
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {currentPromotions.map((promotion: any) => (
                <Card
                  key={promotion._id}
                  className="overflow-hidden border-0 shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl"
                >
                  {promotion.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={promotion.image_url || "/placeholder.svg"}
                        alt={
                          language === "es"
                            ? promotion.title_es
                            : promotion.title_en
                        }
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                          LIMITED TIME
                        </div>
                        <h3 className="text-3xl font-bold mb-2 leading-tight">
                          {language === "es"
                            ? promotion.title_es
                            : promotion.title_en}
                        </h3>
                        <p className="text-gray-200 line-clamp-2 text-sm opacity-90">
                          {language === "es"
                            ? promotion.description_es
                            : promotion.description_en}
                        </p>
                      </div>
                    </div>
                  )}
                  {!promotion.image_url && (
                    <CardContent className="p-8 bg-gradient-to-br from-green-600 to-green-800 text-white h-full flex flex-col justify-center min-h-[300px]">
                      <h3 className="text-3xl font-bold mb-4">
                        {language === "es"
                          ? promotion.title_es
                          : promotion.title_en}
                      </h3>
                      <p className="text-green-100 text-lg">
                        {language === "es"
                          ? promotion.description_es
                          : promotion.description_en}
                      </p>
                      <Button className="bg-white text-green-800 mt-6 self-start hover:bg-gray-100 border-none">
                        Learn More
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
