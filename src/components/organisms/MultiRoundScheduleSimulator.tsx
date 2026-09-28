"use client";

import React, { useState, useMemo } from "react";
import { DriverStanding, ConstructorStanding } from "@/types/standings";
import {
    RemainingRace,
    REMAINING_2026_RACES,
    RoundDriverPoints,
    calculateMultiRoundProgression,
    GP_POINTS_MAP,
    SPRINT_POINTS_MAP,
} from "@/lib/calculator-utils";
import {
    Trophy,
    Calendar,
    Zap,
    Crown,
    RotateCcw,
    TrendingUp,
    Shield,
    Users,
    Sparkles,
    Flag,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

interface MultiRoundScheduleSimulatorProps {
    initialDriverStandings: DriverStanding[];
    initialConstructorStandings: ConstructorStanding[];
    races?: RemainingRace[];
    className?: string;
}

export const MultiRoundScheduleSimulator: React.FC<MultiRoundScheduleSimulatorProps> = ({
    initialDriverStandings,
    initialConstructorStandings,
    races = REMAINING_2026_RACES,
    className = "",
}) => {
    // Selected active round tab (defaults to first remaining race, e.g. round "16")
    const [activeRound, setActiveRound] = useState<string>(races[0]?.round || "16");

    // Multi-round outcomes: roundId -> driverId -> RoundDriverPoints
    const [roundOutcomes, setRoundOutcomes] = useState<
        Record<string, Record<string, RoundDriverPoints>>
    >({});

    const [activeTab, setActiveTab] = useState<"drivers" | "constructors">(
        "drivers",
    );

    // Active race object
    const currentRace = useMemo(() => {
        return races.find((r) => r.round === activeRound) || races[0];
    }, [races, activeRound]);

    // Top drivers to spotlight for quick inputs
    const topContenders = useMemo(() => {
        return initialDriverStandings.slice(0, 10);
    }, [initialDriverStandings]);

    // Calculate full progressive simulation
    const simulation = useMemo(() => {
        return calculateMultiRoundProgression(
            initialDriverStandings,
            initialConstructorStandings,
            roundOutcomes,
            races,
        );
    }, [initialDriverStandings, initialConstructorStandings, roundOutcomes, races]);

    // Update points for a driver in the active round
    const handleSetDriverPoints = (
        driverId: string,
        partial: Partial<RoundDriverPoints>,
    ) => {
        setRoundOutcomes((prev) => {
            const currentRoundObj = prev[activeRound] || {};
            const currentDriverObj = currentRoundObj[driverId] || { driverId };

            return {
                ...prev,
                [activeRound]: {
                    ...currentRoundObj,
                    [driverId]: {
                        ...currentDriverObj,
                        ...partial,
                    },
                },
            };
        });
    };

    // Quick presets for the current round
    const handleApplyRoundPreset = (type: string) => {
        const nextRound: Record<string, RoundDriverPoints> = {};

        switch (type) {
            case "mercedes_ant_p1":
                nextRound["antonelli"] = {
                    driverId: "antonelli",
                    gpPosition: 1,
                    fastestLap: true,
                    sprintPosition: currentRace.hasSprint ? 1 : undefined,
                };
                nextRound["russell"] = {
                    driverId: "russell",
                    gpPosition: 2,
                    sprintPosition: currentRace.hasSprint ? 2 : undefined,
                };
                nextRound["leclerc"] = { driverId: "leclerc", gpPosition: 3 };
                break;

            case "mercedes_rus_p1":
                nextRound["russell"] = {
                    driverId: "russell",
                    gpPosition: 1,
                    fastestLap: true,
                    sprintPosition: currentRace.hasSprint ? 1 : undefined,
                };
                nextRound["antonelli"] = {
                    driverId: "antonelli",
                    gpPosition: 2,
                    sprintPosition: currentRace.hasSprint ? 2 : undefined,
                };
                nextRound["norris"] = { driverId: "norris", gpPosition: 3 };
                break;

            case "ferrari_1_2":
                nextRound["leclerc"] = {
                    driverId: "leclerc",
                    gpPosition: 1,
                    fastestLap: true,
                };
                nextRound["hamilton"] = { driverId: "hamilton", gpPosition: 2 };
                nextRound["antonelli"] = { driverId: "antonelli", gpPosition: 3 };
                nextRound["russell"] = { driverId: "russell", gpPosition: 4 };
                break;

            case "mclaren_1_2":
                nextRound["norris"] = {
                    driverId: "norris",
                    gpPosition: 1,
                    fastestLap: true,
                };
                nextRound["piastri"] = { driverId: "piastri", gpPosition: 2 };
                nextRound["antonelli"] = { driverId: "antonelli", gpPosition: 3 };
                break;

            case "verstappen_win":
                nextRound["max_verstappen"] = {
                    driverId: "max_verstappen",
                    gpPosition: 1,
                    fastestLap: true,
                };
                nextRound["antonelli"] = { driverId: "antonelli", gpPosition: 2 };
                nextRound["russell"] = { driverId: "russell", gpPosition: 3 };
                break;

            case "reset_round":
                setRoundOutcomes((prev) => {
                    const copy = { ...prev };
                    delete copy[activeRound];
                    return copy;
                });
                return;
        }

        setRoundOutcomes((prev) => ({
            ...prev,
            [activeRound]: {
                ...(prev[activeRound] || {}),
                ...nextRound,
            },
        }));
    };

    // Reset all rounds
    const handleResetAll = () => {
        setRoundOutcomes({});
    };

    // Calculate filled rounds count
    const filledRoundsCount = useMemo(() => {
        return Object.keys(roundOutcomes).filter(
            (k) => Object.keys(roundOutcomes[k] || {}).length > 0,
        ).length;
    }, [roundOutcomes]);

    return (
        <div
            data-testid="multi-round-schedule-simulator"
            className={`space-y-8 ${className}`}
        >
            {/* Header & Season Context Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-f1-red/15 text-f1-red border border-f1-red/30 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {races.length} Sisa Balapan Terakhir
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-300 font-semibold border border-neutral-700/60">
                            Rounds {races[0]?.round} &ndash; {races[races.length - 1]?.round}
                        </span>
                        {filledRoundsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                {filledRoundsCount} / {races.length} Balapan Diisi
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Multi-Round Championship Schedule Simulator
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">
                        Pilih balapan, masukkan hasil poin per seri balapan (Grand Prix &amp; Sprint),
                        dan saksikan live kalkulasi poin kumulatif pembalap serta tim konstruktor.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleResetAll}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Atur Ulang Semua Balapan</span>
                    </button>
                </div>
            </div>

            {/* Title Clinch Moment Alert Banner (if clinched) */}
            {simulation.clinchMoment && (
                <div
                    data-testid="clinch-alert-banner"
                    className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/10 border border-amber-500/40 backdrop-blur-md flex items-center gap-4 animate-in fade-in duration-300"
                >
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Crown className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                            <span>Skenario Penguncian Gelar Juara Dunia</span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px]">
                                Clinched!
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-white tracking-tight">
                            🏆 {simulation.clinchMoment.championName} resmi mengunci gelar Juara Dunia F1 2026!
                        </h3>
                        <p className="text-xs text-neutral-300 font-mono mt-0.5">
                            Gelar dipastikan pada <strong className="text-white">Round {simulation.clinchMoment.roundNumber} ({simulation.clinchMoment.raceName})</strong> dengan keunggulan telak {simulation.clinchMoment.gap} poin yang sudah tidak bisa dikejar secara matematis.
                        </p>
                    </div>
                </div>
            )}

            {/* Remaining Races Horizontal Tab Selector */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono px-1">
                    <span className="text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Flag className="w-3.5 h-3.5 text-f1-red" />
                        Pilih Seri Balapan (Round):
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                        Klik salah satu seri balapan untuk mengisi hasil
                    </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono">
                    {races.map((race, idx) => {
                        const isSelected = race.round === activeRound;
                        const roundOutcomesMap = roundOutcomes[race.round] || {};
                        const hasInputs = Object.keys(roundOutcomesMap).length > 0;

                        // Quick summary of top scorer in this round
                        let topScorerText = "";
                        const entries = Object.entries(roundOutcomesMap);
                        if (entries.length > 0) {
                            const sorted = entries.sort((a, b) => {
                                const ptsA = a[1].manualPoints ?? (a[1].gpPosition ? GP_POINTS_MAP[a[1].gpPosition] || 0 : 0);
                                const ptsB = b[1].manualPoints ?? (b[1].gpPosition ? GP_POINTS_MAP[b[1].gpPosition] || 0 : 0);
                                return ptsB - ptsA;
                            });
                            const top = sorted[0];
                            const topPts = top[1].manualPoints ?? (top[1].gpPosition ? GP_POINTS_MAP[top[1].gpPosition] || 0 : 0);
                            topScorerText = `${top[0].substring(0, 3).toUpperCase()}: +${topPts}`;
                        }

                        return (
                            <button
                                key={race.round}
                                type="button"
                                onClick={() => setActiveRound(race.round)}
                                data-testid={`round-tab-${race.round}`}
                                className={`flex-shrink-0 flex flex-col p-3 rounded-2xl border text-left transition-all min-w-[155px] ${
                                    isSelected
                                        ? "bg-f1-red text-white border-f1-red shadow-lg shadow-f1-red/30 scale-[1.02]"
                                        : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                                }`}
                            >
                                <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                                    <span className="opacity-80">R{race.round} &bull; #{idx + 1}</span>
                                    {race.hasSprint && (
                                        <span
                                            className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase flex items-center gap-0.5 ${
                                                isSelected
                                                    ? "bg-white text-f1-red"
                                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                            }`}
                                        >
                                            <Zap className="w-2.5 h-2.5 fill-current" />
                                            Sprint
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-black truncate leading-tight">
                                    {race.raceName.replace("Grand Prix", "GP")}
                                </span>
                                <span className="text-[10px] opacity-75 mt-0.5">
                                    {race.date}
                                </span>

                                {hasInputs && (
                                    <div
                                        className={`mt-2 pt-1.5 border-t text-[10px] font-bold ${
                                            isSelected
                                                ? "border-white/30 text-white"
                                                : "border-neutral-800 text-emerald-400"
                                        }`}
                                    >
                                        {topScorerText || "Diisi ✓"}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Round Editor Card */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl space-y-6 font-mono">
                {/* Round Details Header & Quick Presets */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-f1-red font-black text-sm">
                            R{currentRace.round}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-black text-white">
                                    {currentRace.raceName}
                                </h3>
                                {currentRace.hasSprint && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                        <Zap className="w-3 h-3 fill-current" />
                                        Sprint Race (+8 Pts)
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-neutral-400">
                                {currentRace.circuitName || currentRace.locality} &bull; {currentRace.date}
                            </span>
                        </div>
                    </div>

                    {/* Presets for this round */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 mr-1">
                            Preset Cepat:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleApplyRoundPreset("mercedes_ant_p1")}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        >
                            ANT P1, RUS P2
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApplyRoundPreset("mercedes_rus_p1")}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        >
                            RUS P1, ANT P2
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApplyRoundPreset("ferrari_1_2")}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        >
                            Ferrari 1-2
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApplyRoundPreset("mclaren_1_2")}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        >
                            McLaren 1-2
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApplyRoundPreset("reset_round")}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[11px]"
                        >
                            Kosongkan Seri Ini
                        </button>
                    </div>
                </div>

                {/* Contenders Input Grid */}
                <div className="space-y-3">
                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Input Hasil Pembalap di Round {currentRace.round}:</span>
                        <span className="text-[11px] text-neutral-500 font-normal">
                            Masukkan poin langsung (misal: 25, 18) atau pilih posisi finis
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topContenders.map((standing) => {
                            const dId = standing.Driver.driverId;
                            const outcome = roundOutcomes[currentRace.round]?.[dId] || { driverId: dId };
                            const ptsThisRound = simulation.roundByRoundPoints[dId]?.[currentRace.round] || 0;
                            const totalRunning = simulation.cumulativeDriverPoints[dId]?.[currentRace.round] || parseFloat(standing.points);

                            const teamName = standing.Constructors?.[0]?.name || "F1 Team";

                            return (
                                <div
                                    key={dId}
                                    className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2.5 hover:border-neutral-700/80 transition-all"
                                >
                                    {/* Driver Header & Live Round Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-black text-white">
                                                {standing.Driver.code || dId.substring(0, 3).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-white block leading-tight">
                                                    {standing.Driver.givenName} {standing.Driver.familyName}
                                                </span>
                                                <span className="text-[10px] text-neutral-400">
                                                    {teamName} &bull; P{standing.position} ({standing.points} Pts)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Running Points Chip */}
                                        <div className="text-right font-mono">
                                            <span className="text-xs font-black text-white">
                                                {totalRunning} Pts
                                            </span>
                                            {ptsThisRound > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-400 block leading-none">
                                                    +{ptsThisRound} di R{currentRace.round}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Input Controls */}
                                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-neutral-800/60">
                                        {/* GP Position Selector */}
                                        <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                                            <span className="text-[10px] text-neutral-500 uppercase">GP:</span>
                                            <select
                                                value={outcome.gpPosition ?? ""}
                                                onChange={(e) => {
                                                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                                    handleSetDriverPoints(dId, { gpPosition: val, manualPoints: null });
                                                }}
                                                aria-label={`Posisi GP ${standing.Driver.familyName}`}
                                                className="w-full px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-f1-red"
                                            >
                                                <option value="">- DNF / 0 Pts -</option>
                                                <option value="1">P1 (25 Pts)</option>
                                                <option value="2">P2 (18 Pts)</option>
                                                <option value="3">P3 (15 Pts)</option>
                                                <option value="4">P4 (12 Pts)</option>
                                                <option value="5">P5 (10 Pts)</option>
                                                <option value="6">P6 (8 Pts)</option>
                                                <option value="7">P7 (6 Pts)</option>
                                                <option value="8">P8 (4 Pts)</option>
                                                <option value="9">P9 (2 Pts)</option>
                                                <option value="10">P10 (1 Pt)</option>
                                            </select>
                                        </div>

                                        {/* Sprint Position Selector (if Sprint weekend) */}
                                        {currentRace.hasSprint && (
                                            <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
                                                <span className="text-[10px] text-amber-400 uppercase flex items-center gap-0.5">
                                                    <Zap className="w-2.5 h-2.5 fill-current" />
                                                    Sprint:
                                                </span>
                                                <select
                                                    value={outcome.sprintPosition ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                                        handleSetDriverPoints(dId, { sprintPosition: val, manualPoints: null });
                                                    }}
                                                    aria-label={`Posisi Sprint ${standing.Driver.familyName}`}
                                                    className="w-full px-2 py-1 rounded-lg bg-neutral-950 border border-amber-500/30 text-amber-300 text-xs focus:outline-none focus:border-amber-500"
                                                >
                                                    <option value="">- Sprint 0 Pts -</option>
                                                    <option value="1">P1 (+8 Pts)</option>
                                                    <option value="2">P2 (+7 Pts)</option>
                                                    <option value="3">P3 (+6 Pts)</option>
                                                    <option value="4">P4 (+5 Pts)</option>
                                                    <option value="5">P5 (+4 Pts)</option>
                                                    <option value="6">P6 (+3 Pts)</option>
                                                    <option value="7">P7 (+2 Pts)</option>
                                                    <option value="8">P8 (+1 Pt)</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Fastest Lap toggle */}
                                        <label className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer select-none text-[11px] text-neutral-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={!!outcome.fastestLap}
                                                onChange={(e) => {
                                                    handleSetDriverPoints(dId, { fastestLap: e.target.checked });
                                                }}
                                                className="rounded bg-neutral-900 border-neutral-700 text-f1-red focus:ring-0"
                                            />
                                            <span>FL (+1)</span>
                                        </label>

                                        {/* Direct Points Input Override */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-neutral-500">Poin:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="34"
                                                value={outcome.manualPoints ?? (ptsThisRound > 0 ? ptsThisRound : "")}
                                                placeholder={String(ptsThisRound)}
                                                onChange={(e) => {
                                                    const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                                                    handleSetDriverPoints(dId, { manualPoints: val });
                                                }}
                                                aria-label={`Manual Poin ${standing.Driver.familyName}`}
                                                className="w-14 px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-center text-xs font-bold focus:outline-none focus:border-f1-red"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Live Standings & Cumulative Progression Dashboard */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-2">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-f1-red" />
                        <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                            Live Standings &amp; Calculation Results
                        </h3>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 font-mono text-xs">
                        <button
                            type="button"
                            onClick={() => setActiveTab("drivers")}
                            data-testid="tab-multi-drivers"
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                activeTab === "drivers"
                                    ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Driver Standings
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("constructors")}
                            data-testid="tab-multi-constructors"
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                activeTab === "constructors"
                                    ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Constructor Standings
                        </button>
                    </div>
                </div>

                {/* Table View */}
                {activeTab === "drivers" ? (
                    <div className="rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-800/80 bg-neutral-900/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3 px-4 w-12 text-center">Pos</th>
                                        <th className="py-3 px-4">Pembalap</th>
                                        <th className="py-3 px-4">Tim Konstruktor</th>
                                        <th className="py-3 px-4 text-center">Poin Awal</th>
                                        <th className="py-3 px-4 text-center">Poin Tambahan (Sisa Balapan)</th>
                                        <th className="py-3 px-4 text-right">Poin Akhir Simulasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {simulation.simulatedDriverStandings.slice(0, 10).map((st) => {
                                        const isChampion = st.simulatedPosition === 1;
                                        const posChange = st.positionChange;

                                        return (
                                            <tr
                                                key={st.Driver.driverId}
                                                className={`transition-colors hover:bg-neutral-900/40 ${
                                                    isChampion ? "bg-amber-500/5" : ""
                                                }`}
                                            >
                                                <td className="py-3.5 px-4 text-center font-bold">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span
                                                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                                                                st.simulatedPosition === 1
                                                                    ? "bg-amber-400 text-neutral-950"
                                                                    : st.simulatedPosition === 2
                                                                      ? "bg-neutral-300 text-neutral-950"
                                                                      : st.simulatedPosition === 3
                                                                        ? "bg-amber-700 text-white"
                                                                        : "bg-neutral-800 text-neutral-300"
                                                            }`}
                                                        >
                                                            {st.simulatedPosition}
                                                        </span>
                                                        {posChange !== 0 && (
                                                            <span
                                                                className={`text-[10px] font-bold ${
                                                                    posChange > 0
                                                                        ? "text-emerald-400"
                                                                        : "text-rose-400"
                                                                }`}
                                                            >
                                                                {posChange > 0 ? `↑${posChange}` : `↓${Math.abs(posChange)}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white text-sm">
                                                            {st.Driver.givenName} {st.Driver.familyName}
                                                        </span>
                                                        {isChampion && (
                                                            <span className="px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-400/30">
                                                                <Crown className="w-3 h-3 fill-current" />
                                                                Champion
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-neutral-400">
                                                    {st.Constructors?.[0]?.name || "F1 Team"}
                                                </td>

                                                <td className="py-3.5 px-4 text-center text-neutral-400">
                                                    {st.points}
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    {st.pointsAdded > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                                                            +{st.pointsAdded}
                                                        </span>
                                                    ) : (
                                                        <span className="text-neutral-500">&mdash;</span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <span className="text-base font-black text-white">
                                                        {st.simulatedPoints}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-800/80 bg-neutral-900/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3 px-4 w-12 text-center">Pos</th>
                                        <th className="py-3 px-4">Tim Konstruktor</th>
                                        <th className="py-3 px-4 text-center">Poin Awal</th>
                                        <th className="py-3 px-4 text-center">Poin Tambahan Pembalap</th>
                                        <th className="py-3 px-4 text-right">Poin Akhir Tim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {simulation.simulatedConstructorStandings.map((c) => {
                                        const isChampion = c.simulatedPosition === 1;
                                        const posChange = c.positionChange;

                                        return (
                                            <tr
                                                key={c.Constructor.constructorId}
                                                className={`transition-colors hover:bg-neutral-900/40 ${
                                                    isChampion ? "bg-amber-500/5" : ""
                                                }`}
                                            >
                                                <td className="py-3.5 px-4 text-center font-bold">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span
                                                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                                                                c.simulatedPosition === 1
                                                                    ? "bg-amber-400 text-neutral-950"
                                                                    : c.simulatedPosition === 2
                                                                      ? "bg-neutral-300 text-neutral-950"
                                                                      : c.simulatedPosition === 3
                                                                        ? "bg-amber-700 text-white"
                                                                        : "bg-neutral-800 text-neutral-300"
                                                            }`}
                                                        >
                                                            {c.simulatedPosition}
                                                        </span>
                                                        {posChange !== 0 && (
                                                            <span
                                                                className={`text-[10px] font-bold ${
                                                                    posChange > 0
                                                                        ? "text-emerald-400"
                                                                        : "text-rose-400"
                                                                }`}
                                                            >
                                                                {posChange > 0 ? `↑${posChange}` : `↓${Math.abs(posChange)}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white text-sm">
                                                            {c.Constructor.name}
                                                        </span>
                                                        {isChampion && (
                                                            <span className="px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-400/30">
                                                                <Crown className="w-3 h-3 fill-current" />
                                                                Constructor Champion
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-center text-neutral-400">
                                                    {c.points}
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    {c.pointsAdded > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                                                            +{c.pointsAdded}
                                                        </span>
                                                    ) : (
                                                        <span className="text-neutral-500">&mdash;</span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <span className="text-base font-black text-white">
                                                        {c.simulatedPoints}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
