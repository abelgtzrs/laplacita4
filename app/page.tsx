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
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
  "/store/verdura.jpg",
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

  // ======================
  // COMPONENT RENDER
  // ======================

  return (
    <div className="min-h-screen">
      {/* ================================================ */}
      {/* HERO SECTION                                     */}
      {/* ================================================ */}
      {/* 
        Hero section with image slideshow background
        - Features store images rotating in slideshow
        - Overlaid with welcome text and call-to-action buttons
        - Responsive design for mobile and desktop
      */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600">
            <ImageSlideshow slides={storeImages} />
            <div className="h-full flex items-center justify-center"></div>
          </div>
        </div>
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-xl bg-color-red-600 drop-shadow-[0_3px_2px_rgba(0,0,0,0.8)]">
              {t("home.welcome")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-[0_3px_2px_rgba(0,0,0,0.8)]">
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

      {/* ================================================ */}
      {/* FEATURED PRODUCTS & POPULAR FOOD SECTION        */}
      {/* ================================================ */}
      {/* 
        Dual-column layout featuring:
        - Left: Featured Products (non-food items)
        - Right: Popular Food Items
        - Responsive grid layout with product cards
        - Loading states with skeleton animations
      */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {/* ========================================== */}
            {/* LEFT COLUMN: FEATURED PRODUCTS            */}
            {/* ========================================== */}
            {/* 
              Non-food featured products display
              - Product cards with images and pricing
              - Skeleton loading states
              - Link to all products page
            */}
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

            {/* ========================================== */}
            {/* RIGHT COLUMN: POPULAR FOOD                */}
            {/* ========================================== */}
            {/* 
              Popular food items display
              - Featured food products with images and pricing
              - Skeleton loading states while data loads
              - Link to food menu page
            */}
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

      {/* ================================================ */}
      {/* INTERACTIVE SERVICES SECTION                   */}
      {/* ================================================ */}
      {/* 
        Interactive service cards showcase
        - 6 main services with partner logos
        - Hover effects and mobile tap-to-expand
        - Responsive grid layout (1 to 6 columns based on screen size)
        - Partner logos display on hover/tap
      */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.our_services")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              const isActive = activeService === index;

              return (
                <div
                  key={index}
                  // onClick handler for mobile tap
                  onClick={() => handleServiceClick(index)}
                  className="group relative rounded-lg border-2 border-gray-100 p-6 text-center transition-all duration-300 hover:border-green-500 hover:shadow-xl cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <ServiceIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t(service.titleKey)}
                    </h3>
                  </div>

                  {/* Expanding section with conditional class for mobile */}
                  <div
                    className={`pt-4 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96 ${
                      isActive ? "max-h-96" : ""
                    }`}
                  >
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

      {/* ================================================ */}
      {/* WHATSAPP PRINTING SERVICE SECTION             */}
      {/* ================================================ */}
      {/* 
        WhatsApp printing service promotion
        - Call-to-action for document printing service
        - Direct link to WhatsApp business number
        - Instructions for formatting print requests
      */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("whatsapp.title")}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {t("whatsapp.subtitle")}
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
                {t("whatsapp.button")}
              </a>
            </Button>
            <p className="text-sm text-gray-600 mt-4">{t("whatsapp.format")}</p>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* LOCATION MAP & FACEBOOK FEED SECTION           */}
      {/* ================================================ */}
      {/* 
        Dual-column layout featuring:
        - Left: Interactive Google Maps embed showing store location
        - Right: Facebook page feed for social media integration
        - Business address and contact information
      */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("fb")}</h2>
            <p className="text-lg text-gray-600">
              1508 Delaware Ave, Fort Pierce, FL 34950
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ========================================== */}
            {/* LEFT COLUMN: GOOGLE MAP                    */}
            {/* ========================================== */}
            {/* 
              Interactive Google Maps embed
              - Shows exact store location
              - Allows users to get directions
              - Responsive iframe with proper aspect ratio
            */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.816216717518!2d-80.3419831237173!3d27.443837776334753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88def194f69636f3%3A0x3b810b158ab0f8dc!2sLa%20Placita%20FTP!5e0!3m2!1sen!2sus!4v1749439130255!5m2!1sen!2sus"
                width="600"
                height="576"
                loading="lazy"
              ></iframe>
            </div>

            {/* ========================================== */}
            {/* RIGHT COLUMN: FACEBOOK FEED               */}
            {/* ========================================== */}
            {/* 
              Facebook page feed integration
              - Displays latest posts from business page
              - Social proof and community engagement
              - Embedded Facebook page plugin
            */}
            <div className="rounded-lg shadow-xl bg-white p-4">
              <div className="aspect-w-16 aspect-h-9 md:aspect-h-16 overflow-hidden rounded-md">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61576133441458&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="500"
                  height="500"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* GOOGLE REVIEWS CAROUSEL SECTION               */}
      {/* ================================================ */}
      {/* 
        Customer reviews and testimonials
        - Displays Google reviews in a carousel format
        - Shows customer feedback and ratings
        - Builds trust and social proof
      */}

      {/* ================================================ */}
      {/* ABOUT SNIPPET SECTION                          */}
      {/* ================================================ */}
      {/* 
        Brief company history and description
        - Provides context about La Placita FTP
        - Builds trust and credibility
        - Styled with gradient background
      */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t("home.history_title")}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t("home.about_snippet")}
          </p>
        </div>
      </section>

      {/* ================================================ */}
      {/* CURRENT PROMOTIONS SECTION                     */}
      {/* ================================================ */}
      {/* 
        Active promotions display
        - Conditional rendering based on available promotions
        - Grid layout for multiple promotions
        - Image and text content for each promotion
        - Responsive design for mobile and desktop
      */}
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
