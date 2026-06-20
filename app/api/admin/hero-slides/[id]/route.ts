import { unlink } from "fs/promises";
import path from "path";

import { NextResponse, type NextRequest } from "next/server";

import {
  deleteHeroSlide,
  getHeroSlideById,
  updateHeroSlide,
  type HeroSlide,
} from "@/lib/mongodb";

function serializeHeroSlide(heroSlide: HeroSlide) {
  return {
    ...heroSlide,
    _id: heroSlide._id?.toString(),
    created_at: heroSlide.created_at.toISOString(),
    updated_at: heroSlide.updated_at.toISOString(),
  };
}

export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const heroSlide = await getHeroSlideById(id);

    if (!heroSlide) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json(serializeHeroSlide(heroSlide));
  } catch (error) {
    console.error("Error in GET /api/admin/hero-slides/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slide" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const body = await request.json();

    const updateData: Partial<HeroSlide> = {};

    if ("title" in body) {
      const title = String(body.title ?? "").trim();
      updateData.title = title || undefined;
    }

    if ("is_active" in body) {
      updateData.is_active = Boolean(body.is_active);
    }

    if ("sort_order" in body) {
      const sortOrder = Number.parseInt(String(body.sort_order ?? 0), 10);
      updateData.sort_order = Number.isFinite(sortOrder) ? sortOrder : 0;
    }

    const heroSlide = await updateHeroSlide(id, updateData);

    if (!heroSlide) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json(serializeHeroSlide(heroSlide));
  } catch (error) {
    console.error("Error in PUT /api/admin/hero-slides/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const heroSlide = await getHeroSlideById(id);
    const success = await deleteHeroSlide(id);

    if (!success) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    if (heroSlide?.image_url?.startsWith("/uploads/")) {
      const relativeImagePath = heroSlide.image_url.replace(/^\//, "");

      try {
        await unlink(path.join(process.cwd(), "public", relativeImagePath));
      } catch (fileError) {
        console.error("Failed to delete hero slide image:", fileError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/hero-slides/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 }
    );
  }
}