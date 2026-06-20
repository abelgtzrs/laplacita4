import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse, type NextRequest } from "next/server";

import {
  createHeroSlide,
  getHeroSlidesBootstrapped,
  getHeroSlides,
  setHeroSlidesBootstrapped,
  type HeroSlide,
} from "@/lib/mongodb";
import { DEFAULT_HERO_SLIDES } from "@/lib/hero-slides";

function serializeHeroSlide(heroSlide: HeroSlide) {
  return {
    ...heroSlide,
    _id: heroSlide._id?.toString(),
    created_at: heroSlide.created_at.toISOString(),
    updated_at: heroSlide.updated_at.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    let heroSlides = await getHeroSlides();
    const bootstrapped = await getHeroSlidesBootstrapped();

    if (heroSlides.length === 0 && !bootstrapped) {
      await Promise.all(
        DEFAULT_HERO_SLIDES.map((slide) => createHeroSlide(slide))
      );
      await setHeroSlidesBootstrapped(true);
      heroSlides = await getHeroSlides();
    }

    const visibleSlides = activeOnly
      ? heroSlides.filter((slide) => slide.is_active)
      : heroSlides;

    return NextResponse.json(visibleSlides.map(serializeHeroSlide));
  } catch (error) {
    console.error("Error in GET /api/admin/hero-slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const imageFile = data.get("image_file") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Hero slide image is required" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const imagePath = path.join(uploadsDir, filename);

    await writeFile(imagePath, buffer);

    const sortOrderValue = Number.parseInt(
      (data.get("sort_order") as string) || "0",
      10
    );

    const heroSlide = await createHeroSlide({
      title: ((data.get("title") as string) || "").trim() || undefined,
      image_url: `/uploads/${filename}`,
      is_active: (data.get("is_active") as string) !== "false",
      sort_order: Number.isFinite(sortOrderValue) ? sortOrderValue : 0,
    });

    await setHeroSlidesBootstrapped(true);

    return NextResponse.json(serializeHeroSlide(heroSlide), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/hero-slides:", error);
    return NextResponse.json(
      {
        error: "Failed to create hero slide",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}