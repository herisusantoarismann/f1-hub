"use client";

import React from "react";
import { CircuitProfile } from "@/data/circuits-database";
import { Timer, Trophy, Calendar, Flag, Award } from "lucide-react";

interface CircuitStatsGridProps {
    profile: CircuitProfile;
    className?: string;
}

export const CircuitStatsGrid: React.FC<CircuitStatsGridProps> = ({
    profile,
    className = "",
}) => {
    const { lapRecord, mostWins, firstGrandPrix, racesHeld } = profile;

    return (
        <div
            data-testid="circuit-stats-grid"
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
        >
            {/* Tile 1: Official Race Lap Record */}
            <div
                data-testid="stat-lap-record"
                className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm group hover:border-neutral-700 transition-colors"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-purple-400" />
                        Lap Record
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                        {lapRecord.year}
                    </span>
                </div>
                <div className="space-y-1">
                    <span
                        data-testid="lap-record-time"
                        className="text-2xl font-black font-mono text-white tracking-tight"
                    >
                        {lapRecord.time}
                    </span>
                    <p
                        data-testid="lap-record-holder"
                        className="text-xs text-neutral-300 font-semibold line-clamp-1"
                    >
                        {lapRecord.driver}
                    </p>
                    <p
                        data-testid="lap-record-team"
                        className="text-[11px] text-neutral-400"
                    >
                        {lapRecord.team}
                    </p>
                </div>
            </div>

            {/* Tile 2: Circuit King / Most Wins */}
            <div
                data-testid="stat-most-wins"
                className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm group hover:border-neutral-700 transition-colors"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        Most Wins
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        Record
                    </span>
                </div>
                <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                        <span
                            data-testid="most-wins-driver"
                            className="text-sm font-bold text-white line-clamp-1"
                        >
                            {mostWins.driver}
                        </span>
                        <span
                            data-testid="most-wins-count"
                            className="text-base font-black font-mono text-amber-400 ml-2"
                        >
                            {mostWins.driverWins}{" "}
                            {mostWins.driverWins === 1 ? "win" : "wins"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-xs">
                        <span
                            data-testid="most-wins-team"
                            className="text-neutral-400 line-clamp-1"
                        >
                            {mostWins.team}
                        </span>
                        <span
                            data-testid="most-wins-team-count"
                            className="font-mono font-bold text-neutral-300 shrink-0 ml-1"
                        >
                            {mostWins.teamWins} wins
                        </span>
                    </div>
                </div>
            </div>

            {/* Tile 3: F1 World Championship Debut */}
            <div
                data-testid="stat-f1-debut"
                className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm group hover:border-neutral-700 transition-colors"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        F1 Debut
                    </span>
                    <Award className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="space-y-1">
                    <span
                        data-testid="first-grand-prix-year"
                        className="text-2xl font-black font-mono text-white tracking-tight"
                    >
                        {firstGrandPrix}
                    </span>
                    <p className="text-xs text-neutral-400">
                        First World Championship Grand Prix
                    </p>
                </div>
            </div>

            {/* Tile 4: Total Grands Prix Held */}
            <div
                data-testid="stat-races-held"
                className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm group hover:border-neutral-700 transition-colors"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                        <Flag className="w-4 h-4 text-emerald-400" />
                        Races Held
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                        Heritage
                    </span>
                </div>
                <div className="space-y-1">
                    <span
                        data-testid="races-held-count"
                        className="text-2xl font-black font-mono text-white tracking-tight"
                    >
                        {racesHeld}
                    </span>
                    <p className="text-xs text-neutral-400">
                        Official World Championship Editions
                    </p>
                </div>
            </div>
        </div>
    );
};
