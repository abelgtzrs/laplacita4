"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Truck } from "lucide-react"; // Added Truck Icon
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image"; // Import Next.js Image component

// Use a named export to match the import in layout.tsx
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

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

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-lg border-b-4 border-red-500"
      style={{ backgroundColor: "#f7edd2" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/legacy_logo.png"
              alt="La Placita FTP Logo"
              width={160} // Set explicit width
              height={160} // Set explicit height
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-red-600 bg-red-50 border-b-2 border-red-600"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Uber Eats Link */}
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link
                href={uberEatsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Truck className="mr-2 h-4 w-4" />
                Uber Eats
              </Link>
            </Button>
          </nav>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 border-green-600 text-green-600 hover:bg-green-50"
            >
              <Globe className="h-4 w-4" />
              <span className="font-semibold">{language.toUpperCase()}</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Uber Eats Link in Mobile Menu */}
            <a
              href={uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white bg-black text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center justify-center">
                <Truck className="mr-2 h-4 w-4" />
                Uber Eats
              </div>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
