import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CircuitElevationChart } from "@/components/molecules/CircuitElevationChart";
import { CircuitElevationData } from "@/data/circuits-elevation";

const mockElevation: CircuitElevationData = {
    circuitId: "spa",
    lowestPointMeters: 368,
    highestPointMeters: 470,
    elevationDeltaMeters: 102.2,
    altitudeAboveSeaLevelMeters: 410,
    elevationNotes: "Historical track situated in the Ardennes forest.",
    bankedCorners: [
        {
            turnNumber: 4,
            turnName: "Eau Rouge",
            bankingAngleDeg: 17.5,
            inclinePct: 15,
            description: "Iconic uphill sweep",
        },
    ],
    profilePoints: [
        { distancePct: 0, elevationMeters: 400, label: "La Source" },
        { distancePct: 20, elevationMeters: 370, label: "Eau Rouge" },
        { distancePct: 50, elevationMeters: 470, label: "Les Combes" },
        { distancePct: 100, elevationMeters: 400, label: "Bus Stop" },
    ],
};

describe("CircuitElevationChart Molecule", () => {
    it("renders elevation delta, min, max stats, notes, and banked turns", () => {
        render(<CircuitElevationChart elevation={mockElevation} />);

        expect(
            screen.getByTestId("circuit-elevation-chart"),
        ).toBeInTheDocument();
        expect(screen.getByText("Highest Peak")).toBeInTheDocument();
        expect(screen.getByText("Lowest Dip")).toBeInTheDocument();
        expect(screen.getByText("Elevation Delta")).toBeInTheDocument();
        expect(screen.getByText("Altitude MSL")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Historical track situated in the Ardennes forest.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText(/T4: Eau Rouge/)).toBeInTheDocument();
        expect(screen.getByText(/Banking/)).toBeInTheDocument();
    });
});
