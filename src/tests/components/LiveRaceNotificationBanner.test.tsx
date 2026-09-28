import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveRaceNotificationBanner } from "@/components/molecules/LiveRaceNotificationBanner";
import { INITIAL_LIVE_RACE_SESSION } from "@/lib/live-race-simulator";

describe("LiveRaceNotificationBanner Molecule", () => {
    it("does NOT render anything when there is no active live race session", () => {
        const { container } = render(
            <LiveRaceNotificationBanner
                initialStatus={{
                    isLive: false,
                    session: null,
                    nextRace: null,
                }}
            />,
        );

        // Container should be completely empty
        expect(container).toBeEmptyDOMElement();
        expect(
            screen.queryByTestId("live-race-notification-banner"),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/LIVE RACE SEDANG BERLANGSUNG/i),
        ).not.toBeInTheDocument();
    });

    it("renders the prominent live race banner and link when an active live race session exists", () => {
        render(
            <LiveRaceNotificationBanner
                initialStatus={{
                    isLive: true,
                    session: INITIAL_LIVE_RACE_SESSION,
                    nextRace: null,
                }}
            />,
        );

        expect(
            screen.getByTestId("live-race-notification-banner"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/LIVE RACE SEDANG BERLANGSUNG/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Racik di Live Race Strategy/i),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /Racik di Live Race Strategy/i }),
        ).toHaveAttribute("href", "/strategy/live");
    });
});
