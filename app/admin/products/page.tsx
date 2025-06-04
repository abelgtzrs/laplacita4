"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Star, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useLanguage } from "@/contexts/language-context"

export default function AdminProductsPage() {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product: any) =>
          product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.name_es.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchTerm])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t("admin.confirm_delete"))) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          loadProducts()
        } else {
          alert("Error al eliminar el producto")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Error al eliminar el producto")
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("admin.manage_products")}</h1>
            <p className="text-gray-600 mt-1">Gestiona el inventario de productos de la tienda</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/products/add">
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.add_product")}
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-600">{filteredProducts.length} productos encontrados</div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => (
              <Card key={product._id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-200">
                  {product.image_url ? (
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={language === "es" ? product.name_es : product.name_en}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {language === "es" ? product.name_es : product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {language === "es" ? product.category_es : product.category_en}
                  </p>
                  <p className="text-xl font-bold text-green-600 mb-4">
                    ${Number.parseFloat(product.price).toFixed(2)}
                  </p>

                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href={`/admin/products/edit/${product._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Package className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay productos</h3>
              <p className="text-gray-500 mb-4">Comienza agregando tu primer producto a la tienda.</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Producto
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
