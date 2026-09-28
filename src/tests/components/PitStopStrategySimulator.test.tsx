import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PitStopStrategySimulator } from "@/components/organisms/PitStopStrategySimulator";

describe("PitStopStrategySimulator Organism", () => {
    it("renders the circuit header, telemetry specs, stint editor, and strategy cards", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        expect(
            screen.getByTestId("pit-stop-strategy-simulator"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Bahrain International Circuit"),
        ).toBeInTheDocument();
        expect(screen.getByText("Normal Pit Loss")).toBeInTheDocument();
        expect(
            screen.getByText("Interactive Stint & Pit Window Editor"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("lap-time-delta-chart")).toBeInTheDocument();
    });

    it("allows switching the circuit to Albert Park Melbourne", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        const selectCircuit = screen.getByLabelText("Select Circuit");
        fireEvent.change(selectCircuit, { target: { value: "albert_park" } });

        expect(screen.getByText("Albert Park Circuit")).toBeInTheDocument();
        expect(screen.getAllByText(/58 Laps/i).length).toBeGreaterThan(0);
    });

    it("toggles the Safety Car incident simulation", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        const scToggleBtn = screen.getByRole("button", {
            name: /Simulate Safety Car/i,
        });
        fireEvent.click(scToggleBtn);

        expect(
            screen.getByRole("button", { name: /Safety Car Active/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/SC Lap:/i)).toBeInTheDocument();
    });

    it("allows switching which strategy is being edited", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        const strat2Btn = screen.getByRole("button", { name: "Strategy 2" });
        fireEvent.click(strat2Btn);

        expect(strat2Btn.className).toContain("bg-f1-red");
    });

    it("renders the stint-by-stint breakdown and allows adding a new strategy", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        expect(
            screen.getByText("Rincian Waktu Per Stint:"),
        ).toBeInTheDocument();
        expect(screen.getByText("Total Waktu Balap")).toBeInTheDocument();

        // Click Add Strategy button
        const addStratBtn = screen.getByRole("button", {
            name: /Add Strategy/i,
        });
        fireEvent.click(addStratBtn);

        // A new Strategy 4 button should appear
        expect(
            screen.getByRole("button", { name: "Strategy 4" }),
        ).toBeInTheDocument();
    });

    it("toggles the side-by-side strategy comparison panel", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        const compareBtn = screen.getByRole("button", { name: /Compare/i });
        fireEvent.click(compareBtn);

        expect(
            screen.getByText(/Bandingkan Semua Strategi/i),
        ).toBeInTheDocument();
    });

    it("prominently displays the FIA 2-compound dry tyre warning when only 1 compound is selected in dry conditions", () => {
        render(<PitStopStrategySimulator initialCircuitId="bahrain" />);

        expect(
            screen.getByText("Regulasi 2 Compound Terpenuhi"),
        ).toBeInTheDocument();

        // Change all stints to SOFT so only 1 compound is used
        const softButtons = screen.getAllByRole("button", { name: "S" });
        softButtons.forEach((btn) => fireEvent.click(btn));

        // Prominent warning banner should appear
        expect(
            screen.getByText(/PERINGATAN REGULASI FIA \(ART\. 30\.5\)/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Wajib menggunakan minimal/i),
        ).toBeInTheDocument();
        expect(screen.getByText("DSQ PENALTY")).toBeInTheDocument();
    });
});
