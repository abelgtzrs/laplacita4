import { type NextRequest, NextResponse } from "next/server";
import {
  getPromotionById,
  updatePromotion,
  deletePromotion,
  type Promotion,
} from "@/lib/mongodb"; // Make sure to export Promotion interface
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotion = await getPromotionById(params.id);
    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(promotion);
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.formData();
    const imageFile = data.get("image_file") as File | null;

    // Start with the existing image URL from the form, if present
    let imageUrl = data.get("image_url") as string;

    // If a new file is uploaded, it takes precedence
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updateData: Partial<Promotion> = {
      title_en: data.get("title_en") as string,
      title_es: data.get("title_es") as string,
      description_en: data.get("description_en") as string,
      description_es: data.get("description_es") as string,
      active_from: new Date(data.get("active_from") as string),
      active_to: new Date(data.get("active_to") as string),
    };

    // Only include image_url in the update if it has a value
    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const promotion = await updatePromotion(params.id, updateData);

    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found after update" },
        { status: 404 }
      );
    }

    // FIX: Manually create a serializable object to return
    const serializablePromotion = {
      ...promotion,
      _id: promotion._id?.toString(), // Convert ObjectId to string
      created_at: promotion.created_at.toISOString(), // Convert Date to string
      updated_at: promotion.updated_at.toISOString(), // Convert Date to string
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
  { params }: { params: { id: string } }
) {
  try {
    const success = await deletePromotion(params.id);
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
