import { type NextRequest, NextResponse } from "next/server";
import {
  getPromotionById,
  updatePromotion,
  deletePromotion,
  type Promotion,
} from "@/lib/mongodb";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // CORRECTED TYPE
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
  { params }: { params: { id: string } } // CORRECTED TYPE
) {
  try {
    const data = await request.formData();
    // ... (rest of the function logic is correct)
  } catch (error) {
    // ...
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // CORRECTED TYPE
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
