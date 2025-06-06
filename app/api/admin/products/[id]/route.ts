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
  request: NextRequest, // Use NextRequest for consistency
  { params }: { params: { id: string } } // CORRECTED TYPE
) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
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
  request: NextRequest, // Use NextRequest for consistency
  { params }: { params: { id: string } } // CORRECTED TYPE
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
