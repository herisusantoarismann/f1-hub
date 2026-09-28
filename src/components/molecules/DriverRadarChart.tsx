"use client";

import React, { useId } from "react";
import { DriverPerformanceProfile } from "@/data/drivers-ratings";
import {
    Zap,
    ShieldCheck,
    Gauge,
    Compass,
    CloudRain,
    Flame,
} from "lucide-react";

interface DriverRadarChartProps {
    driver1: DriverPerformanceProfile;
    driver2: DriverPerformanceProfile;
    className?: string;
}

const ATTRIBUTES = [
    { key: "qualifyingPace", label: "Qualifying Pace", icon: Zap },
    { key: "raceCraft", label: "Race Craft", icon: ShieldCheck },
    { key: "consistency", label: "Consistency", icon: Gauge },
    { key: "overtaking", label: "Overtaking", icon: Flame },
    { key: "wetWeather", label: "Wet Weather", icon: CloudRain },
    { key: "experience", label: "Experience", icon: Compass },
] as const;

export const DriverRadarChart: React.FC<DriverRadarChartProps> = ({
    driver1,
    driver2,
    className = "",
}) => {
    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "");

    const size = 380;
    const center = size / 2;
    const radius = 135;
    const totalAxes = ATTRIBUTES.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Calculate (x, y) given an angle index and normalized value (0 - 100)
    const getCoord = (index: number, value: number) => {
        const angle = index * angleStep - Math.PI / 2; // start from top (12 o'clock)
        const dist = (value / 100) * radius;
        return {
            x: center + dist * Math.cos(angle),
            y: center + dist * Math.sin(angle),
        };
    };

    // Build polygon path string for a driver
    const getPolygonPoints = (driver: DriverPerformanceProfile) => {
        return ATTRIBUTES.map((attr, i) => {
            const val = driver.skills[attr.key];
            const coord = getCoord(i, val);
            return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`;
        }).join(" ");
    };

    const poly1 = getPolygonPoints(driver1);
    const poly2 = getPolygonPoints(driver2);

    // Color definitions
    const color1 = driver1.teamColor || "#38BDF8";
    const color2 =
        driver2.teamColor === driver1.teamColor
            ? "#F43F5E"
            : driver2.teamColor || "#E10600";

    return (
        <div
            data-testid="driver-radar-chart"
            className={`relative rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md flex flex-col items-center justify-between ${className}`}
        >
            {/* Header Title & Legend */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 font-mono">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        Performance Radar Analysis
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                        Six-Dimension Motorsport Competency Breakdown (Scale
                        0-100)
                    </p>
                </div>

                {/* Legend Chips */}
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color1 }}
                        />
                        <span className="font-bold text-white">
                            {driver1.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                            ({driver1.overallRating})
                        </span>
                    </div>
                    <span className="text-neutral-600">vs</span>
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color2 }}
                        />
                        <span className="font-bold text-white">
                            {driver2.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                            ({driver2.overallRating})
                        </span>
                    </div>
                </div>
            </div>

            {/* SVG Spider/Radar Canvas */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center my-2">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full overflow-visible drop-shadow-xl"
                >
                    <defs>
                        <radialGradient
                            id={`radGrad1_${cleanId}`}
                            cx="50%"
                            cy="50%"
                            r="50%"
                        >
                            <stop
                                offset="0%"
                                stopColor={color1}
                                stopOpacity="0.45"
                            />
                            <stop
                                offset="100%"
                                stopColor={color1}
                                stopOpacity="0.1"
                            />
                        </radialGradient>
                        <radialGradient
                            id={`radGrad2_${cleanId}`}
                            cx="50%"
                            cy="50%"
                            r="50%"
                        >
                            <stop
                                offset="0%"
                                stopColor={color2}
                                stopOpacity="0.45"
                            />
                            <stop
                                offset="100%"
                                stopColor={color2}
                                stopOpacity="0.1"
                            />
                        </radialGradient>
                    </defs>

                    {/* Concentric Grid Web Polygons */}
                    {[20, 40, 60, 80, 100].map((level) => {
                        const webPts = ATTRIBUTES.map((_, i) => {
                            const c = getCoord(i, level);
                            return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
                        }).join(" ");

                        return (
                            <polygon
                                key={level}
                                points={webPts}
                                fill={level === 100 ? "#0A0A0A" : "none"}
                                fillOpacity={level === 100 ? 0.4 : 0}
                                stroke="#262626"
                                strokeWidth={level === 100 ? "1.5" : "0.75"}
                                strokeDasharray={level === 100 ? "none" : "2 2"}
                            />
                        );
                    })}

                    {/* Axis Spoke Lines */}
                    {ATTRIBUTES.map((_, i) => {
                        const c = getCoord(i, 100);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={c.x}
                                y2={c.y}
                                stroke="#2E2E2E"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Driver 2 Polygon Area */}
                    <polygon
                        points={poly2}
                        fill={`url(#radGrad2_${cleanId})`}
                        stroke={color2}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                    />

                    {/* Driver 1 Polygon Area */}
                    <polygon
                        points={poly1}
                        fill={`url(#radGrad1_${cleanId})`}
                        stroke={color1}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                    />

                    {/* Data Point Dots for Driver 1 */}
                    {ATTRIBUTES.map((attr, i) => {
                        const c = getCoord(i, driver1.skills[attr.key]);
                        return (
                            <circle
                                key={`d1_${i}`}
                                cx={c.x}
                                cy={c.y}
                                r="4"
                                fill={color1}
                                stroke="#000000"
                                strokeWidth="1.5"
                            />
                        );
                    })}

                    {/* Data Point Dots for Driver 2 */}
                    {ATTRIBUTES.map((attr, i) => {
                        const c = getCoord(i, driver2.skills[attr.key]);
                        return (
                            <circle
                                key={`d2_${i}`}
                                cx={c.x}
                                cy={c.y}
                                r="4"
                                fill={color2}
                                stroke="#000000"
                                strokeWidth="1.5"
                            />
                        );
                    })}

                    {/* Attribute Outer Labels & Score Badges */}
                    {ATTRIBUTES.map((attr, i) => {
                        const labelCoord = getCoord(i, 122);
                        const val1 = driver1.skills[attr.key];
                        const val2 = driver2.skills[attr.key];
                        const delta = val1 - val2;

                        let textAnchor: "middle" | "start" | "end" = "middle";
                        if (labelCoord.x > center + 30) textAnchor = "start";
                        else if (labelCoord.x < center - 30) textAnchor = "end";

                        return (
                            <g key={`lbl_${i}`}>
                                <text
                                    x={labelCoord.x}
                                    y={labelCoord.y - 4}
                                    fill="#E5E5E5"
                                    fontSize="10.5"
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                    textAnchor={textAnchor}
                                >
                                    {attr.label}
                                </text>
                                <text
                                    x={labelCoord.x}
                                    y={labelCoord.y + 9}
                                    fontSize="9.5"
                                    fontFamily="monospace"
                                    textAnchor={textAnchor}
                                >
                                    <tspan fill={color1} fontWeight="bold">
                                        {val1}
                                    </tspan>
                                    <tspan fill="#737373"> vs </tspan>
                                    <tspan fill={color2} fontWeight="bold">
                                        {val2}
                                    </tspan>
                                    <tspan
                                        fill={
                                            delta > 0
                                                ? color1
                                                : delta < 0
                                                  ? color2
                                                  : "#737373"
                                        }
                                    >
                                        {delta !== 0
                                            ? ` (${delta > 0 ? `+${delta}` : delta})`
                                            : " (=)"}
                                    </tspan>
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Quick Skills Comparison Grid */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-neutral-800/80 font-mono text-xs">
                {ATTRIBUTES.map((attr) => {
                    const v1 = driver1.skills[attr.key];
                    const v2 = driver2.skills[attr.key];
                    const leader = v1 > v2 ? driver1 : v2 > v1 ? driver2 : null;
                    const leaderColor =
                        v1 > v2 ? color1 : v2 > v1 ? color2 : "#737373";

                    return (
                        <div
                            key={attr.key}
                            className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between"
                        >
                            <span className="text-[11px] text-neutral-400 truncate mr-1">
                                {attr.label}
                            </span>
                            <span
                                className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                                style={{
                                    backgroundColor: `${leaderColor}20`,
                                    color: leader ? leaderColor : "#A3A3A3",
                                    border: `1px solid ${leaderColor}40`,
                                }}
                            >
                                {leader
                                    ? `${leader.code} +${Math.abs(v1 - v2)}`
                                    : "TIE"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
