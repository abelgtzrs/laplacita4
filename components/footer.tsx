"use client";

import Link from "next/link";
import {
  Facebook,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Printer,
  PrinterCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-r from-green-800 to-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-green-800 px-3 py-1 rounded font-bold text-lg">
                La Placita FTP
              </div>
            </div>
            <p className="text-green-100 mb-4">{t("footer.about")}</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact.title")}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-white-400 mt-0.5" />
                <div>
                  <p className="text-green-100">1508 Delaware Ave</p>
                  <p className="text-green-100">Fort Pierce, FL 34950</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-white-400" />
                <p className="text-green-100">(772) 242-1416</p>
              </div>
              <div className="flex items-center space-x-3">
                <PrinterCheck className="h-5 w-5 text-white-400" />
                <p className="text-green-100">(772) 242-1416</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-white-400" />
                <p className="text-green-100">laplacitaftp@hotmail.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-white-400 mt-0.5" />
                <div>
                  <p className="text-green-100">Mon-Sun: 5:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link
                href="/productos"
                className="block text-green-200 hover:text-white transition-colors"
              >
                {t("nav.products")}
              </Link>
              <Link
                href="/servicios"
                className="block text-green-200 hover:text-white transition-colors"
              >
                {t("nav.services")}
              </Link>
              <Link
                href="/promociones"
                className="block text-green-200 hover:text-white transition-colors"
              >
                {t("nav.promotions")}
              </Link>
              <Link
                href="/contacto"
                className="block text-green-200 hover:text-white transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-xs">
          <p className="text-green-200">
            © 2025 La Placita FTP. {t("footer.made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
