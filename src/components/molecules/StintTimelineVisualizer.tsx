"use client";

import React from "react";
import {
    StrategyPlan,
    StintConfig,
    TYRE_PROPERTIES,
    TyreCompound,
} from "@/lib/strategy-simulator";
import { ArrowRight, Wrench } from "lucide-react";

interface StintTimelineVisualizerProps {
    strategy: StrategyPlan;
    totalLaps: number;
    activeLapHover?: number | null;
    onLapHover?: (lap: number | null) => void;
    className?: string;
}

export const StintTimelineVisualizer: React.FC<
    StintTimelineVisualizerProps
> = ({ strategy, totalLaps, activeLapHover, onLapHover, className = "" }) => {
    return (
        <div
            data-testid="stint-timeline-visualizer"
            className={`space-y-3 ${className}`}
        >
            {/* Stint Multi-Segment Bar */}
            <div className="relative h-10 sm:h-12 w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-1 flex overflow-hidden shadow-inner">
                {strategy.stints.map((stint, idx) => {
                    const stintLaps = stint.endLap - stint.startLap + 1;
                    const widthPct = (stintLaps / totalLaps) * 100;
                    const prop = TYRE_PROPERTIES[stint.compound];
                    const isLast = idx === strategy.stints.length - 1;

                    return (
                        <div
                            key={idx}
                            style={{ width: `${widthPct}%` }}
                            className="relative h-full flex items-center justify-center transition-all group overflow-hidden border-r border-black/40 last:border-r-0"
                            title={`Stint ${idx + 1}: ${prop.name} (Laps ${stint.startLap}-${stint.endLap}, ${stintLaps} laps)`}
                        >
                            {/* Color fill */}
                            <div
                                className="absolute inset-0 opacity-90 transition-opacity group-hover:opacity-100"
                                style={{ backgroundColor: prop.color }}
                            />

                            {/* Stint Label */}
                            <div className="relative z-10 flex items-center gap-1.5 px-2 text-black font-black text-[11px] sm:text-xs truncate tracking-wider drop-shadow-sm font-mono">
                                <span>{stint.compound[0]}</span>
                                <span className="hidden sm:inline font-bold">
                                    {stintLaps}L
                                </span>
                            </div>

                            {/* Pit Stop Divider Flag / Icon */}
                            {!isLast && (
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-3.5 bg-black/60 flex items-center justify-center text-white z-20"
                                    title={`Pit Stop on Lap ${stint.endLap}`}
                                >
                                    <Wrench className="w-2.5 h-2.5 text-neutral-300" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lap Scale & Stints Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-neutral-400">
                <div className="flex items-center gap-3 flex-wrap">
                    {strategy.stints.map((stint, idx) => {
                        const prop = TYRE_PROPERTIES[stint.compound];
                        const stintLaps = stint.endLap - stint.startLap + 1;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-1.5 bg-neutral-900/60 px-2 py-1 rounded-lg border border-neutral-800"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: prop.color }}
                                />
                                <span className="font-bold text-white">
                                    Stint {idx + 1}:
                                </span>
                                <span>
                                    {stint.compound} (L{stint.startLap}-
                                    {stint.endLap}, {stintLaps} laps)
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="text-right shrink-0">
                    <span className="text-white font-bold">{totalLaps}</span>{" "}
                    Total Laps &bull;{" "}
                    <span className="text-amber-400 font-bold">
                        {strategy.stints.length - 1} Pit Stop
                        {strategy.stints.length - 1 === 1 ? "" : "s"}
                    </span>
                </div>
            </div>
        </div>
    );
};
