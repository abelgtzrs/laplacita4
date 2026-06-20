"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Facebook,
  MapPin,
  FileText,
  Smartphone,
  Bus,
  CircleDollarSign,
  Landmark,
  Printer,
  ChevronRight,
  Clock,
  Phone,
} from "lucide-react";

import FacebookProfileCard from "@/components/FacebookProfileCard";
import { useLanguage } from "@/contexts/language-context";
import ImageSlideshow from "@/components/ImageSlideshow";

// ===========================
// CONSTANTS
// ===========================

const storeImages = [
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
  "/store/verdura.jpg",
];

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  .lp-display { font-family: 'Syne', sans-serif; }
  @keyframes lp-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .lp-float { animation: lp-float 4s ease-in-out infinite; }
  @keyframes lp-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .lp-skeleton { background: linear-gradient(90deg, #f0ebe0 25%, #e6dfd0 50%, #f0ebe0 75%); background-size: 200% 100%; animation: lp-shimmer 1.5s infinite; }
  .lp-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .lp-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.11); }
  .lp-img-zoom { overflow: hidden; }
  .lp-img-zoom img { transition: transform 0.5s ease; }
  .lp-img-zoom:hover img { transform: scale(1.07); }
  .lp-service { transition: all 0.22s ease; }
  .lp-service:hover { transform: translateY(-3px); }
`;

// =========================
// MAIN COMPONENT
// =========================

export default function HomeAltPage() {
  const { t, language } = useLanguage();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularFood, setPopularFood] = useState([]);
  const [currentPromotions, setCurrentPromotions] = useState([]);
  const [activeService, setActiveService] = useState<number | null>(null);

  const handleServiceClick = (index: number) => {
    setActiveService((prev) => (prev === index ? null : index));
  };

  const services = [
    {
      icon: Landmark,
      titleKey: "services.money_transfers",
      descriptionKey: "services.money_transfers_desc",
      color: "#2563eb",
      bg: "#eff6ff",
      pill: { bg: "#dbeafe", text: "#1d4ed8" },
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
      color: "#7c3aed",
      bg: "#f5f3ff",
      pill: { bg: "#ede9fe", text: "#6d28d9" },
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
      color: "#db2777",
      bg: "#fdf2f8",
      pill: { bg: "#fce7f3", text: "#be185d" },
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
      color: "#ea580c",
      bg: "#fff7ed",
      pill: { bg: "#ffedd5", text: "#c2410c" },
      partners: [
        { name: "Sultana", logoUrl: "/logos/sultana_logo.webp" },
        { name: "Tornado", logoUrl: "/logos/tornado_logo.png" },
      ],
    },
    {
      icon: CircleDollarSign,
      titleKey: "services.check_cashing",
      descriptionKey: "services.check_cashing_desc",
      color: "#16a34a",
      bg: "#f0fdf4",
      pill: { bg: "#dcfce7", text: "#15803d" },
      partners: [],
    },
    {
      icon: Printer,
      titleKey: "services.faxes",
      descriptionKey: "services.faxes_desc",
      color: "#475569",
      bg: "#f8fafc",
      pill: { bg: "#f1f5f9", text: "#334155" },
      partners: [],
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, promotionsRes, foodRes] = await Promise.all([
          fetch("/api/admin/products?featured=true"),
          fetch("/api/admin/promotions?activeOnly=true"),
          fetch("/api/admin/products?category=Comida&featured=true"),
        ]);
        if (productsRes.ok) {
          const allFeatured = await productsRes.json();
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      <div style={{ background: "#fef9f0", fontFamily: "inherit" }}>
        {/* ============================================== */}
        {/* HERO                                          */}
        {/* ============================================== */}
        <section
          className="relative w-full overflow-hidden"
          style={{ height: "100svh", minHeight: "600px", maxHeight: "950px" }}
        >
          <div className="absolute inset-0 z-0">
            <ImageSlideshow slides={storeImages} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(20,83,45,0.92) 0%, rgba(20,83,45,0.72) 45%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
            <div style={{ maxWidth: "620px" }}>
              <div
                className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  borderColor: "rgba(255,255,255,0.20)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-white/90 text-xs font-bold tracking-widest uppercase">
                  Open Daily 7AM – 9PM
                </span>
              </div>

              <h1
                className="lp-display text-white leading-none tracking-tight mb-5"
                style={{
                  fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                  fontWeight: 800,
                }}
              >
                {t("home.welcome")}
              </h1>

              <div
                className="mb-6 rounded-full"
                style={{
                  height: "5px",
                  width: "72px",
                  background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                }}
              />

              <p
                className="text-white/80 mb-10 leading-relaxed"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  maxWidth: "480px",
                }}
              >
                {t("home.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    boxShadow: "0 8px 28px rgba(22,163,74,0.45)",
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("home.view_products")}
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base border text-white transition-all duration-200 hover:bg-white hover:text-green-900"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.28)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CreditCard className="h-5 w-5" />
                  {t("home.our_services")}
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full z-10 leading-none pointer-events-none">
            <svg
              viewBox="0 0 1440 64"
              preserveAspectRatio="none"
              style={{ display: "block", height: "64px", width: "100%" }}
            >
              <path
                d="M0,64 L0,24 Q360,64 720,24 Q1080,-16 1440,24 L1440,64 Z"
                fill="#fef9f0"
              />
            </svg>
          </div>
        </section>

        {/* ============================================== */}
        {/* INFO BAR                                       */}
        {/* ============================================== */}
        <div style={{ background: "#fef9f0" }} className="px-4 py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: MapPin,
                color: "#16a34a",
                bg: "#dcfce7",
                label: "Visit Us",
                value: "1508 Delaware Ave, Fort Pierce, FL",
              },
              {
                icon: Phone,
                color: "#2563eb",
                bg: "#dbeafe",
                label: "Call Us",
                value: "(772) 461-1234",
              },
              {
                icon: Clock,
                color: "#d97706",
                bg: "#fef3c7",
                label: "Hours",
                value: "Mon – Sun: 7:00 AM – 9:00 PM",
              },
            ].map(({ icon: Icon, color, bg, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-5 rounded-2xl border"
                style={{
                  background: "white",
                  borderColor: "#ede3d3",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
                }}
              >
                <div
                  className="flex-shrink-0 p-3 rounded-xl"
                  style={{ background: bg }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#9ca3af" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: "#1c1917" }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================== */}
        {/* PROMOTIONS                                     */}
        {/* ============================================== */}
        {currentPromotions.length > 0 && (
          <section className="py-16 px-4" style={{ background: "white" }}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: "#fef2f2", color: "#dc2626" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full inline-block"
                    style={{ background: "#dc2626" }}
                  />
                  {t("home.current_promotions")}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPromotions.map((promotion: any) => (
                  <div
                    key={promotion._id}
                    className="lp-card group relative overflow-hidden rounded-3xl"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
                  >
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                      }}
                    />
                    {promotion.image_url && (
                      <div className="aspect-[2/1] relative lp-img-zoom">
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
                    <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                        style={{ background: "#dc2626" }}
                      >
                        {language === "es"
                          ? "Oferta Especial"
                          : "Special Offer"}
                      </span>
                      <h3 className="lp-display text-2xl font-bold mb-1">
                        {language === "es"
                          ? promotion.title_es
                          : promotion.title_en}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2">
                        {language === "es"
                          ? promotion.description_es
                          : promotion.description_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================== */}
        {/* FEATURED PRODUCTS                              */}
        {/* ============================================== */}
        <section className="py-20 px-4" style={{ background: "#fef9f0" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#16a34a" }}
                >
                  In Store Now
                </p>
                <h2
                  className="lp-display font-bold"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    color: "#14532d",
                  }}
                >
                  {t("home.featured_products")}
                </h2>
              </div>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: "#16a34a" }}
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.length > 0
                ? featuredProducts.map((product: any) => (
                    <Link href="/productos" key={product._id} className="group">
                      <div
                        className="lp-card rounded-2xl overflow-hidden border h-full flex flex-col"
                        style={{ background: "white", borderColor: "#ede3d3" }}
                      >
                        <div
                          className="aspect-square relative lp-img-zoom"
                          style={{ background: "#fef3e2" }}
                        >
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
                        <div className="p-3 flex-1 flex flex-col">
                          <h3
                            className="text-xs font-medium line-clamp-2 flex-1 mb-2"
                            style={{ color: "#374151" }}
                          >
                            {language === "es"
                              ? product.name_es
                              : product.name_en}
                          </h3>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#16a34a" }}
                          >
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border"
                      style={{ background: "white", borderColor: "#ede3d3" }}
                    >
                      <div className="aspect-square lp-skeleton" />
                      <div className="p-3 space-y-2">
                        <div
                          className="h-3 rounded lp-skeleton"
                          style={{ width: "75%" }}
                        />
                        <div
                          className="h-4 rounded lp-skeleton"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* POPULAR FOOD                                   */}
        {/* ============================================== */}
        <section className="py-20 px-4" style={{ background: "white" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#ea580c" }}
                >
                  Freshly Prepared
                </p>
                <h2
                  className="lp-display font-bold"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    color: "#431407",
                  }}
                >
                  {t("food.title")}
                </h2>
              </div>
              <Link
                href="/comida"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: "#ea580c" }}
              >
                Full Menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularFood.length > 0
                ? popularFood.map((product: any) => (
                    <Link href="/comida" key={product._id} className="group">
                      <div
                        className="lp-card rounded-2xl overflow-hidden border flex"
                        style={{
                          background: "white",
                          borderColor: "#fed7aa",
                          height: "clamp(9rem, 12vw, 11rem)",
                        }}
                      >
                        <div className="w-2/5 relative lp-img-zoom flex-shrink-0">
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
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <h3
                            className="font-bold text-sm sm:text-base line-clamp-2 leading-snug"
                            style={{ color: "#1c1917" }}
                          >
                            {language === "es"
                              ? product.name_es
                              : product.name_en}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className="text-lg font-bold"
                              style={{ color: "#ea580c" }}
                            >
                              ${product.price}
                            </span>
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                              style={{
                                background: "#fff7ed",
                                color: "#ea580c",
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border flex h-44"
                      style={{ background: "white", borderColor: "#fed7aa" }}
                    >
                      <div className="w-2/5 lp-skeleton flex-shrink-0" />
                      <div className="flex-1 p-5 space-y-3">
                        <div
                          className="h-5 rounded lp-skeleton"
                          style={{ width: "80%" }}
                        />
                        <div
                          className="h-4 rounded lp-skeleton"
                          style={{ width: "55%" }}
                        />
                        <div
                          className="h-6 rounded lp-skeleton"
                          style={{ width: "35%" }}
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SERVICES                                       */}
        {/* ============================================== */}
        <section className="py-20 px-4" style={{ background: "#fef9f0" }}>
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-16"
              style={{ maxWidth: "540px", margin: "0 auto 64px" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#16a34a" }}
              >
                More Than a Store
              </p>
              <h2
                className="lp-display font-bold mb-4"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  color: "#14532d",
                }}
              >
                {t("home.our_services")}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6b7280" }}
              >
                {t("services.titleDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, index) => {
                const ServiceIcon = service.icon;
                const isActive = activeService === index;
                return (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(index)}
                    className="lp-service rounded-2xl p-6 cursor-pointer border-2"
                    style={{
                      background: "white",
                      borderColor: isActive ? service.color : "#ede3d3",
                      boxShadow: isActive
                        ? `0 8px 32px ${service.color}25`
                        : "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="p-3 rounded-xl"
                        style={{ background: service.bg }}
                      >
                        <ServiceIcon
                          className="h-6 w-6"
                          style={{ color: service.color }}
                        />
                      </div>
                      {service.partners.length > 0 && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: service.pill.bg,
                            color: service.pill.text,
                          }}
                        >
                          {service.partners.length} partners
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-bold text-base mb-2"
                      style={{ color: "#1c1917" }}
                    >
                      {t(service.titleKey)}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: "#6b7280" }}
                    >
                      {t(service.descriptionKey)}
                    </p>

                    <div
                      className="overflow-hidden"
                      style={{
                        maxHeight:
                          isActive && service.partners.length > 0
                            ? "80px"
                            : "0px",
                        opacity:
                          isActive && service.partners.length > 0 ? 1 : 0,
                        transition: "max-height 0.4s ease, opacity 0.4s ease",
                      }}
                    >
                      <div
                        className="pt-4 border-t flex flex-wrap gap-3"
                        style={{ borderColor: "#f3f4f6" }}
                      >
                        {service.partners.map((partner) => (
                          <div
                            key={partner.name}
                            className="relative grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
                            style={{ height: "28px", width: "56px" }}
                          >
                            <Image
                              src={partner.logoUrl}
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1 mt-3"
                      style={{ color: service.color, opacity: 0.65 }}
                    >
                      <ChevronRight
                        className="h-4 w-4 transition-transform duration-300"
                        style={{
                          transform: isActive
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                      {service.partners.length > 0 && (
                        <span className="text-xs sm:hidden">
                          {isActive ? "Hide" : "Show partners"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* WHATSAPP CTA                                   */}
        {/* ============================================== */}
        <section
          className="relative overflow-hidden py-24 px-4"
          style={{
            background:
              "linear-gradient(150deg, #052e16 0%, #064e3b 50%, #14532d 100%)",
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-120px",
              right: "-80px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "#34d399",
              filter: "blur(80px)",
              opacity: 0.12,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-100px",
              left: "-80px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "#6ee7b7",
              filter: "blur(64px)",
              opacity: 0.09,
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div
              className="lp-float inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
              style={{
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.28)",
              }}
            >
              <MessageCircle className="h-9 w-9" style={{ color: "#6ee7b7" }} />
            </div>

            <h2
              className="lp-display text-white font-bold mb-5 leading-tight"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)" }}
            >
              {t("whatsapp.title")}
            </h2>
            <p
              className="mb-10 max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1rem" }}
            >
              {t("whatsapp.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/7722421416"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105"
                style={{
                  background: "#25D366",
                  boxShadow: "0 10px 36px rgba(37,211,102,0.38)",
                }}
              >
                <MessageCircle className="h-5 w-5" />
                {t("whatsapp.button")}
              </a>
              <div
                className="text-sm px-5 py-3 rounded-xl border"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {t("whatsapp.format")}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* ABOUT                                          */}
        {/* ============================================== */}
        <section className="py-24 px-4" style={{ background: "white" }}>
          <div className="max-w-2xl mx-auto text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#16a34a" }}
            >
              Our Story
            </p>
            <div
              className="lp-display select-none leading-none mb-2"
              style={{
                fontSize: "7rem",
                color: "#dcfce7",
                fontWeight: 800,
                lineHeight: 0.8,
              }}
            >
              "
            </div>
            <h2
              className="lp-display font-bold mb-6"
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                color: "#14532d",
              }}
            >
              {t("home.history_title")}
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: "#4b5563", fontSize: "1.05rem" }}
            >
              {t("home.about_snippet")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-2">
              <div
                className="h-1 w-16 rounded-full"
                style={{ background: "#16a34a" }}
              />
              <div
                className="h-1 w-4 rounded-full"
                style={{ background: "#bbf7d0" }}
              />
              <div
                className="h-1 w-4 rounded-full"
                style={{ background: "#bbf7d0" }}
              />
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* LOCATION + SOCIAL                              */}
        {/* ============================================== */}
        <section style={{ background: "#fef9f0" }}>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative" style={{ minHeight: "480px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.816216717518!2d-80.3419831237173!3d27.443837776334753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88def194f69636f3%3A0x3b810b158ab0f8dc!2sLa%20Placita%20FTP!5e0!3m2!1sen!2sus!4v1749439130255!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
              <div
                className="absolute top-5 left-5 z-10 p-4 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
                  maxWidth: "240px",
                }}
              >
                <p
                  className="font-bold text-sm mb-0.5"
                  style={{ color: "#14532d" }}
                >
                  La Placita FTP
                </p>
                <p className="text-xs" style={{ color: "#6b7280" }}>
                  1508 Delaware Ave, Fort Pierce, FL 34950
                </p>
                <a
                  href="https://maps.google.com/?q=La+Placita+FTP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2"
                  style={{ color: "#16a34a" }}
                >
                  Get Directions <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 bg-white p-10 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="p-3 rounded-full"
                    style={{ background: "#1877f2" }}
                  >
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <h2
                    className="lp-display font-bold"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                      color: "#1c1917",
                    }}
                  >
                    {t("fb")}
                  </h2>
                </div>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "#6b7280" }}
                >
                  Stay updated with our latest offers, new arrivals, and
                  community events. Join our growing family on Facebook!
                </p>
                <FacebookProfileCard
                  facebookUrl="https://www.facebook.com/people/La-Placita-FTP/61576133441458/"
                  headline={
                    language === "es"
                      ? "Mantente al dia con La Placita FTP"
                      : "Stay up to date with La Placita FTP"
                  }
                  description={
                    language === "es"
                      ? "Visita nuestro Facebook para ver promociones nuevas, llegadas recientes y novedades para la comunidad."
                      : "Visit our Facebook to see new promotions, recent arrivals, and community updates."
                  }
                  buttonLabel={
                    language === "es" ? "Abrir Facebook" : "Open Facebook"
                  }
                  note={
                    language === "es"
                      ? "La experiencia completa de publicaciones se abre directamente en Facebook."
                      : "The full posts experience opens directly in Facebook."
                  }
                  className="min-h-[320px] rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
