import { describe, it, expect } from "vitest";
import {
    formatLapTime,
    formatRaceTime,
    formatDeltaTime,
    simulateStrategy,
    compareStrategies,
    calculateUndercutGain,
    StrategyPlan,
} from "@/lib/strategy-simulator";
import { STRATEGY_CIRCUITS } from "@/data/strategy-circuits";

describe("strategy-simulator engine", () => {
    describe("Time Formatting Utilities", () => {
        it("formats lap time into m:ss.xxx", () => {
            expect(formatLapTime(82.456)).toBe("1:22.456");
            expect(formatLapTime(95.008)).toBe("1:35.008");
        });

        it("formats race time into h m s.xxx", () => {
            expect(formatRaceTime(5124.5)).toBe("1h 25m 24.500s");
        });

        it("formats delta time with sign", () => {
            expect(formatDeltaTime(0)).toBe("FASTEST");
            expect(formatDeltaTime(3.42)).toBe("+3.420s");
            expect(formatDeltaTime(-1.5)).toBe("-1.500s");
        });
    });

    describe("simulateStrategy", () => {
        const circuit = STRATEGY_CIRCUITS.bahrain;
        const testStrategy: StrategyPlan = {
            id: "test-1",
            name: "Test 1-Stop",
            stints: [
                { compound: "MEDIUM", startLap: 1, endLap: 25 },
                { compound: "HARD", startLap: 26, endLap: 57 },
            ],
        };

        it("simulates the correct total number of laps", () => {
            const result = simulateStrategy(circuit, testStrategy);
            expect(result.laps.length).toBe(57);
            expect(result.pitStopCount).toBe(1);
            expect(result.meetsTwoCompoundRule).toBe(true);
        });

        it("applies pit loss on the in-lap", () => {
            const result = simulateStrategy(circuit, testStrategy);
            const inLap = result.laps.find((l) => l.isPitInLap);

            expect(inLap).toBeDefined();
            expect(inLap?.lapNumber).toBe(25);
            expect(inLap?.pitLossAppliedSec).toBe(circuit.pitLossSec);
        });

        it("reduces pit loss when Safety Car is active on the pit lap", () => {
            const normalResult = simulateStrategy(circuit, testStrategy, null);
            const scResult = simulateStrategy(circuit, testStrategy, 25); // SC on Lap 25

            const normalInLap = normalResult.laps.find((l) => l.isPitInLap)!;
            const scInLap = scResult.laps.find((l) => l.isPitInLap)!;

            expect(normalInLap.pitLossAppliedSec).toBe(circuit.pitLossSec);
            expect(scInLap.pitLossAppliedSec).toBe(circuit.scPitLossSec);
            expect(scResult.totalRaceTimeSec).toBeLessThan(
                normalResult.totalRaceTimeSec,
            );
        });

        it("flags single-compound strategy as illegal under FIA dry race rules", () => {
            const illegalStrategy: StrategyPlan = {
                id: "illegal-1",
                name: "All Hard",
                stints: [
                    { compound: "HARD", startLap: 1, endLap: 30 },
                    { compound: "HARD", startLap: 31, endLap: 57 },
                ],
            };
            const result = simulateStrategy(circuit, illegalStrategy);
            expect(result.meetsTwoCompoundRule).toBe(false);
        });
    });

    describe("compareStrategies", () => {
        const circuit = STRATEGY_CIRCUITS.albert_park;

        it("ranks strategies by total race time and sets delta to fastest", () => {
            const results = compareStrategies(
                circuit,
                circuit.defaultStrategies,
            );

            expect(results.length).toBe(circuit.defaultStrategies.length);
            expect(results[0].deltaToFastestSec).toBe(0);
            expect(results[0].formattedDelta).toBe("FASTEST");

            for (let i = 1; i < results.length; i++) {
                expect(results[i].totalRaceTimeSec).toBeGreaterThanOrEqual(
                    results[i - 1].totalRaceTimeSec,
                );
                expect(results[i].deltaToFastestSec).toBeGreaterThanOrEqual(0);
            }
        });
    });

    describe("calculateUndercutGain", () => {
        it("returns positive undercut advantage for old soft vs fresh hard/medium", () => {
            const circuit = STRATEGY_CIRCUITS.bahrain;
            const res = calculateUndercutGain(
                circuit,
                15,
                "SOFT",
                15, // 15 laps old soft
                "HARD", // fresh hard
            );

            expect(res.undercutDeltaSec).toBeGreaterThan(0);
            expect(typeof res.analysis).toBe("string");
        });
    });
});
