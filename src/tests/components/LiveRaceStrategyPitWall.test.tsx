import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LiveRaceStrategyPitWall } from "@/components/organisms/LiveRaceStrategyPitWall";
import { INITIAL_LIVE_RACE_SESSION } from "@/lib/live-race-simulator";

describe("LiveRaceStrategyPitWall Organism", () => {
    it("renders the clean empty state when there is no active live race in progress", () => {
        render(
            <LiveRaceStrategyPitWall
                initialSession={null}
                initialNextRace={{
                    name: "Japanese Grand Prix",
                    circuit: "Suzuka",
                    dateStart: "2026-10-04T05:00:00Z",
                    location: "Suzuka",
                }}
            />,
        );

        expect(screen.getByTestId("live-race-no-session")).toBeInTheDocument();
        expect(
            screen.getByText("Tidak Ada Sesi Balapan yang Sedang Berlangsung"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Live Race Strategy Pit Wall hanya aktif/i),
        ).toBeInTheDocument();
        expect(screen.getByText("Japanese Grand Prix")).toBeInTheDocument();
        expect(
            screen.getByRole("link", {
                name: /Kembali ke Simulator Strategi Offline/i,
            }),
        ).toHaveAttribute("href", "/strategy");
    });

    it("renders the live race session header, leaderboard, and rejoin analysis when race is live", () => {
        render(
            <LiveRaceStrategyPitWall
                initialSession={INITIAL_LIVE_RACE_SESSION}
            />,
        );

        expect(
            screen.getByTestId("live-race-strategy-pit-wall"),
        ).toBeInTheDocument();
        expect(screen.getByText("Australian Grand Prix")).toBeInTheDocument();
        expect(screen.getByText(/Albert Park Circuit/i)).toBeInTheDocument();
        expect(
            screen.getByText("Live Race Running Order (Leaderboard)"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Proyeksi Keluar Pit (Pit Rejoin):"),
        ).toBeInTheDocument();
    });

    it("allows selecting a different driver from the running order", () => {
        render(
            <LiveRaceStrategyPitWall
                initialSession={INITIAL_LIVE_RACE_SESSION}
            />,
        );

        // Find Lando Norris button in the leaderboard
        const norrisBtn = screen.getByRole("button", {
            name: /NOR/i,
        });
        fireEvent.click(norrisBtn);

        // Header for target driver should now show Lando Norris
        expect(screen.getByText(/Lando Norris \(NOR\)/i)).toBeInTheDocument();
    });

    it("toggles the race flag to Safety Car and reflects cheap pit loss", () => {
        render(
            <LiveRaceStrategyPitWall
                initialSession={INITIAL_LIVE_RACE_SESSION}
            />,
        );

        const scBtn = screen.getByRole("button", {
            name: /Safety Car \(SC\)/i,
        });
        fireEvent.click(scBtn);

        expect(
            screen.getByText(/SAFETY CAR WINDOW OPPORTUNITY:/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/12.8s \(SC Cheap\)/i)).toBeInTheDocument();
    });

    it("switches target tire compound and updates the remaining stint plan", () => {
        render(
            <LiveRaceStrategyPitWall
                initialSession={INITIAL_LIVE_RACE_SESSION}
            />,
        );

        // Switch to SOFT compound
        const softBtn = screen.getByRole("button", { name: "SOFT" });
        fireEvent.click(softBtn);

        // Should switch to a 2-stop sprint with a second box lap target
        expect(screen.getByText("2-Stop Sprint")).toBeInTheDocument();
        expect(screen.getByText("Jendela Pit Stop Kedua:")).toBeInTheDocument();
    });
});
