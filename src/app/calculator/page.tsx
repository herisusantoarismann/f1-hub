import React from "react";
import { Metadata } from "next";
import { f1Client } from "@/lib/api/f1-client";
import {
    FALLBACK_DRIVER_STANDINGS,
    FALLBACK_CONSTRUCTOR_STANDINGS,
} from "@/data/standings-fallback";
import { ChampionshipCalculator } from "@/components/organisms/ChampionshipCalculator";
import { Calculator, Trophy, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Championship Points Calculator | F1 Hub",
    description:
        "Interactive Formula 1 What-If Championship Points Calculator & Title Clinch Scenario Simulator. Simulate race finish positions and analyze championship outcomes in real time.",
    openGraph: {
        title: "Formula 1 Points & Standings Calculator | F1 Hub",
        description:
            "Calculate Formula 1 championship permutations, points changes, and title clinch scenarios for drivers and constructors.",
    },
};

export const revalidate = 3600; // 1 hour revalidation

export default async function CalculatorPage() {
    // Fetch live standings or fallback to pre-loaded dataset
    const [fetchedDrivers, fetchedConstructors] = await Promise.all([
        f1Client.getDriverStandings("current").catch(() => []),
        f1Client.getConstructorStandings("current").catch(() => []),
    ]);

    const driverStandings =
        fetchedDrivers.length > 0 ? fetchedDrivers : FALLBACK_DRIVER_STANDINGS;
    const constructorStandings =
        fetchedConstructors.length > 0
            ? fetchedConstructors
            : FALLBACK_CONSTRUCTOR_STANDINGS;

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                                What-If Simulator
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-neutral-400 border border-neutral-800">
                                2026 Season &bull; Real-time Matrix
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Championship Points Calculator
                        </h1>
                        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
                            Simulasikan hasil balapan, perebutan poin, dan
                            skenario matematis penguncian gelar Juara Dunia
                            Formula 1 untuk Pembalap dan Konstruktor.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 self-start md:self-auto">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>FIA WDC & WCC Simulator</span>
                    </div>
                </div>

                {/* Master Calculator Organism */}
                <ChampionshipCalculator
                    initialDriverStandings={driverStandings}
                    initialConstructorStandings={constructorStandings}
                />
            </div>
        </main>
    );
}
