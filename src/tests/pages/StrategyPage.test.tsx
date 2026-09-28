import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import StrategyPage, { metadata } from "@/app/strategy/page";

vi.mock("@/components/organisms/PitStopStrategySimulator", () => ({
    PitStopStrategySimulator: () => (
        <div data-testid="mocked-pit-stop-simulator">Simulator Component</div>
    ),
}));

vi.mock("@/components/molecules/LiveRaceNotificationBanner", () => ({
    LiveRaceNotificationBanner: () => (
        <div data-testid="mocked-live-banner">Live Banner Component</div>
    ),
}));

describe("StrategyPage (/strategy)", () => {
    it("renders page title, description, and subcomponents", () => {
        render(<StrategyPage />);
        expect(
            screen.getByText("Pit Stop Strategy Simulator"),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("mocked-pit-stop-simulator"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("mocked-live-banner")).toBeInTheDocument();
    });

    it("has metadata configured with proper title", () => {
        expect(metadata.title).toBe(
            "Pit Stop & Tyre Strategy Simulator | F1 Hub",
        );
    });
});
