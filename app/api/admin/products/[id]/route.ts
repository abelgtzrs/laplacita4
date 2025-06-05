// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/mongodb";

// GET handler for a single product
export async function GET(
  request: Request,
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
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to fetch product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch product", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT handler for updating a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    const updatedProduct = await updateProduct(params.id, updateData);
    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Failed to update product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to update product", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a product
export async function DELETE(
  request: Request,
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
    return new NextResponse(null, { status: 204 }); // 204 No Content for successful deletion
  } catch (error) {
    console.error(`Failed to delete product ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to delete product", error: (error as Error).message },
      { status: 500 }
    );
  }
}
