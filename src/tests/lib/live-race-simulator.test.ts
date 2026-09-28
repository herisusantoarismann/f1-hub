import { describe, it, expect } from "vitest";
import {
    INITIAL_LIVE_RACE_SESSION,
    calculateLivePitRejoin,
} from "@/lib/live-race-simulator";

describe("Live Race Strategy Simulation Engine", () => {
    it("calculates pit rejoin position accurately for the race leader under green flag", () => {
        // Leader Verstappen (gap 0.0s) pits with 21.2s normal pit loss
        const result = calculateLivePitRejoin(
            INITIAL_LIVE_RACE_SESSION,
            "max_verstappen",
            "HARD",
        );

        expect(result).not.toBeNull();
        if (!result) return;

        expect(result.currentPosition).toBe(1);
        expect(result.pitLossAppliedSec).toBe(21.2);
        expect(result.projectedGapToLeaderSec).toBe(21.2);

        // In Australian GP lap 24: NOR (2.34s), LEC (8.75s), RUS (14.2s), PIA (19.8s) are ahead.
        // At 21.2s, Verstappen rejoins at P5, behind Piastri (19.8s) and ahead of Hamilton (23.6s).
        expect(result.projectedPosition).toBe(5);
        expect(result.rejoinsBehind?.code).toBe("PIA");
        expect(result.rejoinsAheadOf?.code).toBe("HAM");
    });

    it("reduces pit loss and improves rejoin position during a Safety Car", () => {
        const scSession = {
            ...INITIAL_LIVE_RACE_SESSION,
            flagStatus: "SC" as const,
        };

        // Under SC, pit loss is 12.8s instead of 21.2s
        const result = calculateLivePitRejoin(
            scSession,
            "max_verstappen",
            "HARD",
        );

        expect(result).not.toBeNull();
        if (!result) return;

        expect(result.pitLossAppliedSec).toBe(12.8);
        expect(result.projectedGapToLeaderSec).toBe(12.8);

        // At 12.8s gap, Verstappen rejoins ahead of Russell (14.2s), dropping only to P3 instead of P5!
        expect(result.projectedPosition).toBe(3);
        expect(result.rejoinsBehind?.code).toBe("LEC");
        expect(result.rejoinsAheadOf?.code).toBe("RUS");
    });

    it("evaluates remaining stint capability based on chosen compound", () => {
        // Lap 24 of 58 -> 34 laps remaining
        // Hard tyre can complete 34 laps (1-stop to end)
        const hardResult = calculateLivePitRejoin(
            INITIAL_LIVE_RACE_SESSION,
            "max_verstappen",
            "HARD",
        );
        expect(hardResult?.nextPitWindow.strategyType).toBe("1-Stop to End");
        expect(hardResult?.nextPitWindow.recommendedNextBoxLap).toBeNull();

        // Soft tyre cannot complete 34 laps (requires 2nd pit stop)
        const softResult = calculateLivePitRejoin(
            INITIAL_LIVE_RACE_SESSION,
            "max_verstappen",
            "SOFT",
        );
        expect(softResult?.nextPitWindow.strategyType).toBe("2-Stop Sprint");
        expect(softResult?.nextPitWindow.recommendedNextBoxLap).not.toBeNull();
    });

    it("detects trailing cars within undercut threat window", () => {
        // Norris is 2.34s behind Verstappen, which is in the < 2.8s threat window
        const result = calculateLivePitRejoin(
            INITIAL_LIVE_RACE_SESSION,
            "max_verstappen",
            "HARD",
        );

        expect(result?.undercutThreats.length).toBeGreaterThan(0);
        expect(result?.undercutThreats[0].driverCode).toBe("NOR");
    });
});
