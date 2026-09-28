import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DriverCard } from "@/components/molecules/DriverCard";
import { DriverWithTeam } from "@/types/f1";
import { DEFAULT_AVATARS } from "@/lib/utils/asset-helper";

const mockDriver: DriverWithTeam = {
    driverId: "max_verstappen",
    permanentNumber: "1",
    code: "VER",
    givenName: "Max",
    familyName: "Verstappen",
    dateOfBirth: "1997-09-30",
    nationality: "Dutch",
    url: "https://en.wikipedia.org/wiki/Max_Verstappen",
    team: {
        constructorId: "red_bull",
        name: "Red Bull Racing",
        nationality: "Austrian",
        url: "https://en.wikipedia.org/wiki/Red_Bull_Racing",
    },
    position: "1",
    points: "437",
    wins: "9",
};

const mockDriverWithoutTeam: DriverWithTeam = {
    driverId: "reserve_driver",
    code: "RES",
    givenName: "Reserve",
    familyName: "Rookie",
    nationality: "British",
    url: "https://en.wikipedia.org",
};

describe("DriverCard Component (Molecule)", () => {
    it("renders driver name, racing number, and nationality", () => {
        render(<DriverCard driver={mockDriver} />);

        expect(screen.getByTestId("driver-name")).toHaveTextContent(
            "Max Verstappen",
        );
        expect(screen.getByTestId("driver-number")).toHaveTextContent("#1");
        expect(screen.getByText(/Dutch/i)).toBeInTheDocument();
    });

    it("renders team name and points correctly", () => {
        render(<DriverCard driver={mockDriver} />);

        expect(screen.getByTestId("driver-team")).toHaveTextContent(
            "Red Bull Racing",
        );
        expect(screen.getByText(/437 PTS/i)).toBeInTheDocument();
        expect(screen.getByText(/P1/i)).toBeInTheDocument();
    });

    it("links to the correct driver profile route", () => {
        render(<DriverCard driver={mockDriver} />);

        const link = screen.getByTestId("driver-card");
        expect(link).toHaveAttribute("href", "/drivers/max_verstappen");
    });

    it("uses legal vector driver avatar and falls back gracefully on error", () => {
        render(<DriverCard driver={mockDriver} />);

        const image = screen.getByAltText("Max Verstappen");
        expect(image.getAttribute("src")).toContain(DEFAULT_AVATARS.driver);

        // Simulate image load error
        fireEvent.error(image);

        // Should maintain default fallback avatar
        expect(image.getAttribute("src")).toContain(DEFAULT_AVATARS.driver);
    });

    it("handles drivers without an assigned team gracefully", () => {
        render(<DriverCard driver={mockDriverWithoutTeam} />);

        expect(screen.getByTestId("driver-name")).toHaveTextContent(
            "Reserve Rookie",
        );
        expect(screen.getByTestId("driver-team")).toHaveTextContent(
            "Free Agent / Unassigned",
        );
    });

    it("uses default_driver.svg directly when driver has no official headshot", () => {
        render(<DriverCard driver={mockDriverWithoutTeam} />);

        const image = screen.getByAltText("Reserve Rookie");
        expect(image.getAttribute("src")).toContain(DEFAULT_AVATARS.driver);
    });
});
