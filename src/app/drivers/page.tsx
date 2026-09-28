import React from "react";
import { Metadata } from "next";
import { f1Client } from "@/lib/api/f1-client";
import { DriverGrid } from "@/components/organisms/DriverGrid";
import { Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Formula 1 Drivers | F1 Hub",
    description:
        "Official Formula 1 driver lineup, statistics, race numbers, current championship standing, and biographies.",
};

export const revalidate = 86400; // 24 hours static revalidation

export default async function DriversPage() {
    const drivers = await f1Client.getDrivers("current");

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-f1-charcoal">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-950/60 text-blue-400 border border-blue-800/40">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                Official Driver Lineup
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Formula 1 Drivers
                        </h1>
                        <p className="text-sm text-f1-gray mt-1 max-w-xl">
                            Explore the world&apos;s fastest drivers competing
                            in the Formula 1 World Championship, with real-time
                            points, teams, and numbers.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-f1-gray bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800 self-start md:self-auto">
                        <Users className="w-4 h-4 text-f1-red" />
                        <span>Active Season Grid</span>
                    </div>
                </div>

                {/* Driver Grid Component */}
                <DriverGrid drivers={drivers} />
            </div>
        </main>
    );
}
