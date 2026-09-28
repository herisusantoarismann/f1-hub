import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LapTimeDeltaChart } from "@/components/molecules/LapTimeDeltaChart";
import { compareStrategies } from "@/lib/strategy-simulator";
import { STRATEGY_CIRCUITS } from "@/data/strategy-circuits";

describe("LapTimeDeltaChart Molecule", () => {
    const circuit = STRATEGY_CIRCUITS.bahrain;
    const results = compareStrategies(circuit, circuit.defaultStrategies);

    it("renders the telemetry chart and legend", () => {
        render(
            <LapTimeDeltaChart
                results={results}
                totalLaps={circuit.totalLaps}
            />,
        );

        expect(screen.getByTestId("lap-time-delta-chart")).toBeInTheDocument();
        expect(
            screen.getByText("Lap-by-Lap Pace & Degradation Telemetry"),
        ).toBeInTheDocument();
        expect(screen.getByText(/L57/)).toBeInTheDocument();
    });
});
