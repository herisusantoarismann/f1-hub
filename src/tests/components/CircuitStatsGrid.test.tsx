import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CircuitStatsGrid } from "@/components/molecules/CircuitStatsGrid";
import { CircuitProfile } from "@/data/circuits-database";

const mockMonzaProfile: CircuitProfile = {
    circuitId: "monza",
    officialName: "Autodromo Nazionale Monza",
    locality: "Monza",
    country: "Italy",
    lengthKm: 5.793,
    turns: 11,
    drsZones: 2,
    firstGrandPrix: 1950,
    racesHeld: 74,
    lapRecord: {
        time: "1:21.046",
        driver: "Rubens Barrichello",
        team: "Ferrari",
        year: 2004,
    },
    mostWins: {
        driver: "Michael Schumacher",
        driverWins: 5,
        team: "Ferrari",
        teamWins: 20,
    },
    iconicTurns: [
        {
            turn: "Turn 1-2",
            name: "Variante del Rettifilo",
            description: "Severe braking chicane off the main straight.",
        },
    ],
    description: "The Temple of Speed.",
};

describe("CircuitStatsGrid Component (Molecule)", () => {
    it("renders the official race lap record time, driver, team, and year", () => {
        render(<CircuitStatsGrid profile={mockMonzaProfile} />);

        // Time check
        expect(screen.getByTestId("lap-record-time")).toHaveTextContent(
            "1:21.046",
        );

        // Driver check
        expect(screen.getByTestId("lap-record-holder")).toHaveTextContent(
            "Rubens Barrichello",
        );

        // Team and Year check
        expect(screen.getByTestId("lap-record-team")).toHaveTextContent(
            "Ferrari",
        );
        expect(screen.getByText("2004")).toBeInTheDocument();
    });

    it("renders the driver and constructor with the most wins accurately", () => {
        render(<CircuitStatsGrid profile={mockMonzaProfile} />);

        // Driver most wins
        expect(screen.getByTestId("most-wins-driver")).toHaveTextContent(
            "Michael Schumacher",
        );
        expect(screen.getByTestId("most-wins-count")).toHaveTextContent(
            "5 wins",
        );

        // Constructor most wins
        expect(screen.getByTestId("most-wins-team")).toHaveTextContent(
            "Ferrari",
        );
        expect(screen.getByTestId("most-wins-team-count")).toHaveTextContent(
            "20 wins",
        );
    });

    it("renders F1 debut year and total races held", () => {
        render(<CircuitStatsGrid profile={mockMonzaProfile} />);

        // Debut year
        expect(screen.getByTestId("first-grand-prix-year")).toHaveTextContent(
            "1950",
        );

        // Total races held
        expect(screen.getByTestId("races-held-count")).toHaveTextContent("74");
    });

    it("handles singular win formatting correctly", () => {
        const singularWinProfile: CircuitProfile = {
            ...mockMonzaProfile,
            mostWins: {
                driver: "Oscar Piastri",
                driverWins: 1,
                team: "McLaren",
                teamWins: 1,
            },
        };

        render(<CircuitStatsGrid profile={singularWinProfile} />);
        expect(screen.getByTestId("most-wins-count")).toHaveTextContent(
            "1 win",
        );
    });
});
