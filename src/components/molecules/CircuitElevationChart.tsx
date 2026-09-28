"use client";

import React, { useId } from "react";
import { CircuitElevationData } from "@/data/circuits-elevation";
import {
    TrendingUp,
    ArrowDown,
    ArrowUp,
    Compass,
    AlertCircle,
} from "lucide-react";

interface CircuitElevationChartProps {
    elevation: CircuitElevationData;
    className?: string;
}

export const CircuitElevationChart: React.FC<CircuitElevationChartProps> = ({
    elevation,
    className = "",
}) => {
    const rawId = useId();
    const gradId = `elevGrad_${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
    const {
        profilePoints,
        lowestPointMeters,
        highestPointMeters,
        elevationDeltaMeters,
        bankedCorners,
    } = elevation;

    // SVG coordinate math
    const svgWidth = 700;
    const svgHeight = 220;
    const paddingX = 40;
    const paddingY = 30;
    const chartW = svgWidth - paddingX * 2;
    const chartH = svgHeight - paddingY * 2;

    const minEle = Math.floor(lowestPointMeters);
    const maxEle = Math.ceil(highestPointMeters);
    const range = Math.max(maxEle - minEle, 5);

    const points = profilePoints.map((pt) => {
        const x = paddingX + (pt.distancePct / 100) * chartW;
        const normalizedY = (pt.elevationMeters - minEle) / range;
        const y = paddingY + (1 - normalizedY) * chartH;
        return { ...pt, x, y };
    });

    const pathD = points.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x},${pt.y}`;
        const prev = points[i - 1];
        const cpX = (prev.x + pt.x) / 2;
        return `${acc} C ${cpX},${prev.y} ${cpX},${pt.y} ${pt.x},${pt.y}`;
    }, "");

    const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

    return (
        <div
            data-testid="circuit-elevation-chart"
            className={`space-y-6 ${className}`}
        >
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                        Highest Peak
                    </span>
                    <span className="text-base font-bold text-white mt-1">
                        {highestPointMeters.toFixed(1)} m
                    </span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                        Lowest Dip
                    </span>
                    <span className="text-base font-bold text-white mt-1">
                        {lowestPointMeters.toFixed(1)} m
                    </span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        Elevation Delta
                    </span>
                    <span className="text-base font-bold text-white mt-1">
                        {elevationDeltaMeters.toFixed(1)} m
                    </span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-purple-400" />
                        Altitude MSL
                    </span>
                    <span className="text-base font-bold text-white mt-1">
                        {elevation.altitudeAboveSeaLevelMeters} m
                    </span>
                </div>
            </div>

            {/* SVG Elevation Contour Chart */}
            <div className="relative rounded-2xl bg-neutral-950/90 border border-neutral-800/80 p-4 sm:p-6 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                    <span className="uppercase tracking-wider font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Elevation Profile &amp; Topography (Lap Progress 0%
                        &rarr; 100%)
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                        Vertical Scale &plusmn;{elevationDeltaMeters.toFixed(1)}
                        m
                    </span>
                </div>

                <div className="w-full overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full min-w-[550px] h-48 sm:h-56"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient
                                id={gradId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#10B981"
                                    stopOpacity="0.35"
                                />
                                <stop
                                    offset="80%"
                                    stopColor="#10B981"
                                    stopOpacity="0.05"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#10B981"
                                    stopOpacity="0.0"
                                />
                            </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                            const y = paddingY + pct * chartH;
                            const labelVal = maxEle - pct * range;
                            return (
                                <g key={idx}>
                                    <line
                                        x1={paddingX}
                                        y1={y}
                                        x2={svgWidth - paddingX}
                                        y2={y}
                                        stroke="#262626"
                                        strokeWidth="0.8"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={paddingX - 8}
                                        y={y + 3.5}
                                        fill="#737373"
                                        fontSize="9"
                                        fontFamily="monospace"
                                        textAnchor="end"
                                    >
                                        {labelVal.toFixed(0)}m
                                    </text>
                                </g>
                            );
                        })}

                        {/* Contour Area Fill */}
                        <path d={areaD} fill={`url(#${gradId})`} />

                        {/* Contour Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Landmark Nodes */}
                        {points.map((pt, i) => (
                            <g key={i}>
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={pt.turnNumber ? "5" : "3.5"}
                                    fill={pt.turnNumber ? "#FFFFFF" : "#10B981"}
                                    stroke="#059669"
                                    strokeWidth="2"
                                />
                                {pt.label && (
                                    <text
                                        x={pt.x}
                                        y={pt.y - 10}
                                        fill="#D4D4D4"
                                        fontSize="8.5"
                                        fontFamily="monospace"
                                        textAnchor={
                                            i === 0
                                                ? "start"
                                                : i === points.length - 1
                                                  ? "end"
                                                  : "middle"
                                        }
                                        fontWeight="bold"
                                    >
                                        {pt.label}
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>

                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                    {elevation.elevationNotes}
                </p>
            </div>

            {/* Banked Turns Highlights (Key for Zandvoort, Spa, etc.) */}
            {bankedCorners.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Iconic Banked Corners &amp; Gradients</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {bankedCorners.map((corner) => (
                            <div
                                key={corner.turnNumber}
                                className="p-4 rounded-2xl bg-neutral-900/60 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-sm font-black text-white">
                                        T{corner.turnNumber}: {corner.turnName}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                            {corner.bankingAngleDeg}&deg;
                                            Banking
                                        </span>
                                        {corner.inclinePct && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-800 text-neutral-200">
                                                {corner.inclinePct > 0
                                                    ? `+${corner.inclinePct}%`
                                                    : `${corner.inclinePct}%`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    {corner.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
