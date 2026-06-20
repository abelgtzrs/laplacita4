"use client";

import {
  FileText,
  Smartphone,
  Bus,
  CircleDollarSign,
  Globe,
  Landmark,
  Printer,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  const { t, language } = useLanguage();

  // ── Service definitions ───────────────────────────────────────────
  const services = [
    {
      icon: Landmark,
      title: t("services.money_transfers"),
      description: t("services.money_transfers_desc"),
      accentFrom: "from-green-500",
      accentTo: "to-emerald-600",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      badgeColor: "bg-green-50 text-green-700 border-green-200",
      partners: [
        { name: "Intermex", logoUrl: "/logos/intermex_logo.png" },
        { name: "MoneyGram", logoUrl: "/logos/moneygram_logo.png" },
        { name: "Ria", logoUrl: "/logos/ria_logo.png" },
      ],
      rates: [] as string[],
    },
    {
      icon: FileText,
      title: t("services.bill_payments"),
      description: t("services.bill_payments_desc"),
      accentFrom: "from-blue-500",
      accentTo: "to-cyan-600",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      partners: [
        { name: "FPUA", logoUrl: "/logos/fpua_logo.png" },
        { name: "FPL", logoUrl: "/logos/fpl_logo.png" },
        { name: "Comcast", logoUrl: "/logos/comcast_logo.png" },
        { name: "Dish Network", logoUrl: "/logos/dish_logo.png" },
      ],
      rates: [] as string[],
    },
    {
      icon: Smartphone,
      title: t("services.mobile_topups"),
      description: t("services.mobile_topups_desc"),
      accentFrom: "from-purple-500",
      accentTo: "to-violet-600",
      iconBg: "bg-purple-100",
      iconText: "text-purple-600",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      partners: [
        { name: "Boss Revolution", logoUrl: "/logos/br_logo.svg" },
        { name: "Sin Pin", logoUrl: "/logos/sinpin_logo.png" },
        { name: "Telcel", logoUrl: "/logos/telcel_logo.png" },
        { name: "Tigo", logoUrl: "/logos/tigo_logo.png" },
        { name: "Claro", logoUrl: "/logos/claro_logo.svg" },
        { name: "Movistar", logoUrl: "/logos/movistar_logo.png" },
        { name: "Natcom", logoUrl: "/logos/natcom_logo.png" },
        { name: "Digicel", logoUrl: "/logos/digicel_logo.png" },
      ],
      rates: [] as string[],
    },
    {
      icon: Bus,
      title: t("services.bus_tickets"),
      description: t("services.bus_tickets_desc"),
      accentFrom: "from-orange-500",
      accentTo: "to-amber-500",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
      partners: [
        { name: "Sultana", logoUrl: "/logos/sultana_logo.webp" },
        { name: "Tornado", logoUrl: "/logos/tornado_logo.png" },
      ],
      rates: [] as string[],
    },
    {
      icon: CircleDollarSign,
      title: t("services.check_cashing"),
      description: t("services.check_cashing_desc"),
      accentFrom: "from-red-500",
      accentTo: "to-rose-600",
      iconBg: "bg-red-100",
      iconText: "text-red-600",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      partners: [] as { name: string; logoUrl: string }[],
      rates: ["1% (under $1,000)", "1.5% (under $2,000)"],
    },
    {
      icon: Printer,
      title: t("services.faxes"),
      description: t("services.faxes_desc"),
      accentFrom: "from-teal-500",
      accentTo: "to-cyan-600",
      iconBg: "bg-teal-100",
      iconText: "text-teal-600",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      partners: [] as { name: string; logoUrl: string }[],
      rates: [
        language === "es"
          ? "PDF, Word, Excel, Imágenes"
          : "PDF, Word, Excel, Images",
        language === "es" ? "Envío por WhatsApp" : "Send via WhatsApp",
      ],
    },
  ];

  const countries = [
    { name: "México", carriers: "Telcel, Movistar" },
    { name: "Honduras", carriers: "Tigo, Claro" },
    { name: "Guatemala", carriers: "Tigo, Claro" },
    { name: "El Salvador", carriers: "Tigo, Movistar" },
    { name: "Nicaragua", carriers: "Claro, Tigo" },
    { name: "Haiti", carriers: "Natcom, Digicel" },
    { name: "Jamaica", carriers: "Digicel, Lime" },
    { name: language === "es" ? "Y más..." : "And more...", carriers: "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50">
      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-red-600">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-2/3 w-48 h-48 bg-yellow-300 rounded-full -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
            <Globe className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              {services.length}{" "}
              {language === "es"
                ? "servicios disponibles"
                : "services available"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t("services.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {t("services.titleDescription")}
          </p>
        </div>

        {/* Wave */}
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

      {/* ===== SERVICES GRID ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pt-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card top accent bar */}
              <div
                className={`h-1.5 bg-gradient-to-r ${service.accentFrom} ${service.accentTo}`}
              />

              <div className="p-7 flex flex-col flex-1">
                {/* Icon + title */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl ${service.iconBg} ${service.iconText} flex items-center justify-center shadow-sm`}
                  >
                    <service.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors">
                      {service.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Partner logos */}
                {service.partners.length > 0 && (
                  <div className="mt-auto">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      {language === "es" ? "Socios" : "Partners"}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {service.partners.map((partner, i) => (
                        <div
                          key={i}
                          className="relative h-10 w-24 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          title={partner.name}
                        >
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-1.5"
                            sizes="96px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rates / feature pills */}
                {service.rates.length > 0 && (
                  <div className="mt-auto">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      {language === "es" ? "Tarifas" : "Rates"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.rates.map((rate, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${service.badgeColor}`}
                        >
                          {rate}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== INTERNATIONAL SECTION ===== */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-teal-600 p-8 md:p-12">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <div className="p-4 bg-white/15 rounded-2xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    {language === "es"
                      ? "Servicios Internacionales"
                      : "International Services"}
                  </h2>
                  <p className="text-white/80 mt-1 max-w-xl">
                    {t("services.description_int") ||
                      (language === "es"
                        ? "Conectamos tu comunidad con el mundo."
                        : "Connecting your community with the world.")}
                  </p>
                </div>
              </div>

              {/* Country grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countries.map((c, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 text-center transition-all ${
                      c.carriers
                        ? "bg-white/15 hover:bg-white/25 cursor-default"
                        : "bg-white/10 border border-white/20"
                    }`}
                  >
                    <div className="font-bold text-white text-sm md:text-base">
                      {c.name}
                    </div>
                    {c.carriers && (
                      <div className="text-white/70 text-xs mt-1">
                        {c.carriers}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="mt-10">
          <div className="bg-white rounded-3xl shadow-lg border border-yellow-200 p-8 md:p-10 flex flex-col sm:flex-row items-center gap-8">
            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                {language === "es"
                  ? "¿Necesitas más información?"
                  : "Need more information?"}
              </h2>
              <p className="text-gray-500">
                {language === "es"
                  ? "Visítanos en la tienda o llámanos para obtener más detalles sobre nuestros servicios."
                  : "Visit us in store or give us a call to learn more about our services."}
              </p>
            </div>

            {/* Action links */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="https://maps.google.com/?q=1508+Delaware+Ave,+Fort+Pierce,+FL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-3 rounded-xl shadow hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <MapPin className="h-4 w-4" />
                <span>1508 Delaware Ave</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
              <Link
                href="tel:+17722421416"
                className="inline-flex items-center gap-2 bg-white border-2 border-green-200 text-green-700 font-bold px-5 py-3 rounded-xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
              >
                <Phone className="h-4 w-4" />
                <span>(772) 242-1416</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
