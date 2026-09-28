import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChampionshipCalculator } from "@/components/organisms/ChampionshipCalculator";
import {
    FALLBACK_DRIVER_STANDINGS,
    FALLBACK_CONSTRUCTOR_STANDINGS,
} from "@/data/standings-fallback";

describe("ChampionshipCalculator Organism", () => {
    it("renders the clinch card, finish position picker, and simulated standings table", () => {
        render(
            <ChampionshipCalculator
                initialDriverStandings={FALLBACK_DRIVER_STANDINGS}
                initialConstructorStandings={FALLBACK_CONSTRUCTOR_STANDINGS}
            />,
        );

        expect(
            screen.getByTestId("championship-calculator"),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("championship-clinch-card"),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("race-finish-position-picker"),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("simulated-standings-table"),
        ).toBeInTheDocument();

        expect(screen.getAllByText("Max Verstappen").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Lando Norris").length).toBeGreaterThan(0);
    });

    it("applies a preset scenario and updates the simulated points", () => {
        render(
            <ChampionshipCalculator
                initialDriverStandings={FALLBACK_DRIVER_STANDINGS}
                initialConstructorStandings={FALLBACK_CONSTRUCTOR_STANDINGS}
            />,
        );

        // Click preset button
        const mclarenPresetBtn = screen.getByText(
            /McLaren 1-2 \(Norris P1, Piastri P2\)/i,
        );
        fireEvent.click(mclarenPresetBtn);

        // Norris should have +26 pts (25 + 1 FL)
        expect(screen.getAllByText("+26").length).toBeGreaterThan(0);
        // Piastri should have +18 pts (P2)
        expect(screen.getAllByText("+18").length).toBeGreaterThan(0);
    });

    it("switches between Drivers and Constructors standings tabs", () => {
        render(
            <ChampionshipCalculator
                initialDriverStandings={FALLBACK_DRIVER_STANDINGS}
                initialConstructorStandings={FALLBACK_CONSTRUCTOR_STANDINGS}
            />,
        );

        const constructorsTab = screen.getByTestId(
            "tab-simulated-constructors",
        );
        fireEvent.click(constructorsTab);

        expect(screen.getAllByText("Red Bull Racing").length).toBeGreaterThan(
            0,
        );
        expect(screen.getAllByText("Ferrari").length).toBeGreaterThan(0);

        const driversTab = screen.getByTestId("tab-simulated-drivers");
        fireEvent.click(driversTab);

        expect(screen.getAllByText("Max Verstappen").length).toBeGreaterThan(0);
    });

    it("resets outcomes when Reset button is clicked", () => {
        render(
            <ChampionshipCalculator
                initialDriverStandings={FALLBACK_DRIVER_STANDINGS}
                initialConstructorStandings={FALLBACK_CONSTRUCTOR_STANDINGS}
            />,
        );

        // Apply preset first
        const presetBtn = screen.getByText(/Verstappen P1, Norris P4/i);
        fireEvent.click(presetBtn);
        expect(screen.getAllByText("+26").length).toBeGreaterThan(0);

        // Reset
        const resetBtn = screen.getByRole("button", { name: /reset/i });
        fireEvent.click(resetBtn);

        // Points added badges should be gone / reset
        expect(screen.queryByText("+26")).toBeNull();
    });
});
