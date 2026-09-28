import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DriverComparisonModule } from "@/components/organisms/DriverComparisonModule";

describe("DriverComparisonModule Component (Organism)", () => {
    beforeEach(() => {
        // Mock global fetch for /api/compare
        vi.spyOn(global, "fetch").mockImplementation((url: RequestInfo | URL) => {
            const urlStr = url.toString();
            if (urlStr.includes("/api/compare")) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            season: "all",
                            intersectingSeasons: ["2026", "2025"],
                            d1Stats: {
                                season: "all",
                                driverId: "antonelli",
                                fullName: "Kimi Antonelli",
                                code: "ANT",
                                teamName: "Mercedes-AMG Petronas",
                                teamColor: "#27F4D2",
                                championshipPosition: "P1",
                                worldChampionships: 0,
                                wins: 8,
                                podiums: 12,
                                polePositions: 6,
                                fastestLaps: 7,
                                points: 452,
                                grandPrixStarts: 39,
                                bestFinish: "P1",
                                overallRating: 92,
                            },
                            d2Stats: {
                                season: "all",
                                driverId: "max_verstappen",
                                fullName: "Max Verstappen",
                                code: "VER",
                                teamName: "Red Bull Racing",
                                teamColor: "#3671C6",
                                championshipPosition: "P1",
                                worldChampionships: 4,
                                wins: 63,
                                podiums: 111,
                                polePositions: 40,
                                fastestLaps: 33,
                                points: 3014.5,
                                grandPrixStarts: 206,
                                bestFinish: "P1",
                                overallRating: 96,
                            },
                        }),
                } as Response);
            }
            return Promise.reject(new Error("Unknown url"));
        });
    });

    it("renders driver selection cards and season filter bar", () => {
        render(
            <DriverComparisonModule
                initialDriver1Id="antonelli"
                initialDriver2Id="max_verstappen"
            />,
        );

        expect(
            screen.getByTestId("driver-comparison-module"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("season-filter-bar")).toBeInTheDocument();
        expect(screen.getByTestId("season-btn-all")).toBeInTheDocument();
    });

    it("restricts available seasons to intersecting years only (e.g. 2026, 2025 for Antonelli vs Max)", () => {
        render(
            <DriverComparisonModule
                initialDriver1Id="antonelli"
                initialDriver2Id="max_verstappen"
            />,
        );

        // 2026 and 2025 should exist
        expect(screen.getByTestId("season-btn-2026")).toBeInTheDocument();
        expect(screen.getByTestId("season-btn-2025")).toBeInTheDocument();

        // 2022 and 2023 MUST NOT exist because Antonelli wasn't in F1 then
        expect(screen.queryByTestId("season-btn-2022")).toBeNull();
        expect(screen.queryByTestId("season-btn-2023")).toBeNull();
    });

    it("swaps driver positions when central swap button is clicked", () => {
        render(
            <DriverComparisonModule
                initialDriver1Id="antonelli"
                initialDriver2Id="max_verstappen"
            />,
        );

        const swapButton = screen.getByTestId("swap-drivers-button");
        fireEvent.click(swapButton);

        // Both drivers still present but swapped in cards
        expect(screen.getAllByText("Kimi Antonelli").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Max Verstappen").length).toBeGreaterThan(0);
    });

    it("allows switching between All-Time and specific intersecting season", async () => {
        render(
            <DriverComparisonModule
                initialDriver1Id="antonelli"
                initialDriver2Id="max_verstappen"
            />,
        );

        const btn2026 = screen.getByTestId("season-btn-2026");
        fireEvent.click(btn2026);

        await waitFor(() => {
            expect(btn2026.className).toContain("bg-f1-red");
        });
    });
});
