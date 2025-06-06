import { type NextRequest, NextResponse } from "next/server";
import {
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
} from "@/lib/mongodb";

// The context object, including params, has a specific type.
// We define it here for clarity.
type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const communication = await getCommunicationById(params.id);
    if (!communication) {
      return NextResponse.json(
        { error: "Communication not found" },
        { status: 404 }
      );
    }
    // It's good practice to make sure the response is serializable
    const serializableCommunication = {
      ...communication,
      _id: communication._id?.toString(),
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

export async function PUT(request: NextRequest, { params }: RouteContext) {
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

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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
