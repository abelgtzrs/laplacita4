"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
// We will no longer import directly from the database on the client-side
// import { getProducts } from "@/lib/db"

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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

  // UPDATED: Fetch products from the API endpoint
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Failed to fetch products from API");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product: any) =>
          product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.name_es.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product: any) =>
          product.category_en
            .toLowerCase()
            .includes(selectedCategory.toLowerCase()) ||
          product.category_es
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case "price_low":
        filtered.sort(
          (a: any, b: any) =>
            Number.parseFloat(a.price) - Number.parseFloat(b.price)
        );
        break;
      case "price_high":
        filtered.sort(
          (a: any, b: any) =>
            Number.parseFloat(b.price) - Number.parseFloat(a.price)
        );
        break;
      case "alphabetical":
        filtered.sort((a: any, b: any) => {
          const nameA = language === "es" ? a.name_es : a.name_en;
          const nameB = language === "es" ? b.name_es : b.name_en;
          return nameA.localeCompare(nameB);
        });
        break;
      default: // latest
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, language]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("products.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto"></div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t("products.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center text-gray-600">
              <Filter className="h-5 w-5 mr-2" />
              {filteredProducts.length} productos
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product: any) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative bg-gray-200">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={
                        language === "es" ? product.name_es : product.name_en
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Destacado
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {language === "es" ? product.name_es : product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {language === "es"
                      ? product.category_es
                      : product.category_en}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${Number.parseFloat(product.price).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No se encontraron productos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
