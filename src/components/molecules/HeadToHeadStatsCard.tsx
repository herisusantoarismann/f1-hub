"use client";

import React from "react";
import { DriverPerformanceProfile } from "@/data/drivers-ratings";
import { DriverComparisonStats } from "@/lib/api/driver-comparison";
import {
    Trophy,
    Award,
    Flag,
    Zap,
    Timer,
    Milestone,
    Crown,
    CheckCircle2,
    Calendar,
} from "lucide-react";

export interface HeadToHeadStatsCardProps {
    driver1: DriverPerformanceProfile;
    driver2: DriverPerformanceProfile;
    seasonStats1?: DriverComparisonStats;
    seasonStats2?: DriverComparisonStats;
    selectedSeason?: string; // "all" or "2026", "2025", etc.
    className?: string;
}

interface StatRow {
    key: string;
    label: string;
    val1: number | string;
    val2: number | string;
    num1: number;
    num2: number;
    icon: React.ComponentType<{ className?: string }>;
    reverseScale?: boolean; // For finish positions where smaller number is better
}

export const HeadToHeadStatsCard: React.FC<HeadToHeadStatsCardProps> = ({
    driver1,
    driver2,
    seasonStats1,
    seasonStats2,
    selectedSeason = "all",
    className = "",
}) => {
    const isSeasonMode =
        selectedSeason !== "all" && seasonStats1 && seasonStats2;

    const color1 = driver1.teamColor || "#38BDF8";
    const color2 =
        driver2.teamColor === driver1.teamColor
            ? "#F43F5E"
            : driver2.teamColor || "#E10600";

    const s1 = isSeasonMode ? seasonStats1 : driver1.careerStats;
    const s2 = isSeasonMode ? seasonStats2 : driver2.careerStats;

    const parsePosNum = (posStr?: string) => {
        if (!posStr || posStr === "-") return 99;
        const num = parseInt(posStr.replace(/\D/g, ""), 10);
        return isNaN(num) ? 99 : num;
    };

    let stats: StatRow[] = [];

    if (isSeasonMode && seasonStats1 && seasonStats2) {
        const p1Num = parsePosNum(seasonStats1.championshipPosition);
        const p2Num = parsePosNum(seasonStats2.championshipPosition);

        stats = [
            {
                key: "championshipPos",
                label: "Championship Standing",
                val1:
                    seasonStats1.worldChampionships === 1
                        ? `${seasonStats1.championshipPosition} (Champion)`
                        : seasonStats1.championshipPosition,
                val2:
                    seasonStats2.worldChampionships === 1
                        ? `${seasonStats2.championshipPosition} (Champion)`
                        : seasonStats2.championshipPosition,
                num1: p1Num,
                num2: p2Num,
                reverseScale: true,
                icon: Crown,
            },
            {
                key: "wins",
                label: "Season Wins",
                val1: seasonStats1.wins,
                val2: seasonStats2.wins,
                num1: seasonStats1.wins,
                num2: seasonStats2.wins,
                icon: Trophy,
            },
            {
                key: "podiums",
                label: "Podium Finishes",
                val1: seasonStats1.podiums,
                val2: seasonStats2.podiums,
                num1: seasonStats1.podiums,
                num2: seasonStats2.podiums,
                icon: Award,
            },
            {
                key: "poles",
                label: "Pole Positions",
                val1: seasonStats1.polePositions,
                val2: seasonStats2.polePositions,
                num1: seasonStats1.polePositions,
                num2: seasonStats2.polePositions,
                icon: Zap,
            },
            {
                key: "fastestLaps",
                label: "Fastest Laps",
                val1: seasonStats1.fastestLaps,
                val2: seasonStats2.fastestLaps,
                num1: seasonStats1.fastestLaps,
                num2: seasonStats2.fastestLaps,
                icon: Timer,
            },
            {
                key: "points",
                label: "Season Points",
                val1: seasonStats1.points.toLocaleString(),
                val2: seasonStats2.points.toLocaleString(),
                num1: seasonStats1.points,
                num2: seasonStats2.points,
                icon: Flag,
            },
            {
                key: "starts",
                label: "Grand Prix Starts",
                val1: seasonStats1.grandPrixStarts,
                val2: seasonStats2.grandPrixStarts,
                num1: seasonStats1.grandPrixStarts,
                num2: seasonStats2.grandPrixStarts,
                icon: Milestone,
            },
            {
                key: "bestFinish",
                label: "Best Race Result",
                val1: seasonStats1.bestFinish,
                val2: seasonStats2.bestFinish,
                num1: parsePosNum(seasonStats1.bestFinish),
                num2: parsePosNum(seasonStats2.bestFinish),
                reverseScale: true,
                icon: CheckCircle2,
            },
        ];
    } else {
        const c1 = driver1.careerStats;
        const c2 = driver2.careerStats;

        stats = [
            {
                key: "championships",
                label: "World Championships",
                val1: c1.worldChampionships,
                val2: c2.worldChampionships,
                num1: c1.worldChampionships,
                num2: c2.worldChampionships,
                icon: Crown,
            },
            {
                key: "wins",
                label: "Grand Prix Wins",
                val1: c1.wins,
                val2: c2.wins,
                num1: c1.wins,
                num2: c2.wins,
                icon: Trophy,
            },
            {
                key: "podiums",
                label: "Podium Finishes",
                val1: c1.podiums,
                val2: c2.podiums,
                num1: c1.podiums,
                num2: c2.podiums,
                icon: Award,
            },
            {
                key: "poles",
                label: "Pole Positions",
                val1: c1.polePositions,
                val2: c2.polePositions,
                num1: c1.polePositions,
                num2: c2.polePositions,
                icon: Zap,
            },
            {
                key: "fastestLaps",
                label: "Fastest Laps",
                val1: c1.fastestLaps,
                val2: c2.fastestLaps,
                num1: c1.fastestLaps,
                num2: c2.fastestLaps,
                icon: Timer,
            },
            {
                key: "points",
                label: "Career Points",
                val1: c1.careerPoints.toLocaleString(),
                val2: c2.careerPoints.toLocaleString(),
                num1: c1.careerPoints,
                num2: c2.careerPoints,
                icon: Flag,
            },
            {
                key: "starts",
                label: "Grand Prix Starts",
                val1: c1.grandPrixStarts,
                val2: c2.grandPrixStarts,
                num1: c1.grandPrixStarts,
                num2: c2.grandPrixStarts,
                icon: Milestone,
            },
        ];
    }

    return (
        <div
            data-testid="head-to-head-stats-card"
            className={`rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md space-y-5 ${className}`}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/80 pb-3 font-mono gap-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-f1-red" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        {isSeasonMode
                            ? `Season ${selectedSeason} Head-to-Head Battle`
                            : "Career Milestones & Head-to-Head"}
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="w-3.5 h-3.5 text-f1-red" />
                    <span>
                        {isSeasonMode
                            ? `FIA ${selectedSeason} Official Championship Stats`
                            : "Formula 1 Historical Records"}
                    </span>
                </div>
            </div>

            {/* Comparison Rows List */}
            <div className="space-y-4 font-mono">
                {stats.map((row) => {
                    let isD1Leader = false;
                    let isD2Leader = false;
                    let pct1 = 50;
                    let pct2 = 50;

                    if (row.reverseScale) {
                        // Smaller number is better (e.g. P1 > P6)
                        if (row.num1 !== row.num2) {
                            isD1Leader = row.num1 < row.num2;
                            isD2Leader = row.num2 < row.num1;
                        }
                        const inv1 = row.num1 <= 0 ? 0 : 1 / row.num1;
                        const inv2 = row.num2 <= 0 ? 0 : 1 / row.num2;
                        const invTotal = inv1 + inv2;
                        if (invTotal > 0) {
                            pct1 = Math.round((inv1 / invTotal) * 100);
                            pct2 = 100 - pct1;
                        }
                    } else {
                        // Greater number is better
                        isD1Leader = row.num1 > row.num2;
                        isD2Leader = row.num2 > row.num1;
                        const total = row.num1 + row.num2;
                        if (total > 0) {
                            pct1 = Math.round((row.num1 / total) * 100);
                            pct2 = 100 - pct1;
                        }
                    }

                    const Icon = row.icon;

                    return (
                        <div key={row.key} className="space-y-1.5">
                            {/* Metric Label & Numbers */}
                            <div className="flex items-center justify-between text-xs">
                                {/* Driver 1 Value */}
                                <div className="flex items-center gap-2 flex-1">
                                    <span
                                        className={`text-base font-black ${
                                            isD1Leader
                                                ? "text-white"
                                                : "text-neutral-400"
                                        }`}
                                    >
                                        {row.val1}
                                    </span>
                                    {isD1Leader && (
                                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                    )}
                                </div>

                                {/* Row Title / Icon */}
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300 text-[11px] font-semibold">
                                    <Icon className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>{row.label}</span>
                                </div>

                                {/* Driver 2 Value */}
                                <div className="flex items-center justify-end gap-2 flex-1 text-right">
                                    {isD2Leader && (
                                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                    )}
                                    <span
                                        className={`text-base font-black ${
                                            isD2Leader
                                                ? "text-white"
                                                : "text-neutral-400"
                                        }`}
                                    >
                                        {row.val2}
                                    </span>
                                </div>
                            </div>

                            {/* Dual Proportional Comparison Bar */}
                            <div className="w-full h-2.5 rounded-full bg-neutral-950 overflow-hidden flex items-center border border-neutral-800/80">
                                <div
                                    className="h-full transition-all duration-700 rounded-l-full"
                                    style={{
                                        width: `${pct1}%`,
                                        backgroundColor: color1,
                                        opacity: isD1Leader ? 1 : 0.6,
                                    }}
                                />
                                <div
                                    className="h-full transition-all duration-700 rounded-r-full"
                                    style={{
                                        width: `${pct2}%`,
                                        backgroundColor: color2,
                                        opacity: isD2Leader ? 1 : 0.6,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
