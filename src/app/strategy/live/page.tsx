import React from "react";
import { Metadata } from "next";
import { LiveRaceStrategyPitWall } from "@/components/organisms/LiveRaceStrategyPitWall";

export const metadata: Metadata = {
    title: "Live Race Strategy & Rejoin Pit Wall | F1 Hub",
    description:
        "Real-time Formula 1 Pit Wall Strategy. Calculate live pit rejoin positions, traffic exit windows, undercut threats, and remaining stint strategies during active Grand Prix sessions.",
    openGraph: {
        title: "Live Race Strategy & Rejoin Pit Wall | F1 Hub",
        description:
            "Live F1 Pit Wall Strategy. Rejoin position predictor, clean air gaps, undercut threats, and next box lap planner.",
    },
};

export default function LiveStrategyPage() {
    return (
        <main className="min-h-screen bg-f1-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <LiveRaceStrategyPitWall />
            </div>
        </main>
    );
}
