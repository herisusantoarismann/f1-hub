"use client";

import React, { useState, useMemo } from "react";
import { DriverWithTeam } from "@/types/f1";
import { DriverCard } from "@/components/molecules/DriverCard";
import { Search, Users, X } from "lucide-react";

export interface DriverGridProps {
    drivers: DriverWithTeam[];
}

export const DriverGrid: React.FC<DriverGridProps> = ({ drivers }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<
        "all" | "race" | "reserve"
    >("all");

    const counts = useMemo(() => {
        const raceCount = drivers.filter((d) => !d.isReserve).length;
        const reserveCount = drivers.filter((d) => Boolean(d.isReserve)).length;
        return {
            all: drivers.length,
            race: raceCount,
            reserve: reserveCount,
        };
    }, [drivers]);

    const filteredDrivers = useMemo(() => {
        let list = drivers;

        if (filterCategory === "race") {
            list = list.filter((d) => !d.isReserve);
        } else if (filterCategory === "reserve") {
            list = list.filter((d) => Boolean(d.isReserve));
        }

        const query = searchQuery.trim().toLowerCase();
        if (!query) return list;

        return list.filter((driver) => {
            const fullName =
                `${driver.givenName} ${driver.familyName}`.toLowerCase();
            const nationality = driver.nationality.toLowerCase();
            const team = (driver.team?.name ?? "").toLowerCase();
            const number = driver.permanentNumber ?? "";
            const code = (driver.code ?? "").toLowerCase();

            return (
                fullName.includes(query) ||
                nationality.includes(query) ||
                team.includes(query) ||
                number.includes(query) ||
                code.includes(query)
            );
        });
    }, [drivers, filterCategory, searchQuery]);

    return (
        <div className="flex flex-col gap-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1 sm:max-w-md">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search drivers by name, team, number, or nationality..."
                            className="w-full pl-10 pr-9 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-f1-red focus:ring-1 focus:ring-f1-red transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full"
                                title="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Category Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 shrink-0 text-xs font-mono font-bold">
                        <button
                            type="button"
                            onClick={() => setFilterCategory("all")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterCategory === "all"
                                    ? "bg-neutral-800 text-white shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Semua ({counts.all})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterCategory("race")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterCategory === "race"
                                    ? "bg-neutral-800 text-white shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Pembalap Utama ({counts.race})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterCategory("reserve")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filterCategory === "reserve"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Pembalap Cadangan ({counts.reserve})
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 self-end sm:self-center">
                    <Users className="w-3.5 h-3.5 text-f1-red" />
                    <span>
                        Showing{" "}
                        <strong className="text-white">
                            {filteredDrivers.length}
                        </strong>{" "}
                        of {drivers.length} Drivers
                    </span>
                </div>
            </div>

            {/* Grid or Empty State */}
            {filteredDrivers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDrivers.map((driver) => (
                        <DriverCard key={driver.driverId} driver={driver} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800/80 my-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
                        <Search className="w-6 h-6 text-f1-gray" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                        No Drivers Found
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-sm mb-4">
                        We couldn&apos;t find any drivers matching &ldquo;
                        {searchQuery}&rdquo;. Try searching for a different
                        name, team, or nationality.
                    </p>
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                    >
                        Reset Search
                    </button>
                </div>
            )}
        </div>
    );
};
