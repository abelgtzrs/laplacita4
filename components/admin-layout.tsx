"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Package, Tag, MessageSquare, DollarSign, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin/login");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const navigation = [
    {
      name: t("admin.manage_products"),
      href: "/admin/products",
      icon: Package,
      current: pathname.startsWith("/admin/products"),
    },
    {
      name: t("admin.manage_promotions"),
      href: "/admin/promotions",
      icon: Tag,
      current: pathname.startsWith("/admin/promotions"),
    },
    {
      name: "Comunicaciones",
      href: "/admin/communications",
      icon: MessageSquare,
      current: pathname.startsWith("/admin/communications"),
    },

    {
      name: "Tipo de Cambio",
      href: "/admin/exchangerate",
      icon: DollarSign,
      current: pathname.startsWith("/admin/exchangerate"),
    },
  ];
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-black px-3 py-1 rounded font-bold">
                  La Placita FTP
                </div>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                Panel de Administración
              </span>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("admin.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <nav className="bg-white shadow-md min-h-screen w-16 md:w-64 transition-all duration-300 ease-in-out shrink-0">
            <div className="p-2 md:p-4 flex flex-col h-full">
              <div className="space-y-2 flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={item.name}
                    className={`flex items-center px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-colors justify-center md:justify-start ${
                      item.current
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5 md:mr-3" />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
