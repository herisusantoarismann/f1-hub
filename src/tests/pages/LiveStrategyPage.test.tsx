import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import LiveStrategyPage, { metadata } from "@/app/strategy/live/page";

// Mock the LiveRaceStrategyPitWall organism
vi.mock("@/components/organisms/LiveRaceStrategyPitWall", () => ({
    LiveRaceStrategyPitWall: () => (
        <div data-testid="mocked-live-pit-wall">Live Pit Wall Component</div>
    ),
}));

describe("LiveStrategyPage (/strategy/live)", () => {
    it("renders the LiveRaceStrategyPitWall component inside main container", () => {
        render(<LiveStrategyPage />);
        expect(screen.getByTestId("mocked-live-pit-wall")).toBeInTheDocument();
    });

    it("has metadata configured with proper title and description", () => {
        expect(metadata.title).toBe(
            "Live Race Strategy & Rejoin Pit Wall | F1 Hub",
        );
        expect(metadata.description).toContain("Formula 1 Pit Wall Strategy");
    });
});
