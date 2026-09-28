import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TeamCard } from "@/components/molecules/TeamCard";
import { ConstructorWithDetails } from "@/types/f1";

const mockTeam: ConstructorWithDetails = {
    constructorId: "red_bull",
    url: "https://en.wikipedia.org/wiki/Red_Bull_Racing",
    name: "Red Bull Racing",
    nationality: "Austrian",
    standing: {
        position: "1",
        positionText: "1",
        points: "500",
        wins: "12",
        Constructor: {
            constructorId: "red_bull",
            url: "https://en.wikipedia.org/wiki/Red_Bull_Racing",
            name: "Red Bull Racing",
            nationality: "Austrian",
        },
    },
};

describe("TeamCard Molecule", () => {
    it("renders team name, nationality, standing, points, and cta link", () => {
        render(<TeamCard team={mockTeam} />);

        expect(screen.getByTestId("team-card")).toBeInTheDocument();
        expect(screen.getByTestId("team-name")).toHaveTextContent(
            "Red Bull Racing",
        );
        expect(screen.getByText(/Austrian/i)).toBeInTheDocument();
        expect(screen.getByText("P1")).toBeInTheDocument();
        expect(screen.getByText(/500/)).toBeInTheDocument();
        expect(screen.getByText("Lihat Profil Tim")).toBeInTheDocument();
    });

    it("renders team logo with proper alt text and does not render car image in list", () => {
        render(<TeamCard team={mockTeam} />);

        const logoImg = screen.getByAltText("Red Bull Racing logo");
        expect(logoImg).toBeInTheDocument();
        expect(
            screen.queryByAltText(/Challenger|RB20|RB22|car/i),
        ).not.toBeInTheDocument();
    });
});
