import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CircuitInteractiveSimulator } from "@/components/organisms/CircuitInteractiveSimulator";
import { getCircuitDatabase } from "@/data/circuits-database";

describe("CircuitInteractiveSimulator Component (Organism)", () => {
    const zandvoortProfile = getCircuitDatabase("zandvoort")!;

    beforeEach(() => {
        // Mock SVG path methods in JSDOM
        (SVGElement.prototype as any).getTotalLength = vi
            .fn()
            .mockReturnValue(1200);
        (SVGElement.prototype as any).getPointAtLength = vi
            .fn()
            .mockImplementation((dist: number) => ({
                x: 250 + Math.cos(dist / 100) * 100,
                y: 250 + Math.sin(dist / 100) * 100,
            }));
    });

    it("renders the interactive telemetry simulator and live HUD", () => {
        render(<CircuitInteractiveSimulator profile={zandvoortProfile} />);

        expect(
            screen.getByTestId("circuit-interactive-simulator"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Interactive Track Telemetry/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/19° Banking/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Speed/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Gear/i)).toBeInTheDocument();
    });

    it("allows toggling between Live Sim and Elevation & Banking mode", () => {
        render(<CircuitInteractiveSimulator profile={zandvoortProfile} />);

        // Toggle to Elevation mode
        const elevButton = screen.getByTestId("mode-elevation-button");
        fireEvent.click(elevButton);

        expect(
            screen.getByTestId("circuit-elevation-chart"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Elevation Profile & Topography/i),
        ).toBeInTheDocument();
        expect(screen.getAllByText(/Hugenholtzbocht/i).length).toBeGreaterThan(
            0,
        );

        // Switch back to Live Sim
        const simButton = screen.getByTestId("mode-sim-button");
        fireEvent.click(simButton);

        expect(
            screen.queryByTestId("circuit-elevation-chart"),
        ).not.toBeInTheDocument();
    });

    it("allows pausing and resuming the car animation", () => {
        render(<CircuitInteractiveSimulator profile={zandvoortProfile} />);

        const toggleBtn = screen.getByTestId("toggle-car-animation");
        expect(screen.getByText("Pause Sim")).toBeInTheDocument();

        fireEvent.click(toggleBtn);
        expect(screen.getByText("Resume Sim")).toBeInTheDocument();
    });
});
