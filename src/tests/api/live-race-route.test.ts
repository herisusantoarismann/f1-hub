import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/strategy/live-race/route";
import * as openf1Client from "@/lib/api/openf1-client";

describe("API Route: /api/strategy/live-race", () => {
    it("returns JSON with status data when getLiveRaceTelemetry resolves", async () => {
        const mockData: openf1Client.LiveRaceStatusResponse = {
            isLive: true,
            session: {
                grandPrixName: "Monaco Grand Prix",
                circuitId: "monaco",
                circuitName: "Monaco",
                currentLap: 45,
                totalLaps: 78,
                flagStatus: "GREEN",
                trackTempC: 38,
                airTempC: 24,
                weatherCondition: "dry",
                normalPitLossSec: 21.5,
                scPitLossSec: 12.0,
                vscPitLossSec: 15.0,
                drivers: [],
            },
            nextRace: null,
        };

        vi.spyOn(openf1Client, "getLiveRaceTelemetry").mockResolvedValueOnce(
            mockData,
        );

        const response = await GET();
        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.isLive).toBe(true);
        expect(json.session?.grandPrixName).toBe("Monaco Grand Prix");
    });

    it("returns 500 fallback JSON when getLiveRaceTelemetry throws", async () => {
        vi.spyOn(openf1Client, "getLiveRaceTelemetry").mockRejectedValueOnce(
            new Error("Network connection failed"),
        );

        const response = await GET();
        expect(response.status).toBe(500);

        const json = await response.json();
        expect(json.isLive).toBe(false);
        expect(json.session).toBeNull();
    });
});
