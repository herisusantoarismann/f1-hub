"use client";

import React from "react";
import Image from "next/image";
import {
    SimulatedDriverStanding,
    analyzeClinchScenario,
} from "@/lib/calculator-utils";
import { getDriverImage, getTeamColor } from "@/lib/utils/asset-helper";
import {
    Trophy,
    Calculator,
    CheckCircle2,
    AlertCircle,
    Flag,
} from "lucide-react";

interface ChampionshipClinchCardProps {
    drivers: SimulatedDriverStanding[];
    leaderId: string;
    chaserId: string;
    onLeaderChange: (id: string) => void;
    onChaserChange: (id: string) => void;
    remainingRacesAfterThis: number;
    onRemainingRacesChange: (count: number) => void;
    hasSprintRemaining: boolean;
    includeFastestLap: boolean;
}

export const ChampionshipClinchCard: React.FC<ChampionshipClinchCardProps> = ({
    drivers,
    leaderId,
    chaserId,
    onLeaderChange,
    onChaserChange,
    remainingRacesAfterThis,
    onRemainingRacesChange,
    hasSprintRemaining,
    includeFastestLap,
}) => {
    // Find leader & chaser from simulated standings
    const leader =
        drivers.find((d) => d.Driver.driverId === leaderId) || drivers[0];
    const chaser =
        drivers.find((d) => d.Driver.driverId === chaserId) ||
        drivers[1] ||
        drivers[0];

    if (!leader || !chaser) return null;

    const clinchResult = analyzeClinchScenario({
        leader,
        chaser,
        remainingRacesAfterThis,
        hasSprintRemaining,
        includeFastestLapBonus: includeFastestLap,
    });

    const leaderColor = getTeamColor(leader.Constructors?.[0]?.constructorId);
    const chaserColor = getTeamColor(chaser.Constructors?.[0]?.constructorId);

    return (
        <div
            data-testid="championship-clinch-card"
            className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 backdrop-blur-md transition-all ${
                clinchResult.canClinchThisRace || clinchResult.isAlreadyClinched
                    ? "border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-neutral-900/80 to-neutral-950 shadow-xl shadow-amber-500/10"
                    : "border-neutral-800 bg-neutral-900/60"
            }`}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            Championship Title Clinch Scenario
                        </h3>
                        <p className="text-xs text-neutral-400 font-mono">
                            Kalkulasi matematis peluang penguncian gelar Juara
                            Dunia (WDC)
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="self-start sm:self-auto">
                    {clinchResult.canClinchThisRace ||
                    clinchResult.isAlreadyClinched ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300 font-mono text-xs font-bold animate-pulse">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>TITLE CLINCHED! 🏆</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                            <Flag className="w-3.5 h-3.5 text-cyan-400" />
                            <span>TITLE BATTLE ALIVE ⚔️</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenders Selectors & Remaining Races Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-2">
                {/* Contender 1: Leader */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: leaderColor }}
                        />
                        Pembalap Pemimpin (Leader):
                    </label>
                    <select
                        aria-label="Title Contender Leader"
                        value={leader.Driver.driverId}
                        onChange={(e) => onLeaderChange(e.target.value)}
                        className="w-full text-xs font-mono font-bold bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                    >
                        {drivers.slice(0, 10).map((d) => (
                            <option
                                key={d.Driver.driverId}
                                value={d.Driver.driverId}
                            >
                                #{d.Driver.permanentNumber || "?"}{" "}
                                {d.Driver.givenName} {d.Driver.familyName} (
                                {d.simulatedPoints} pts)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Contender 2: Chaser */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: chaserColor }}
                        />
                        Pesaing Terdekat (Chaser):
                    </label>
                    <select
                        aria-label="Title Contender Chaser"
                        value={chaser.Driver.driverId}
                        onChange={(e) => onChaserChange(e.target.value)}
                        className="w-full text-xs font-mono font-bold bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                        {drivers
                            .filter(
                                (d) =>
                                    d.Driver.driverId !==
                                    leader.Driver.driverId,
                            )
                            .slice(0, 10)
                            .map((d) => (
                                <option
                                    key={d.Driver.driverId}
                                    value={d.Driver.driverId}
                                >
                                    #{d.Driver.permanentNumber || "?"}{" "}
                                    {d.Driver.givenName} {d.Driver.familyName} (
                                    {d.simulatedPoints} pts)
                                </option>
                            ))}
                    </select>
                </div>

                {/* Remaining Races Slider */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        <span>Sisa Balapan Setelah Ini:</span>
                        <span className="text-white font-bold">
                            {remainingRacesAfterThis} GP
                        </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="range"
                            min="0"
                            max="8"
                            value={remainingRacesAfterThis}
                            onChange={(e) =>
                                onRemainingRacesChange(
                                    parseInt(e.target.value, 10),
                                )
                            }
                            className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                        />
                        <span className="text-xs font-mono font-bold text-amber-400 w-8 text-right">
                            {remainingRacesAfterThis}
                        </span>
                    </div>
                </div>
            </div>

            {/* Gap Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400">
                        Selisih Poin Saat Ini
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white mt-0.5 font-mono">
                        {clinchResult.currentGap}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                            pts
                        </span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400">
                        Selisih Pasca Simulasi
                    </div>
                    <div
                        className={`text-lg sm:text-xl font-black mt-0.5 font-mono ${
                            clinchResult.simulatedGap > clinchResult.currentGap
                                ? "text-emerald-400"
                                : clinchResult.simulatedGap <
                                    clinchResult.currentGap
                                  ? "text-red-400"
                                  : "text-white"
                        }`}
                    >
                        {clinchResult.simulatedGap}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                            pts
                        </span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400">
                        Maks Poin Tersisa
                    </div>
                    <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5 font-mono">
                        {clinchResult.maxPointsRemaining}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                            pts
                        </span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400">
                        Target Gap Kunci Gelar
                    </div>
                    <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5 font-mono">
                        &gt; {clinchResult.maxPointsRemaining}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                            pts
                        </span>
                    </div>
                </div>
            </div>

            {/* Clinch Summary & Mathematical Conditions */}
            <div className="mt-4 p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2">
                <div className="flex items-start gap-2 text-xs text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="font-semibold leading-relaxed">
                        {clinchResult.clinchSummary}
                    </p>
                </div>

                {clinchResult.clinchConditions.length > 0 && (
                    <div className="pl-6 space-y-1">
                        {clinchResult.clinchConditions.map((cond, idx) => (
                            <div
                                key={idx}
                                className="text-[11px] text-neutral-400 font-mono list-item"
                            >
                                {cond}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
