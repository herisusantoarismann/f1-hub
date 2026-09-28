import { describe, it, expect } from "vitest";
import {
    getDriverActiveSeasons,
    getIntersectingSeasons,
    fetchDriverSeasonStats,
} from "@/lib/api/driver-comparison";

describe("Driver Comparison API & Season Logic", () => {
    describe("getDriverActiveSeasons", () => {
        it("returns exact active seasons for rookie Andrea Kimi Antonelli", () => {
            const seasons = getDriverActiveSeasons("antonelli");
            expect(seasons).toEqual(["2026", "2025"]);
            expect(seasons).not.toContain("2024");
            expect(seasons).not.toContain("2022");
        });

        it("returns full F1 career seasons for Max Verstappen", () => {
            const seasons = getDriverActiveSeasons("max_verstappen");
            expect(seasons).toContain("2026");
            expect(seasons).toContain("2023");
            expect(seasons).toContain("2015");
            expect(seasons).not.toContain("2014");
        });
    });

    describe("getIntersectingSeasons", () => {
        it("strictly intersects seasons between Antonelli and Max Verstappen", () => {
            const intersection = getIntersectingSeasons(
                "antonelli",
                "max_verstappen",
            );
            // Only 2026 and 2025 should intersect! 2022 or 2023 MUST NOT be selectable.
            expect(intersection).toEqual(["2026", "2025"]);
            expect(intersection).not.toContain("2024");
            expect(intersection).not.toContain("2023");
            expect(intersection).not.toContain("2022");
        });

        it("intersects seasons between Lewis Hamilton and Charles Leclerc", () => {
            const intersection = getIntersectingSeasons("hamilton", "leclerc");
            // Leclerc debuted in 2018
            expect(intersection).toContain("2026");
            expect(intersection).toContain("2024");
            expect(intersection).toContain("2018");
            expect(intersection).not.toContain("2017");
            expect(intersection).not.toContain("2008");
        });

        it("sorts intersecting seasons in descending order (latest season first)", () => {
            const intersection = getIntersectingSeasons("hamilton", "alonso");
            expect(intersection[0]).toBe("2026");
            const numericYears = intersection.map(Number);
            for (let i = 0; i < numericYears.length - 1; i++) {
                expect(numericYears[i]).toBeGreaterThan(numericYears[i + 1]);
            }
        });
    });

    describe("fetchDriverSeasonStats", () => {
        it("returns career stats when season is 'all'", async () => {
            const stats = await fetchDriverSeasonStats("antonelli", "all");
            expect(stats.season).toBe("all");
            expect(stats.driverId).toBe("antonelli");
            expect(stats.wins).toBe(8);
            expect(stats.podiums).toBe(12);
            expect(stats.points).toBe(452);
            expect(stats.bestFinish).toBe("P1");
        });

        it("returns 2026 season stats with wins for Antonelli", async () => {
            const stats = await fetchDriverSeasonStats("antonelli", "2026");
            expect(stats.season).toBe("2026");
            expect(stats.driverId).toBe("antonelli");
            expect(stats.championshipPosition).toBe("P1");
            expect(stats.wins).toBe(8);
            expect(stats.podiums).toBe(12);
            expect(stats.points).toBe(302);
        });

        it("returns 2024 season stats for Max Verstappen", async () => {
            const stats = await fetchDriverSeasonStats(
                "max_verstappen",
                "2024",
            );
            expect(stats.season).toBe("2024");
            expect(stats.driverId).toBe("max_verstappen");
            expect(stats.championshipPosition).toBe("P1");
            expect(stats.wins).toBeGreaterThanOrEqual(8);
        });
    });
});
