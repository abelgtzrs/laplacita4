import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined

    const products = await getProducts(category, search, featured)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in GET /api/admin/products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await createProduct(body)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
