"use client";

import React, { useState, useMemo } from "react";
import { RaceWithStatus } from "@/types/f1";
import { RaceCard } from "@/components/molecules/RaceCard";
import {
    Search,
    Filter,
    CalendarDays,
    CheckCircle2,
    Clock,
} from "lucide-react";

export interface ScheduleGridProps {
    initialRaces: RaceWithStatus[];
    season?: string;
}

type FilterTab = "all" | "upcoming" | "completed";

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
    initialRaces,
    season = "2024",
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    const stats = useMemo(() => {
        const total = initialRaces.length;
        const completed = initialRaces.filter(
            (r) => r.status === "completed",
        ).length;
        const remaining = total - completed;
        return { total, completed, remaining };
    }, [initialRaces]);

    const filteredRaces = useMemo(() => {
        return initialRaces.filter((race) => {
            // Tab filter
            if (activeTab === "completed" && race.status !== "completed")
                return false;
            if (activeTab === "upcoming" && race.status === "completed")
                return false;

            // Search keyword filter
            if (searchTerm.trim() !== "") {
                const query = searchTerm.toLowerCase();
                const matchesName = race.raceName.toLowerCase().includes(query);
                const matchesCircuit = race.Circuit.circuitName
                    .toLowerCase()
                    .includes(query);
                const matchesCountry = race.Circuit.Location.country
                    .toLowerCase()
                    .includes(query);
                const matchesCity = race.Circuit.Location.locality
                    .toLowerCase()
                    .includes(query);

                return (
                    matchesName ||
                    matchesCircuit ||
                    matchesCountry ||
                    matchesCity
                );
            }

            return true;
        });
    }, [initialRaces, activeTab, searchTerm]);

    return (
        <section className="space-y-6" data-testid="schedule-grid-container">
            {/* Header Controls: Stats & Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-f1-charcoal pb-6">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <span>F1 World Championship Calendar</span>
                        <span className="text-xs px-2.5 py-1 rounded bg-f1-red text-white font-mono">
                            {season}
                        </span>
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-xs text-f1-gray">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-f1-lightgray" />
                            {stats.total} Grands Prix
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {stats.completed} Finished
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {stats.remaining} Remaining
                        </span>
                    </div>
                </div>

                {/* Search bar & Tab Switcher */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-f1-gray" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Grand Prix or Country..."
                            aria-label="Search races"
                            className="w-full rounded-lg bg-f1-carbon border border-f1-charcoal pl-9 pr-4 py-2 text-xs text-white placeholder-f1-gray focus:outline-none focus:border-f1-red transition-colors"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="inline-flex rounded-lg bg-f1-carbon p-1 border border-f1-charcoal text-xs">
                        {(["all", "upcoming", "completed"] as FilterTab[]).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all ${
                                        activeTab === tab
                                            ? "bg-f1-red text-white shadow-sm"
                                            : "text-f1-gray hover:text-white"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </div>

            {/* Grid listing */}
            {filteredRaces.length > 0 ? (
                <div
                    data-testid="schedule-grid"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                    {filteredRaces.map((race) => (
                        <RaceCard
                            key={`${race.season}-${race.round}`}
                            race={race}
                            status={race.status}
                            daysRemaining={race.daysRemaining}
                        />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div
                    data-testid="empty-state"
                    className="rounded-xl border border-dashed border-f1-charcoal p-12 text-center bg-f1-carbon/30"
                >
                    <Filter className="w-10 h-10 text-f1-gray mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-white">
                        No races found
                    </h3>
                    <p className="text-xs text-f1-gray mt-1 max-w-sm mx-auto">
                        We couldn't find any Grand Prix matching "{searchTerm}".
                        Try clearing your search or switching filter tabs.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setActiveTab("all");
                        }}
                        className="mt-4 px-4 py-1.5 text-xs bg-f1-carbon hover:bg-f1-charcoal text-white rounded-md border border-f1-charcoal transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </section>
    );
};
