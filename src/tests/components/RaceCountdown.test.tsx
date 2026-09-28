import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { RaceCountdown } from "@/components/molecules/RaceCountdown";

describe("RaceCountdown Molecule", () => {
    it("renders race information, circuit name, and round badge", () => {
        render(
            <RaceCountdown
                date="2099-10-15"
                time="14:00:00Z"
                raceName="United States Grand Prix"
                circuitName="Circuit of the Americas"
                country="USA"
                round="19"
            />,
        );

        expect(
            screen.getByText("United States Grand Prix"),
        ).toBeInTheDocument();
        expect(screen.getByText("Circuit of the Americas")).toBeInTheDocument();
        expect(screen.getByText("ROUND 19")).toBeInTheDocument();
        expect(screen.getByText("DAYS")).toBeInTheDocument();
        expect(screen.getByText("HOURS")).toBeInTheDocument();
        expect(screen.getByText("MINS")).toBeInTheDocument();
        expect(screen.getByText("SECS")).toBeInTheDocument();
    });

    it("displays zeroed counters when date is in the past", () => {
        render(
            <RaceCountdown
                date="2020-01-01"
                time="10:00:00Z"
                raceName="Past Grand Prix"
                circuitName="Past Track"
                country="Australia"
                round="1"
            />,
        );

        expect(screen.getByText("Past Grand Prix")).toBeInTheDocument();
        expect(screen.getByText("ROUND 01")).toBeInTheDocument();
        expect(screen.getAllByText("00").length).toBeGreaterThanOrEqual(4);
    });
});
