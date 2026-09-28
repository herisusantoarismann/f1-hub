import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RaceCard } from "@/components/molecules/RaceCard";
import { Race } from "@/types/f1";

const mockRace: Race = {
    season: "2024",
    round: "1",
    url: "https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix",
    raceName: "Bahrain Grand Prix",
    Circuit: {
        circuitId: "bahrain",
        url: "https://en.wikipedia.org/wiki/Bahrain_International_Circuit",
        circuitName: "Bahrain International Circuit",
        Location: {
            lat: "26.0325",
            long: "50.5106",
            locality: "Sakhir",
            country: "Bahrain",
        },
    },
    date: "2024-03-02",
    time: "15:00:00Z",
};

const mockSprintRace: Race = {
    ...mockRace,
    round: "5",
    raceName: "Chinese Grand Prix",
    Sprint: {
        date: "2024-04-20",
        time: "03:00:00Z",
    },
};

describe("RaceCard Component (Molecule)", () => {
    it("renders the Grand Prix title, circuit, and country location", () => {
        render(<RaceCard race={mockRace} status="upcoming" />);

        expect(screen.getByTestId("race-name")).toHaveTextContent(
            "Bahrain Grand Prix",
        );
        expect(screen.getByTestId("circuit-name")).toHaveTextContent(
            "Bahrain International Circuit",
        );
        expect(screen.getByTestId("location-text")).toHaveTextContent(
            "Sakhir, Bahrain",
        );
    });

    it("pads the round number with leading zero", () => {
        render(<RaceCard race={mockRace} status="upcoming" />);

        expect(screen.getByTestId("round-badge")).toHaveTextContent("ROUND 01");
    });

    it("renders NEXT RACE badge when status is 'next'", () => {
        render(<RaceCard race={mockRace} status="next" daysRemaining={3} />);

        expect(screen.getByText("NEXT RACE")).toBeInTheDocument();
        expect(screen.getByText(/In 3 days/i)).toBeInTheDocument();
    });

    it("renders FINISHED badge when status is 'completed'", () => {
        render(<RaceCard race={mockRace} status="completed" />);

        expect(screen.getByText("FINISHED")).toBeInTheDocument();
        expect(screen.getByText(/Results in/i)).toBeInTheDocument();
    });

    it("renders sprint badge when race contains a sprint session", () => {
        render(<RaceCard race={mockSprintRace} status="upcoming" />);

        expect(screen.getByText("SPRINT")).toBeInTheDocument();
    });

    it("triggers onSelect callback when clicking details button", async () => {
        const handleSelect = vi.fn();
        const user = userEvent.setup();

        render(<RaceCard race={mockRace} onSelect={handleSelect} />);

        const detailsBtn = screen.getByRole("button", {
            name: /View details for Bahrain Grand Prix/i,
        });
        await user.click(detailsBtn);

        expect(handleSelect).toHaveBeenCalledTimes(1);
        expect(handleSelect).toHaveBeenCalledWith(mockRace);
    });
});
