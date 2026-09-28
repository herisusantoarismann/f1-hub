import { describe, it, expect } from "vitest";
import {
    calculateDriverRacePoints,
    calculateSimulatedDriverStandings,
    calculateSimulatedConstructorStandings,
    analyzeClinchScenario,
} from "@/lib/calculator-utils";
import {
    FALLBACK_DRIVER_STANDINGS,
    FALLBACK_CONSTRUCTOR_STANDINGS,
} from "@/data/standings-fallback";

describe("calculator-utils domain logic", () => {
    describe("calculateDriverRacePoints", () => {
        it("awards 25 points for P1 without fastest lap", () => {
            const pts = calculateDriverRacePoints({
                driverId: "norris",
                gpPosition: 1,
                fastestLap: false,
            });
            expect(pts).toBe(25);
        });

        it("awards 26 points for P1 with fastest lap bonus", () => {
            const pts = calculateDriverRacePoints(
                {
                    driverId: "norris",
                    gpPosition: 1,
                    fastestLap: true,
                },
                true,
            );
            expect(pts).toBe(26);
        });

        it("does NOT award fastest lap bonus if finishing outside top 10", () => {
            const pts = calculateDriverRacePoints(
                {
                    driverId: "albon",
                    gpPosition: 11,
                    fastestLap: true,
                },
                true,
            );
            expect(pts).toBe(0);
        });

        it("awards sprint race points correctly (e.g. P1 = 8 pts, P2 = 7 pts)", () => {
            const pts = calculateDriverRacePoints({
                driverId: "max_verstappen",
                gpPosition: 2, // 18 pts
                sprintPosition: 1, // 8 pts
            });
            expect(pts).toBe(26); // 18 + 8 = 26
        });
    });

    describe("calculateSimulatedDriverStandings", () => {
        it("correctly adds points, increments wins, and recalculates positions", () => {
            // Suppose Norris (base 331 pts) wins with FL (+26 -> 357)
            // and Verstappen (base 393 pts) finishes P10 (+1 -> 394)
            const simulated = calculateSimulatedDriverStandings(
                FALLBACK_DRIVER_STANDINGS,
                {
                    norris: {
                        driverId: "norris",
                        gpPosition: 1,
                        fastestLap: true,
                    },
                    max_verstappen: {
                        driverId: "max_verstappen",
                        gpPosition: 10,
                    },
                },
                true,
            );

            const norris = simulated.find(
                (d) => d.Driver.driverId === "norris",
            )!;
            const max = simulated.find(
                (d) => d.Driver.driverId === "max_verstappen",
            )!;

            expect(norris.pointsAdded).toBe(26);
            expect(norris.simulatedPoints).toBe(331 + 26);
            expect(norris.simulatedWins).toBe(parseInt(norris.wins, 10) + 1);

            expect(max.pointsAdded).toBe(1);
            expect(max.simulatedPoints).toBe(393 + 1);
            expect(max.simulatedWins).toBe(parseInt(max.wins, 10)); // did not win
        });

        it("handles position leapfrogging when driver earns enough points", () => {
            // Leclerc (307 pts) wins (+25 = 332) while Norris (331 pts) gets 0
            const simulated = calculateSimulatedDriverStandings(
                FALLBACK_DRIVER_STANDINGS,
                {
                    leclerc: {
                        driverId: "leclerc",
                        gpPosition: 1,
                    },
                },
                false,
            );

            const leclerc = simulated.find(
                (d) => d.Driver.driverId === "leclerc",
            )!;
            const norris = simulated.find(
                (d) => d.Driver.driverId === "norris",
            )!;

            // Leclerc now has 332 pts vs Norris 331 pts -> Leclerc is P2, Norris is P3
            expect(leclerc.simulatedPosition).toBe(2);
            expect(leclerc.positionChange).toBe(1); // climbed 1 spot (from pos 3 to pos 2)
            expect(norris.simulatedPosition).toBe(3);
            expect(norris.positionChange).toBe(-1); // dropped 1 spot
        });
    });

    describe("calculateSimulatedConstructorStandings", () => {
        it("sums points gained by both drivers to the constructor total", () => {
            const simulatedDrivers = calculateSimulatedDriverStandings(
                FALLBACK_DRIVER_STANDINGS,
                {
                    norris: { driverId: "norris", gpPosition: 1 }, // 25 pts (McLaren)
                    piastri: { driverId: "piastri", gpPosition: 2 }, // 18 pts (McLaren)
                },
                false,
            );

            const simulatedTeams = calculateSimulatedConstructorStandings(
                FALLBACK_CONSTRUCTOR_STANDINGS,
                simulatedDrivers,
            );

            const mclaren = simulatedTeams.find(
                (t) => t.Constructor.constructorId === "mclaren",
            )!;

            expect(mclaren.pointsAdded).toBe(43); // 25 + 18
            expect(mclaren.simulatedPoints).toBe(593 + 43);
            expect(mclaren.simulatedWins).toBe(parseInt(mclaren.wins, 10) + 1);
        });
    });

    describe("analyzeClinchScenario", () => {
        it("identifies when the title battle is still mathematically alive", () => {
            const simulated = calculateSimulatedDriverStandings(
                FALLBACK_DRIVER_STANDINGS,
                {},
                true,
            );

            const leader = simulated[0]; // Verstappen (393)
            const chaser = simulated[1]; // Norris (331)

            // Gap is 62 pts. With 3 races remaining, max points = 3 * 26 = 78 pts.
            const result = analyzeClinchScenario({
                leader,
                chaser,
                remainingRacesAfterThis: 3,
                includeFastestLapBonus: true,
            });

            expect(result.canClinchThisRace).toBe(false);
            expect(result.maxPointsRemaining).toBe(78);
            expect(result.simulatedGap).toBe(62);
        });

        it("identifies when the title is clinched (gap > max points remaining)", () => {
            const simulated = calculateSimulatedDriverStandings(
                FALLBACK_DRIVER_STANDINGS,
                {
                    max_verstappen: {
                        driverId: "max_verstappen",
                        gpPosition: 1, // +25 -> 418
                    },
                    norris: {
                        driverId: "norris",
                        gpPosition: null, // 0 -> 331
                    },
                },
                false,
            );

            const leader = simulated[0];
            const chaser = simulated[1];

            // Gap is 418 - 331 = 87 pts.
            // With 2 races remaining without FL bonus: max points = 2 * 25 = 50 pts.
            const result = analyzeClinchScenario({
                leader,
                chaser,
                remainingRacesAfterThis: 2,
                includeFastestLapBonus: false,
            });

            expect(result.canClinchThisRace).toBe(true);
            expect(result.clinchSummary).toContain("Juara Dunia");
        });
    });
});
