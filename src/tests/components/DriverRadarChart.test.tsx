import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DriverRadarChart } from "@/components/molecules/DriverRadarChart";
import { getDriverPerformance } from "@/data/drivers-ratings";

describe("DriverRadarChart Component (Molecule)", () => {
    const verstappen = getDriverPerformance("max_verstappen");
    const norris = getDriverPerformance("norris");

    it("renders the performance radar analysis title and legend", () => {
        render(<DriverRadarChart driver1={verstappen} driver2={norris} />);

        expect(screen.getByTestId("driver-radar-chart")).toBeInTheDocument();
        expect(
            screen.getByText(/Performance Radar Analysis/i),
        ).toBeInTheDocument();
        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
        expect(screen.getByText("Lando Norris")).toBeInTheDocument();
    });

    it("renders all six core motorsport attributes", () => {
        render(<DriverRadarChart driver1={verstappen} driver2={norris} />);

        expect(screen.getAllByText(/Qualifying Pace/i).length).toBeGreaterThan(
            0,
        );
        expect(screen.getAllByText(/Race Craft/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Consistency/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Overtaking/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Wet Weather/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0);
    });
});
