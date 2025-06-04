"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, MessageSquare, AlertCircle, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useLanguage } from "@/contexts/language-context"

export default function AdminCommunicationsPage() {
  const { language } = useLanguage()
  const [communications, setCommunications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCommunications()
  }, [])

  const loadCommunications = async () => {
    try {
      const response = await fetch("/api/admin/communications")
      if (response.ok) {
        const data = await response.json()
        setCommunications(data)
      }
    } catch (error) {
      console.error("Error loading communications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta comunicación?")) {
      try {
        const response = await fetch(`/api/admin/communications/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          loadCommunications()
        } else {
          alert("Error al eliminar la comunicación")
        }
      } catch (error) {
        console.error("Error deleting communication:", error)
        alert("Error al eliminar la comunicación")
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return Megaphone
      case "alert":
        return AlertCircle
      case "promotion":
        return Plus
      default:
        return MessageSquare
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800"
      case "alert":
        return "bg-red-100 text-red-800"
      case "promotion":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionar Comunicaciones</h1>
            <p className="text-gray-600 mt-1">Administra anuncios, alertas y comunicaciones del sitio</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/communications/add">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Comunicación
            </Link>
          </Button>
        </div>

        {/* Communications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando comunicaciones...</p>
          </div>
        ) : communications.length > 0 ? (
          <div className="space-y-4">
            {communications.map((communication: any) => {
              const TypeIcon = getTypeIcon(communication.type)

              return (
                <Card key={communication._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-full ${getTypeColor(communication.type)}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {language === "es" ? communication.title_es : communication.title_en}
                            </h3>
                            <Badge className={getTypeColor(communication.type)}>{communication.type}</Badge>
                            <div
                              className={`w-3 h-3 rounded-full ${getPriorityColor(communication.priority)}`}
                              title={`Prioridad: ${communication.priority}`}
                            ></div>
                            {communication.is_active && <Badge className="bg-green-500">Activa</Badge>}
                          </div>
                          <p className="text-gray-600 mb-3">
                            {language === "es" ? communication.message_es : communication.message_en}
                          </p>
                          <p className="text-sm text-gray-500">
                            Creado: {new Date(communication.created_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/communications/edit/${communication._id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(communication._id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                <MessageSquare className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay comunicaciones</h3>
              <p className="text-gray-500 mb-4">Comienza creando tu primera comunicación.</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/communications/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Comunicación
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
