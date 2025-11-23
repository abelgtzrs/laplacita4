import { NextResponse, type NextRequest } from "next/server";
import {
  getLatestExchangeRate,
  getExchangeRateHistory,
  createExchangeRate,
} from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const latest = await getLatestExchangeRate();
    const history = await getExchangeRateHistory();

    // Serialize _id to string to avoid serialization issues
    const safeLatest = latest ? { ...latest, _id: latest._id?.toString() } : null;
    const safeHistory = history.map((h) => ({ ...h, _id: h._id?.toString() }));

    return NextResponse.json({ latest: safeLatest, history: safeHistory });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return NextResponse.json(
      { message: "Failed to fetch exchange rates", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { rates, logoType, selectedCountries, countries } = data;

    if (!rates || !logoType || !selectedCountries || !countries) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRate = await createExchangeRate({
      rates,
      logoType,
      selectedCountries,
      countries,
    });

    return NextResponse.json(newRate, { status: 201 });
  } catch (error) {
    console.error("Failed to create exchange rate:", error);
    return NextResponse.json(
      { message: "Failed to create exchange rate", error: (error as Error).message },
      { status: 500 }
    );
  }
}
