"use client";

import React, { useState } from "react";
import { getCircuitSvgPath } from "@/data/circuit-svg-paths";
import { CircuitProfile } from "@/data/circuits-database";
import { Maximize2, Zap, X } from "lucide-react";

interface CircuitDetailedHeroProps {
    profile: CircuitProfile;
    className?: string;
}

export const CircuitDetailedHero: React.FC<CircuitDetailedHeroProps> = ({
    profile,
    className = "",
}) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const svgData = getCircuitSvgPath(profile.circuitId);

    return (
        <>
            <div
                data-testid="circuit-detailed-hero"
                className={`relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-md transition-colors hover:border-neutral-700/80 ${className}`}
            >
                {/* Header Controls: DRS badge & Zoom Toggle */}
                <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                            Technical Track Map
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            {profile.drsZones} 2026 Overtake{" "}
                            {profile.drsZones === 1 ? "Zone" : "Zones"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-neutral-950 text-neutral-300 border border-neutral-800">
                            {profile.turns} Turns
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsZoomed(true)}
                        data-testid="toggle-zoom-button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
                        aria-label="Zoom circuit map"
                    >
                        <Maximize2 className="w-3.5 h-3.5 text-f1-red" />
                        <span className="hidden sm:inline">Inspect Map</span>
                    </button>
                </div>

                {/* Circuit Detailed Graphic Canvas */}
                <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-neutral-950/90 border border-neutral-800/80 p-4 sm:p-6 flex items-center justify-center overflow-hidden group">
                    <svg
                        viewBox="0 0 500 500"
                        className="w-full h-full max-w-[440px] max-h-[440px] transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl"
                        fill="none"
                        role="img"
                        aria-label={`${profile.officialName} detailed technical track map with turns and DRS zones`}
                    >
                        <defs>
                            <pattern
                                id={`detailGrid_${profile.circuitId}`}
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
                                id={`detailTrackGrad_${profile.circuitId}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#E10600" />
                                <stop offset="100%" stopColor="#FF3838" />
                            </linearGradient>
                            <filter
                                id={`detailGlow_${profile.circuitId}`}
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                            >
                                <feGaussianBlur
                                    stdDeviation="5"
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
                            fill={`url(#detailGrid_${profile.circuitId})`}
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
                            stroke={`url(#detailTrackGrad_${profile.circuitId})`}
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter={`url(#detailGlow_${profile.circuitId})`}
                        />

                        {/* Centerline Racing Track */}
                        <path
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
                    </svg>

                    {/* Subtle watermarked track name */}
                    <div className="absolute bottom-3 left-4 text-[11px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none">
                        {profile.officialName} • FIA Homologation
                    </div>
                </div>
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
                                    DRS Zones
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
                                Turn numbers indicate apex points. Green markers
                                indicate 2026 Active Aero (X-Mode) and Manual
                                Override overtake sectors.
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
