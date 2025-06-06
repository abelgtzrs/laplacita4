"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin-layout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define categories to be used in the dropdown
const commonCategories = [
  { es: "Carnes", en: "Meats" },
  { es: "Abarrotes", en: "Groceries" },
  { es: "Frutas y Verduras", en: "Produce" },
  { es: "Bebidas", en: "Drinks" },
  { es: "Lácteos", en: "Dairy" },
  { es: "Panadería", en: "Bakery" },
  { es: "Limpieza", en: "Cleaning" },
  { es: "Cuidado Personal", en: "Personal Care" },
];

// Remove params from the function signature
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>(); // Get params using the hook
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const [formData, setFormData] = useState({
    name_en: "",
    name_es: "",
    description_en: "",
    description_es: "",
    price: "",
    category_en: "",
    category_es: "",
    image_url: "",
    is_featured: false,
  });

  useEffect(() => {
    // No change needed here, just ensure `params.id` is available
    if (!params.id) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`);
        if (response.ok) {
          const product = await response.json();
          setFormData({
            name_en: product.name_en,
            name_es: product.name_es,
            description_en: product.description_en || "",
            description_es: product.description_es || "",
            price: product.price.toString(),
            category_en: product.category_en,
            category_es: product.category_es,
            image_url: product.image_url || "",
            is_featured: product.is_featured,
          });

          if (product.image_url) {
            setImagePreview(product.image_url);
          }

          if (!commonCategories.some((c) => c.es === product.category_es)) {
            setIsOtherCategory(true);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "other") {
      setIsOtherCategory(true);
      setFormData((prev) => ({ ...prev, category_en: "", category_es: "" }));
    } else {
      const selectedCat = commonCategories.find((c) => c.es === value);
      if (selectedCat) {
        setFormData((prev) => ({
          ...prev,
          category_es: selectedCat.es,
          category_en: selectedCat.en,
        }));
      }
      setIsOtherCategory(false);
    }
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

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, String(value));
    });
    if (imageFile) {
      submissionData.append("image_file", imageFile);
    }

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        body: submissionData,
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el producto: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el producto");
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

  // The rest of your JSX form remains the same
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre (Inglés) *
                  </label>
                  <Input
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre (Español) *
                  </label>
                  <Input
                    name="name_es"
                    value={formData.name_es}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Inglés)
                  </label>
                  <Textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Español)
                  </label>
                  <Textarea
                    name="description_es"
                    value={formData.description_es}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <Select
                    value={isOtherCategory ? "other" : formData.category_es}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCategories.map((cat) => (
                        <SelectItem key={cat.es} value={cat.es}>
                          {cat.es}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Otra...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isOtherCategory && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría Personalizada (Español) *
                      </label>
                      <Input
                        name="category_es"
                        value={formData.category_es}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría Personalizada (Inglés) *
                      </label>
                      <Input
                        name="category_en"
                        value={formData.category_en}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Previsualización actual:
                    </p>
                    <Image
                      src={imagePreview}
                      alt="Previsualización de la imagen"
                      width={128}
                      height={128}
                      className="h-32 w-auto rounded-md border object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_featured: Boolean(checked),
                    }))
                  }
                />
                <label
                  htmlFor="is_featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Producto destacado
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/products">Cancelar</Link>
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
                      Actualizar Producto
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
