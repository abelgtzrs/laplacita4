"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  // Add shadow + slight backdrop-blur when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.products"), href: "/productos" },
    { name: t("nav.food"), href: "/comida" },
    { name: t("nav.services"), href: "/servicios" },
    { name: t("nav.promotions"), href: "/promociones" },
    { name: t("nav.contact"), href: "/contacto" },
  ];

  const uberEatsUrl =
    "https://www.ubereats.com/store/la-placita-ftp-1508-delaware-avenue/sKQr3zMKWJ6f0TdQWYNWpA?diningMode=DELIVERY&sc=SEARCH_SUGGESTION";

  const toggleLanguage = () => setLanguage(language === "en" ? "es" : "en");

  return (
    <>
      {/* ═══ MAIN HEADER ════════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 border-b-4 border-red-500 transition-shadow duration-300 ${
          scrolled ? "shadow-xl backdrop-blur-sm" : "shadow-md"
        }`}
        style={{ backgroundColor: "#f7edd2" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image
                src="/legacy_logo.png"
                alt="La Placita FTP Logo"
                width={150}
                height={150}
                className="object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-150 group ${
                      active
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                  >
                    {item.name}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-red-500 transition-transform duration-200 origin-left ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ────────────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Facebook CTA – desktop */}
              <a
                href="https://www.facebook.com/profile.php?id=100057713580575"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-[#1877F2] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1464d1] active:scale-95 transition-all duration-150 shadow-md"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>

              {/* Uber Eats CTA – desktop */}
              <a
                href={uberEatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-800 active:scale-95 transition-all duration-150 shadow-md"
              >
                <span>🛵</span>
                Uber Eats
              </a>

              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-green-600 text-green-700 text-sm font-bold hover:bg-green-600 hover:text-white transition-all duration-150"
                aria-label="Toggle language"
              >
                <span className="text-base leading-none">
                  {language === "en" ? "🇺🇸" : "🇲🇽"}
                </span>
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Hamburger – mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ backgroundColor: "#fdf6e7" }}
        >
          <div className="px-4 py-4 border-t-2 border-red-100 space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    active
                      ? "text-red-600 bg-red-50 border border-red-100"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  )}
                  {item.name}
                </Link>
              );
            })}

            {/* Uber Eats – mobile */}
            <a
              href={uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-black text-white text-base font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Order on Uber Eats 🛵
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
