import { type NextRequest, NextResponse } from "next/server";
import {
  getPromotionById,
  updatePromotion,
  deletePromotion,
  type Promotion,
} from "@/lib/mongodb";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  context: any // Using 'any' as a temporary workaround for build error
) {
  try {
    const { id } = context.params;
    const promotion = await getPromotionById(id);
    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }
    const serializablePromotion = {
      ...promotion,
      _id: promotion._id?.toString(),
      created_at: promotion.created_at.toISOString(),
      updated_at: promotion.updated_at.toISOString(),
      active_from: promotion.active_from.toISOString(),
      active_to: promotion.active_to.toISOString(),
    };
    return NextResponse.json(serializablePromotion);
  } catch (error) {
    console.error("Error in GET /api/admin/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: any // Using 'any' as a temporary workaround for build error
) {
  try {
    const { id } = context.params;
    const data = await request.formData();
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

    const updateData: Partial<Promotion> = {
      title_en: data.get("title_en") as string,
      title_es: data.get("title_es") as string,
      description_en: data.get("description_en") as string,
      description_es: data.get("description_es") as string,
      active_from: new Date(data.get("active_from") as string),
      active_to: new Date(data.get("active_to") as string),
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const promotion = await updatePromotion(id, updateData);
    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found after update" },
        { status: 404 }
      );
    }

    const serializablePromotion = {
      ...promotion,
      _id: promotion._id?.toString(),
      created_at: promotion.created_at.toISOString(),
      updated_at: promotion.updated_at.toISOString(),
      active_from: promotion.active_from.toISOString(),
      active_to: promotion.active_to.toISOString(),
    };
    return NextResponse.json(serializablePromotion);
  } catch (error) {
    console.error("Error in PUT /api/admin/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: any // Using 'any' as a temporary workaround for build error
) {
  try {
    const { id } = context.params;
    const success = await deletePromotion(id);
    if (!success) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}
