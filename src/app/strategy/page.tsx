import React from "react";
import { Metadata } from "next";
import { PitStopStrategySimulator } from "@/components/organisms/PitStopStrategySimulator";
import { LiveRaceNotificationBanner } from "@/components/molecules/LiveRaceNotificationBanner";
import { Wrench, Timer, Gauge } from "lucide-react";

export const metadata: Metadata = {
    title: "Pit Stop & Tyre Strategy Simulator | F1 Hub",
    description:
        "Interactive Formula 1 Pit Stop Strategy & Tyre Degradation Simulator. Simulate lap-by-lap race pace, pit loss deltas, fuel burn-off, and undercut advantages across Grand Prix circuits.",
    openGraph: {
        title: "Formula 1 Pit Stop & Tyre Strategy Simulator | F1 Hub",
        description:
            "Simulate F1 pit stop windows, total race times, and Pirelli tyre degradation curves with interactive telemetry.",
    },
};

export default function StrategyPage() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-f1-red/15 text-f1-red border border-f1-red/30 flex items-center gap-1.5">
                                <Wrench className="w-3.5 h-3.5 text-f1-red" />
                                Race Engineering Lab
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-neutral-400 border border-neutral-800">
                                Pirelli Tyre Telemetry &bull; Real-time Matrix
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Pit Stop Strategy Simulator
                        </h1>
                        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
                            Simulasikan degradasi ban Pirelli, efek pengurangan
                            beban bahan bakar (*fuel burn-off*), kerugian waktu
                            di pit lane (*pit loss*), dan kalkulasi total waktu
                            balap secara presisi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 self-start md:self-auto">
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pace & Delta Calculator</span>
                    </div>
                </div>

                {/* Live Race Announcement Banner (Only rendered when race is live) */}
                <LiveRaceNotificationBanner />

                {/* Strategy Simulator Organism */}
                <PitStopStrategySimulator initialCircuitId="bahrain" />
            </div>
        </main>
    );
}
