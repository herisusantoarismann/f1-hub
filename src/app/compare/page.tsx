import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { DriverComparisonModule } from "@/components/organisms/DriverComparisonModule";
import { ChevronLeft, Scale } from "lucide-react";

export const metadata: Metadata = {
    title: "Driver Head-to-Head Comparison & Radar Analysis | F1 Hub",
    description:
        "Compare Formula 1 drivers side-by-side with 6-dimension skill radar charts, career milestone records, qualifying speed, and engineering telemetry insights.",
};

interface ComparePageProps {
    searchParams: Promise<{
        d1?: string;
        d2?: string;
        season?: string;
    }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const {
        d1 = "max_verstappen",
        d2 = "norris",
        season = "all",
    } = await searchParams;

    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Breadcrumbs & Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/drivers"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors group mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span>All Drivers</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-f1-red/10 border border-f1-red/30 text-f1-red">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    Driver Head-to-Head Battle
                                </h1>
                                <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-0.5">
                                    Interactive Telemetry Comparison &bull;
                                    6-Axis Skill Radar &bull; Career Milestones
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold uppercase tracking-wider">
                            FIA Grade 1 Telemetry Index
                        </span>
                    </div>
                </div>

                {/* Main Interactive Comparison Module */}
                <DriverComparisonModule
                    initialDriver1Id={d1}
                    initialDriver2Id={d2}
                    initialSeason={season}
                />
            </div>
        </main>
    );
}
