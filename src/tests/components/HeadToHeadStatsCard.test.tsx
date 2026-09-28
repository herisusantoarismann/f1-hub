import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeadToHeadStatsCard } from "@/components/molecules/HeadToHeadStatsCard";
import { getDriverPerformance } from "@/data/drivers-ratings";

describe("HeadToHeadStatsCard Component (Molecule)", () => {
    const hamilton = getDriverPerformance("hamilton");
    const leclerc = getDriverPerformance("leclerc");

    it("renders career milestones and comparison header", () => {
        render(<HeadToHeadStatsCard driver1={hamilton} driver2={leclerc} />);

        expect(
            screen.getByTestId("head-to-head-stats-card"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Career Milestones & Head-to-Head/i),
        ).toBeInTheDocument();
    });

    it("renders all critical comparative metrics", () => {
        render(<HeadToHeadStatsCard driver1={hamilton} driver2={leclerc} />);

        expect(screen.getByText("World Championships")).toBeInTheDocument();
        expect(screen.getByText("Grand Prix Wins")).toBeInTheDocument();
        expect(screen.getByText("Podium Finishes")).toBeInTheDocument();
        expect(screen.getByText("Pole Positions")).toBeInTheDocument();
        expect(screen.getByText("Fastest Laps")).toBeInTheDocument();
        expect(screen.getByText("Career Points")).toBeInTheDocument();
        expect(screen.getByText("Grand Prix Starts")).toBeInTheDocument();
    });

    it("correctly renders values for the compared drivers", () => {
        render(<HeadToHeadStatsCard driver1={hamilton} driver2={leclerc} />);

        // Hamilton's 7 WDCs
        expect(screen.getByText("7")).toBeInTheDocument();
        // Hamilton's 105 wins
        expect(screen.getByText("105")).toBeInTheDocument();
        // Leclerc's 8 wins
        expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("verifies Antonelli's updated career stats show wins", () => {
        const antonelli = getDriverPerformance("antonelli");
        expect(antonelli.careerStats.wins).toBe(8);
        expect(antonelli.careerStats.podiums).toBe(12);
        expect(antonelli.careerStats.careerPoints).toBe(452);
    });

    it("renders specific season head-to-head metrics when in season mode", () => {
        const antonelli = getDriverPerformance("antonelli");
        const max = getDriverPerformance("max_verstappen");

        render(
            <HeadToHeadStatsCard
                driver1={antonelli}
                driver2={max}
                selectedSeason="2026"
                seasonStats1={{
                    season: "2026",
                    driverId: "antonelli",
                    fullName: "Kimi Antonelli",
                    code: "ANT",
                    teamName: "Mercedes-AMG Petronas",
                    teamColor: "#27F4D2",
                    championshipPosition: "P1",
                    worldChampionships: 1,
                    wins: 8,
                    podiums: 12,
                    polePositions: 6,
                    fastestLaps: 7,
                    points: 302,
                    grandPrixStarts: 15,
                    bestFinish: "P1",
                    skills: antonelli.skills,
                    overallRating: 92,
                }}
                seasonStats2={{
                    season: "2026",
                    driverId: "max_verstappen",
                    fullName: "Max Verstappen",
                    code: "VER",
                    teamName: "Red Bull Racing",
                    teamColor: "#3671C6",
                    championshipPosition: "P6",
                    worldChampionships: 0,
                    wins: 0,
                    podiums: 7,
                    polePositions: 0,
                    fastestLaps: 1,
                    points: 163,
                    grandPrixStarts: 15,
                    bestFinish: "P2",
                    skills: max.skills,
                    overallRating: 96,
                }}
            />,
        );

        expect(
            screen.getByText(/Season 2026 Head-to-Head Battle/i),
        ).toBeInTheDocument();
        expect(screen.getByText("Championship Standing")).toBeInTheDocument();
        expect(screen.getByText("Season Wins")).toBeInTheDocument();
        expect(screen.getByText("Season Points")).toBeInTheDocument();
        expect(screen.getByText("P1 (Champion)")).toBeInTheDocument();
        expect(screen.getByText("302")).toBeInTheDocument();
        expect(screen.getByText("163")).toBeInTheDocument();
    });
});
