import { NextRequest, NextResponse } from "next/server";
import {
    fetchDriverSeasonStats,
    getIntersectingSeasons,
} from "@/lib/api/driver-comparison";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const d1 = searchParams.get("d1") || "max_verstappen";
    const d2 = searchParams.get("d2") || "norris";
    const requestedSeason = searchParams.get("season") || "all";

    const intersectingSeasons = getIntersectingSeasons(d1, d2);

    // Validate that the requested season is valid for these two drivers
    let validSeason = requestedSeason;
    if (
        requestedSeason !== "all" &&
        !intersectingSeasons.includes(requestedSeason)
    ) {
        // If requested season is not valid for both drivers, fallback to "all" or latest intersecting
        validSeason =
            intersectingSeasons.length > 0 ? intersectingSeasons[0] : "all";
    }

    try {
        const [d1Stats, d2Stats] = await Promise.all([
            fetchDriverSeasonStats(d1, validSeason),
            fetchDriverSeasonStats(d2, validSeason),
        ]);

        return NextResponse.json({
            season: validSeason,
            intersectingSeasons,
            d1Stats,
            d2Stats,
        });
    } catch (error) {
        console.error("[API /api/compare] Error compiling stats:", error);
        return NextResponse.json(
            { error: "Failed to compile driver comparison statistics" },
            { status: 500 },
        );
    }
}
