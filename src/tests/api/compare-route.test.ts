import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/compare/route";
import { NextRequest } from "next/server";
import * as driverComp from "@/lib/api/driver-comparison";

describe("API Route: /api/compare", () => {
    it("returns comparison JSON with intersecting seasons and driver stats", async () => {
        vi.spyOn(driverComp, "getIntersectingSeasons").mockReturnValue([
            "2024",
            "2023",
        ]);
        vi.spyOn(driverComp, "fetchDriverSeasonStats").mockResolvedValue({
            driverId: "max_verstappen",
            fullName: "Max Verstappen",
            code: "VER",
            teamName: "Red Bull Racing",
            teamColor: "#3671c6",
            season: "2024",
            championshipPosition: "P1",
            worldChampionships: 1,
            wins: 9,
            podiums: 14,
            polePositions: 8,
            fastestLaps: 3,
            points: 429,
            grandPrixStarts: 24,
            bestFinish: "1",
            skills: {
                qualifyingPace: 98,
                raceCraft: 96,
                consistency: 95,
                overtaking: 95,
                wetWeather: 98,
                experience: 90,
            },
            overallRating: 97,
        });

        const req = new NextRequest(
            "http://localhost:3000/api/compare?d1=max_verstappen&d2=norris&season=2024",
        );
        const res = await GET(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.season).toBe("2024");
        expect(json.intersectingSeasons).toContain("2024");
        expect(json.d1Stats.driverId).toBe("max_verstappen");
    });

    it("falls back gracefully when requested season is not valid for both drivers", async () => {
        vi.spyOn(driverComp, "getIntersectingSeasons").mockReturnValue([
            "2023",
            "2022",
        ]);
        vi.spyOn(driverComp, "fetchDriverSeasonStats").mockResolvedValue({
            driverId: "hamilton",
            fullName: "Lewis Hamilton",
            code: "HAM",
            teamName: "Mercedes",
            teamColor: "#00d2be",
            season: "2023",
            championshipPosition: "P3",
            worldChampionships: 0,
            wins: 0,
            podiums: 6,
            polePositions: 1,
            fastestLaps: 4,
            points: 234,
            grandPrixStarts: 22,
            bestFinish: "2",
            skills: {
                qualifyingPace: 95,
                raceCraft: 97,
                consistency: 94,
                overtaking: 94,
                wetWeather: 96,
                experience: 99,
            },
            overallRating: 95,
        });

        const req = new NextRequest(
            "http://localhost:3000/api/compare?d1=hamilton&d2=piastri&season=2015",
        );
        const res = await GET(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.season).toBe("2023");
    });
});
