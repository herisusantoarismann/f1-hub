"use client";

import React from "react";
import {
    StrategySimulationResult,
    StrategyPlan,
    TYRE_PROPERTIES,
} from "@/lib/strategy-simulator";
import { StintTimelineVisualizer } from "./StintTimelineVisualizer";
import {
    Clock,
    Timer,
    CheckCircle2,
    AlertTriangle,
    Zap,
    Trophy,
} from "lucide-react";

interface StrategyComparisonCardProps {
    strategyPlan: StrategyPlan;
    result: StrategySimulationResult;
    totalLaps: number;
    isFastest: boolean;
    onEditStrategy?: () => void;
}

export const StrategyComparisonCard: React.FC<StrategyComparisonCardProps> = ({
    strategyPlan,
    result,
    totalLaps,
    isFastest,
    onEditStrategy,
}) => {
    return (
        <div
            data-testid={`strategy-card-${strategyPlan.id}`}
            className={`relative rounded-3xl border p-5 sm:p-6 backdrop-blur-md transition-all overflow-hidden space-y-4 ${
                isFastest
                    ? "border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 via-neutral-900/80 to-neutral-950 shadow-xl shadow-emerald-500/10"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700/80"
            }`}
        >
            {/* Top Accent Line */}
            {isFastest && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            )}

            {/* Header: Strategy Name, Delta & Stops */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        {isFastest ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-emerald-400" />
                                FASTEST STRATEGY
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                ALTERNATIVE
                            </span>
                        )}
                        <span className="text-xs text-neutral-400 font-mono">
                            {result.pitStopCount} Pit Stop
                            {result.pitStopCount === 1 ? "" : "s"}
                        </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                        {strategyPlan.name}
                    </h3>
                    {strategyPlan.description && (
                        <p className="text-xs text-neutral-400 max-w-xl">
                            {strategyPlan.description}
                        </p>
                    )}
                </div>

                {/* Total Time & Delta Badge */}
                <div className="text-left sm:text-right space-y-0.5 shrink-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        Total Projected Race Time
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                        {result.formattedTotalTime}
                    </div>
                    <div>
                        {isFastest ? (
                            <span className="text-xs font-mono font-bold text-emerald-400">
                                0.000s &bull; Optimal Baseline
                            </span>
                        ) : (
                            <span className="text-xs font-mono font-bold text-red-400">
                                {result.formattedDelta} slower
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Stint Timeline */}
            <StintTimelineVisualizer
                strategy={strategyPlan}
                totalLaps={totalLaps}
            />

            {/* Footer Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">
                        Avg Stint Pace
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                        {result.formattedAverageLap}
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">
                        Fastest Clean Lap
                    </div>
                    <div className="text-sm font-bold text-purple-400 mt-0.5 flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" />
                        <span>L{result.fastestLapNumber}</span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">
                        Pirelli Compounds
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        {result.compoundsUsed.map((comp) => {
                            const prop = TYRE_PROPERTIES[comp];
                            return (
                                <span
                                    key={comp}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-black text-black"
                                    style={{ backgroundColor: prop.color }}
                                >
                                    {comp[0]}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">
                        FIA 2-Compound Rule
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold">
                        {result.meetsTwoCompoundRule ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Compliant
                            </span>
                        ) : (
                            <span className="text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Illegal (1 compound)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
