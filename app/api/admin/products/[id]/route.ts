import { NextResponse, type NextRequest } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  type Product,
} from "@/lib/mongodb";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    // Make sure the response is serializable
    const serializableProduct = {
      ...product,
      _id: product._id?.toString(),
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };
    return NextResponse.json(serializableProduct);
  } catch (error) {
    console.error(`Failed to fetch product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch product", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.formData();

    // --- Data Validation ---
    const name_en = data.get("name_en") as string;
    const name_es = data.get("name_es") as string;
    const priceStr = data.get("price") as string;
    const category_en = data.get("category_en") as string;
    const category_es = data.get("category_es") as string;

    if (!name_en || !name_es || !priceStr || !category_en || !category_es) {
      return NextResponse.json(
        { message: "Campos requeridos (nombre, precio, categoría) faltan." },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Precio inválido. El precio debe ser un número." },
        { status: 400 }
      );
    }

    const imageFile = data.get("image_file") as File | null;
    let imageUrl = data.get("image_url") as string;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;

      const oldImageUrl = data.get("image_url") as string;
      if (oldImageUrl && oldImageUrl.startsWith("/uploads/")) {
        try {
          await unlink(path.join(process.cwd(), "public", oldImageUrl));
        } catch (e) {
          console.error("Failed to delete old image:", e);
        }
      }
    }

    const updateData: Partial<Product> = {
      name_en: name_en,
      name_es: name_es,
      description_en: data.get("description_en") as string,
      description_es: data.get("description_es") as string,
      price: price,
      category_en: category_en,
      category_es: category_es,
      is_featured: (data.get("is_featured") as string) === "true",
      image_url: imageUrl,
    };

    const updatedProduct = await updateProduct(params.id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Producto no encontrado o fallo al actualizar" },
        { status: 404 }
      );
    }

    const serializableProduct = {
      ...updatedProduct,
      _id: updatedProduct._id?.toString(),
      created_at: updatedProduct.created_at.toISOString(),
      updated_at: updatedProduct.updated_at.toISOString(),
    };

    return NextResponse.json(serializableProduct);
  } catch (error) {
    console.error(`Failed to update product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to update product", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(params.id);
    if (!success) {
      return NextResponse.json(
        { message: "Product not found or could not be deleted" },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to delete product", error: (error as Error).message },
      { status: 500 }
    );
  }
}
