import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { DriverSelectorCard } from "@/components/molecules/DriverSelectorCard";
import { DriverPerformanceProfile } from "@/data/drivers-ratings";

const mockDrivers: DriverPerformanceProfile[] = [
    {
        driverId: "max_verstappen",
        fullName: "Max Verstappen",
        code: "VER",
        permanentNumber: "1",
        nationality: "Dutch",
        constructorId: "red_bull",
        teamName: "Red Bull Racing",
        teamColor: "#3671c6",
        overallRating: 97,
        skills: {
            qualifyingPace: 98,
            raceCraft: 96,
            consistency: 95,
            overtaking: 95,
            wetWeather: 98,
            experience: 90,
        },
        careerStats: {
            worldChampionships: 3,
            wins: 60,
            podiums: 105,
            polePositions: 40,
            fastestLaps: 32,
            careerPoints: 2900,
            grandPrixStarts: 200,
            bestFinish: "1st",
        },
        analystSummary: {
            racingStyle: "Aggressive & Clinical",
            strengths: ["Race pace", "Wet weather control"],
            weaknesses: ["Temperament under frustration"],
        },
    },
    {
        driverId: "norris",
        fullName: "Lando Norris",
        code: "NOR",
        permanentNumber: "4",
        nationality: "British",
        constructorId: "mclaren",
        teamName: "McLaren",
        teamColor: "#ff8000",
        overallRating: 93,
        skills: {
            qualifyingPace: 95,
            raceCraft: 91,
            consistency: 91,
            overtaking: 90,
            wetWeather: 92,
            experience: 85,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 3,
            podiums: 24,
            polePositions: 8,
            fastestLaps: 10,
            careerPoints: 950,
            grandPrixStarts: 120,
            bestFinish: "1st",
        },
        analystSummary: {
            racingStyle: "Fluid & Consistent",
            strengths: ["Single lap pace", "Tyre preservation"],
            weaknesses: ["Starts in dirty air"],
        },
    },
];

describe("DriverSelectorCard Molecule", () => {
    it("renders driver information, team name, and ratings summary", () => {
        render(
            <DriverSelectorCard
                slotLabel="Driver 1"
                driver={mockDrivers[0]}
                availableDrivers={mockDrivers}
                onSelectDriver={vi.fn()}
                accentColor="#3671c6"
            />,
        );

        expect(
            screen.getByTestId("driver-selector-max_verstappen"),
        ).toBeInTheDocument();
        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
        expect(screen.getByText("Red Bull Racing")).toBeInTheDocument();
        expect(screen.getByText("Driver 1")).toBeInTheDocument();
        expect(screen.getByText("Aggressive & Clinical")).toBeInTheDocument();
    });

    it("triggers onSelectDriver callback when changing selected option", async () => {
        const handleSelect = vi.fn();
        const user = userEvent.setup();

        render(
            <DriverSelectorCard
                slotLabel="Driver 1"
                driver={mockDrivers[0]}
                availableDrivers={mockDrivers}
                onSelectDriver={handleSelect}
                accentColor="#3671c6"
            />,
        );

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "norris");
        expect(handleSelect).toHaveBeenCalledWith("norris");
    });
});
