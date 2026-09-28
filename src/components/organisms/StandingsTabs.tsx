"use client";

import React, { useState, useMemo } from "react";
import {
    DriverStanding,
    ConstructorStanding,
    StandingsTabType,
} from "@/types/standings";
import { DriverStandingRow } from "@/components/molecules/DriverStandingRow";
import { ConstructorStandingRow } from "@/components/molecules/ConstructorStandingRow";
import { Users, Shield, Search, X, Trophy } from "lucide-react";

interface StandingsTabsProps {
    driverStandings: DriverStanding[];
    constructorStandings: ConstructorStanding[];
}

export const StandingsTabs: React.FC<StandingsTabsProps> = ({
    driverStandings,
    constructorStandings,
}) => {
    const [activeTab, setActiveTab] = useState<StandingsTabType>("drivers");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter drivers based on search query
    const filteredDrivers = useMemo(() => {
        if (!searchQuery.trim()) return driverStandings;
        const q = searchQuery.toLowerCase().trim();
        return driverStandings.filter((st) => {
            const fullName =
                `${st.Driver.givenName} ${st.Driver.familyName}`.toLowerCase();
            const code = st.Driver.code?.toLowerCase() || "";
            const number = st.Driver.permanentNumber || "";
            const nationality = st.Driver.nationality.toLowerCase();
            const team = st.Constructors?.[0]?.name?.toLowerCase() || "";

            return (
                fullName.includes(q) ||
                code.includes(q) ||
                number.includes(q) ||
                nationality.includes(q) ||
                team.includes(q)
            );
        });
    }, [driverStandings, searchQuery]);

    // Filter constructors based on search query
    const filteredConstructors = useMemo(() => {
        if (!searchQuery.trim()) return constructorStandings;
        const q = searchQuery.toLowerCase().trim();
        return constructorStandings.filter((st) => {
            const teamName = st.Constructor.name.toLowerCase();
            const nationality = st.Constructor.nationality.toLowerCase();
            return teamName.includes(q) || nationality.includes(q);
        });
    }, [constructorStandings, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Controls Bar: Tab Switcher & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/50 p-2 sm:p-3 rounded-2xl border border-neutral-800 backdrop-blur-md">
                {/* Tab Switcher Pills */}
                <div
                    role="tablist"
                    aria-label="Standings Category"
                    className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "drivers"}
                        onClick={() => {
                            setActiveTab("drivers");
                            setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            activeTab === "drivers"
                                ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                        data-testid="tab-drivers"
                    >
                        <Users className="w-4 h-4" />
                        <span>Drivers Championship</span>
                        <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                activeTab === "drivers"
                                    ? "bg-black/20 text-white"
                                    : "bg-neutral-800 text-neutral-400"
                            }`}
                        >
                            {driverStandings.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "constructors"}
                        onClick={() => {
                            setActiveTab("constructors");
                            setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            activeTab === "constructors"
                                ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                        data-testid="tab-constructors"
                    >
                        <Shield className="w-4 h-4" />
                        <span>Constructors</span>
                        <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                activeTab === "constructors"
                                    ? "bg-black/20 text-white"
                                    : "bg-neutral-800 text-neutral-400"
                            }`}
                        >
                            {constructorStandings.length}
                        </span>
                    </button>
                </div>

                {/* Local Search Input */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            activeTab === "drivers"
                                ? "Search driver, team, or #..."
                                : "Search constructor..."
                        }
                        className="w-full pl-10 pr-9 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-f1-red focus:ring-1 focus:ring-f1-red transition-all"
                        aria-label="Filter standings"
                        data-testid="standings-search-input"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Drivers Tab Panel */}
            {activeTab === "drivers" && (
                <div
                    role="tabpanel"
                    aria-label="Drivers Championship"
                    className="space-y-3"
                    data-testid="panel-drivers"
                >
                    <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-sm">
                        <table className="w-full text-left text-sm text-neutral-300">
                            <thead className="bg-neutral-950/80 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                                <tr>
                                    <th className="py-3.5 px-4 w-16 text-center">
                                        Pos
                                    </th>
                                    <th className="py-3.5 px-4">Driver</th>
                                    <th className="py-3.5 px-4 hidden sm:table-cell">
                                        Nationality
                                    </th>
                                    <th className="py-3.5 px-4">Constructor</th>
                                    <th className="py-3.5 px-4 text-center hidden md:table-cell">
                                        Wins
                                    </th>
                                    <th className="py-3.5 px-4 text-right">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/60 font-sans">
                                {filteredDrivers.length > 0 ? (
                                    filteredDrivers.map((st) => (
                                        <DriverStandingRow
                                            key={st.Driver.driverId}
                                            standing={st}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center text-neutral-400"
                                        >
                                            <p className="text-sm font-semibold">
                                                No drivers found matching &quot;
                                                {searchQuery}&quot;
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                Try searching by driver surname,
                                                number, or team name.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Constructors Tab Panel */}
            {activeTab === "constructors" && (
                <div
                    role="tabpanel"
                    aria-label="Constructors Championship"
                    className="space-y-3"
                    data-testid="panel-constructors"
                >
                    <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-sm">
                        <table className="w-full text-left text-sm text-neutral-300">
                            <thead className="bg-neutral-950/80 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                                <tr>
                                    <th className="py-3.5 px-4 w-16 text-center">
                                        Pos
                                    </th>
                                    <th className="py-3.5 px-4">Team</th>
                                    <th className="py-3.5 px-4 hidden sm:table-cell">
                                        Nationality
                                    </th>
                                    <th className="py-3.5 px-4 text-center hidden md:table-cell">
                                        Wins
                                    </th>
                                    <th className="py-3.5 px-4 text-right">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/60 font-sans">
                                {filteredConstructors.length > 0 ? (
                                    filteredConstructors.map((st) => (
                                        <ConstructorStandingRow
                                            key={st.Constructor.constructorId}
                                            standing={st}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-neutral-400"
                                        >
                                            <p className="text-sm font-semibold">
                                                No constructors found matching
                                                &quot;{searchQuery}&quot;
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                Try checking the spelling or
                                                country name.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
