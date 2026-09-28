import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RaceResultRow } from "@/components/molecules/RaceResultRow";
import { RaceResult } from "@/types/f1";

// Fixture: P1 Race Winner with total elapsed race time and Fastest Lap
const mockWinnerResult: RaceResult = {
    number: "1",
    position: "1",
    positionText: "1",
    points: "26",
    grid: "1",
    laps: "57",
    status: "Finished",
    Time: {
        millis: "5535223",
        time: "1:32:15.223",
    },
    FastestLap: {
        rank: "1",
        lap: "44",
        Time: {
            time: "1:31.442",
        },
    },
    Driver: {
        driverId: "max_verstappen",
        code: "VER",
        permanentNumber: "1",
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        url: "",
    },
    Constructor: {
        constructorId: "red_bull",
        name: "Red Bull Racing",
        nationality: "Austrian",
        url: "",
    },
};

// Fixture: P2 Finisher with time gap interval and gained grid positions
const mockRunnerUpResult: RaceResult = {
    number: "4",
    position: "2",
    positionText: "2",
    points: "18",
    grid: "5",
    laps: "57",
    status: "Finished",
    Time: {
        millis: "5540644",
        time: "+5.421s",
    },
    Driver: {
        driverId: "norris",
        code: "NOR",
        permanentNumber: "4",
        givenName: "Lando",
        familyName: "Norris",
        nationality: "British",
        url: "",
    },
    Constructor: {
        constructorId: "mclaren",
        name: "McLaren",
        nationality: "British",
        url: "",
    },
};

// Fixture: DNF Finisher due to Engine failure
const mockDnfResult: RaceResult = {
    number: "16",
    position: "19",
    positionText: "R",
    points: "0",
    grid: "2",
    laps: "23",
    status: "Engine",
    Driver: {
        driverId: "leclerc",
        code: "LEC",
        permanentNumber: "16",
        givenName: "Charles",
        familyName: "Leclerc",
        nationality: "Monegasque",
        url: "",
    },
    Constructor: {
        constructorId: "ferrari",
        name: "Ferrari",
        nationality: "Italian",
        url: "",
    },
};

// Fixture: Dropped positions
const mockDroppedResult: RaceResult = {
    number: "44",
    position: "6",
    positionText: "6",
    points: "8",
    grid: "3",
    laps: "57",
    status: "Finished",
    Time: {
        time: "+24.891s",
    },
    Driver: {
        driverId: "hamilton",
        code: "HAM",
        permanentNumber: "44",
        givenName: "Lewis",
        familyName: "Hamilton",
        nationality: "British",
        url: "",
    },
    Constructor: {
        constructorId: "mercedes",
        name: "Mercedes",
        nationality: "German",
        url: "",
    },
};

const renderRow = (result: RaceResult, isWinner?: boolean) => {
    return render(
        <table>
            <tbody>
                <RaceResultRow result={result} isWinner={isWinner} />
            </tbody>
        </table>,
    );
};

describe("RaceResultRow Component (Molecule)", () => {
    it("renders winner (P1) with full total elapsed race time and gold badge", () => {
        renderRow(mockWinnerResult, true);

        // Verification of winner time
        const timeEl = screen.getByTestId("result-time-status");
        expect(timeEl).toHaveTextContent("1:32:15.223");
        expect(timeEl.className).toContain("text-amber-400");

        // Verification of P1 badge
        const posBadge = screen.getByTestId("result-position-badge");
        expect(posBadge).toHaveTextContent("1");
        expect(posBadge.className).toContain("bg-amber-400");
        expect(posBadge.className).toContain("text-neutral-950");

        // Driver and team
        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
        expect(screen.getByText("Red Bull Racing")).toBeInTheDocument();
        expect(screen.getByTestId("result-points")).toHaveTextContent("26");
    });

    it("renders runner up (P2) with relative gap time and positive grid delta", () => {
        renderRow(mockRunnerUpResult);

        // Verification of gap interval time (+5.421s)
        const timeEl = screen.getByTestId("result-time-status");
        expect(timeEl).toHaveTextContent("+5.421s");

        // Grid delta: Started P5, Finished P2 = +3 positions gained
        const deltaEl = screen.getByTestId("grid-delta");
        expect(deltaEl).toHaveTextContent("+3");
        expect(deltaEl.className).toContain("text-emerald-400");

        // Silver P2 badge
        const posBadge = screen.getByTestId("result-position-badge");
        expect(posBadge).toHaveTextContent("2");
        expect(posBadge.className).toContain("bg-neutral-300");
    });

    it("renders DNF status when driver retires with mechanical failure or collision", () => {
        renderRow(mockDnfResult);

        // Verification of DNF failure status
        const timeEl = screen.getByTestId("result-time-status");
        expect(timeEl).toHaveTextContent("Engine");
        expect(timeEl.className).toContain("text-rose-400");

        // Zero points
        expect(screen.getByTestId("result-points")).toHaveTextContent("0");
    });

    it("renders negative grid movement when driver loses positions", () => {
        renderRow(mockDroppedResult);

        // Started P3, Finished P6 = -3 positions lost
        const deltaEl = screen.getByTestId("grid-delta");
        expect(deltaEl).toHaveTextContent("-3");
        expect(deltaEl.className).toContain("text-rose-400");
    });

    it("renders purple fastest lap badge when driver set the fastest lap of the race", () => {
        renderRow(mockWinnerResult);

        const flBadge = screen.getByTestId("fastest-lap-badge");
        expect(flBadge).toBeInTheDocument();
        expect(flBadge).toHaveTextContent("1:31.442");
        expect(flBadge.className).toContain("bg-purple-950/80");
        expect(flBadge.className).toContain("text-purple-300");
    });
});
