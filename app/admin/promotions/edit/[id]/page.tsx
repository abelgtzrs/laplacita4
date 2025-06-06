"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin-layout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// CORRECTED: Remove params from the function signature
export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>(); // Get params using the hook
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    title_es: "",
    description_en: "",
    description_es: "",
    image_url: "",
    active_from: "",
    active_to: "",
  });

  useEffect(() => {
    if (!params.id) return;

    async function fetchPromotion() {
      try {
        const response = await fetch(`/api/admin/promotions/${params.id}`);
        if (response.ok) {
          const promotion = await response.json();
          setFormData({
            title_en: promotion.title_en,
            title_es: promotion.title_es,
            description_en: promotion.description_en || "",
            description_es: promotion.description_es || "",
            image_url: promotion.image_url || "",
            active_from: promotion.active_from
              ? new Date(promotion.active_from).toISOString().split("T")[0]
              : "",
            active_to: promotion.active_to
              ? new Date(promotion.active_to).toISOString().split("T")[0]
              : "",
          });
          if (promotion.image_url) {
            setImagePreview(promotion.image_url);
          }
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchPromotion();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Using FormData for potential file upload
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    if (imageFile) {
      submissionData.append("image_file", imageFile);
    }
    // API Route will handle parsing dates from string
    submissionData.set("active_from", formData.active_from);
    submissionData.set("active_to", formData.active_to);

    try {
      const response = await fetch(`/api/admin/promotions/${params.id}`, {
        method: "PUT", // Use PUT for updates
        body: submissionData,
      });

      if (response.ok) {
        router.push("/admin/promotions");
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar la promoción: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar la promoción");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/promotions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Promoción</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Promoción</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título (Inglés) *
                  </label>
                  <Input
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título (Español) *
                  </label>
                  <Input
                    name="title_es"
                    value={formData.title_es}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Inglés) *
                  </label>
                  <Textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Español) *
                  </label>
                  <Textarea
                    name="description_es"
                    value={formData.description_es}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de la Promoción
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <Image
                      src={imagePreview}
                      alt="Previsualización"
                      width={200}
                      height={112}
                      className="rounded-md border object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <Input
                    name="active_from"
                    type="date"
                    value={formData.active_from}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <Input
                    name="active_to"
                    type="date"
                    value={formData.active_to}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/promotions">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    "Actualizando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Actualizar Promoción
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
