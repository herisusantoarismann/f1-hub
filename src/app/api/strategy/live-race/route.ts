import { NextResponse } from "next/server";
import { getLiveRaceTelemetry } from "@/lib/api/openf1-client";

export const revalidate = 15; // Cache for 15 seconds

export async function GET() {
    try {
        const data = await getLiveRaceTelemetry();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { isLive: false, session: null, nextRace: null },
            { status: 500 },
        );
    }
}
