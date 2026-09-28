"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Circuit } from "@/types/f1";
import { getNationalityFlag } from "@/lib/utils/asset-helper";
import {
    getCircuitDiagram,
    DEFAULT_CIRCUIT_DIAGRAM,
} from "@/lib/utils/circuit-assets";
import { MapPin, Navigation, Gauge, Milestone, ArrowRight } from "lucide-react";

interface CircuitInfoCardProps {
    circuit: Circuit;
    round: string;
    raceName: string;
    totalLaps?: number;
    circuitLengthKm?: string;
}

// Famous F1 Circuit specs reference mapping (length in km & typical lap count)
const CIRCUIT_SPECS: Record<string, { lengthKm: string; laps: number }> = {
    bahrain: { lengthKm: "5.412 km", laps: 57 },
    jeddah: { lengthKm: "6.174 km", laps: 50 },
    albert_park: { lengthKm: "5.278 km", laps: 58 },
    suzuka: { lengthKm: "5.807 km", laps: 53 },
    shanghai: { lengthKm: "5.451 km", laps: 56 },
    miami: { lengthKm: "5.412 km", laps: 57 },
    imola: { lengthKm: "4.909 km", laps: 63 },
    monaco: { lengthKm: "3.337 km", laps: 78 },
    villeneuve: { lengthKm: "4.361 km", laps: 70 },
    catalunya: { lengthKm: "4.657 km", laps: 66 },
    red_bull_ring: { lengthKm: "4.318 km", laps: 71 },
    silverstone: { lengthKm: "5.891 km", laps: 52 },
    hungaroring: { lengthKm: "4.381 km", laps: 70 },
    spa: { lengthKm: "7.004 km", laps: 44 },
    zandvoort: { lengthKm: "4.259 km", laps: 72 },
    monza: { lengthKm: "5.793 km", laps: 53 },
    baku: { lengthKm: "6.003 km", laps: 51 },
    marina_bay: { lengthKm: "4.940 km", laps: 62 },
    americas: { lengthKm: "5.513 km", laps: 56 },
    rodriguez: { lengthKm: "4.304 km", laps: 71 },
    interlagos: { lengthKm: "4.309 km", laps: 71 },
    vegas: { lengthKm: "6.201 km", laps: 50 },
    losail: { lengthKm: "5.419 km", laps: 57 },
    yas_marina: { lengthKm: "5.281 km", laps: 58 },
};

export const CircuitInfoCard: React.FC<CircuitInfoCardProps> = ({
    circuit,
    round,
    raceName,
    totalLaps,
    circuitLengthKm,
}) => {
    const flag = getNationalityFlag(circuit.Location.country);
    const specs = CIRCUIT_SPECS[circuit.circuitId] || {
        lengthKm: circuitLengthKm || "5.300 km",
        laps: totalLaps || 55,
    };

    const initialDiagram = getCircuitDiagram(circuit.circuitId);
    const [imgSrc, setImgSrc] = useState(initialDiagram);

    useEffect(() => {
        setImgSrc(getCircuitDiagram(circuit.circuitId));
    }, [circuit.circuitId]);

    return (
        <div
            data-testid="circuit-info-card"
            className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-neutral-950 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-f1-red/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Circuit Details */}
                <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-f1-red/15 text-f1-red border border-f1-red/30">
                            ROUND {round.padStart(2, "0")} VENUE
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                            FIA Grade 1 Circuit
                        </span>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                            <span>{circuit.circuitName}</span>
                            <span className="text-xl sm:text-2xl leading-none">
                                {flag}
                            </span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-f1-red shrink-0" />
                            <span>
                                {circuit.Location.locality},{" "}
                                {circuit.Location.country}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        Host of the official {raceName}. Featuring high-speed
                        straights and technical braking zones demanding maximum
                        aerodynamic efficiency.
                    </p>

                    <div className="pt-1">
                        <Link
                            href={`/circuits/${circuit.circuitId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-f1-red hover:underline group"
                        >
                            <span>Inspect Full Technical Profile</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Circuit Layout Visual Diagram & Telemetry Tiles */}
                <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                    {/* Visual Diagram Box */}
                    <div className="relative w-48 h-32 rounded-2xl bg-neutral-950/80 border border-neutral-800 p-3 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                            <Image
                                src={imgSrc}
                                alt={`${circuit.circuitName} track layout`}
                                fill
                                className="object-contain transition-transform duration-500 hover:scale-105"
                                onError={() =>
                                    setImgSrc(DEFAULT_CIRCUIT_DIAGRAM)
                                }
                                priority
                                loading="eager"
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Circuit Telemetry Metric Tiles */}
                    <div className="grid grid-cols-2 gap-3 shrink-0 font-mono w-full sm:w-auto">
                        {/* Metric 1: Track Length */}
                        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                <Milestone className="w-3.5 h-3.5 text-f1-red" />
                                Length
                            </span>
                            <span className="text-base font-black text-white">
                                {specs.lengthKm}
                            </span>
                        </div>

                        {/* Metric 2: Race Distance Laps */}
                        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                                Laps
                            </span>
                            <span className="text-base font-black text-white">
                                {specs.laps} Laps
                            </span>
                        </div>

                        {/* Metric 3: Coordinates */}
                        <div className="col-span-2 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                                GPS Coordinates
                            </span>
                            <span className="text-xs font-bold text-neutral-300">
                                {Number(circuit.Location.lat).toFixed(2)}°N,{" "}
                                {Number(circuit.Location.long).toFixed(2)}°E
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
