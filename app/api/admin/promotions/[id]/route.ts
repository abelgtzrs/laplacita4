import { type NextRequest, NextResponse } from "next/server"
import { getPromotionById, updatePromotion, deletePromotion } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const promotion = await getPromotionById(params.id)
    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }
    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error in GET /api/admin/promotions/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch promotion" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const promotion = await updatePromotion(params.id, body)
    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }
    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error in PUT /api/admin/promotions/[id]:", error)
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deletePromotion(params.id)
    if (!success) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/admin/promotions/[id]:", error)
    return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 })
  }
}
