"use client";

import Link from "next/link";
import {
  Facebook,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  PrinterCheck,
  ArrowRight,
  Instagram,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-green-950 via-green-900 to-red-950 text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200 inline-block">
                La Placita FTP
              </h2>
              <p className="text-green-100/80 text-sm leading-relaxed max-w-xs">
                {t("footer.about")}
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Link href="#" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">
              {language === "es" ? "Enlaces Rápidos" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/productos", label: "nav.products" },
                { href: "/servicios", label: "nav.services" },
                { href: "/promociones", label: "nav.promotions" },
                { href: "/contacto", label: "nav.contact" },
                { href: "/comida", label: "nav.food" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-green-100/70 hover:text-white transition-colors duration-200"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">
              {t("contact.title")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <MapPin className="h-5 w-5 text-red-300" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">Visit Us</p>
                  <p className="text-green-100/70">1508 Delaware Ave</p>
                  <p className="text-green-100/70">Fort Pierce, FL 34950</p>
                </div>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <Phone className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">Call Us</p>
                  <Link
                    href="tel:7722421416"
                    className="text-green-100/70 hover:text-white transition-colors"
                  >
                    (772) 242-1416
                  </Link>
                </div>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">Email Us</p>
                  <a
                    href="mailto:laplacitaftp@hotmail.com"
                    className="text-green-100/70 hover:text-white transition-colors"
                  >
                    laplacitaftp@hotmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">
              {language === "es" ? "Horario" : "Business Hours"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-300 mt-1" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-1 border-dashed">
                    <span className="text-green-100/90">Mon - Sun</span>
                    <span className="font-semibold text-white">
                      5:00 AM - 9:00 PM
                    </span>
                  </div>
                  <p className="text-xs text-green-200/60 mt-2 italic">
                    * Holiday hours may vary
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <PrinterCheck className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-white">Fax</p>
                    <p className="text-green-100/70">(772) 242-1416</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-200/60">
          <p>
            © {new Date().getFullYear()} La Placita FTP.{" "}
            {t("footer.made_with_love")}
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
