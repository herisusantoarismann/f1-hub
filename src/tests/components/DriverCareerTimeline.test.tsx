import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DriverCareerTimeline } from "@/components/organisms/DriverCareerTimeline";
import { DRIVERS_CAREER_DATABASE } from "@/data/drivers-career";

describe("DriverCareerTimeline Component (Organism)", () => {
    const hamiltonCareer = DRIVERS_CAREER_DATABASE.hamilton;
    const piastriCareer = DRIVERS_CAREER_DATABASE.piastri;

    it("renders World Championship badge and all championship years for a World Champion", () => {
        render(<DriverCareerTimeline career={hamiltonCareer} />);

        // World Championship banner
        expect(screen.getByText("7× World Champion")).toBeInTheDocument();
        expect(screen.getByText("2008")).toBeInTheDocument();
        expect(screen.getByText("2014")).toBeInTheDocument();
        expect(screen.getByText("2020")).toBeInTheDocument();
    });

    it("renders F1 teams history with tenure years and highlights", () => {
        render(<DriverCareerTimeline career={hamiltonCareer} />);

        // Should display McLaren, Mercedes, Ferrari
        expect(
            screen.getByText("Vodafone McLaren Mercedes"),
        ).toBeInTheDocument();
        expect(screen.getByText("2007–2012")).toBeInTheDocument();

        expect(
            screen.getByText("Mercedes-AMG Petronas F1 Team"),
        ).toBeInTheDocument();
        expect(screen.getByText("2013–2024")).toBeInTheDocument();

        expect(screen.getByText("Scuderia Ferrari HP")).toBeInTheDocument();
        expect(screen.getByText("2025–Present")).toBeInTheDocument();
        expect(screen.getByText("Current Team")).toBeInTheDocument();
    });

    it("switches to Junior Ladder tab and displays the pathway from Karting to F2", () => {
        render(<DriverCareerTimeline career={hamiltonCareer} />);

        const juniorTab = screen.getByTestId("tab-junior-ladder");
        fireEvent.click(juniorTab);

        // Check Junior pathway elements
        expect(screen.getByTestId("junior-ladder-panel")).toBeInTheDocument();
        expect(screen.getByText("Formula Renault 2.0 UK")).toBeInTheDocument();
        expect(screen.getByText("Formula 3 Euro Series")).toBeInTheDocument();
        expect(screen.getByText("GP2 Series (now F2)")).toBeInTheDocument();
        expect(screen.getAllByText(/Champion 🏆/i).length).toBeGreaterThan(0);
    });

    it("renders Junior Titles for non-World Champions (e.g. Oscar Piastri)", () => {
        render(<DriverCareerTimeline career={piastriCareer} />);

        expect(screen.getByText("Junior Formula Champion")).toBeInTheDocument();
        expect(screen.getByText(/FIA Formula 3 Champion/i)).toBeInTheDocument();
        expect(screen.getByText(/FIA Formula 2 Champion/i)).toBeInTheDocument();

        // Check F1 stint
        expect(screen.getByText("McLaren Formula 1 Team")).toBeInTheDocument();
    });
});
