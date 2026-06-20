"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Package,
  Tag,
  MessageSquare,
  DollarSign,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-200 border-t-green-600" />
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Breadcrumb segment
  const segments = pathname.split("/").filter(Boolean);
  const pageLabel =
    navigation.find((n) => pathname.startsWith(n.href))?.name ??
    "Panel de Administración";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } shrink-0 bg-gray-900 flex flex-col transition-all duration-300 ease-in-out sticky top-0 h-screen overflow-hidden`}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="shrink-0">
            <Image
              src="/legacy_logo.png"
              alt="La Placita"
              width={36}
              height={36}
              className="object-contain rounded-lg"
            />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">
                La Placita FTP
              </p>
              <p className="text-gray-400 text-xs truncate">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                item.current
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/40"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {isSidebarOpen && (
                <span className="truncate">{item.name}</span>
              )}
              {isSidebarOpen && item.current && (
                <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {isSidebarOpen && <span>{t("admin.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
            {/* Sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <LayoutDashboard className="h-4 w-4" />
              <span>/</span>
              <span className="font-semibold text-gray-800">{pageLabel}</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* View site link */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-700 transition"
            >
              Ver Tienda
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            {/* Avatar / user badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              {/* Logout shortcut on mobile */}
              <button
                onClick={handleLogout}
                className="sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
