"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Tag,
  Gift,
  Sparkles,
  Clock,
  Facebook,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { type Promotion } from "@/lib/mongodb";

export default function PromotionsPage() {
  const { t, language } = useLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  useEffect(() => {
    async function loadPromotions() {
      try {
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
    activeTo: string | Date,
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
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (activeTo: string | Date) => {
    const now = new Date();
    const to = new Date(activeTo);
    const diff = Math.ceil(
      (to.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const filteredPromotions = promotions.filter((p) => {
    if (filter === "all") return true;
    const active = isPromotionActive(p.active_from, p.active_to);
    return filter === "active" ? active : !active;
  });

  const activeCount = promotions.filter((p) =>
    isPromotionActive(p.active_from, p.active_to),
  ).length;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50">
        {/* Hero skeleton */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-red-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-10 w-80 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-white/15 rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
        {/* Card skeletons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50">
      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-red-600">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              {activeCount > 0
                ? language === "es"
                  ? `${activeCount} ${activeCount === 1 ? "oferta activa" : "ofertas activas"}`
                  : `${activeCount} active ${activeCount === 1 ? "deal" : "deals"}`
                : language === "es"
                  ? "Nuevas ofertas pronto"
                  : "New deals coming soon"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t("promotions.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {language === "es"
              ? "Descubre nuestras ofertas especiales y promociones exclusivas para la comunidad."
              : "Discover our special offers and exclusive promotions for the community."}
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              className="fill-amber-50"
            />
          </svg>
        </div>
      </section>
      {/* ===== FACEBOOK FEED SECTION ===== */}
      <section className="mt-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-[550px] mx-auto">
          {/* Section header */}
          <div className="flex flex-col items-center text-center gap-3 px-8 pt-8 pb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Facebook className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {language === "es"
                  ? "Síguenos en Facebook"
                  : "Follow Us on Facebook"}
              </h2>
              <p className="text-gray-500 text-sm">
                {language === "es"
                  ? "Entérate de nuestras últimas ofertas y novedades"
                  : "Stay up to date with our latest deals and news"}
              </p>
            </div>
          </div>

          {/* Facebook embed */}
          <div className="px-6 pb-8">
            <div className="overflow-hidden rounded-xl bg-gray-50 w-full">
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
      </section>
      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter tabs */}
        {promotions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 -mt-4 mb-10 relative z-10">
            {(
              [
                {
                  key: "all",
                  label: language === "es" ? "Todas" : "All",
                  count: promotions.length,
                },
                {
                  key: "active",
                  label: language === "es" ? "Activas" : "Active",
                  count: activeCount,
                },
                {
                  key: "expired",
                  label: language === "es" ? "Expiradas" : "Expired",
                  count: promotions.length - activeCount,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
                  filter === tab.key
                    ? "bg-green-600 text-white shadow-green-200 shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.key
                      ? "bg-white/25 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Promotions Grid */}
        {filteredPromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promotion, index) => {
              const isActive = isPromotionActive(
                promotion.active_from,
                promotion.active_to,
              );
              const daysRemaining = getDaysRemaining(promotion.active_to);

              return (
                <div
                  key={promotion._id?.toString()}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                      isActive
                        ? "shadow-lg ring-2 ring-green-400/50"
                        : "shadow-md opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Image */}
                    {promotion.image_url ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={promotion.image_url}
                          alt={
                            language === "es"
                              ? promotion.title_es
                              : promotion.title_en
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Status badge */}
                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`px-3 py-1 text-xs font-bold shadow-lg ${
                              isActive
                                ? "bg-green-500 hover:bg-green-600 text-white border-0"
                                : "bg-gray-500/80 hover:bg-gray-600 text-white border-0"
                            }`}
                          >
                            {isActive
                              ? language === "es"
                                ? "Activa"
                                : "Active"
                              : language === "es"
                                ? "Expirada"
                                : "Expired"}
                          </Badge>
                        </div>

                        {/* Urgency badge for expiring soon */}
                        {isActive &&
                          daysRemaining <= 7 &&
                          daysRemaining > 0 && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg animate-pulse">
                                <Clock className="h-3 w-3 mr-1" />
                                {daysRemaining === 1
                                  ? language === "es"
                                    ? "Último día!"
                                    : "Last day!"
                                  : language === "es"
                                    ? `${daysRemaining} días`
                                    : `${daysRemaining} days left`}
                              </Badge>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div
                        className={`h-36 flex items-center justify-center ${
                          isActive
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : "bg-gradient-to-br from-gray-300 to-gray-400"
                        }`}
                      >
                        <Gift className="h-14 w-14 text-white/70" />
                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`px-3 py-1 text-xs font-bold shadow-lg ${
                              isActive
                                ? "bg-green-700 hover:bg-green-800 text-white border-0"
                                : "bg-gray-600 hover:bg-gray-700 text-white border-0"
                            }`}
                          >
                            {isActive
                              ? language === "es"
                                ? "Activa"
                                : "Active"
                              : language === "es"
                                ? "Expirada"
                                : "Expired"}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {language === "es"
                          ? promotion.title_es
                          : promotion.title_en}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {language === "es"
                          ? promotion.description_es
                          : promotion.description_en}
                      </p>

                      {/* Date range */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {formatDate(promotion.active_from)} &mdash;{" "}
                          {formatDate(promotion.active_to)}
                        </span>
                      </div>

                      {/* Active promotion CTA */}
                      {isActive && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-green-600">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                            </span>
                            <span className="text-sm font-semibold">
                              {language === "es"
                                ? "Promoción activa — ¡Visítanos!"
                                : "Active deal — Visit us!"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-amber-100 mb-6">
              <Tag className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {filter !== "all"
                ? language === "es"
                  ? "No hay promociones en esta categoría"
                  : "No promotions in this category"
                : t("promotions.no_active")}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {language === "es"
                ? "Mantente atento a nuestras redes sociales para conocer las últimas ofertas."
                : "Stay tuned to our social media for the latest offers and deals."}
            </p>
            {filter !== "all" && (
              <Button
                variant="outline"
                onClick={() => setFilter("all")}
                className="rounded-full border-green-300 text-green-700 hover:bg-green-50"
              >
                {language === "es" ? "Ver todas" : "View all"}
              </Button>
            )}
          </div>
        )}

        {/* ===== CTA SECTION ===== */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-red-600 p-8 md:p-12">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-yellow-300/15 rounded-full" />

            <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left side: text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4">
                  <Gift className="h-4 w-4 text-yellow-300" />
                  <span className="text-white/90 text-sm font-medium">
                    {language === "es" ? "No te lo pierdas" : "Don't miss out"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                  {language === "es"
                    ? "¡Síguenos para más ofertas!"
                    : "Follow us for more deals!"}
                </h2>
                <p className="text-white/80 text-lg max-w-xl leading-relaxed">
                  {language === "es"
                    ? "Conéctate con nosotros en Facebook y WhatsApp para recibir notificaciones de ofertas exclusivas para la comunidad."
                    : "Connect with us on Facebook and WhatsApp to get notifications about exclusive deals for the community."}
                </p>
              </div>

              {/* Right side: action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
                <Link
                  href="https://www.facebook.com/profile.php?id=61558498982498"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-green-700 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span>La Placita FTP</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <Link
                  href="tel:+17722421416"
                  className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm text-white font-bold px-6 py-3.5 rounded-xl border border-white/25 hover:bg-white/25 hover:scale-105 transition-all duration-200"
                >
                  <Phone className="h-5 w-5 text-green-300" />
                  <span>(772) 242-1416</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
