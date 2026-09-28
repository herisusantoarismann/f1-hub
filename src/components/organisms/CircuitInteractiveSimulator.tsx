"use client";

import React, { useState, useEffect, useRef } from "react";
import { CircuitProfile } from "@/data/circuits-database";
import { getCircuitSvgPath } from "@/data/circuit-svg-paths";
import { getCircuitElevation } from "@/data/circuits-elevation";
import { CircuitElevationChart } from "@/components/molecules/CircuitElevationChart";
import {
    Maximize2,
    Play,
    Pause,
    RotateCcw,
    Gauge,
    Activity,
    Wind,
    Mountain,
    Zap,
    X,
} from "lucide-react";

interface CircuitInteractiveSimulatorProps {
    profile: CircuitProfile;
    className?: string;
}

export const CircuitInteractiveSimulator: React.FC<
    CircuitInteractiveSimulatorProps
> = ({ profile, className = "" }) => {
    const [activeTab, setActiveTab] = useState<"sim" | "elevation">("sim");
    const [isPlaying, setIsPlaying] = useState(true);
    const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
    const [isZoomed, setIsZoomed] = useState(false);

    // Telemetry state
    const [telemetry, setTelemetry] = useState({
        speedKmH: 260,
        gear: 6,
        progressPct: 0,
        activeAero: "X-MODE" as "X-MODE" | "Z-MODE",
        lapTimeSeconds: 0,
    });

    const pathRef = useRef<SVGPathElement | null>(null);
    const carRef = useRef<SVGGElement | null>(null);
    const progressRef = useRef<number>(0);
    const animFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    const svgData = getCircuitSvgPath(profile.circuitId);
    const elevationData = getCircuitElevation(profile.circuitId);

    // Car path following loop
    useEffect(() => {
        if (activeTab !== "sim") return;

        const pathElem = pathRef.current;
        if (!pathElem) return;

        let totalLength = 0;
        try {
            totalLength = pathElem.getTotalLength();
        } catch {
            return;
        }

        if (totalLength === 0) return;

        const animate = (timestamp: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const deltaMs = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            if (isPlaying) {
                // Determine curvature to modulate speed realistically
                const curLen =
                    (progressRef.current * totalLength) % totalLength;
                const lookAheadLen = (curLen + 15) % totalLength;

                const p1 = pathElem.getPointAtLength(curLen);
                const p2 = pathElem.getPointAtLength(lookAheadLen);

                const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const angleDeg = (angleRad * 180) / Math.PI;

                // Sharp turns require look-back and look-ahead angle change
                const pBehind = pathElem.getPointAtLength(
                    (curLen - 15 + totalLength) % totalLength,
                );
                const angleIn = Math.atan2(p1.y - pBehind.y, p1.x - pBehind.x);
                const angleDelta = Math.abs(angleRad - angleIn);

                // Is corner or straight?
                const isCorner = angleDelta > 0.18;
                const targetSpeed = isCorner
                    ? 95 + Math.random() * 25
                    : 315 + Math.random() * 25;
                const gear = isCorner
                    ? targetSpeed < 115
                        ? 2
                        : 3
                    : targetSpeed > 280
                      ? 8
                      : 7;
                const aeroMode = isCorner ? "Z-MODE" : "X-MODE";

                // Progress speed based on lap length (~75-90s real lap)
                const lapTimeBase = 80 / speedMultiplier;
                const progressDelta = deltaMs / 1000 / lapTimeBase;
                progressRef.current = (progressRef.current + progressDelta) % 1;

                if (carRef.current) {
                    carRef.current.setAttribute(
                        "transform",
                        `translate(${p1.x}, ${p1.y}) rotate(${angleDeg})`,
                    );
                }

                setTelemetry((prev) => ({
                    speedKmH: Math.round(targetSpeed),
                    gear,
                    progressPct: Math.round(progressRef.current * 100),
                    activeAero: aeroMode,
                    lapTimeSeconds:
                        (prev.lapTimeSeconds +
                            (deltaMs / 1000) * speedMultiplier) %
                        lapTimeBase,
                }));
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current)
                cancelAnimationFrame(animFrameRef.current);
            lastTimeRef.current = null;
        };
    }, [activeTab, isPlaying, speedMultiplier, svgData.trackPath]);

    const formatLapTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(2);
        return `${m.toString().padStart(2, "0")}:${s.padStart(5, "0")}`;
    };

    return (
        <>
            <div
                data-testid="circuit-interactive-simulator"
                className={`relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-md transition-colors hover:border-neutral-700/80 ${className}`}
            >
                {/* Header Controls: Tab Switcher & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                            Interactive Track Telemetry
                        </span>

                        {/* View Switcher Tabs */}
                        <div className="p-1 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-1 font-mono text-xs">
                            <button
                                type="button"
                                data-testid="mode-sim-button"
                                onClick={() => setActiveTab("sim")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                                    activeTab === "sim"
                                        ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                <Activity className="w-3.5 h-3.5" />
                                <span>2D Live Sim</span>
                            </button>

                            <button
                                type="button"
                                data-testid="mode-elevation-button"
                                onClick={() => setActiveTab("elevation")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                                    activeTab === "elevation"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                <Mountain className="w-3.5 h-3.5" />
                                <span>Elevation &amp; Banking</span>
                            </button>
                        </div>

                        {/* Overtake / Turns Badge */}
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            {profile.drsZones} 2026 Overtake{" "}
                            {profile.drsZones === 1 ? "Zone" : "Zones"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-neutral-950 text-neutral-300 border border-neutral-800">
                            {profile.turns} Turns
                        </span>
                        {elevationData.bankedCorners.length > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {elevationData.bankedCorners[0].bankingAngleDeg}
                                &deg; Banking
                            </span>
                        )}
                    </div>

                    {/* Secondary Controls: Inspect Map Lightbox */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsZoomed(true)}
                            data-testid="toggle-zoom-button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
                            aria-label="Inspect Full Map"
                        >
                            <Maximize2 className="w-3.5 h-3.5 text-f1-red" />
                            <span className="hidden sm:inline">
                                Inspect Map
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tab 1: Live Simulation Screen */}
                {activeTab === "sim" && (
                    <div className="space-y-4">
                        {/* Simulation Viewport Canvas */}
                        <div className="relative w-full h-80 sm:h-[420px] rounded-2xl bg-neutral-950/90 border border-neutral-800/80 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                            {/* Live Telemetry Heads-Up Display (HUD) */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 font-mono pointer-events-none">
                                <div className="px-3 py-2 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                        <Gauge className="w-3.5 h-3.5 text-f1-red" />
                                        <span className="text-neutral-400 text-xs font-semibold">
                                            Speed:
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {telemetry.speedKmH}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 uppercase">
                                            km/h
                                        </span>
                                    </div>
                                    <span className="text-neutral-700">|</span>
                                    <div className="text-xs font-bold text-amber-400">
                                        Gear {telemetry.gear}
                                    </div>
                                    <span className="text-neutral-700">|</span>
                                    <div className="text-xs text-neutral-300">
                                        LAP {telemetry.progressPct}%
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider border ${
                                            telemetry.activeAero === "X-MODE"
                                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                                                : "bg-amber-500/10 text-amber-400 border-amber-500/40"
                                        }`}
                                    >
                                        <Wind className="w-3 h-3 inline mr-1" />
                                        ACTIVE AERO: {telemetry.activeAero}
                                    </span>

                                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400">
                                        {formatLapTime(
                                            telemetry.lapTimeSeconds,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* SVG Track Layout Canvas with Animated F1 Car */}
                            <svg
                                viewBox="0 0 500 500"
                                className="w-full h-full max-w-[460px] max-h-[460px] drop-shadow-2xl"
                                fill="none"
                            >
                                <defs>
                                    <pattern
                                        id="simGrid"
                                        width="25"
                                        height="25"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <path
                                            d="M 25 0 L 0 0 0 25"
                                            fill="none"
                                            stroke="#262626"
                                            strokeWidth="0.5"
                                            strokeOpacity="0.4"
                                        />
                                    </pattern>
                                    <linearGradient
                                        id="trackGlowGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#E10600" />
                                        <stop
                                            offset="100%"
                                            stopColor="#FF3838"
                                        />
                                    </linearGradient>
                                    <filter
                                        id="f1Glow"
                                        x="-20%"
                                        y="-20%"
                                        width="140%"
                                        height="140%"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="6"
                                            result="blur"
                                        />
                                        <feComposite
                                            in="SourceGraphic"
                                            in2="blur"
                                            operator="over"
                                        />
                                    </filter>
                                </defs>

                                {/* Background Grid */}
                                <rect
                                    width="500"
                                    height="500"
                                    fill="url(#simGrid)"
                                />

                                {/* Asphalt Road Base */}
                                <path
                                    d={svgData.trackPath}
                                    stroke="#171717"
                                    strokeWidth="32"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Glowing Race Track Layer */}
                                <path
                                    d={svgData.trackPath}
                                    stroke="url(#trackGlowGrad)"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#f1Glow)"
                                />

                                {/* Centerline Racing Track */}
                                <path
                                    ref={pathRef}
                                    d={svgData.trackPath}
                                    stroke="#FFFFFF"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="8,6"
                                    strokeOpacity="0.8"
                                />

                                {/* Start / Finish Marker */}
                                {svgData.sfPath && (
                                    <path
                                        d={svgData.sfPath}
                                        fill="#FFFFFF"
                                        fillOpacity="1"
                                    />
                                )}

                                {/* Direction Arrow */}
                                {svgData.dirPath && (
                                    <path
                                        d={svgData.dirPath}
                                        stroke="#FFFFFF"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Animated F1 Car Marker */}
                                <g
                                    ref={carRef}
                                    style={{ transformOrigin: "0 0" }}
                                >
                                    {/* Car Body Shadow & Glow */}
                                    <ellipse
                                        cx="-4"
                                        cy="0"
                                        rx="14"
                                        ry="7"
                                        fill="#E10600"
                                        opacity="0.35"
                                        filter="url(#f1Glow)"
                                    />
                                    {/* Rear Wing */}
                                    <rect
                                        x="-14"
                                        y="-8"
                                        width="4"
                                        height="16"
                                        rx="1"
                                        fill="#FFFFFF"
                                    />
                                    {/* Rear Wheels */}
                                    <rect
                                        x="-9"
                                        y="-9"
                                        width="6"
                                        height="4"
                                        rx="1"
                                        fill="#1A1A1A"
                                        stroke="#737373"
                                        strokeWidth="0.5"
                                    />
                                    <rect
                                        x="-9"
                                        y="5"
                                        width="6"
                                        height="4"
                                        rx="1"
                                        fill="#1A1A1A"
                                        stroke="#737373"
                                        strokeWidth="0.5"
                                    />
                                    {/* Main Chassis */}
                                    <polygon
                                        points="12,0 -12,-5 -12,5"
                                        fill="#E10600"
                                    />
                                    {/* Cockpit & Halo */}
                                    <circle
                                        cx="-1"
                                        cy="0"
                                        r="2.5"
                                        fill="#0A0A0A"
                                    />
                                    <circle
                                        cx="-1"
                                        cy="0"
                                        r="1.5"
                                        fill="#38BDF8"
                                    />
                                    {/* Front Wheels */}
                                    <rect
                                        x="5"
                                        y="-8"
                                        width="5"
                                        height="3.5"
                                        rx="1"
                                        fill="#1A1A1A"
                                        stroke="#737373"
                                        strokeWidth="0.5"
                                    />
                                    <rect
                                        x="5"
                                        y="4.5"
                                        width="5"
                                        height="3.5"
                                        rx="1"
                                        fill="#1A1A1A"
                                        stroke="#737373"
                                        strokeWidth="0.5"
                                    />
                                    {/* Front Wing */}
                                    <polygon
                                        points="12,-7 14,0 12,7 10,0"
                                        fill="#FFFFFF"
                                    />
                                </g>
                            </svg>

                            {/* Watermark track name */}
                            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none">
                                {profile.officialName} • Live Telemetry
                                Simulator
                            </div>
                        </div>

                        {/* Interactive Playback Control Bar */}
                        <div className="flex items-center justify-between bg-neutral-950/80 rounded-2xl border border-neutral-800 p-3 px-4 font-mono text-xs">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    data-testid="toggle-car-animation"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                                    aria-label={
                                        isPlaying
                                            ? "Pause simulation"
                                            : "Resume simulation"
                                    }
                                >
                                    {isPlaying ? (
                                        <Pause className="w-4 h-4 text-amber-400" />
                                    ) : (
                                        <Play className="w-4 h-4 text-emerald-400" />
                                    )}
                                    <span className="text-xs font-bold">
                                        {isPlaying ? "Pause Sim" : "Resume Sim"}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        progressRef.current = 0;
                                        setTelemetry((prev) => ({
                                            ...prev,
                                            progressPct: 0,
                                            lapTimeSeconds: 0,
                                        }));
                                    }}
                                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                                    aria-label="Restart lap"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Speed Multiplier Toggle */}
                            <div className="flex items-center gap-1 text-[11px]">
                                <span className="text-neutral-500 mr-1 hidden sm:inline">
                                    Speed:
                                </span>
                                {[1, 1.5, 2].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSpeedMultiplier(s)}
                                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                                            speedMultiplier === s
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-900 text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Elevation & Banking Profile */}
                {activeTab === "elevation" && (
                    <CircuitElevationChart elevation={elevationData} />
                )}
            </div>

            {/* Lightbox / Zoom Preview Modal */}
            {isZoomed && (
                <div
                    data-testid="circuit-lightbox-modal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Detailed Circuit Lightbox"
                >
                    <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col space-y-4 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                            <div>
                                <h3 className="text-lg font-black text-white">
                                    {profile.officialName}
                                </h3>
                                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                    {profile.lengthKm.toFixed(3)} km •{" "}
                                    {profile.turns} Turns • {profile.drsZones}{" "}
                                    2026 Overtake Zones
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsZoomed(false)}
                                data-testid="close-lightbox-button"
                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                aria-label="Close zoomed view"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* High-Res View Container */}
                        <div className="relative w-full h-[65vh] rounded-2xl bg-neutral-950 p-4 flex items-center justify-center overflow-hidden">
                            <svg
                                viewBox="0 0 500 500"
                                className="w-full h-full max-w-[550px]"
                                fill="none"
                            >
                                <rect width="500" height="500" fill="#0A0A0A" />
                                <path
                                    d={svgData.trackPath}
                                    stroke="#262626"
                                    strokeWidth="32"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d={svgData.trackPath}
                                    stroke="#E10600"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d={svgData.trackPath}
                                    stroke="#FFFFFF"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="8,6"
                                    strokeOpacity="0.8"
                                />
                                {svgData.sfPath && (
                                    <path d={svgData.sfPath} fill="#FFFFFF" />
                                )}
                                {svgData.dirPath && (
                                    <path
                                        d={svgData.dirPath}
                                        stroke="#FFFFFF"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                )}
                            </svg>
                        </div>

                        {/* Modal Footer note */}
                        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-neutral-800/80">
                            <span>
                                High-precision FIA Homologated Grade 1 Track
                                Blueprint.
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsZoomed(false)}
                                className="text-f1-red hover:underline font-bold"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
