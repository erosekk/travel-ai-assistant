// app/api/generate/route.ts
// =============================================
// Server-side API route — keeps API key secret
// =============================================

import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai";
import { getDestinations, MAX_DESTINATIONS } from "@/lib/travelLimits";
import { GenerateRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { formData, lang } = body;
    const destinations = getDestinations(formData);

    // Validate required fields
    if (!destinations.length || !formData.country) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (destinations.length > MAX_DESTINATIONS) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_DESTINATIONS} destination cities allowed` },
        { status: 400 }
      );
    }

    // API key lives ONLY on the server in .env.local
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "ANTHROPIC_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const data = await callClaude(
      {
        ...formData,
        destination: destinations.join(", "),
        destinations,
      },
      lang,
      apiKey
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    console.error("[/api/generate] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
