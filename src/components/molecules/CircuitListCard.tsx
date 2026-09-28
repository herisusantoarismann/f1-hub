"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Circuit } from "@/types/f1";
import { getCircuitDatabase } from "@/data/circuits-database";
import {
    getCircuitOutline,
    DEFAULT_CIRCUIT_OUTLINE,
} from "@/lib/utils/circuit-assets";
import { getNationalityFlag } from "@/lib/utils/asset-helper";
import {
    MapPin,
    Milestone,
    Calendar,
    ArrowRight,
    CornerDownRight,
} from "lucide-react";

interface CircuitListCardProps {
    circuit: Circuit;
    priority?: boolean;
}

export const CircuitListCard: React.FC<CircuitListCardProps> = ({
    circuit,
    priority = false,
}) => {
    const profile = getCircuitDatabase(circuit.circuitId);
    const flag = getNationalityFlag(circuit.Location.country);
    const outlineSrc = getCircuitOutline(circuit.circuitId);
    const [imgSrc, setImgSrc] = useState(outlineSrc);

    const lengthDisplay = profile
        ? `${profile.lengthKm.toFixed(3)} km`
        : "5.300 km";
    const debutYear = profile?.firstGrandPrix || 1950;
    const turnsCount = profile?.turns || 16;

    return (
        <article
            data-testid={`circuit-list-card-${circuit.circuitId}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/70 backdrop-blur-sm"
        >
            {/* Top Track Outline Thumbnail Container */}
            <div className="relative w-full h-44 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:border-neutral-700 transition-colors">
                <Image
                    src={imgSrc}
                    alt={`${circuit.circuitName} track outline`}
                    width={280}
                    height={150}
                    className="object-contain max-h-full w-auto transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgSrc(DEFAULT_CIRCUIT_OUTLINE)}
                    priority={priority}
                    loading={priority ? "eager" : undefined}
                    unoptimized
                />

                {/* Debut Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-900/90 text-neutral-300 border border-neutral-800 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    F1 Debut {debutYear}
                </span>

                {/* Turns Badge */}
                <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900/90 text-neutral-400 border border-neutral-800 font-bold">
                    {turnsCount} Turns
                </span>
            </div>

            {/* Circuit Information */}
            <div className="space-y-3">
                <div>
                    <h3
                        data-testid="circuit-list-card-name"
                        className="text-lg font-black text-white group-hover:text-f1-red transition-colors line-clamp-1"
                    >
                        {circuit.circuitName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-f1-red shrink-0" />
                        <span className="truncate">
                            {circuit.Location.locality},{" "}
                            {circuit.Location.country}
                        </span>
                        <span className="text-sm leading-none ml-1">
                            {flag}
                        </span>
                    </div>
                </div>

                {/* Quick Telemetry Bar */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/60 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                        <Milestone className="w-3.5 h-3.5 text-f1-red" />
                        <span data-testid="circuit-list-card-length">
                            {lengthDisplay}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300 justify-end">
                        <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                            {profile
                                ? `${profile.drsZones} Overtake`
                                : "Overtake"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                    {profile
                        ? `${profile.racesHeld} GPs Held`
                        : "Championship Track"}
                </span>

                <Link
                    href={`/circuits/${circuit.circuitId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-f1-red hover:underline group-hover:translate-x-0.5 transition-transform"
                    aria-label={`View full profile for ${circuit.circuitName}`}
                >
                    <span>View Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </article>
    );
};
