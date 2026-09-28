import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChampionshipClinchCard } from "@/components/molecules/ChampionshipClinchCard";
import { calculateSimulatedDriverStandings } from "@/lib/calculator-utils";
import { FALLBACK_DRIVER_STANDINGS } from "@/data/standings-fallback";

describe("ChampionshipClinchCard Molecule", () => {
    const simulatedDrivers = calculateSimulatedDriverStandings(
        FALLBACK_DRIVER_STANDINGS,
        {},
        true,
    );

    it("renders the title clinch scenario and metrics", () => {
        render(
            <ChampionshipClinchCard
                drivers={simulatedDrivers}
                leaderId="max_verstappen"
                chaserId="norris"
                onLeaderChange={vi.fn()}
                onChaserChange={vi.fn()}
                remainingRacesAfterThis={3}
                onRemainingRacesChange={vi.fn()}
                hasSprintRemaining={false}
                includeFastestLap={true}
            />,
        );

        expect(
            screen.getByTestId("championship-clinch-card"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Championship Title Clinch Scenario"),
        ).toBeInTheDocument();
        expect(screen.getByText("TITLE BATTLE ALIVE ⚔️")).toBeInTheDocument();
        expect(screen.getByText("Selisih Poin Saat Ini")).toBeInTheDocument();
        expect(screen.getByText("Maks Poin Tersisa")).toBeInTheDocument();
    });

    it("displays TITLE CLINCHED when gap exceeds max remaining points", () => {
        const clinchedDrivers = calculateSimulatedDriverStandings(
            FALLBACK_DRIVER_STANDINGS,
            {
                max_verstappen: {
                    driverId: "max_verstappen",
                    gpPosition: 1, // +26 -> 419 pts
                },
                norris: {
                    driverId: "norris",
                    gpPosition: null, // 0 -> 331 pts (gap = 88 pts)
                },
            },
            true,
        );

        render(
            <ChampionshipClinchCard
                drivers={clinchedDrivers}
                leaderId="max_verstappen"
                chaserId="norris"
                onLeaderChange={vi.fn()}
                onChaserChange={vi.fn()}
                remainingRacesAfterThis={2} // max pts = 2 * 26 = 52 < 88
                onRemainingRacesChange={vi.fn()}
                hasSprintRemaining={false}
                includeFastestLap={true}
            />,
        );

        expect(screen.getByText("TITLE CLINCHED! 🏆")).toBeInTheDocument();
    });

    it("triggers onRemainingRacesChange when slider changes", () => {
        const onRacesChange = vi.fn();
        render(
            <ChampionshipClinchCard
                drivers={simulatedDrivers}
                leaderId="max_verstappen"
                chaserId="norris"
                onLeaderChange={vi.fn()}
                onChaserChange={vi.fn()}
                remainingRacesAfterThis={3}
                onRemainingRacesChange={onRacesChange}
                hasSprintRemaining={false}
                includeFastestLap={true}
            />,
        );

        const slider = screen.getByRole("slider");
        fireEvent.change(slider, { target: { value: "5" } });

        expect(onRacesChange).toHaveBeenCalledWith(5);
    });
});
