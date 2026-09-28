import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DriverStandingRow } from "@/components/molecules/DriverStandingRow";
import { DriverStanding } from "@/types/standings";

// Mock driver standing fixtures
const mockP1Standing: DriverStanding = {
    position: "1",
    positionText: "1",
    points: "437",
    wins: "12",
    Driver: {
        driverId: "max_verstappen",
        permanentNumber: "1",
        code: "VER",
        givenName: "Max",
        familyName: "Verstappen",
        dateOfBirth: "1997-09-30",
        nationality: "Dutch",
    },
    Constructors: [
        {
            constructorId: "red_bull",
            name: "Red Bull Racing",
            nationality: "Austrian",
        },
    ],
};

const mockP2Standing: DriverStanding = {
    position: "2",
    positionText: "2",
    points: "374",
    wins: "4",
    Driver: {
        driverId: "norris",
        permanentNumber: "4",
        code: "NOR",
        givenName: "Lando",
        familyName: "Norris",
        nationality: "British",
    },
    Constructors: [
        {
            constructorId: "mclaren",
            name: "McLaren",
            nationality: "British",
        },
    ],
};

const mockP4Standing: DriverStanding = {
    position: "4",
    positionText: "4",
    points: "215",
    wins: "1",
    Driver: {
        driverId: "piastri",
        permanentNumber: "81",
        code: "PIA",
        givenName: "Oscar",
        familyName: "Piastri",
        nationality: "Australian",
    },
    Constructors: [
        {
            constructorId: "mclaren",
            name: "McLaren",
            nationality: "British",
        },
    ],
};

// Wrap in <table><tbody> for valid HTML table row rendering
const renderRow = (standing: DriverStanding) => {
    return render(
        <table>
            <tbody>
                <DriverStandingRow standing={standing} />
            </tbody>
        </table>,
    );
};

describe("DriverStandingRow Component (Molecule)", () => {
    it("renders driver name, code, permanent number, and team correctly", () => {
        renderRow(mockP1Standing);

        // Driver full name
        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();

        // Code and permanent number
        expect(screen.getByText("VER")).toBeInTheDocument();
        expect(screen.getByText("#1")).toBeInTheDocument();

        // Team name
        expect(screen.getByText("Red Bull Racing")).toBeInTheDocument();

        // Nationality
        expect(screen.getByText("Dutch")).toBeInTheDocument();
    });

    it("renders points and wins accurately", () => {
        renderRow(mockP1Standing);

        const pointsEl = screen.getByTestId("driver-points");
        expect(pointsEl).toHaveTextContent("437");
        expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("applies special championship leader (P1) gold styling", () => {
        renderRow(mockP1Standing);

        const badge = screen.getByTestId("standing-position-badge");
        expect(badge).toHaveTextContent("1");
        expect(badge.className).toContain("bg-amber-400");
        expect(badge.className).toContain("text-neutral-950");
        expect(badge.className).toContain("font-black");

        const row = screen.getByTestId("driver-standing-row-max_verstappen");
        expect(row.className).toContain("bg-amber-500/[0.04]");
    });

    it("applies silver styling for P2 and standard styling for non-podium positions", () => {
        const { unmount } = renderRow(mockP2Standing);

        const p2Badge = screen.getByTestId("standing-position-badge");
        expect(p2Badge).toHaveTextContent("2");
        expect(p2Badge.className).toContain("bg-neutral-300");

        unmount();

        renderRow(mockP4Standing);
        const p4Badge = screen.getByTestId("standing-position-badge");
        expect(p4Badge).toHaveTextContent("4");
        expect(p4Badge.className).toContain("text-neutral-400");
    });

    it("links to the correct driver and team detail routes", () => {
        renderRow(mockP1Standing);

        const driverLink = screen.getByRole("link", {
            name: /max verstappen/i,
        });
        expect(driverLink).toHaveAttribute("href", "/drivers/max_verstappen");

        const teamLink = screen.getByRole("link", {
            name: /red bull racing/i,
        });
        expect(teamLink).toHaveAttribute("href", "/teams/red_bull");
    });
});
