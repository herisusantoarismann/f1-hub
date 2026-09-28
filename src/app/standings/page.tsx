import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { f1Client } from "@/lib/api/f1-client";
import { StandingsTabs } from "@/components/organisms/StandingsTabs";
import { Trophy, Calculator } from "lucide-react";

export const metadata: Metadata = {
    title: "Championship Standings | F1 Hub",
    description:
        "Official Formula 1 World Championship Standings for Drivers and Constructors with live points, victories, and team standings.",
    openGraph: {
        title: "Formula 1 World Championship Standings | F1 Hub",
        description:
            "Follow the title battle for the FIA Formula One Drivers' and Constructors' Championships.",
    },
};

export const revalidate = 3600; // Revalidate every hour

export default async function StandingsPage() {
    // Parallel RSC data fetching
    const [driverStandings, constructorStandings] = await Promise.all([
        f1Client.getDriverStandings("current").catch(() => []),
        f1Client.getConstructorStandings("current").catch(() => []),
    ]);

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                FIA Formula 1 World Championship
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Championship Standings
                        </h1>
                        <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                            Live championship points standings for the
                            Drivers&apos; and Constructors&apos; World
                            Championships.
                        </p>
                    </div>

                    <div className="text-xs font-mono text-neutral-400 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 self-start md:self-auto">
                        2026 Season
                    </div>
                </div>

                {/* What-If Points Calculator CTA Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-neutral-900/80 to-neutral-950 p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                NEW FEATURE
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">
                                Interactive Simulation
                            </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-white">
                            Championship What-If Points Calculator
                        </h2>
                        <p className="text-xs text-neutral-400 max-w-xl">
                            Simulasikan hasil posisi finis seri balapan
                            berikutnya dan hitung skenario matematis penguncian
                            gelar Juara Dunia (WDC & WCC) secara real-time.
                        </p>
                    </div>

                    <Link
                        href="/calculator"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-f1-red to-f1-darkred hover:from-red-600 hover:to-f1-red text-white text-xs font-bold font-mono tracking-wide shadow-lg shadow-f1-red/30 transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
                    >
                        <Calculator className="w-4 h-4" />
                        <span>Buka Calculator</span>
                    </Link>
                </div>

                {/* Standings Interactive Tabs (Client Component) */}
                <StandingsTabs
                    driverStandings={driverStandings}
                    constructorStandings={constructorStandings}
                />
            </div>
        </main>
    );
}
