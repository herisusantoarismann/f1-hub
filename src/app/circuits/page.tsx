import React from "react";
import { Metadata } from "next";
import { f1Client } from "@/lib/api/f1-client";
import { CircuitGrid } from "@/components/organisms/CircuitGrid";
import { Milestone } from "lucide-react";

export const metadata: Metadata = {
    title: "Formula 1 Circuits & Tracks | F1 Hub",
    description:
        "Explore the official Formula 1 World Championship circuits. Inspect track layouts, lap records, DRS overtaking zones, and aerodynamic downforce demands.",
    openGraph: {
        title: "Formula 1 Circuit Profiles & Track Specifications | F1 Hub",
        description:
            "Complete directory of FIA Grade 1 circuits with technical specifications and lap records.",
    },
};

export const revalidate = 86400; // 24 hours static revalidation

export default async function CircuitsPage() {
    const circuits = await f1Client.getCircuits("current");

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-f1-red/15 text-f1-red border border-f1-red/30 flex items-center gap-1.5">
                                <Milestone className="w-3.5 h-3.5" />
                                FIA Grade 1 Homologation
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            World Championship Circuits
                        </h1>
                        <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                            Comprehensive track layouts, aerodynamic demands,
                            lap records, and technical profiles across every
                            venue on the Formula 1 calendar.
                        </p>
                    </div>

                    <div className="text-xs font-mono text-neutral-400 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 self-start md:self-auto">
                        2026 Calendar • {circuits.length} Venues
                    </div>
                </div>

                {/* Circuit Grid with Search and Filter */}
                <CircuitGrid initialCircuits={circuits} />
            </div>
        </main>
    );
}
