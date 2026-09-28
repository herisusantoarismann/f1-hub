"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Race, RaceStatus } from "@/types/f1";
import { Badge } from "@/components/atoms/Badge";
import {
    getCircuitDiagram,
    DEFAULT_CIRCUIT_DIAGRAM,
} from "@/lib/utils/circuit-assets";
import { Calendar, MapPin, Flag, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface RaceCardProps {
    race: Race;
    status?: RaceStatus;
    daysRemaining?: number;
    onSelect?: (race: Race) => void;
    className?: string;
}

export const RaceCard: React.FC<RaceCardProps> = ({
    race,
    status = "upcoming",
    daysRemaining,
    onSelect,
    className,
}) => {
    const isNext = status === "next";
    const isCompleted = status === "completed";
    const hasSprint = Boolean(race.Sprint || race.SprintQualifying);

    const initialDiagram = getCircuitDiagram(race.Circuit.circuitId);
    const [circuitImg, setCircuitImg] = useState(initialDiagram);

    const formattedDate = React.useMemo(() => {
        try {
            const raceDate = new Date(
                `${race.date}T${race.time ?? "12:00:00Z"}`,
            );
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(raceDate);
        } catch {
            return race.date;
        }
    }, [race.date, race.time]);

    return (
        <article
            data-testid="race-card"
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-f1-carbon/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-f1-red/60 hover:shadow-xl",
                isNext
                    ? "border-f1-red shadow-f1-glow ring-1 ring-f1-red/40"
                    : "border-f1-charcoal hover:border-f1-gray/40",
                className,
            )}
        >
            {/* Stretched Link wrapping the whole card to /schedule/[round] */}
            <Link
                href={`/schedule/${race.round}`}
                className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-f1-red rounded-2xl"
                aria-label={`View details for ${race.raceName}`}
            />

            {/* Decorative top racing stripe */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 h-1 transition-all z-10",
                    isNext
                        ? "bg-gradient-to-r from-f1-red via-f1-darkred to-f1-red"
                        : isCompleted
                          ? "bg-emerald-600/60"
                          : "bg-f1-charcoal group-hover:bg-f1-red/70",
                )}
            />

            {/* Header section: Round badge + Status */}
            <div className="relative z-10 flex items-center justify-between gap-2 mb-2 pointer-events-none">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                        variant={isNext ? "primary" : "secondary"}
                        size="sm"
                        data-testid="round-badge"
                    >
                        ROUND {race.round.padStart(2, "0")}
                    </Badge>

                    {hasSprint && (
                        <Badge
                            variant="sprint"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Zap className="w-3 h-3 fill-current text-purple-300" />
                            SPRINT
                        </Badge>
                    )}
                </div>

                {isNext ? (
                    <Badge variant="danger" size="sm">
                        NEXT RACE
                    </Badge>
                ) : isCompleted ? (
                    <Badge variant="success" size="sm">
                        FINISHED
                    </Badge>
                ) : (
                    <Badge variant="outline" size="sm">
                        UPCOMING
                    </Badge>
                )}
            </div>

            {/* Circuit Outline Visual Preview */}
            <div className="relative z-10 w-full h-24 my-2 rounded-xl bg-neutral-950/70 border border-neutral-800/80 p-2 flex items-center justify-center overflow-hidden pointer-events-none group-hover:border-neutral-700/80 transition-colors">
                <Image
                    src={circuitImg}
                    alt={`${race.Circuit.circuitName} layout`}
                    width={180}
                    height={80}
                    className="object-contain max-h-full w-auto opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    onError={() => setCircuitImg(DEFAULT_CIRCUIT_DIAGRAM)}
                    priority={isNext}
                    loading={isNext ? "eager" : undefined}
                    unoptimized
                />
            </div>

            {/* Body: Grand Prix & Circuit Details */}
            <div className="relative z-10 space-y-3 pointer-events-none">
                <div>
                    <h3
                        data-testid="race-name"
                        className="text-lg font-bold tracking-tight text-white group-hover:text-f1-red transition-colors line-clamp-1"
                    >
                        {race.raceName}
                    </h3>
                    <p
                        data-testid="circuit-name"
                        className="text-xs text-f1-gray font-medium mt-0.5 line-clamp-1"
                    >
                        {race.Circuit.circuitName}
                    </p>
                </div>

                {/* Meta tags: Location & Date */}
                <div className="space-y-1.5 text-xs text-f1-lightgray/80 pt-2 border-t border-f1-charcoal/60">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-f1-red shrink-0" />
                        <span data-testid="location-text" className="truncate">
                            {race.Circuit.Location.locality},{" "}
                            {race.Circuit.Location.country}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-f1-gray shrink-0" />
                        <span data-testid="race-date" className="font-mono">
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer & Action link */}
            <div className="relative z-10 mt-4 pt-3 flex items-center justify-between border-t border-f1-charcoal/50">
                <div className="text-[11px] text-f1-gray font-medium pointer-events-none">
                    {daysRemaining !== undefined && daysRemaining > 0 ? (
                        <span className="text-amber-400 font-semibold font-mono">
                            In {daysRemaining}{" "}
                            {daysRemaining === 1 ? "day" : "days"}
                        </span>
                    ) : isCompleted ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                            <Flag className="w-3 h-3" /> Results in
                        </span>
                    ) : (
                        <span>Season {race.season}</span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        if (onSelect) {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect(race);
                        }
                    }}
                    className="relative z-20 inline-flex items-center gap-1 text-xs font-semibold text-f1-lightgray hover:text-white transition-colors group-hover:translate-x-0.5"
                    aria-label={`View details for ${race.raceName}`}
                >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-f1-red" />
                </button>
            </div>
        </article>
    );
};
