"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Bus,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  Facebook,
  FileText,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import ImageSlideshow from "@/components/ImageSlideshow";
import { useLanguage } from "@/contexts/language-context";

type Product = {
  _id: string;
  name_es: string;
  name_en: string;
  price: number | string;
  image_url?: string;
  category_es?: string;
  category_en?: string;
};

type Promotion = {
  _id: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  image_url?: string;
};

type ServicePartner = {
  name: string;
  logoUrl: string;
};

type ServiceCard = {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  number: string;
  accentClass: string;
  iconSurfaceClass: string;
  partners: ServicePartner[];
};

const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const storeImages = [
  "/store/galletas.png",
  "/store/chips.png",
  "/store/carnes.png",
  "/store/verdura.jpg",
];

const services: ServiceCard[] = [
  {
    icon: Landmark,
    titleKey: "services.money_transfers",
    descriptionKey: "services.money_transfers_desc",
    number: "01",
    accentClass: "text-amber-700",
    iconSurfaceClass: "bg-amber-100/90",
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
    number: "02",
    accentClass: "text-emerald-700",
    iconSurfaceClass: "bg-emerald-100/90",
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
    number: "03",
    accentClass: "text-rose-700",
    iconSurfaceClass: "bg-rose-100/90",
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
    number: "04",
    accentClass: "text-orange-700",
    iconSurfaceClass: "bg-orange-100/90",
    partners: [
      { name: "Sultana", logoUrl: "/logos/sultana_logo.webp" },
      { name: "Tornado", logoUrl: "/logos/tornado_logo.png" },
    ],
  },
  {
    icon: CircleDollarSign,
    titleKey: "services.check_cashing",
    descriptionKey: "services.check_cashing_desc",
    number: "05",
    accentClass: "text-teal-700",
    iconSurfaceClass: "bg-teal-100/90",
    partners: [],
  },
  {
    icon: Printer,
    titleKey: "services.faxes",
    descriptionKey: "services.faxes_desc",
    number: "06",
    accentClass: "text-slate-700",
    iconSurfaceClass: "bg-slate-200/80",
    partners: [],
  },
];

const formatPrice = (price: Product["price"]) => {
  const numericPrice = typeof price === "number" ? price : Number(price);

  if (Number.isFinite(numericPrice)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  }

  const priceLabel = String(price);
  return priceLabel.startsWith("$") ? priceLabel : `$${priceLabel}`;
};

export default function HomeAltPage() {
  const { t, language } = useLanguage();
  const isSpanish = language === "es";

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularFood, setPopularFood] = useState<Product[]>([]);
  const [currentPromotions, setCurrentPromotions] = useState<Promotion[]>([]);
  const [activeService, setActiveService] = useState<number | null>(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const [productsRes, promotionsRes, foodRes] = await Promise.all([
          fetch("/api/admin/products?featured=true", { signal: controller.signal }),
          fetch("/api/admin/promotions?activeOnly=true", { signal: controller.signal }),
          fetch("/api/admin/products?category=Comida&featured=true", {
            signal: controller.signal,
          }),
        ]);

        if (productsRes.ok) {
          const allFeatured: Product[] = await productsRes.json();
          setFeaturedProducts(
            allFeatured
              .filter(
                (product) =>
                  product.category_es !== "Comida" && product.category_en !== "Food"
              )
              .slice(0, 4)
          );
        }

        if (foodRes.ok) {
          const foodItems: Product[] = await foodRes.json();
          setPopularFood(foodItems.slice(0, 4));
        }

        if (promotionsRes.ok) {
          const promotions: Promotion[] = await promotionsRes.json();
          setCurrentPromotions(promotions.slice(0, 3));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error loading data:", error);
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  const serif = { fontFamily: "var(--font-editorial)" } as CSSProperties;
  const pageTheme = {
    "--page-bg": "#f6eee2",
    "--page-surface": "rgba(255, 250, 243, 0.78)",
    "--page-ink": "#17352b",
    "--page-accent": "#d67a10",
    "--page-line": "rgba(23, 53, 43, 0.12)",
  } as CSSProperties;

  const copy = isSpanish
    ? {
        heroEyebrow: "Mercado latino, cocina y ayuda diaria",
        heroCaption: "La parada del vecindario en Fort Pierce",
        heroLineAccent: "sabor fresco,",
        heroLineTail: "todo en un solo lugar.",
        openNow: "Abierto hoy",
        trustNote: "Diseñado para compras rápidas, almuerzos y vueltas del día.",
        heroMediaTitle: "Un mercado vivo desde el cafecito de la mañana hasta la última parada del día.",
        heroMediaBody:
          "Entra por despensa, comida lista o servicios esenciales. Todo está organizado para sentirse rápido, cálido y local.",
        ratingNote: "Favorito de la comunidad",
        todayAtStore: "Rutas rápidas de hoy",
        productsDesc: "Favoritos de despensa y esenciales del día.",
        foodDesc: "Comida caliente, antojos y cocina lista para llevar.",
        servicesDesc: "Remesas, pagos, recargas y más en un solo mostrador.",
        promotionsEyebrow: "Ofertas por tiempo limitado",
        promotionsIntro: "Descuentos y especiales que vale la pena aprovechar esta semana.",
        promotionsFallbackTitle: "Aquí viven las mejores ofertas de la semana.",
        promotionsFallbackBody:
          "Este espacio ahora está listo para destacar combos de cocina, descuentos de despensa y promociones de temporada sin saturar la página.",
        promotionsSecondaryOneTitle: "Combos de temporada",
        promotionsSecondaryOneBody:
          "Empuja promociones de productos, hogar o cocina con mejor jerarquía visual.",
        promotionsSecondaryTwoTitle: "Especiales de cocina",
        promotionsSecondaryTwoBody:
          "Úsalo para almuerzos, combos o favoritos del fin de semana.",
        marketEyebrow: "Curado a través de toda la tienda",
        marketTitle: "Compra despensa y cocina en el mismo recorrido.",
        marketBody:
          "La nueva composición separa descubrimiento y rapidez: en móvil se escanea fácil, en escritorio se siente como una vitrina editorial.",
        foodPanelTitle: "Comida popular",
        browseAll: "Ver todo",
        fullMenu: "Ver menú",
        servicesEyebrow: "Servicios de todos los días",
        servicesIntro: "Ayuda rápida para las gestiones que realmente traen gente a la tienda.",
        servicesBody:
          "Toca una tarjeta para ver socios. Así se mantiene compacto en móvil y sigue viéndose premium en escritorio.",
        walkInHelp: "Pasa por la tienda y te ayudamos en caja.",
        sameDayHelp: "Ayuda el mismo día",
        partnersLabel: "socios",
        communityEyebrow: "Hecho para el vecindario",
        communityQuote: "Una tienda de barrio debe sentirse útil antes de sentirse llamativa.",
        communityQuoteBy: "Pensada para la vida diaria en Fort Pierce.",
        whatsappEyebrow: "Pedidos, preguntas y ayuda rápida",
        whatsappExtra:
          "Escríbenos para preguntar por productos, promociones o disponibilidad de servicios antes de llegar.",
        fastReplies: "Respuestas rápidas en horario de tienda",
        shareList: "Envía tu lista o una pregunta corta",
        visitEyebrow: "Visita la tienda",
        visitTitle: "Fácil de encontrar, simple para entrar y salir.",
        visitBody:
          "Ya sea para almuerzo o una vuelta rápida, la experiencia ahora se presenta más clara para orientar al visitante desde el primer scroll.",
        directions: "Cómo llegar",
        planVisit: "Planear visita",
        socialDescription: "Mantente al día con llegadas, ofertas y novedades de la comunidad.",
        visitUsLabel: "Visítanos",
        callUsLabel: "Llámanos",
        hoursLabel: "Horario",
        featuredStatLabel: "selecciones destacadas",
        kitchenStatLabel: "platos en tendencia",
        promoStatLabel: "promociones activas",
        activeNow: "Activas ahora",
        seePromotions: "Ver promociones",
        cornerStoreLabel: "Mercado\nde barrio.",
        kitchenLabel: "Cocina",
        responseLabel: "Respuesta",
        socialLabel: "Redes",
      }
    : {
        heroEyebrow: "Latin market, kitchen, and everyday help",
        heroCaption: "Fort Pierce's neighborhood stop",
        heroLineAccent: "fresh flavor,",
        heroLineTail: "daily essentials.",
        openNow: "Open today",
        trustNote: "Designed for grocery runs, lunch breaks, and quick errands.",
        heroMediaTitle: "A market floor that feels alive from morning cafecito to evening pick-ups.",
        heroMediaBody:
          "Walk in for pantry staples, hot food, or the service counter. Everything is arranged to feel fast, warm, and local.",
        ratingNote: "Top-rated by the local community",
        todayAtStore: "Today's quick routes",
        productsDesc: "Shelf favorites and pantry essentials.",
        foodDesc: "Hot dishes, snacks, and ready-to-go kitchen favorites.",
        servicesDesc: "Remittances, bill pay, top-ups, and more in one stop.",
        promotionsEyebrow: "Limited-time offers",
        promotionsIntro: "Deals and specials worth grabbing before they disappear.",
        promotionsFallbackTitle: "This is where the week's strongest offers should live.",
        promotionsFallbackBody:
          "The new spotlight is ready for kitchen combos, pantry discounts, and seasonal promotions without overcrowding the page.",
        promotionsSecondaryOneTitle: "Seasonal bundles",
        promotionsSecondaryOneBody:
          "Feature grocery, household, or pantry promotions with stronger hierarchy.",
        promotionsSecondaryTwoTitle: "Kitchen specials",
        promotionsSecondaryTwoBody:
          "Use this slot for lunch specials, combo meals, or weekend favorites.",
        marketEyebrow: "Curated across the store",
        marketTitle: "Shop the shelves and the kitchen in one flow.",
        marketBody:
          "The layout now separates discovery from speed: mobile visitors can scan quickly while desktop visitors get a richer storefront.",
        foodPanelTitle: "Popular food",
        browseAll: "Browse all",
        fullMenu: "Full menu",
        servicesEyebrow: "Everyday services",
        servicesIntro: "Fast help for the tasks people actually stop in for.",
        servicesBody:
          "Tap a card to reveal partner brands. It keeps the section compact on mobile and more tactile on desktop.",
        walkInHelp: "Walk in and we'll help at the counter.",
        sameDayHelp: "Same-day help",
        partnersLabel: "partners",
        communityEyebrow: "Built around the neighborhood",
        communityQuote: "A neighborhood store should feel useful before it feels flashy.",
        communityQuoteBy: "Designed for daily life in Fort Pierce.",
        whatsappEyebrow: "Orders, questions, and quick help",
        whatsappExtra:
          "Send a quick message to ask about products, promotions, or service availability before you stop by.",
        fastReplies: "Fast replies during store hours",
        shareList: "Send a shopping list or quick question",
        visitEyebrow: "Visit the store",
        visitTitle: "Easy to find, simple to stop by.",
        visitBody:
          "Whether you're picking up lunch or handling errands, the page now guides people into the store experience faster.",
        directions: "Get directions",
        planVisit: "Plan your visit",
        socialDescription: "Stay connected for arrivals, offers, and community updates.",
        visitUsLabel: "Visit us",
        callUsLabel: "Call us",
        hoursLabel: "Hours",
        featuredStatLabel: "featured picks",
        kitchenStatLabel: "trending dishes",
        promoStatLabel: "live promotions",
        activeNow: "Active now",
        seePromotions: "See promotions",
        cornerStoreLabel: "Fort Pierce\ncorner store.",
        kitchenLabel: "Kitchen",
        responseLabel: "Response",
        socialLabel: "Social",
      };

  const spotlightPromotion = currentPromotions[0];
  const secondaryPromotions = currentPromotions.slice(1);

  const heroStats = [
    {
      value: featuredProducts.length > 0 ? `${featuredProducts.length}+` : "04",
      label: copy.featuredStatLabel,
    },
    {
      value: popularFood.length > 0 ? `${popularFood.length}+` : "04",
      label: copy.kitchenStatLabel,
    },
    {
      value: currentPromotions.length > 0 ? `${currentPromotions.length}` : "03",
      label: copy.promoStatLabel,
    },
  ];

  const contactItems = [
    {
      icon: MapPin,
      label: copy.visitUsLabel,
      value: "1508 Delaware Ave",
    },
    {
      icon: Phone,
      label: copy.callUsLabel,
      value: "(772) 461-1234",
    },
    {
      icon: Clock,
      label: copy.hoursLabel,
      value: "7AM - 9PM",
    },
  ];

  const quickLinks = [
    {
      href: "/productos",
      icon: ShoppingBag,
      title: t("home.featured_products"),
      description: copy.productsDesc,
      surfaceClass: "from-white to-[#fff7ed]",
      iconClass: "bg-[#f5ddbb] text-[#b86518]",
    },
    {
      href: "/comida",
      icon: UtensilsCrossed,
      title: copy.foodPanelTitle,
      description: copy.foodDesc,
      surfaceClass: "from-white to-[#f5ece1]",
      iconClass: "bg-[#efceb6] text-[#a85534]",
    },
    {
      href: "/servicios",
      icon: CreditCard,
      title: t("home.our_services"),
      description: copy.servicesDesc,
      surfaceClass: "from-white to-[#edf1ec]",
      iconClass: "bg-[#dfe9e0] text-[#20543e]",
    },
  ];

  return (
    <div
      className={`${editorial.variable} ${bodyFont.variable} relative min-h-screen overflow-hidden bg-[#f6eee2] text-[#17352b]`}
      style={{
        ...pageTheme,
        fontFamily: "var(--font-manrope)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,122,16,0.18),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(23,53,43,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "220px",
        }}
      />

      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8 lg:px-10 lg:pb-18 lg:pt-10">
        <div className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#17352b]/10 bg-[rgba(255,250,243,0.8)] p-6 shadow-[0_24px_80px_rgba(23,53,43,0.1)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d67a10]/70 to-transparent" />

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-[#17352b]/10 bg-white/85 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#17352b] shadow-sm">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-[#d67a10]" />
                {copy.heroEyebrow}
              </Badge>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d67a10]/20 bg-[#fff2df] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b86518]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d67a10]" />
                {copy.openNow}
              </span>
            </div>

            <div className="mt-10 max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#17352b]/45">
                {copy.heroCaption}
              </p>
              <h1
                className="text-[clamp(3.8rem,10vw,8rem)] font-semibold leading-[0.86] tracking-tight text-[#17352b]"
                style={serif}
              >
                <span className="block">La Placita</span>
                <span className="block italic text-[#d67a10]">{copy.heroLineAccent}</span>
                <span className="block text-[0.46em] leading-[0.95] text-[#17352b]/45">
                  {copy.heroLineTail}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#17352b]/68 sm:text-lg">
                {t("home.subtitle")}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17352b] px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#204735]"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("home.view_products")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17352b]/12 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#17352b] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                <CreditCard className="h-4 w-4 text-[#d67a10]" />
                {t("home.our_services")}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {contactItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-[1.4rem] border border-[#17352b]/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(23,53,43,0.05)]"
                >
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/40">
                    <Icon className="h-3.5 w-3.5 text-[#d67a10]" />
                    {label}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#17352b]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3 rounded-[1.8rem] border border-[#17352b]/10 bg-[#fff9f2] p-4 sm:grid-cols-3 sm:p-5">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.3rem] bg-white/70 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/38">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#17352b]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#17352b]/10 bg-[#17352b] p-3 shadow-[0_28px_90px_rgba(23,53,43,0.18)] lg:min-h-[720px]">
            <div className="relative h-full min-h-[500px] overflow-hidden rounded-[1.7rem] lg:min-h-[694px]">
              <ImageSlideshow slides={storeImages} />
              <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(10,18,15,0.12),rgba(10,18,15,0.52)_52%,rgba(10,18,15,0.88)_100%)]" />
              <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_10%_18%,rgba(255,245,228,0.28),transparent_24%),radial-gradient(circle_at_85%_24%,rgba(214,122,16,0.22),transparent_22%)]" />

              <div className="absolute left-5 right-5 top-5 z-30 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xs rounded-[1.7rem] border border-white/12 bg-black/20 p-4 backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                    {copy.trustNote}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-3xl leading-none text-white sm:text-[2.55rem]" style={serif}>
                    {copy.cornerStoreLabel}
                  </p>
                </div>

                <div className="w-fit rounded-[1.4rem] border border-white/12 bg-white/92 p-4 text-[#17352b] shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[#d67a10]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-xl font-bold">4.9 / 5</p>
                  <p className="text-xs text-[#17352b]/55">{copy.ratingNote}</p>
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-5 z-30 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[1.8rem] border border-white/12 bg-black/32 p-5 text-white backdrop-blur-md sm:p-6">
                  <Badge className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                    {copy.heroCaption}
                  </Badge>
                  <h2 className="mt-4 text-3xl leading-none sm:text-[2.6rem]" style={serif}>
                    {copy.heroMediaTitle}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/72 sm:text-[15px]">
                    {copy.heroMediaBody}
                  </p>
                  <Link
                    href="/promociones"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d4a2] transition-colors hover:text-white"
                  >
                    {copy.seePromotions}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-[1.8rem] border border-[#f5d4a2]/35 bg-[rgba(252,240,218,0.94)] p-5 text-[#17352b] backdrop-blur-md sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/48">
                    {copy.todayAtStore}
                  </p>
                  <div className="mt-5 space-y-3">
                    {[
                      {
                        href: "/productos",
                        icon: Store,
                        title: t("home.featured_products"),
                      },
                      {
                        href: "/comida",
                        icon: UtensilsCrossed,
                        title: copy.foodPanelTitle,
                      },
                      {
                        href: "/servicios",
                        icon: CreditCard,
                        title: t("home.our_services"),
                      },
                    ].map(({ href, icon: Icon, title }) => (
                      <Link
                        key={title}
                        href={href}
                        className="group flex items-center justify-between rounded-[1.25rem] border border-[#17352b]/10 bg-white/72 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-[#fff0d8] p-2 text-[#b86518]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#17352b]">{title}</span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#17352b]/35 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map(({ href, icon: Icon, title, description, surfaceClass, iconClass }) => (
            <Link
              key={title}
              href={href}
              className={`group rounded-[1.8rem] border border-[#17352b]/10 bg-gradient-to-br ${surfaceClass} p-5 shadow-[0_18px_45px_rgba(23,53,43,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(23,53,43,0.12)] sm:p-6`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`rounded-[1.15rem] p-3 ${iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#17352b]/32 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h2 className="mt-5 text-[2.1rem] leading-none text-[#17352b]" style={serif}>
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#17352b]/62">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b86518]">
              {copy.promotionsEyebrow}
            </p>
            <h2 className="mt-3 text-4xl leading-none text-[#17352b] sm:text-5xl" style={serif}>
              {t("home.current_promotions")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#17352b]/62 sm:text-base">
              {copy.promotionsIntro}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#17352b]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#17352b]/55">
            <span className="h-2 w-2 rounded-full bg-[#d67a10]" />
            {copy.activeNow}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#17352b]/10 bg-[#17352b] p-3 shadow-[0_32px_90px_rgba(23,53,43,0.18)]">
            {spotlightPromotion ? (
              <div className="relative min-h-[360px] overflow-hidden rounded-[1.8rem] sm:min-h-[460px]">
                {spotlightPromotion.image_url ? (
                  <Image
                    src={spotlightPromotion.image_url}
                    alt={
                      isSpanish ? spotlightPromotion.title_es : spotlightPromotion.title_en
                    }
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#325041,#17352b)]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,23,19,0.04),rgba(13,23,19,0.86)_78%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(245,212,162,0.22),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(214,122,16,0.24),transparent_28%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <Badge className="rounded-full border border-[#f5d4a2]/30 bg-[#f5d4a2]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f5d4a2]">
                    <BadgePercent className="mr-2 h-3.5 w-3.5" />
                    {copy.promotionsEyebrow}
                  </Badge>
                  <h3 className="mt-4 max-w-xl text-4xl leading-none text-white sm:text-5xl" style={serif}>
                    {isSpanish ? spotlightPromotion.title_es : spotlightPromotion.title_en}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                    {isSpanish
                      ? spotlightPromotion.description_es
                      : spotlightPromotion.description_en}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,#2e4a3d,#17352b)] p-8 text-white sm:p-10">
                <Badge className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                  <BadgePercent className="mr-2 h-3.5 w-3.5 text-[#f5d4a2]" />
                  {copy.promotionsEyebrow}
                </Badge>
                <h3 className="mt-6 text-4xl leading-none sm:text-5xl" style={serif}>
                  {copy.promotionsFallbackTitle}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                  {copy.promotionsFallbackBody}
                </p>
                <Link
                  href="/promociones"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d4a2] transition-colors hover:text-white"
                >
                  {copy.seePromotions}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {(secondaryPromotions.length > 0
              ? secondaryPromotions.map((promotion) => ({
                  key: promotion._id,
                  title: isSpanish ? promotion.title_es : promotion.title_en,
                  body: isSpanish ? promotion.description_es : promotion.description_en,
                  imageUrl: promotion.image_url,
                }))
              : [
                  {
                    key: "seasonal",
                    title: copy.promotionsSecondaryOneTitle,
                    body: copy.promotionsSecondaryOneBody,
                    imageUrl: undefined,
                  },
                  {
                    key: "kitchen",
                    title: copy.promotionsSecondaryTwoTitle,
                    body: copy.promotionsSecondaryTwoBody,
                    imageUrl: undefined,
                  },
                ]).map((item, index) => (
              <div
                key={item.key}
                className="relative overflow-hidden rounded-[1.8rem] border border-[#17352b]/10 bg-white/72 p-5 shadow-[0_16px_45px_rgba(23,53,43,0.06)] backdrop-blur-sm sm:p-6"
              >
                {item.imageUrl && (
                  <div className="absolute inset-0 opacity-12">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b86518]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-[2rem] leading-none text-[#17352b]" style={serif}>
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#17352b]/62">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-18">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[rgba(255,250,243,0.84)] p-6 shadow-[0_22px_70px_rgba(23,53,43,0.08)] backdrop-blur-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b86518]">
              {copy.marketEyebrow}
            </p>
            <h2 className="mt-3 text-4xl leading-none text-[#17352b] sm:text-5xl" style={serif}>
              {copy.marketTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#17352b]/62 sm:text-base">
              {copy.marketBody}
            </p>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/42">
                  {t("home.featured_products")}
                </p>
              </div>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#17352b] transition-colors hover:text-[#b86518]"
              >
                {copy.browseAll}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {featuredProducts.length > 0
                ? featuredProducts.map((product) => (
                    <Link
                      key={product._id}
                      href="/productos"
                      className="group overflow-hidden rounded-[1.6rem] border border-[#17352b]/10 bg-white shadow-[0_18px_45px_rgba(23,53,43,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(23,53,43,0.12)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={isSpanish ? product.name_es : product.name_en}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#17352b]/38">
                          {t("home.featured_products")}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#17352b]">
                          {isSpanish ? product.name_es : product.name_en}
                        </h3>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-base font-bold text-[#b86518]">
                            {formatPrice(product.price)}
                          </span>
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff2df] text-[#b86518] transition-colors duration-200 group-hover:bg-[#17352b] group-hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[1.6rem] border border-[#17352b]/10 bg-white/75"
                    >
                      <div className="aspect-[4/3] animate-pulse bg-[#efe3d2]" />
                      <div className="space-y-3 p-4">
                        <div className="h-3 w-1/3 rounded-full bg-[#efe3d2]" />
                        <div className="h-5 w-3/4 rounded-full bg-[#f4eadc]" />
                        <div className="h-5 w-1/4 rounded-full bg-[#efe3d2]" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[#ead8c3] p-6 shadow-[0_24px_75px_rgba(23,53,43,0.08)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a85534]">
                  {t("food.title")}
                </p>
                <h2 className="mt-3 text-4xl leading-none text-[#17352b] sm:text-5xl" style={serif}>
                  {copy.foodPanelTitle}
                </h2>
              </div>
              <Link
                href="/comida"
                className="hidden items-center gap-2 text-sm font-semibold text-[#17352b] transition-colors hover:text-[#a85534] sm:inline-flex"
              >
                {copy.fullMenu}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {popularFood.length > 0
                ? popularFood.map((product) => (
                    <Link
                      key={product._id}
                      href="/comida"
                      className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-[1.6rem] border border-[#17352b]/10 bg-white/76 shadow-[0_16px_45px_rgba(23,53,43,0.06)] transition-all duration-200 hover:-translate-y-1 hover:bg-white"
                    >
                      <div className="relative min-h-[128px] overflow-hidden bg-[#e8c9b1]">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={isSpanish ? product.name_es : product.name_en}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-between p-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/36">
                            {copy.kitchenLabel}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#17352b]">
                            {isSpanish ? product.name_es : product.name_en}
                          </h3>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-base font-bold text-[#a85534]">
                            {formatPrice(product.price)}
                          </span>
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e4d8] text-[#a85534] transition-all duration-200 group-hover:bg-[#a85534] group-hover:text-white">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[112px_1fr] overflow-hidden rounded-[1.6rem] border border-[#17352b]/10 bg-white/65"
                    >
                      <div className="min-h-[128px] animate-pulse bg-[#e8c9b1]" />
                      <div className="space-y-3 p-4">
                        <div className="h-3 w-1/4 rounded-full bg-[#ead8c3]" />
                        <div className="h-5 w-3/4 rounded-full bg-[#f4eadc]" />
                        <div className="h-5 w-1/4 rounded-full bg-[#ead8c3]" />
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-6 rounded-[1.8rem] bg-[#17352b] p-6 text-white shadow-[0_18px_45px_rgba(23,53,43,0.16)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                {copy.foodPanelTitle}
              </p>
              <h3 className="mt-3 text-3xl leading-none text-white" style={serif}>
                {copy.foodDesc}
              </h3>
              <Link
                href="/comida"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d4a2] transition-colors hover:text-white"
              >
                {copy.fullMenu}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[#17352b] p-6 text-white shadow-[0_26px_75px_rgba(23,53,43,0.18)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f5d4a2]">
              {copy.servicesEyebrow}
            </p>
            <h2 className="mt-3 text-4xl leading-none text-white sm:text-5xl" style={serif}>
              {t("home.our_services")}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/72 sm:text-base">
              {copy.servicesIntro}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.servicesBody}</p>

            <div className="mt-8 space-y-3">
              {[
                t("services.money_transfers"),
                t("services.bill_payments"),
                t("services.mobile_topups"),
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-[#d67a10]" />
                  <span className="text-sm text-white/82">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              const isActive = activeService === index;

              return (
                <button
                  key={service.number}
                  type="button"
                  onClick={() =>
                    setActiveService((current) => (current === index ? null : index))
                  }
                  className="text-left"
                >
                  <div
                    className={`h-full rounded-[1.8rem] border p-5 transition-all duration-200 sm:p-6 ${
                      isActive
                        ? "-translate-y-1 border-transparent bg-white shadow-[0_22px_60px_rgba(23,53,43,0.14)]"
                        : "border-[#17352b]/10 bg-white/68 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(23,53,43,0.08)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#17352b]/36">
                        {service.number}
                      </span>
                      <div
                        className={`rounded-[1.1rem] p-3 ${service.accentClass} ${service.iconSurfaceClass}`}
                      >
                        <ServiceIcon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-[2rem] leading-none text-[#17352b]" style={serif}>
                      {t(service.titleKey)}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#17352b]/62">
                      {t(service.descriptionKey)}
                    </p>

                    <div
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ${
                        isActive ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        {service.partners.length > 0 ? (
                          <div className="rounded-[1.3rem] border border-[#17352b]/10 bg-[#fbf5ec] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/38">
                              {service.partners.length} {copy.partnersLabel}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4">
                              {service.partners.map((partner) => (
                                <div
                                  key={partner.name}
                                  className="relative h-7 w-18 opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
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
                        ) : (
                          <div className="rounded-[1.3rem] border border-[#17352b]/10 bg-[#fbf5ec] p-4">
                            <p className="text-sm leading-7 text-[#17352b]/62">{copy.walkInHelp}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#17352b]/38">
                        {service.partners.length > 0
                          ? `${service.partners.length} ${copy.partnersLabel}`
                          : copy.sameDayHelp}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 text-[#17352b]/35 transition-transform duration-200 ${
                          isActive ? "rotate-90 text-[#d67a10]" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[rgba(255,250,243,0.84)] p-6 shadow-[0_20px_60px_rgba(23,53,43,0.08)] backdrop-blur-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b86518]">
              {copy.communityEyebrow}
            </p>
            <h2 className="mt-3 text-4xl leading-none text-[#17352b] sm:text-5xl" style={serif}>
              {t("home.history_title")}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#17352b]/65">{t("home.about_snippet")}</p>

            <div className="mt-8 rounded-[1.8rem] border border-[#17352b]/10 bg-white/72 p-5">
              <p className="text-3xl leading-none text-[#17352b]" style={serif}>
                "{copy.communityQuote}"
              </p>
              <p className="mt-4 text-sm leading-7 text-[#17352b]/58">{copy.communityQuoteBy}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-[#17352b]/10 bg-white/72 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/38">
                  {copy.visitUsLabel}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#17352b]">
                  1508 Delaware Ave
                  <br />
                  Fort Pierce, FL 34950
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-[#17352b]/10 bg-white/72 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#17352b]/38">
                  {copy.hoursLabel}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#17352b]">7AM - 9PM Daily</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#d67a10,#b86518)] p-6 text-white shadow-[0_30px_90px_rgba(184,101,24,0.28)] sm:p-8">
            <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-14 bottom-4 h-36 w-36 rounded-full bg-[#17352b]/15 blur-2xl" />
            <div className="relative">
              <Badge className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                <MessageCircle className="mr-2 h-3.5 w-3.5" />
                {copy.whatsappEyebrow}
              </Badge>
              <h2 className="mt-5 text-4xl leading-none sm:text-5xl" style={serif}>
                {t("whatsapp.title")}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {t("whatsapp.subtitle")}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">{copy.whatsappExtra}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="https://wa.me/7722421416"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17352b] px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#204735]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("whatsapp.button")}
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/14"
                >
                  {copy.planVisit}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/14 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/62">
                    WhatsApp
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/85">{t("whatsapp.format")}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/14 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/62">
                    {copy.responseLabel}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/85">
                    {copy.fastReplies}
                    <br />
                    {copy.shareList}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#17352b]/10 bg-[#17352b] p-3 shadow-[0_28px_85px_rgba(23,53,43,0.18)]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.8rem] sm:min-h-[520px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.816216717518!2d-80.3419831237173!3d27.443837776334753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88def194f69636f3%3A0x3b810b158ab0f8dc!2sLa%20Placita%20FTP!5e0!3m2!1sen!2sus!4v1749439130255!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full grayscale contrast-110 brightness-90 transition-all duration-700 hover:grayscale-0 hover:brightness-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,23,19,0.06),rgba(13,23,19,0.22)_55%,rgba(13,23,19,0.55)_100%)]" />
              <div className="absolute left-5 top-5 max-w-[240px] rounded-[1.6rem] border border-white/12 bg-[#17352b]/92 p-5 text-white shadow-xl backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                  {copy.visitEyebrow}
                </p>
                <h2 className="mt-3 text-3xl leading-none text-white" style={serif}>
                  La Placita FTP
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">1508 Delaware Ave, Fort Pierce, FL 34950</p>
                <a
                  href="https://www.google.com/maps/dir//La+Placita+FTP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#f5d4a2] transition-colors hover:text-white"
                >
                  {copy.directions}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="absolute bottom-5 right-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/12 bg-white/92 px-4 py-3 text-[#17352b] shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/40">
                    <Phone className="h-3.5 w-3.5 text-[#d67a10]" />
                    {copy.callUsLabel}
                  </div>
                  <p className="mt-2 text-sm font-semibold">(772) 461-1234</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/12 bg-white/92 px-4 py-3 text-[#17352b] shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/40">
                    <Clock className="h-3.5 w-3.5 text-[#d67a10]" />
                    {copy.hoursLabel}
                  </div>
                  <p className="mt-2 text-sm font-semibold">7AM - 9PM Daily</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[rgba(255,250,243,0.84)] p-6 shadow-[0_18px_55px_rgba(23,53,43,0.08)] backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b86518]">
                {copy.visitEyebrow}
              </p>
              <h2 className="mt-3 text-4xl leading-none text-[#17352b] sm:text-5xl" style={serif}>
                {copy.visitTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#17352b]/62 sm:text-base">{copy.visitBody}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[#17352b]/10 bg-white/72 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/42">
                    <MapPin className="h-3.5 w-3.5 text-[#d67a10]" />
                    {copy.visitUsLabel}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#17352b]">
                    1508 Delaware Ave
                    <br />
                    Fort Pierce, FL 34950
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-[#17352b]/10 bg-white/72 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#17352b]/42">
                    <Phone className="h-3.5 w-3.5 text-[#d67a10]" />
                    {copy.callUsLabel}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#17352b]">(772) 461-1234</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#17352b]/10 bg-[#17352b] p-4 text-white shadow-[0_26px_75px_rgba(23,53,43,0.18)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] bg-[#1877f2] p-3 text-white">
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
                    {copy.socialLabel}
                  </p>
                  <h2 className="mt-1 text-3xl leading-none text-white" style={serif}>
                    {t("fb")}
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/68">{copy.socialDescription}</p>
              <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/10">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61576133441458&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="100%"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
