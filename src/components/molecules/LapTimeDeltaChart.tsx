"use client";

import React, { useState, useMemo } from "react";
import {
    StrategySimulationResult,
    formatLapTime,
    TYRE_PROPERTIES,
} from "@/lib/strategy-simulator";
import { Activity, Clock } from "lucide-react";

interface LapTimeDeltaChartProps {
    results: StrategySimulationResult[];
    totalLaps: number;
    className?: string;
}

export const LapTimeDeltaChart: React.FC<LapTimeDeltaChartProps> = ({
    results,
    totalLaps,
    className = "",
}) => {
    const [hoveredLap, setHoveredLap] = useState<number | null>(null);

    // Color palette for up to 3 compared strategies
    const strategyColors = ["#10B981", "#06B6D4", "#F59E0B"]; // Emerald, Cyan, Amber

    // Min and max lap time across non-pit laps to scale Y axis nicely
    const { minY, maxY } = useMemo(() => {
        let min = Infinity;
        let max = -Infinity;

        results.forEach((res) => {
            res.laps.forEach((l) => {
                // Ignore pit-in laps with +20s spike for graph scaling purposes
                const cleanTime = l.isPitInLap
                    ? l.lapTimeSec - l.pitLossAppliedSec
                    : l.lapTimeSec;
                if (cleanTime < min) min = cleanTime;
                if (cleanTime > max) max = cleanTime;
            });
        });

        // Add 1s padding top & bottom
        return {
            minY: Math.floor(min - 0.5),
            maxY: Math.ceil(max + 1.0),
        };
    }, [results]);

    // SVG coordinates mapping
    const chartWidth = 800;
    const chartHeight = 220;
    const paddingX = 45;
    const paddingY = 25;

    const scaleX = (lap: number) => {
        return (
            paddingX +
            ((lap - 1) / (totalLaps - 1)) * (chartWidth - paddingX * 2)
        );
    };

    const scaleY = (sec: number) => {
        // Clamp to avoid extreme pit spikes breaking chart boundaries
        const clampedSec = Math.min(sec, maxY + 2.0);
        return (
            chartHeight -
            paddingY -
            ((clampedSec - minY) / (maxY - minY)) * (chartHeight - paddingY * 2)
        );
    };

    // Generate SVG path for each strategy
    const paths = useMemo(() => {
        return results.map((res) => {
            const points = res.laps.map((l) => {
                const x = scaleX(l.lapNumber);
                // For smoother visual trajectory, plot clean lap time but mark pit stop with a dot
                const plotTime = l.isPitInLap
                    ? l.lapTimeSec - l.pitLossAppliedSec
                    : l.lapTimeSec;
                const y = scaleY(plotTime);
                return `${x},${y}`;
            });
            return points.join(" ");
        });
    }, [results, totalLaps, minY, maxY]);

    // Currently hovered lap data across strategies
    const hoveredData = useMemo(() => {
        if (!hoveredLap) return null;
        return results.map((res) => {
            const lap = res.laps.find((l) => l.lapNumber === hoveredLap);
            return {
                strategyName: res.strategyName,
                lap,
            };
        });
    }, [hoveredLap, results]);

    return (
        <div
            data-testid="lap-time-delta-chart"
            className={`rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-md space-y-4 ${className}`}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <div>
                        <h4 className="text-sm font-black text-white">
                            Lap-by-Lap Pace & Degradation Telemetry
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono">
                            Grafik trajektori lap time: pengaruh bahan bakar
                            berkurang vs keausan ban Pirelli.
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
                    {results.map((res, idx) => (
                        <div
                            key={res.strategyId}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className="w-3 h-1 rounded-full"
                                style={{
                                    backgroundColor:
                                        strategyColors[
                                            idx % strategyColors.length
                                        ],
                                }}
                            />
                            <span className="text-neutral-300 font-bold truncate max-w-[140px]">
                                {res.strategyName}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SVG Telemetry Chart */}
            <div className="relative overflow-x-auto w-full">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto min-w-[500px] select-none"
                    onMouseLeave={() => setHoveredLap(null)}
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
                        const yVal = minY + (maxY - minY) * ratio;
                        const yPos = scaleY(yVal);
                        return (
                            <g key={ratio}>
                                <line
                                    x1={paddingX}
                                    y1={yPos}
                                    x2={chartWidth - paddingX}
                                    y2={yPos}
                                    stroke="#262626"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={paddingX - 6}
                                    y={yPos + 3}
                                    textAnchor="end"
                                    fill="#737373"
                                    fontSize="9"
                                    fontFamily="monospace"
                                >
                                    {formatLapTime(yVal)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Vertical guideline for hovered lap */}
                    {hoveredLap && (
                        <line
                            x1={scaleX(hoveredLap)}
                            y1={paddingY}
                            x2={scaleX(hoveredLap)}
                            y2={chartHeight - paddingY}
                            stroke="#525252"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                        />
                    )}

                    {/* Strategy Trajectory Lines */}
                    {paths.map((points, idx) => (
                        <polyline
                            key={idx}
                            fill="none"
                            stroke={strategyColors[idx % strategyColors.length]}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                            className="transition-all"
                        />
                    ))}

                    {/* Pit Stop Dots */}
                    {results.map((res, sIdx) => {
                        const color =
                            strategyColors[sIdx % strategyColors.length];
                        return res.laps
                            .filter((l) => l.isPitInLap)
                            .map((l) => {
                                const cx = scaleX(l.lapNumber);
                                const cy = scaleY(
                                    l.lapTimeSec - l.pitLossAppliedSec,
                                );
                                return (
                                    <g key={l.lapNumber}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r="4.5"
                                            fill="#EF4444"
                                            stroke="#FFFFFF"
                                            strokeWidth="1.5"
                                        />
                                    </g>
                                );
                            });
                    })}

                    {/* Transparent overlay rects for hover detection */}
                    {Array.from({ length: totalLaps }, (_, i) => i + 1).map(
                        (lap) => {
                            const x = scaleX(lap);
                            const step =
                                (chartWidth - paddingX * 2) / totalLaps;
                            return (
                                <rect
                                    key={lap}
                                    x={x - step / 2}
                                    y={0}
                                    width={step}
                                    height={chartHeight}
                                    fill="transparent"
                                    className="cursor-crosshair"
                                    onMouseEnter={() => setHoveredLap(lap)}
                                />
                            );
                        },
                    )}

                    {/* X-axis Laps labels */}
                    {[
                        1,
                        Math.round(totalLaps / 4),
                        Math.round(totalLaps / 2),
                        Math.round((totalLaps * 3) / 4),
                        totalLaps,
                    ].map((l) => (
                        <text
                            key={l}
                            x={scaleX(l)}
                            y={chartHeight - 6}
                            textAnchor="middle"
                            fill="#737373"
                            fontSize="10"
                            fontFamily="monospace"
                        >
                            L{l}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Hover Tooltip Card */}
            {hoveredData && hoveredLap && (
                <div className="p-3 rounded-2xl bg-neutral-950/90 border border-neutral-800 flex items-center justify-between gap-4 flex-wrap text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-bold text-white">
                            Lap {hoveredLap} of {totalLaps}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {hoveredData.map((d, idx) => {
                            if (!d.lap) return null;
                            const prop = TYRE_PROPERTIES[d.lap.compound];
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                strategyColors[
                                                    idx % strategyColors.length
                                                ],
                                        }}
                                    />
                                    <span className="text-neutral-400 truncate max-w-[120px]">
                                        {d.strategyName}:
                                    </span>
                                    <span className="font-bold text-white">
                                        {d.lap.formattedLapTime}
                                    </span>
                                    <span
                                        className="px-1.5 py-0.2 rounded text-[10px] font-bold text-black"
                                        style={{ backgroundColor: prop.color }}
                                    >
                                        {d.lap.compound[0]} (Age:{" "}
                                        {d.lap.tyreAge}L)
                                    </span>
                                    {d.lap.isPitInLap && (
                                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500 text-white font-bold">
                                            BOX
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
