// app/api/admin/products/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getProducts, createProduct, type Product } from "@/lib/mongodb"; // Assuming Product interface is exported
import { writeFile, mkdir } from "fs/promises"; // For saving the file
import path from "path";
import { ObjectId } from "mongodb"; // For the Product interface reference

// GET handler remains the same
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;

    const products = await getProducts(category, search, featured);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST handler for creating a new product with image upload
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const imageFile = data.get("image_file") as File | null;
    let imageUrl: string | undefined = undefined; // Initialize imageUrl as undefined

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadsDir, { recursive: true }); // Ensure directory exists
    } catch (dirError) {
      console.error("Error creating uploads directory:", dirError);
      // Decide if this should be a fatal error or if you proceed without image saving
    }

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Sanitize filename and make it unique
      const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${sanitizedName}`;
      const imagePath = path.join(uploadsDir, filename);

      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`; // URL path for the image, accessible from the public folder
    }

    // Extract other form data
    const name_en = data.get("name_en") as string;
    const name_es = data.get("name_es") as string;
    const description_en = data.get("description_en") as string;
    const description_es = data.get("description_es") as string;
    const priceStr = data.get("price") as string;
    const category_en = data.get("category_en") as string;
    const category_es = data.get("category_es") as string;
    const is_featured_str = data.get("is_featured") as string;

    if (!name_en || !name_es || !priceStr || !category_en || !category_es) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Invalid price format" },
        { status: 400 }
      );
    }
    const is_featured = is_featured_str === "true";

    const productToCreate: Omit<Product, "_id" | "created_at" | "updated_at"> =
      {
        name_en,
        name_es,
        description_en,
        description_es,
        price,
        category_en,
        category_es,
        is_featured,
      };

    if (imageUrl) {
      productToCreate.image_url = imageUrl;
    }

    const newProduct = await createProduct(productToCreate);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: (error as Error).message },
      { status: 500 }
    );
  }
}
