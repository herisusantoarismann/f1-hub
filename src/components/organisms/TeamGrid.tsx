"use client";

import React, { useState, useMemo } from "react";
import { ConstructorWithDetails } from "@/types/f1";
import { TeamCard } from "@/components/molecules/TeamCard";
import { Search, Shield, X } from "lucide-react";

export interface TeamGridProps {
    teams: ConstructorWithDetails[];
}

export const TeamGrid: React.FC<TeamGridProps> = ({ teams }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTeams = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return teams;

        return teams.filter((team) => {
            const name = team.name.toLowerCase();
            const nationality = team.nationality.toLowerCase();

            return name.includes(query) || nationality.includes(query);
        });
    }, [teams, searchQuery]);

    return (
        <div className="flex flex-col gap-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search teams by constructor name or nationality..."
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

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 self-end sm:self-center">
                    <Shield className="w-3.5 h-3.5 text-f1-red" />
                    <span>
                        Showing{" "}
                        <strong className="text-white">
                            {filteredTeams.length}
                        </strong>{" "}
                        of {teams.length} Teams
                    </span>
                </div>
            </div>

            {/* Grid or Empty State */}
            {filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
                        <TeamCard key={team.constructorId} team={team} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800/80 my-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
                        <Search className="w-6 h-6 text-f1-gray" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                        No Teams Found
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-sm mb-4">
                        We couldn&apos;t find any constructors matching &ldquo;
                        {searchQuery}&rdquo;. Try searching for a different
                        constructor name or nationality.
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
