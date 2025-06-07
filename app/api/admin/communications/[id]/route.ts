import { type NextRequest, NextResponse } from "next/server";
import {
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
} from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const communication = await getCommunicationById(params.id);
    if (!communication) {
      return NextResponse.json(
        { error: "Communication not found" },
        { status: 404 }
      );
    }
    // Ensure the response is serializable
    const serializableCommunication = {
      ...communication,
      _id: communication._id?.toString(),
      created_at: communication.created_at.toISOString(),
      updated_at: communication.updated_at.toISOString(),
    };
    return NextResponse.json(serializableCommunication);
  } catch (error) {
    console.error("Error in GET /api/admin/communications/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch communication" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const communication = await updateCommunication(params.id, body);
    if (!communication) {
      return NextResponse.json(
        { error: "Communication not found" },
        { status: 404 }
      );
    }
    const serializableCommunication = {
      ...communication,
      _id: communication._id?.toString(),
      created_at: communication.created_at.toISOString(),
      updated_at: communication.updated_at.toISOString(),
    };
    return NextResponse.json(serializableCommunication);
  } catch (error) {
    console.error("Error in PUT /api/admin/communications/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update communication" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteCommunication(params.id);
    if (!success) {
      return NextResponse.json(
        { error: "Communication not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/communications/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete communication" },
      { status: 500 }
    );
  }
}
