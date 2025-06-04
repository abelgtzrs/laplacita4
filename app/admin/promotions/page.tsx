"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useLanguage } from "@/contexts/language-context"

export default function AdminPromotionsPage() {
  const { language } = useLanguage()
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      const response = await fetch("/api/admin/promotions")
      if (response.ok) {
        const data = await response.json()
        setPromotions(data)
      }
    } catch (error) {
      console.error("Error loading promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
      try {
        const response = await fetch(`/api/admin/promotions/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          loadPromotions()
        } else {
          alert("Error al eliminar la promoción")
        }
      } catch (error) {
        console.error("Error deleting promotion:", error)
        alert("Error al eliminar la promoción")
      }
    }
  }

  const isPromotionActive = (activeFrom: string, activeTo: string) => {
    const now = new Date()
    const from = new Date(activeFrom)
    const to = new Date(activeTo)
    return now >= from && now <= to
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionar Promociones</h1>
            <p className="text-gray-600 mt-1">Administra las promociones y ofertas especiales</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/promotions/add">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Promoción
            </Link>
          </Button>
        </div>

        {/* Promotions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando promociones...</p>
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion: any) => {
              const isActive = isPromotionActive(promotion.active_from, promotion.active_to)

              return (
                <Card key={promotion._id} className="overflow-hidden">
                  {promotion.image_url && (
                    <div className="aspect-video relative bg-gray-200">
                      <Image
                        src={promotion.image_url || "/placeholder.svg"}
                        alt={language === "es" ? promotion.title_es : promotion.title_en}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500" : ""}>
                          {isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {language === "es" ? promotion.title_es : promotion.title_en}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {language === "es" ? promotion.description_es : promotion.description_en}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(promotion.active_from)} - {formatDate(promotion.active_to)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/admin/promotions/edit/${promotion._id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(promotion._id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Tag className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay promociones</h3>
              <p className="text-gray-500 mb-4">Comienza creando tu primera promoción.</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/promotions/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Promoción
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
