import { type NextRequest, NextResponse } from "next/server"
import { getCommunications, createCommunication } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    const communications = await getCommunications(activeOnly)
    return NextResponse.json(communications)
  } catch (error) {
    console.error("Error in GET /api/admin/communications:", error)
    return NextResponse.json({ error: "Failed to fetch communications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const communication = await createCommunication(body)
    return NextResponse.json(communication)
  } catch (error) {
    console.error("Error in POST /api/admin/communications:", error)
    return NextResponse.json({ error: "Failed to create communication" }, { status: 500 })
  }
}
