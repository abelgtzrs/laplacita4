"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type HeroSlide = {
  _id: string;
  title?: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export default function AdminHeroSlideManager() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingSlideId, setSavingSlideId] = useState<string | null>(null);
  const [deletingSlideId, setDeletingSlideId] = useState<string | null>(null);
  const [newSlideFile, setNewSlideFile] = useState<File | null>(null);
  const [newSlidePreview, setNewSlidePreview] = useState<string | null>(null);
  const [newSlide, setNewSlide] = useState({
    title: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadHeroSlides();
  }, []);

  const loadHeroSlides = async () => {
    try {
      const response = await fetch("/api/admin/hero-slides");
      if (response.ok) {
        const data = await response.json();
        setHeroSlides(data);
        setNewSlide((prev) => ({
          ...prev,
          sort_order: data.length,
        }));
      }
    } catch (error) {
      console.error("Error loading hero slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSlideFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewSlideFile(file);
      setNewSlidePreview(URL.createObjectURL(file));
      return;
    }

    setNewSlideFile(null);
    setNewSlidePreview(null);
  };

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSlideFile) {
      alert("Selecciona una imagen para el banner principal.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", newSlide.title);
      formData.append("sort_order", String(newSlide.sort_order));
      formData.append("is_active", String(newSlide.is_active));
      formData.append("image_file", newSlideFile);

      const response = await fetch("/api/admin/hero-slides", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload hero slide");
      }

      setNewSlide({
        title: "",
        sort_order: heroSlides.length + 1,
        is_active: true,
      });
      setNewSlideFile(null);
      setNewSlidePreview(null);
      await loadHeroSlides();
    } catch (error) {
      console.error("Error creating hero slide:", error);
      alert("No se pudo guardar la imagen del banner principal.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSlide = async (slide: HeroSlide) => {
    setSavingSlideId(slide._id);

    try {
      const response = await fetch(`/api/admin/hero-slides/${slide._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: slide.title || "",
          sort_order: slide.sort_order,
          is_active: slide.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update hero slide");
      }

      await loadHeroSlides();
    } catch (error) {
      console.error("Error updating hero slide:", error);
      alert("No se pudo actualizar la configuración del banner.");
    } finally {
      setSavingSlideId(null);
    }
  };

  const handleMoveSlide = async (slideId: string, direction: -1 | 1) => {
    const currentIndex = heroSlides.findIndex((slide) => slide._id === slideId);
    const targetIndex = currentIndex + direction;

    if (currentIndex === -1 || targetIndex < 0 || targetIndex >= heroSlides.length) {
      return;
    }

    const reorderedSlides = [...heroSlides];
    const [movedSlide] = reorderedSlides.splice(currentIndex, 1);
    reorderedSlides.splice(targetIndex, 0, movedSlide);

    const normalizedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      sort_order: index,
    }));

    setHeroSlides(normalizedSlides);
    setSavingSlideId(slideId);

    try {
      await Promise.all(
        normalizedSlides.map((slide) =>
          fetch(`/api/admin/hero-slides/${slide._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sort_order: slide.sort_order,
            }),
          })
        )
      );

      await loadHeroSlides();
    } catch (error) {
      console.error("Error reordering hero slides:", error);
      alert("No se pudo reorganizar el banner principal.");
    } finally {
      setSavingSlideId(null);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("¿Eliminar esta imagen del banner principal?")) {
      return;
    }

    setDeletingSlideId(slideId);

    try {
      const response = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete hero slide");
      }

      await loadHeroSlides();
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      alert("No se pudo eliminar la imagen del banner.");
    } finally {
      setDeletingSlideId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ImagePlus className="h-6 w-6 text-green-600" />
          Banner Principal
        </CardTitle>
        <CardDescription>
          Sube, activa y ordena las imagenes que aparecen en el slideshow principal de la pagina de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreateSlide} className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 p-5">
          <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Titulo interno
                </label>
                <Input
                  value={newSlide.title}
                  onChange={(e) =>
                    setNewSlide((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ej. Frutas frescas"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Orden
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newSlide.sort_order}
                    onChange={(e) =>
                      setNewSlide((prev) => ({
                        ...prev,
                        sort_order: Number.parseInt(e.target.value || "0", 10),
                      }))
                    }
                  />
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-green-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700">
                  <Checkbox
                    checked={newSlide.is_active}
                    onCheckedChange={(checked) =>
                      setNewSlide((prev) => ({
                        ...prev,
                        is_active: Boolean(checked),
                      }))
                    }
                  />
                  Mostrar en el banner
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Imagen del slide
                </label>
                <Input type="file" accept="image/*" onChange={handleNewSlideFileChange} />
              </div>
            </div>

            <div className="rounded-xl border border-green-100 bg-white p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Vista previa</p>
              {newSlidePreview ? (
                <Image
                  src={newSlidePreview}
                  alt="Vista previa del slide"
                  width={320}
                  height={180}
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
                  Selecciona una imagen
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={uploading} className="bg-green-600 hover:bg-green-700">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Agregar al Banner
                </>
              )}
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Cargando imagenes del banner...
          </div>
        ) : heroSlides.length > 0 ? (
          <div className="space-y-4">
            {heroSlides.map((slide) => (
              <div
                key={slide._id}
                className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center"
              >
                <Image
                  src={slide.image_url}
                  alt={slide.title || "Hero slide"}
                  width={160}
                  height={96}
                  className="h-24 w-full rounded-lg object-cover md:w-40"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Titulo interno
                    </label>
                    <Input
                      value={slide.title || ""}
                      onChange={(e) =>
                        setHeroSlides((prev) =>
                          prev.map((item) =>
                            item._id === slide._id
                              ? { ...item, title: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Orden
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={slide.sort_order}
                      onChange={(e) =>
                        setHeroSlides((prev) =>
                          prev.map((item) =>
                            item._id === slide._id
                              ? {
                                  ...item,
                                  sort_order: Number.parseInt(
                                    e.target.value || "0",
                                    10
                                  ),
                                }
                              : item
                          )
                        )
                      }
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 sm:col-span-2">
                    <Checkbox
                      checked={slide.is_active}
                      onCheckedChange={(checked) =>
                        setHeroSlides((prev) =>
                          prev.map((item) =>
                            item._id === slide._id
                              ? { ...item, is_active: Boolean(checked) }
                              : item
                          )
                        )
                      }
                    />
                    Mostrar esta imagen en el hero principal
                  </label>
                </div>

                <div className="flex flex-col gap-2 md:w-36">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveSlide(slide._id, -1)}
                      disabled={savingSlideId === slide._id || deletingSlideId === slide._id}
                      className="flex-1"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveSlide(slide._id, 1)}
                      disabled={savingSlideId === slide._id || deletingSlideId === slide._id}
                      className="flex-1"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleSaveSlide(slide)}
                    disabled={savingSlideId === slide._id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {savingSlideId === slide._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeleteSlide(slide._id)}
                    disabled={deletingSlideId === slide._id}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {deletingSlideId === slide._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
            Todavia no hay imagenes configuradas para el hero principal. Sube la primera para volver a mostrar el banner.
          </div>
        )}
      </CardContent>
    </Card>
  );
}