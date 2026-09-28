"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DriverCareerProfile } from "@/data/drivers-career";
import { getTeamColor, getTeamLogo } from "@/lib/utils/asset-helper";
import { CareerChampionshipBanner } from "@/components/molecules/CareerChampionshipBanner";
import {
    History,
    Flag,
    Trophy,
    Award,
    Calendar,
    ChevronRight,
    Milestone,
    Shield,
    Sparkles,
} from "lucide-react";

interface DriverCareerTimelineProps {
    career: DriverCareerProfile;
    className?: string;
}

type CareerTab = "f1" | "junior";

export const DriverCareerTimeline: React.FC<DriverCareerTimelineProps> = ({
    career,
    className = "",
}) => {
    const [activeTab, setActiveTab] = useState<CareerTab>("f1");

    return (
        <section
            data-testid="driver-career-timeline"
            className={`space-y-6 ${className}`}
        >
            {/* Header & Section Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-f1-red/15 text-f1-red border border-f1-red/30 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" />
                            Motorsport Journey
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Career & Feeder Series Pathway
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                        From junior karting and formula ladders to the pinnacle
                        of Formula 1.
                    </p>
                </div>

                {/* Tab Controls */}
                <div className="flex items-center p-1 rounded-2xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto font-mono text-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab("f1")}
                        data-testid="tab-f1-career"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                            activeTab === "f1"
                                ? "bg-f1-red text-white shadow-lg shadow-f1-red/25"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        <Flag className="w-3.5 h-3.5" />
                        <span>F1 Teams ({career.f1Career.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("junior")}
                        data-testid="tab-junior-ladder"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                            activeTab === "junior"
                                ? "bg-f1-red text-white shadow-lg shadow-f1-red/25"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        <Milestone className="w-3.5 h-3.5" />
                        <span>Road to F1 ({career.juniorCareer.length})</span>
                    </button>
                </div>
            </div>

            {/* Championship Banner */}
            <CareerChampionshipBanner
                worldChampionships={career.worldChampionships}
                juniorTitles={career.juniorTitles}
            />

            {/* TAB 1: FORMULA 1 TEAMS TIMELINE */}
            {activeTab === "f1" && (
                <div className="space-y-4" data-testid="f1-career-panel">
                    <div className="grid grid-cols-1 gap-4">
                        {career.f1Career.map((stint, index) => {
                            const teamColor = getTeamColor(stint.constructorId);
                            const teamLogo = getTeamLogo(stint.constructorId);

                            return (
                                <div
                                    key={index}
                                    data-testid={`f1-stint-${index}`}
                                    className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 transition-all duration-200 hover:border-neutral-700 backdrop-blur-sm"
                                >
                                    {/* Left Accent Color Indicator */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                                        style={{ backgroundColor: teamColor }}
                                    />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                                        <div className="flex items-start sm:items-center gap-4">
                                            {/* Team Logo Emblem (White container for optimal contrast) */}
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                                                <Image
                                                    src={teamLogo}
                                                    alt={stint.teamName}
                                                    width={44}
                                                    height={44}
                                                    className="object-contain max-h-full w-auto"
                                                    unoptimized
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/80 text-neutral-300">
                                                        {stint.years}
                                                    </span>

                                                    {stint.isCurrent && (
                                                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            Current Team
                                                        </span>
                                                    )}

                                                    {stint.championships &&
                                                        stint.championships
                                                            .length > 0 && (
                                                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                                <Trophy className="w-3 h-3 fill-amber-400" />
                                                                {
                                                                    stint
                                                                        .championships
                                                                        .length
                                                                }
                                                                × Champion (
                                                                {stint.championships.join(
                                                                    ", ",
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                </div>

                                                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-f1-red transition-colors">
                                                    {stint.teamName}
                                                </h3>

                                                <span className="text-xs font-mono text-neutral-400">
                                                    Role: {stint.role}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stint Statistics Pill */}
                                        <div className="flex items-center gap-3 font-mono text-xs text-neutral-300 bg-neutral-950/60 px-4 py-2.5 rounded-2xl border border-neutral-800/80 shrink-0">
                                            {typeof stint.wins === "number" && (
                                                <div className="text-center">
                                                    <span className="text-base font-black text-white block">
                                                        {stint.wins}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-500 uppercase">
                                                        Wins
                                                    </span>
                                                </div>
                                            )}

                                            {typeof stint.podiums ===
                                                "number" && (
                                                <>
                                                    <div className="w-px h-6 bg-neutral-800" />
                                                    <div className="text-center">
                                                        <span className="text-base font-black text-white block">
                                                            {stint.podiums}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-500 uppercase">
                                                            Podiums
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {stint.constructorId && (
                                                <Link
                                                    href={`/teams/${stint.constructorId}`}
                                                    className="ml-2 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                                                    title={`View ${stint.teamName} Profile`}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {stint.highlights && (
                                        <div className="mt-3.5 pt-3 border-t border-neutral-800/60 text-xs text-neutral-400 pl-2">
                                            <span className="text-neutral-300 font-semibold">
                                                Highlights:{" "}
                                            </span>
                                            {stint.highlights}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: JUNIOR LADDER (ROAD TO F1) */}
            {activeTab === "junior" && (
                <div className="space-y-4" data-testid="junior-ladder-panel">
                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-f1-red before:via-neutral-700 before:to-neutral-900">
                        {career.juniorCareer.map((step, idx) => (
                            <div
                                key={idx}
                                data-testid={`junior-step-${idx}`}
                                className="relative group"
                            >
                                {/* Timeline Node Bullet */}
                                <div
                                    className={`absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                                        step.isChampion
                                            ? "bg-amber-400 border-amber-300 shadow-md shadow-amber-500/50"
                                            : "bg-neutral-900 border-neutral-700"
                                    }`}
                                />

                                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 transition-colors hover:border-neutral-700 backdrop-blur-sm space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950 text-cyan-400 border border-neutral-800">
                                                {step.years}
                                            </span>
                                            <h4 className="text-base sm:text-lg font-bold text-white">
                                                {step.category}
                                            </h4>
                                        </div>

                                        {step.isChampion && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                                                <Trophy className="w-3 h-3 fill-amber-400" />
                                                Champion 🏆
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1 text-neutral-400">
                                        {step.team && (
                                            <div>
                                                <span className="text-neutral-500">
                                                    Team:{" "}
                                                </span>
                                                <span className="text-neutral-300 font-semibold">
                                                    {step.team}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-neutral-500">
                                                Result:{" "}
                                            </span>
                                            <span className="text-neutral-200">
                                                {step.result}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
