import { type NextRequest, NextResponse } from "next/server"
import { getPromotions, createPromotion } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    const promotions = await getPromotions(activeOnly)
    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Error in GET /api/admin/promotions:", error)
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const promotion = await createPromotion(body)
    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error in POST /api/admin/promotions:", error)
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 })
  }
}
