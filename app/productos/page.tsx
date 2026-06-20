"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingBasket,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

// ─── Category metadata ────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  all: { emoji: "🛒", color: "bg-gray-800 text-white" },
  Carnes: { emoji: "🥩", color: "bg-red-600 text-white" },
  Abarrotes: { emoji: "🧴", color: "bg-amber-600 text-white" },
  "Frutas y Verduras": { emoji: "🥦", color: "bg-green-600 text-white" },
  Bebidas: { emoji: "🧃", color: "bg-blue-500 text-white" },
  Lácteos: { emoji: "🥛", color: "bg-sky-400 text-white" },
  Panadería: { emoji: "🍞", color: "bg-yellow-600 text-white" },
};

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: t("products.all_categories") },
    { value: "Carnes", label: t("category.meats") },
    { value: "Abarrotes", label: t("category.groceries") },
    { value: "Frutas y Verduras", label: t("category.produce") },
    { value: "Bebidas", label: t("category.drinks") },
    { value: "Lácteos", label: t("category.dairy") },
    { value: "Panadería", label: t("category.bakery") },
  ];

  const sortOptions = [
    { value: "latest", label: t("products.sort.latest") },
    { value: "price_low", label: t("products.sort.price_low") },
    { value: "price_high", label: t("products.sort.price_high") },
    { value: "alphabetical", label: t("products.sort.alphabetical") },
  ];

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/products");
        if (response.ok) {
          const allProducts = await response.json();
          const nonFood = allProducts.filter(
            (p: any) => p.category_es !== "Comida" && p.category_en !== "Food",
          );
          setProducts(nonFood);
          setFilteredProducts(nonFood);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // ── Filter & sort ────────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_es.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      const cat = selectedCategory.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.category_en.toLowerCase().includes(cat) ||
          p.category_es.toLowerCase().includes(cat),
      );
    }

    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "alphabetical":
        filtered.sort((a, b) => {
          const na = language === "es" ? a.name_es : a.name_en;
          const nb = language === "es" ? b.name_es : b.name_en;
          return na.localeCompare(nb);
        });
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, language]);

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
        {/* Hero skeleton */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-red-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="h-10 w-72 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-5 w-96 bg-white/15 rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-red-600">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
            <ShoppingBasket className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              {products.length}{" "}
              {language === "es"
                ? "productos disponibles"
                : "products available"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t("products.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {language === "es"
              ? "Encuentra los mejores productos hispanos a los mejores precios."
              : "Find the best Hispanic products at the best prices."}
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
              className="fill-green-50"
            />
          </svg>
        </div>
      </section>

      {/* ═══ FILTERS ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-5">
          {/* Row 1 — search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Input
                type="text"
                placeholder={t("products.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-green-400"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 sm:w-56">
              <SlidersHorizontal className="h-5 w-5 text-gray-400 shrink-0" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 — category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat.value] ?? {
                emoji: "📦",
                color: "bg-gray-700 text-white",
              };
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    active
                      ? `${meta.color} border-transparent shadow-md scale-105`
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  <span>{meta.emoji}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Row 3 — result count */}
          <p className="text-sm text-gray-500">
            {filteredProducts.length === products.length
              ? language === "es"
                ? `Mostrando ${products.length} productos`
                : `Showing all ${products.length} products`
              : language === "es"
                ? `${filteredProducts.length} de ${products.length} productos`
                : `${filteredProducts.length} of ${products.length} products`}
          </p>
        </div>
      </section>

      {/* ═══ GRID ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => {
              const name =
                language === "es" ? product.name_es : product.name_en;
              const category =
                language === "es" ? product.category_es : product.category_en;
              const description =
                language === "es"
                  ? product.description_es
                  : product.description_en;
              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBasket className="h-14 w-14 text-gray-300" />
                      </div>
                    )}

                    {/* Featured badge */}
                    {product.is_featured && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold shadow">
                        <Star className="h-3 w-3 fill-amber-900" />
                        {language === "es" ? "Destacado" : "Featured"}
                      </div>
                    )}

                    {/* Category chip (top-right) */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                        {(CATEGORY_META[product.category_es]?.emoji ?? "📦") +
                          " " +
                          category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-1">
                      {name}
                    </h3>

                    {description && (
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed flex-1">
                        {description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-2xl font-extrabold text-green-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs border-green-200 text-green-700 bg-green-50"
                      >
                        {language === "es" ? "En stock" : "In stock"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBasket className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "es"
                ? "No se encontraron productos"
                : "No products found"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              {language === "es"
                ? "Intenta ajustar el filtro o la búsqueda."
                : "Try adjusting your filter or search term."}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            >
              {language === "es" ? "Ver todos" : "View all"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
