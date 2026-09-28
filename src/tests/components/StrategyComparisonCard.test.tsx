import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { StrategyComparisonCard } from "@/components/molecules/StrategyComparisonCard";
import {
    StrategyPlan,
    StrategySimulationResult,
} from "@/lib/strategy-simulator";

const mockPlan: StrategyPlan = {
    id: "plan-1",
    name: "Standard 1-Stop Soft-Hard",
    description: "Classic undercut strategy using soft tyre start.",
    stints: [
        { compound: "SOFT", startLap: 1, endLap: 18 },
        { compound: "HARD", startLap: 19, endLap: 57 },
    ],
};

const mockResult: StrategySimulationResult = {
    strategyId: "plan-1",
    strategyName: "Standard 1-Stop Soft-Hard",
    totalRaceTimeSec: 5200.45,
    formattedTotalTime: "1:26:40.450",
    deltaToFastestSec: 0,
    formattedDelta: "+0.000s",
    pitStopCount: 1,
    compoundsUsed: ["SOFT", "HARD"],
    meetsTwoCompoundRule: true,
    fiaRegulationStatus: {
        isCompliant: true,
        ruleCode: "ARTICLE_30_5_COMPLIANT",
        message: "Compliant with 2026 regulations",
    },
    laps: [],
    averageLapTimeSec: 91.23,
    formattedAverageLap: "1:31.230",
    fastestLapSec: 89.45,
    fastestLapNumber: 42,
    optimalLifespans: [],
};

describe("StrategyComparisonCard Molecule", () => {
    it("renders fastest strategy badge and formatted race times", () => {
        render(
            <StrategyComparisonCard
                strategyPlan={mockPlan}
                result={mockResult}
                totalLaps={57}
                isFastest={true}
            />,
        );

        expect(screen.getByTestId("strategy-card-plan-1")).toBeInTheDocument();
        expect(screen.getByText("FASTEST STRATEGY")).toBeInTheDocument();
        expect(screen.getByText("1:26:40.450")).toBeInTheDocument();
        expect(screen.getAllByText("1 Pit Stop").length).toBeGreaterThanOrEqual(
            1,
        );
        expect(screen.getByText("Compliant")).toBeInTheDocument();
    });

    it("renders alternative label and delta when isFastest is false", () => {
        const altResult: StrategySimulationResult = {
            ...mockResult,
            deltaToFastestSec: 8.42,
            formattedDelta: "+8.420s",
        };

        render(
            <StrategyComparisonCard
                strategyPlan={mockPlan}
                result={altResult}
                totalLaps={57}
                isFastest={false}
            />,
        );

        expect(screen.getByText("ALTERNATIVE")).toBeInTheDocument();
        expect(screen.getByText("+8.420s slower")).toBeInTheDocument();
    });

    it("renders illegal status when 2-compound rule is violated", () => {
        const illegalResult: StrategySimulationResult = {
            ...mockResult,
            meetsTwoCompoundRule: false,
        };

        render(
            <StrategyComparisonCard
                strategyPlan={mockPlan}
                result={illegalResult}
                totalLaps={57}
                isFastest={false}
            />,
        );

        expect(screen.getByText("Illegal (1 compound)")).toBeInTheDocument();
    });
});
