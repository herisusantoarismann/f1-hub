"use client";

import React from "react";
import Image from "next/image";
import {
    DriverRaceOutcome,
    GP_POINTS_MAP,
    calculateDriverRacePoints,
} from "@/lib/calculator-utils";
import { DriverStanding } from "@/types/standings";
import {
    getDriverImage,
    getTeamLogo,
    getNationalityFlag,
    getTeamColor,
} from "@/lib/utils/asset-helper";
import { Timer, Zap, RotateCcw, Sparkles } from "lucide-react";

interface RaceFinishPositionPickerProps {
    drivers: DriverStanding[];
    outcomes: Record<string, DriverRaceOutcome>;
    onOutcomeChange: (driverId: string, outcome: DriverRaceOutcome) => void;
    onApplyPreset: (presetName: string) => void;
    onResetAll: () => void;
    isSprintWeekend: boolean;
    onToggleSprintWeekend: (val: boolean) => void;
    includeFastestLap: boolean;
    onToggleFastestLap: (val: boolean) => void;
}

export const RaceFinishPositionPicker: React.FC<
    RaceFinishPositionPickerProps
> = ({
    drivers,
    outcomes,
    onOutcomeChange,
    onApplyPreset,
    onResetAll,
    isSprintWeekend,
    onToggleSprintWeekend,
    includeFastestLap,
    onToggleFastestLap,
}) => {
    // Top contenders (first 6 or 8 drivers)
    const topContenders = drivers.slice(0, 8);

    const handleGpPositionChange = (driverId: string, pos: number | null) => {
        const curr = outcomes[driverId] || { driverId };
        onOutcomeChange(driverId, {
            ...curr,
            gpPosition: pos,
            fastestLap: pos === null ? false : curr.fastestLap,
        });
    };

    const handleFastestLapToggle = (driverId: string) => {
        const curr = outcomes[driverId] || { driverId };
        // If driver gets fastest lap, remove it from other drivers
        const willBeTrue = !curr.fastestLap;
        if (willBeTrue) {
            Object.keys(outcomes).forEach((id) => {
                if (id !== driverId && outcomes[id]?.fastestLap) {
                    onOutcomeChange(id, { ...outcomes[id], fastestLap: false });
                }
            });
        }
        onOutcomeChange(driverId, { ...curr, fastestLap: willBeTrue });
    };

    return (
        <div
            data-testid="race-finish-position-picker"
            className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-md space-y-6"
        >
            {/* Header & Simulation Weekend Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
                <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Simulated Grand Prix Race Results
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Tentukan posisi finis balapan untuk melihat perubahan
                        poin dan klasemen secara langsung.
                    </p>
                </div>

                {/* Weekend Toggles (Sprint & Fastest Lap) */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => onToggleFastestLap(!includeFastestLap)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            includeFastestLap
                                ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300"
                        }`}
                        title="Bonus 1 poin untuk Fastest Lap (Top 10)"
                    >
                        <Timer className="w-3.5 h-3.5" />
                        <span>Fastest Lap (+1 pt)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleSprintWeekend(!isSprintWeekend)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            isSprintWeekend
                                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300"
                        }`}
                        title="Simulasikan poin Sprint Race (P1: 8pts - P8: 1pt)"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Sprint Race (+8 pts)</span>
                    </button>

                    <button
                        type="button"
                        onClick={onResetAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-mono transition-colors"
                        title="Reset semua hasil simulasi"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Quick Scenario Preset Chips */}
            <div className="space-y-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-f1-red" />
                    Preset Skenario Balapan:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        {
                            id: "mclaren_1_2",
                            label: "McLaren 1-2 (Norris P1, Piastri P2)",
                        },
                        {
                            id: "verstappen_win",
                            label: "Verstappen P1, Norris P4",
                        },
                        {
                            id: "ferrari_1_2",
                            label: "Ferrari 1-2 (Leclerc P1, Hamilton P2)",
                        },
                        {
                            id: "norris_max_dnf",
                            label: "Norris P1 + FL, Verstappen DNF",
                        },
                    ].map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onApplyPreset(preset.id)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all font-sans font-medium"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Driver Position Assign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {topContenders.map((standing) => {
                    const driver = standing.Driver;
                    const constructor = standing.Constructors[0];
                    const teamColor = getTeamColor(constructor?.constructorId);
                    const outcome = outcomes[driver.driverId] || {
                        driverId: driver.driverId,
                    };
                    const pointsGained = calculateDriverRacePoints(
                        outcome,
                        includeFastestLap,
                    );
                    const currentPos = outcome.gpPosition ?? null;

                    return (
                        <div
                            key={driver.driverId}
                            className="relative flex items-center justify-between p-3.5 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 hover:border-neutral-700/80 transition-all overflow-hidden"
                            style={{
                                borderLeftWidth: "4px",
                                borderLeftColor: teamColor,
                            }}
                        >
                            {/* Driver Snapshot */}
                            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                                    <Image
                                        src={getDriverImage(driver.driverId)}
                                        alt={driver.familyName}
                                        fill
                                        className="object-cover object-top"
                                        unoptimized
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black text-white truncate">
                                            {driver.givenName}{" "}
                                            {driver.familyName}
                                        </span>
                                        <span className="text-xs">
                                            {getNationalityFlag(
                                                driver.nationality,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                                        <span className="truncate">
                                            {constructor?.name || "Independent"}
                                        </span>
                                        <span>&bull;</span>
                                        <span className="text-white font-bold">
                                            {standing.points} pts
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Position Selector Dropdown & Fastest Lap */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Fastest Lap Icon Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleFastestLapToggle(driver.driverId)
                                    }
                                    disabled={
                                        currentPos === null || currentPos > 10
                                    }
                                    title={
                                        currentPos && currentPos <= 10
                                            ? "Fastest Lap (+1 pt)"
                                            : "Pembalap harus finis Top 10 untuk mendapat poin Fastest Lap"
                                    }
                                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                                        outcome.fastestLap
                                            ? "bg-purple-600/30 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/30"
                                            : "bg-neutral-900/60 border-neutral-800 text-neutral-600 hover:text-neutral-400 disabled:opacity-30 disabled:hover:text-neutral-600"
                                    }`}
                                >
                                    <Timer className="w-3.5 h-3.5" />
                                </button>

                                {/* Finish Position Dropdown */}
                                <select
                                    aria-label={`Position for ${driver.familyName}`}
                                    value={
                                        currentPos !== null
                                            ? String(currentPos)
                                            : "none"
                                    }
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleGpPositionChange(
                                            driver.driverId,
                                            val === "none"
                                                ? null
                                                : parseInt(val, 10),
                                        );
                                    }}
                                    className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl border appearance-none text-center cursor-pointer transition-all outline-none ${
                                        currentPos === 1
                                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-black"
                                            : currentPos === 2 ||
                                                currentPos === 3
                                              ? "bg-neutral-800 border-neutral-600 text-white font-black"
                                              : currentPos && currentPos <= 10
                                                ? "bg-neutral-900 border-neutral-700 text-neutral-200"
                                                : "bg-neutral-950 border-neutral-800 text-neutral-500"
                                    }`}
                                >
                                    <option value="none">- (No Pts/DNF)</option>
                                    <option value="1">P1 (25 pts)</option>
                                    <option value="2">P2 (18 pts)</option>
                                    <option value="3">P3 (15 pts)</option>
                                    <option value="4">P4 (12 pts)</option>
                                    <option value="5">P5 (10 pts)</option>
                                    <option value="6">P6 (8 pts)</option>
                                    <option value="7">P7 (6 pts)</option>
                                    <option value="8">P8 (4 pts)</option>
                                    <option value="9">P9 (2 pts)</option>
                                    <option value="10">P10 (1 pt)</option>
                                    <option value="11">P11-P20 (0 pts)</option>
                                </select>

                                {/* Points Badge */}
                                <div
                                    className={`w-12 text-right font-mono font-bold text-xs ${
                                        pointsGained > 0
                                            ? "text-emerald-400"
                                            : "text-neutral-600"
                                    }`}
                                >
                                    {pointsGained > 0
                                        ? `+${pointsGained}`
                                        : "0"}{" "}
                                    <span className="text-[10px] text-neutral-500 font-normal">
                                        pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
