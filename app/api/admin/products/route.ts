// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/mongodb"; // Assuming your lib/mongodb.ts is in the root lib folder

// GET handler for fetching products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;

    const products = await getProducts(category, search, featured);
    // In the previous example, products were returned directly.
    // Your frontend expects the raw array, which is fine.
    // If you wanted to stick to a { success: true, data: products } structure,
    // you would need to adjust your frontend to access `data.data`.
    // For now, returning the array directly matches your frontend's expectation.
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST handler for creating a new product
export async function POST(request: Request) {
  try {
    const productData = await request.json();

    if (
      !productData.name_en ||
      !productData.name_es ||
      !productData.price ||
      !productData.category_en ||
      !productData.category_es
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await createProduct(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: (error as Error).message },
      { status: 500 }
    );
  }
}
