"use client";

import React, { useState, useMemo } from "react";
import {
    STRATEGY_CIRCUITS,
    StrategyCircuitConfig,
} from "@/data/strategy-circuits";
import {
    StrategyPlan,
    TyreCompound,
    compareStrategies,
    calculateUndercutGain,
    TYRE_PROPERTIES,
    EnvironmentConfig,
    DEFAULT_ENVIRONMENT,
    WeatherCondition,
    WindDirection,
    formatLapTime,
} from "@/lib/strategy-simulator";
import { StrategyComparisonCard } from "@/components/molecules/StrategyComparisonCard";
import { LapTimeDeltaChart } from "@/components/molecules/LapTimeDeltaChart";
import {
    Gauge,
    ShieldAlert,
    Sliders,
    Zap,
    RotateCcw,
    Timer,
    Thermometer,
    CloudRain,
    Wind,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Trash2,
    Trophy,
    BarChart3,
    Layers,
    Flag,
} from "lucide-react";

interface PitStopStrategySimulatorProps {
    initialCircuitId?: string;
}

export const PitStopStrategySimulator: React.FC<
    PitStopStrategySimulatorProps
> = ({ initialCircuitId = "bahrain" }) => {
    // Selected Circuit
    const [selectedCircuitId, setSelectedCircuitId] =
        useState<string>(initialCircuitId);
    const circuit: StrategyCircuitConfig =
        STRATEGY_CIRCUITS[selectedCircuitId] || STRATEGY_CIRCUITS.bahrain;

    // Custom Weather & Environment State
    const [environment, setEnvironment] =
        useState<EnvironmentConfig>(DEFAULT_ENVIRONMENT);

    // Safety Car / VSC Incident Window
    const [enableSafetyCar, setEnableSafetyCar] = useState(false);
    const [safetyCarLap, setSafetyCarLap] = useState(
        Math.round(circuit.totalLaps / 3),
    );

    // Custom Stint Plans (derived from circuit default strategies)
    const [strategies, setStrategies] = useState<StrategyPlan[]>(
        circuit.defaultStrategies,
    );

    // Active Strategy being edited (index 0 by default)
    const [editingStrategyIdx, setEditingStrategyIdx] = useState<number>(0);

    // Toggle Compare View (allows viewing comparison cards alongside or below)
    const [showComparison, setShowComparison] = useState(false);

    // When circuit changes, reset strategies to new circuit defaults
    const handleCircuitChange = (newCircuitId: string) => {
        setSelectedCircuitId(newCircuitId);
        const newCircuit =
            STRATEGY_CIRCUITS[newCircuitId] || STRATEGY_CIRCUITS.bahrain;
        setStrategies(newCircuit.defaultStrategies);
        setEditingStrategyIdx(0);
        setSafetyCarLap(Math.round(newCircuit.totalLaps / 3));
    };

    // Calculate simulation results for all strategies considering 2026 regulations & environment
    const simulationResults = useMemo(() => {
        return compareStrategies(
            circuit,
            strategies,
            enableSafetyCar ? safetyCarLap : null,
            environment,
        );
    }, [circuit, strategies, enableSafetyCar, safetyCarLap, environment]);

    // Active editing strategy
    const currentEditPlan =
        strategies[editingStrategyIdx] ||
        strategies[0] ||
        circuit.defaultStrategies[0];

    // Current edit strategy's simulation result
    const currentEditResult = useMemo(() => {
        return (
            simulationResults.find(
                (r) => r.strategyId === currentEditPlan.id,
            ) || simulationResults[0]
        );
    }, [simulationResults, currentEditPlan]);

    // Modify pit stop lap for active strategy
    const handlePitLapChange = (stintIdx: number, newEndLap: number) => {
        setStrategies((prev) => {
            const next = [...prev];
            const currentPlan = { ...next[editingStrategyIdx] };
            const stints = [...currentPlan.stints];

            if (stintIdx < stints.length - 1) {
                stints[stintIdx] = { ...stints[stintIdx], endLap: newEndLap };
                stints[stintIdx + 1] = {
                    ...stints[stintIdx + 1],
                    startLap: newEndLap + 1,
                };
            }
            currentPlan.stints = stints;
            next[editingStrategyIdx] = currentPlan;
            return next;
        });
    };

    // Modify compound for a stint
    const handleCompoundChange = (stintIdx: number, compound: TyreCompound) => {
        setStrategies((prev) => {
            const next = [...prev];
            const currentPlan = { ...next[editingStrategyIdx] };
            const stints = [...currentPlan.stints];
            stints[stintIdx] = { ...stints[stintIdx], compound };
            currentPlan.stints = stints;
            next[editingStrategyIdx] = currentPlan;
            return next;
        });
    };

    // Add a new stint to active strategy (e.g. convert 1-stop to 2-stop)
    const handleAddStint = () => {
        setStrategies((prev) => {
            const next = [...prev];
            const currentPlan = { ...next[editingStrategyIdx] };
            const stints = [...currentPlan.stints];
            const lastStint = stints[stints.length - 1];

            if (lastStint.endLap - lastStint.startLap < 8) return prev; // Too short to split

            const splitLap = Math.floor(
                (lastStint.startLap + lastStint.endLap) / 2,
            );
            stints[stints.length - 1] = {
                ...lastStint,
                endLap: splitLap,
            };
            stints.push({
                compound: "SOFT",
                startLap: splitLap + 1,
                endLap: circuit.totalLaps,
            });

            currentPlan.stints = stints;
            currentPlan.name = `${currentPlan.name} (${stints.length - 1} Stops)`;
            next[editingStrategyIdx] = currentPlan;
            return next;
        });
    };

    // Remove the last stint (e.g. convert 2-stop to 1-stop)
    const handleRemoveStint = () => {
        if (currentEditPlan.stints.length <= 1) return;
        setStrategies((prev) => {
            const next = [...prev];
            const currentPlan = { ...next[editingStrategyIdx] };
            const stints = [...currentPlan.stints];
            stints.pop();
            stints[stints.length - 1] = {
                ...stints[stints.length - 1],
                endLap: circuit.totalLaps,
            };
            currentPlan.stints = stints;
            next[editingStrategyIdx] = currentPlan;
            return next;
        });
    };

    // Add a new alternative strategy
    const handleAddNewStrategy = () => {
        const newId = `custom-strategy-${strategies.length + 1}`;
        const newStrategy: StrategyPlan = {
            id: newId,
            name: `Strategy ${strategies.length + 1}`,
            description: "Custom pit stop strategy",
            stints: [
                {
                    compound: "MEDIUM",
                    startLap: 1,
                    endLap: Math.round(circuit.totalLaps / 2),
                },
                {
                    compound: "HARD",
                    startLap: Math.round(circuit.totalLaps / 2) + 1,
                    endLap: circuit.totalLaps,
                },
            ],
        };
        setStrategies((prev) => [...prev, newStrategy]);
        setEditingStrategyIdx(strategies.length);
    };

    // Reset current circuit strategies and environment
    const handleResetDefaults = () => {
        setStrategies(circuit.defaultStrategies);
        setEditingStrategyIdx(0);
        setEnableSafetyCar(false);
        setEnvironment(DEFAULT_ENVIRONMENT);
    };

    // Undercut analysis for first pit stop of editing strategy
    const undercutAnalysis = useMemo(() => {
        if (!currentEditPlan || currentEditPlan.stints.length < 2) return null;
        const s1 = currentEditPlan.stints[0];
        const s2 = currentEditPlan.stints[1];
        return calculateUndercutGain(
            circuit,
            s1.endLap,
            s1.compound,
            s1.endLap - s1.startLap + 1,
            s2.compound,
            environment,
        );
    }, [circuit, currentEditPlan, environment]);

    // Breakdown per stint for right-hand live results
    const currentStintBreakdown = useMemo(() => {
        if (!currentEditResult || !currentEditPlan || !currentEditResult.laps)
            return [];
        return currentEditPlan.stints.map((stint, idx) => {
            const stintLaps = currentEditResult.laps.filter(
                (l) =>
                    l.lapNumber >= stint.startLap &&
                    l.lapNumber <= stint.endLap,
            );
            const totalStintSec = stintLaps.reduce(
                (acc, l) => acc + l.lapTimeSec,
                0,
            );
            const avgLapSec =
                stintLaps.length > 0 ? totalStintSec / stintLaps.length : 0;

            const formatTime = (sec: number) => {
                const m = Math.floor(sec / 60);
                const s = (sec % 60).toFixed(3);
                return `${m}:${s.padStart(6, "0")}`;
            };

            return {
                stintNumber: idx + 1,
                compound: stint.compound,
                startLap: stint.startLap,
                endLap: stint.endLap,
                lapCount: stint.endLap - stint.startLap + 1,
                totalStintTime: formatTime(totalStintSec),
                avgLapTime: formatTime(avgLapSec),
                isFinalStint: idx === currentEditPlan.stints.length - 1,
            };
        });
    }, [currentEditResult, currentEditPlan]);

    // Thermal degradation status note
    const thermalStatus = useMemo(() => {
        const temp = environment.trackTempC;
        if (temp >= 42) {
            return {
                label: "Thermal Overheating",
                badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
                description:
                    "Suhu >42°C memicu blistering cepat pada ban Soft. Hard lebih diuntungkan.",
            };
        }
        if (temp >= 36) {
            return {
                label: "High Thermal Wear",
                badgeClass:
                    "bg-amber-500/20 text-amber-400 border-amber-500/30",
                description:
                    "Suhu aspal hangat (~38°C). Degradasi ban Soft meningkat +15%.",
            };
        }
        if (temp <= 22) {
            return {
                label: "Cold Track / Graining",
                badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                description:
                    "Aspal dingin (<23°C) memicu graining pada ban Hard. Soft lebih awet.",
            };
        }
        return {
            label: "Optimal Thermal",
            badgeClass:
                "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            description: "Suhu aspal ideal (25°C - 35°C). Baseline normal.",
        };
    }, [environment.trackTempC]);

    return (
        <div data-testid="pit-stop-strategy-simulator" className="space-y-6">
            {/* 1. DATA UNTUK TRACK DI ATAS (Circuit Bar & Global Telemetry Specs) */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Circuit Info & Picker */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-f1-red/15 text-f1-red border border-f1-red/30">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                                    {circuit.name}
                                </h2>
                                <p className="text-xs text-neutral-400 font-mono">
                                    {circuit.grandPrixName} &bull;{" "}
                                    {circuit.totalLaps} Laps &bull; 2026 FIA
                                    Specs
                                </p>
                            </div>
                        </div>

                        {/* Dropdown Select Circuit */}
                        <div className="flex items-center gap-2 sm:pl-3 sm:border-l sm:border-neutral-800">
                            <label
                                htmlFor="circuit-select"
                                className="text-xs font-mono text-neutral-400 shrink-0"
                            >
                                Sirkuit:
                            </label>
                            <select
                                id="circuit-select"
                                aria-label="Select Circuit"
                                value={selectedCircuitId}
                                onChange={(e) =>
                                    handleCircuitChange(e.target.value)
                                }
                                className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono font-bold text-white focus:outline-none focus:border-f1-red cursor-pointer"
                            >
                                {Object.values(STRATEGY_CIRCUITS).map((c) => (
                                    <option
                                        key={c.circuitId}
                                        value={c.circuitId}
                                    >
                                        {c.name} ({c.totalLaps} L)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Top Action Controls: Safety Car & Reset */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Safety Car Toggle */}
                        <button
                            type="button"
                            onClick={() => setEnableSafetyCar(!enableSafetyCar)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                                enableSafetyCar
                                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20"
                                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                            }`}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span>
                                {enableSafetyCar
                                    ? "Safety Car Active"
                                    : "Simulate Safety Car"}
                            </span>
                        </button>

                        {/* Reset Defaults */}
                        <button
                            type="button"
                            onClick={handleResetDefaults}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700 text-xs font-mono transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Defaults</span>
                        </button>
                    </div>
                </div>

                {/* Safety Car Incident Slider (when enabled) */}
                {enableSafetyCar && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-2 text-amber-300">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            <span>
                                SC Pit Loss: {circuit.scPitLossSec}s (Hemat{" "}
                                {(
                                    circuit.pitLossSec - circuit.scPitLossSec
                                ).toFixed(1)}
                                s vs pit normal!)
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-neutral-400 shrink-0">
                                SC Lap:
                            </span>
                            <input
                                type="range"
                                min="2"
                                max={circuit.totalLaps - 5}
                                value={safetyCarLap}
                                onChange={(e) =>
                                    setSafetyCarLap(
                                        parseInt(e.target.value, 10),
                                    )
                                }
                                className="w-32 sm:w-40 accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                            />
                            <span className="text-amber-400 font-bold w-8 text-right">
                                L{safetyCarLap}
                            </span>
                        </div>
                    </div>
                )}

                {/* Track Telemetry Quick Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono pt-1">
                    <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Normal Pit Loss
                        </div>
                        <div className="text-base font-black text-white mt-0.5">
                            {circuit.pitLossSec.toFixed(1)}s
                        </div>
                        <div className="text-[9px] text-neutral-500">
                            Transit + 2.5s Stop
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Safety Car Pit Delta
                        </div>
                        <div className="text-base font-black text-emerald-400 mt-0.5">
                            {circuit.scPitLossSec.toFixed(1)}s
                        </div>
                        <div className="text-[9px] text-emerald-500/80">
                            Hemat{" "}
                            {(
                                circuit.pitLossSec - circuit.scPitLossSec
                            ).toFixed(1)}
                            s
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Tire Wear Rate
                        </div>
                        <div className="text-base font-black text-amber-400 mt-0.5">
                            {circuit.tyreWearMultiplier}x
                        </div>
                        <div className="text-[9px] text-neutral-500">
                            {circuit.tyreWearMultiplier > 1.2
                                ? "High Abrasion"
                                : circuit.tyreWearMultiplier < 0.9
                                  ? "Low Wear"
                                  : "Medium Wear"}
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Fuel Burn Delta (2026)
                        </div>
                        <div className="text-base font-black text-cyan-400 mt-0.5">
                            ~0.038s/lap
                        </div>
                        <div className="text-[9px] text-neutral-500">
                            Max 75kg Sustainable
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SPLIT LAYOUT: KIRI (Setting / Utak-Atik) | KANAN (Hasil Live & Graph) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ========================================================
                    KOLOM KIRI: SETTING (BAN, LAP, SUHU, CUACA, STRATEGY)
                   ======================================================== */}
                <div className="lg:col-span-5 space-y-5">
                    {/* Strategy Switcher & Editor Header */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-f1-red/15 text-f1-red">
                                    <Sliders className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-black text-white">
                                        Interactive Stint &amp; Pit Window
                                        Editor
                                    </h3>
                                    <p className="text-[11px] text-neutral-400 font-mono">
                                        Atur ban, lap pit stop, dan cuaca di
                                        sini.
                                    </p>
                                </div>
                            </div>

                            {/* Tombol Compare Toggle */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowComparison(!showComparison)
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                                    showComparison
                                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>Compare</span>
                            </button>
                        </div>

                        {/* Strategy Selection Buttons (Strategy 1, Strategy 2, etc.) */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                Pilih Strategi yang Diatur:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {strategies.map((strat, idx) => (
                                    <button
                                        key={strat.id}
                                        type="button"
                                        onClick={() =>
                                            setEditingStrategyIdx(idx)
                                        }
                                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                                            editingStrategyIdx === idx
                                                ? "bg-f1-red text-white border-f1-red shadow-sm"
                                                : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        Strategy {idx + 1}
                                    </button>
                                ))}

                                {/* Add Strategy Button */}
                                <button
                                    type="button"
                                    onClick={handleAddNewStrategy}
                                    className="px-2.5 py-1.5 rounded-xl border border-dashed border-neutral-700 bg-neutral-950/60 hover:border-neutral-500 text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-all"
                                    title="Tambah Strategi Baru"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Strategy</span>
                                </button>
                            </div>
                        </div>

                        {/* Stints Editor Rows (Ban apa & Brpa lap) */}
                        <div className="space-y-3 pt-2">
                            {/* Peringatan Menonjol Regulasi FIA 2 Compound Kering */}
                            {!currentEditResult.meetsTwoCompoundRule ? (
                                <div className="p-3.5 rounded-xl bg-red-950/60 border-2 border-red-500 text-red-200 shadow-lg shadow-red-950/50 space-y-1.5 animate-pulse">
                                    <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider font-mono">
                                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                        <span>
                                            PERINGATAN REGULASI FIA (ART. 30.5)
                                        </span>
                                    </div>
                                    <p className="text-white text-xs font-semibold leading-relaxed">
                                        Wajib menggunakan minimal{" "}
                                        <strong>
                                            2 jenis compound ban kering yang
                                            berbeda
                                        </strong>{" "}
                                        dalam balapan kering!
                                    </p>
                                    <p className="text-[11px] text-red-300/90 leading-normal">
                                        Saat ini strategi Anda hanya menggunakan
                                        1 compound kering. Ubah compound pada
                                        salah satu stint agar legal dan
                                        terhindar dari{" "}
                                        <strong>Diskualifikasi (DSQ)</strong>.
                                    </p>
                                </div>
                            ) : (
                                environment.weatherCondition === "dry" && (
                                    <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                                            Regulasi 2 Compound Terpenuhi
                                        </span>
                                        <span className="text-[10px] text-emerald-500">
                                            Art. 30.5 Compliant
                                        </span>
                                    </div>
                                )
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-f1-red" />
                                    Stints ({currentEditPlan.stints.length}{" "}
                                    Stint &bull;{" "}
                                    {currentEditPlan.stints.length - 1} Stop)
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handleAddStint}
                                        className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[10px] font-mono flex items-center gap-1"
                                        title="Tambah Pit Stop (+1 Stint)"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>+ Pit</span>
                                    </button>
                                    {currentEditPlan.stints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveStint}
                                            className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-rose-900/50 text-rose-400 text-[10px] font-mono flex items-center gap-1"
                                            title="Hapus Stint Terakhir"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            <span>- Stint</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stint Cards */}
                            <div className="space-y-2.5">
                                {currentEditPlan.stints.map((stint, sIdx) => {
                                    const isLastStint =
                                        sIdx ===
                                        currentEditPlan.stints.length - 1;
                                    const prop =
                                        TYRE_PROPERTIES[stint.compound];
                                    const lifespan = currentEditResult
                                        .optimalLifespans?.[sIdx] || {
                                        optimalLaps: 15,
                                        cliffLap: 22,
                                        degradationPerLapSec: 0.05,
                                    };

                                    return (
                                        <div
                                            key={sIdx}
                                            className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2.5"
                                        >
                                            {/* Stint Header: Lap range & compound */}
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full ring-2 ring-neutral-800 shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                prop.color,
                                                        }}
                                                    />
                                                    <span className="font-bold text-white">
                                                        Stint {sIdx + 1}
                                                    </span>
                                                    <span
                                                        className="px-1.5 py-0.2 rounded text-[10px] font-black text-black"
                                                        style={{
                                                            backgroundColor:
                                                                prop.color,
                                                        }}
                                                    >
                                                        {prop.name}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-400 text-[11px]">
                                                    Lap {stint.startLap} &rarr;{" "}
                                                    {stint.endLap} (
                                                    {stint.endLap -
                                                        stint.startLap +
                                                        1}{" "}
                                                    L)
                                                </span>
                                            </div>

                                            {/* Compound Selector Buttons (S, M, H, I, W) */}
                                            <div className="grid grid-cols-5 gap-1">
                                                {(
                                                    [
                                                        "SOFT",
                                                        "MEDIUM",
                                                        "HARD",
                                                        "INTERMEDIATE",
                                                        "WET",
                                                    ] as TyreCompound[]
                                                ).map((c) => {
                                                    const cProp =
                                                        TYRE_PROPERTIES[c];
                                                    const isSelected =
                                                        stint.compound === c;
                                                    return (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() =>
                                                                handleCompoundChange(
                                                                    sIdx,
                                                                    c,
                                                                )
                                                            }
                                                            title={cProp.name}
                                                            className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                                                                isSelected
                                                                    ? "border-white text-black font-black shadow-sm"
                                                                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                                                            }`}
                                                            style={
                                                                isSelected
                                                                    ? {
                                                                          backgroundColor:
                                                                              cProp.color,
                                                                      }
                                                                    : {}
                                                            }
                                                        >
                                                            {c ===
                                                            "INTERMEDIATE"
                                                                ? "I"
                                                                : c === "WET"
                                                                  ? "W"
                                                                  : c[0]}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Optimal & Cliff indicators */}
                                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
                                                <span>
                                                    Optimal:{" "}
                                                    <strong className="text-emerald-400">
                                                        {lifespan.optimalLaps}L
                                                    </strong>
                                                </span>
                                                <span>
                                                    Cliff:{" "}
                                                    <strong className="text-rose-400">
                                                        Lap {lifespan.cliffLap}
                                                    </strong>
                                                </span>
                                                <span>
                                                    Wear:{" "}
                                                    <strong className="text-neutral-300">
                                                        +
                                                        {lifespan.degradationPerLapSec.toFixed(
                                                            3,
                                                        )}
                                                        s/l
                                                    </strong>
                                                </span>
                                            </div>

                                            {/* Box Lap Slider (for non-final stints) */}
                                            {!isLastStint ? (
                                                <div className="space-y-1 pt-1 border-t border-neutral-900">
                                                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                                                        <span>
                                                            Masuk Pit (Box Lap):
                                                        </span>
                                                        <span className="text-white font-bold">
                                                            Lap {stint.endLap}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={stint.startLap + 4}
                                                        max={
                                                            sIdx <
                                                            currentEditPlan
                                                                .stints.length -
                                                                2
                                                                ? currentEditPlan
                                                                      .stints[
                                                                      sIdx + 1
                                                                  ].endLap - 4
                                                                : circuit.totalLaps -
                                                                  5
                                                        }
                                                        value={stint.endLap}
                                                        onChange={(e) =>
                                                            handlePitLapChange(
                                                                sIdx,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ),
                                                            )
                                                        }
                                                        className="w-full accent-f1-red cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-mono text-neutral-500 text-center py-0.5 bg-neutral-900/40 rounded-lg border border-neutral-800/40">
                                                    🏁 Finis Balapan (Lap{" "}
                                                    {circuit.totalLaps})
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Undercut Advantage Insight Card */}
                        {undercutAnalysis && (
                            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5 text-xs">
                                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="font-mono font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                                        Undercut &amp; Pit Window:
                                    </span>
                                    <p className="text-neutral-300 font-sans text-[11px] leading-relaxed">
                                        {undercutAnalysis.analysis}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Environment & Weather Controls (Suhu dkk) */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-md space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                    <Thermometer className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs sm:text-sm font-black text-white">
                                        Track Environment &amp; Weather Engine
                                    </h3>
                                    <p className="text-[10px] text-neutral-400 font-mono">
                                        Faktor suhu, cuaca, dan angin ke ban
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${thermalStatus.badgeClass}`}
                            >
                                {thermalStatus.label}
                            </span>
                        </div>

                        {/* Track Temperature */}
                        <div className="space-y-1.5 font-mono text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                                    Suhu Aspal (Track Temp):
                                </span>
                                <span className="text-xs font-bold text-amber-400">
                                    {environment.trackTempC}°C
                                </span>
                            </div>
                            <input
                                type="range"
                                min="15"
                                max="55"
                                value={environment.trackTempC}
                                onChange={(e) =>
                                    setEnvironment(
                                        (prev: EnvironmentConfig) => ({
                                            ...prev,
                                            trackTempC: parseInt(
                                                e.target.value,
                                                10,
                                            ),
                                        }),
                                    )
                                }
                                aria-label="Track Temperature"
                                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                            />
                            <div className="flex justify-between text-[9px] text-neutral-500">
                                <span>15°C (Cold)</span>
                                <span>35°C (Base)</span>
                                <span>55°C (Extreme)</span>
                            </div>
                        </div>

                        {/* Weather Condition Buttons */}
                        <div className="space-y-1.5 font-mono text-xs">
                            <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                                Kondisi Lintasan:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: "dry", label: "☀️ Kering" },
                                    { id: "damp", label: "🌦️ Lembab" },
                                    { id: "wet", label: "🌧️ Basah" },
                                ].map((w) => (
                                    <button
                                        key={w.id}
                                        type="button"
                                        onClick={() =>
                                            setEnvironment(
                                                (prev: EnvironmentConfig) => ({
                                                    ...prev,
                                                    weatherCondition:
                                                        w.id as WeatherCondition,
                                                }),
                                            )
                                        }
                                        className={`py-1.5 rounded-lg text-center border text-[11px] font-bold transition-all ${
                                            environment.weatherCondition ===
                                            w.id
                                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm"
                                                : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        {w.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wind Controls */}
                        <div className="space-y-1.5 font-mono text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                                    <Wind className="w-3.5 h-3.5 text-neutral-300" />
                                    Kecepatan &amp; Arah Angin:
                                </span>
                                <span className="text-xs font-bold text-white">
                                    {environment.windSpeedKmh} km/h
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={environment.windSpeedKmh}
                                onChange={(e) =>
                                    setEnvironment(
                                        (prev: EnvironmentConfig) => ({
                                            ...prev,
                                            windSpeedKmh: parseInt(
                                                e.target.value,
                                                10,
                                            ),
                                        }),
                                    )
                                }
                                aria-label="Wind Speed"
                                className="w-full accent-f1-red cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                            />
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { id: "calm", label: "Calm" },
                                    { id: "headwind", label: "Head" },
                                    { id: "tailwind", label: "Tail" },
                                    { id: "crosswind", label: "Cross" },
                                ].map((wd) => (
                                    <button
                                        key={wd.id}
                                        type="button"
                                        onClick={() =>
                                            setEnvironment(
                                                (prev: EnvironmentConfig) => ({
                                                    ...prev,
                                                    windDirection:
                                                        wd.id as WindDirection,
                                                }),
                                            )
                                        }
                                        className={`py-1 rounded-md text-[10px] border transition-all ${
                                            environment.windDirection === wd.id
                                                ? "bg-f1-red text-white border-f1-red font-bold"
                                                : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        {wd.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* FIA 2026 Rules Badge */}
                        <div
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors ${
                                currentEditResult.meetsTwoCompoundRule
                                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                                    : "bg-red-950/40 border-red-500 text-red-300 shadow-md shadow-red-950/30"
                            }`}
                        >
                            <span className="flex items-center gap-1.5 font-bold">
                                <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                        currentEditResult.meetsTwoCompoundRule
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-red-500 text-white"
                                    }`}
                                >
                                    FIA Art. 30.5
                                </span>
                                <span>
                                    {currentEditResult.meetsTwoCompoundRule
                                        ? "2 Compounds Rule"
                                        : "Pelanggaran Regulasi"}
                                </span>
                            </span>
                            {currentEditResult.meetsTwoCompoundRule ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Compliant (2 Compounds)
                                </span>
                            ) : (
                                <span className="text-red-400 flex items-center gap-1 font-black text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Wajib 2 Compound Kering
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    KOLOM KANAN: HASIL (LAPTIME SAMPAI AKHIR, STINT 1,2, GRAPH)
                   ======================================================== */}
                <div className="lg:col-span-7 space-y-5">
                    {/* Live Result Summary Card */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                                    <Trophy className="w-3.5 h-3.5" />
                                    Live Strategy Outcome
                                </span>
                                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                                    {currentEditPlan.name}
                                </h3>
                                <p className="text-xs text-neutral-400 font-mono">
                                    {currentEditResult.pitStopCount} Pit Stop
                                    {currentEditResult.pitStopCount === 1
                                        ? ""
                                        : "s"}{" "}
                                    &bull; {circuit.totalLaps} Laps Finis
                                </p>
                            </div>

                            {/* Total Projected Race Time */}
                            <div className="text-left sm:text-right">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                    Total Waktu Balap
                                </span>
                                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                                    {currentEditResult.formattedTotalTime}
                                </div>
                                <div className="text-xs font-mono font-bold">
                                    {currentEditResult.deltaToFastestSec ===
                                    0 ? (
                                        <span className="text-emerald-400">
                                            0.000s &bull; Optimal Baseline
                                        </span>
                                    ) : (
                                        <span className="text-rose-400">
                                            +
                                            {currentEditResult.deltaToFastestSec.toFixed(
                                                3,
                                            )}
                                            s vs Fastest
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Peringatan Menonjol Regulasi FIA 2 Compound Kering (Live Outcome) */}
                        {!currentEditResult.meetsTwoCompoundRule ? (
                            <div className="p-3.5 rounded-xl bg-red-950/70 border-2 border-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-md shadow-red-950/40 animate-pulse">
                                <div className="flex items-center gap-2.5 text-red-300">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                    <div>
                                        <div className="font-black text-red-400 uppercase tracking-wide">
                                            STATUS STRATEGI: ILEGAL (MELANGGAR
                                            ATURAN FIA)
                                        </div>
                                        <div className="text-[11px] text-white/90 font-sans mt-0.5">
                                            Hanya menggunakan 1 compound kering
                                            di trek kering. Wajib ganti ke
                                            compound kering berbeda!
                                        </div>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs tracking-wider uppercase shrink-0 text-center">
                                    DSQ PENALTY
                                </span>
                            </div>
                        ) : (
                            environment.weatherCondition === "dry" && (
                                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-mono text-emerald-400">
                                    <span className="flex items-center gap-2 font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>
                                            Status Strategi: Legal (2 Compound
                                            Kering Digunakan)
                                        </span>
                                    </span>
                                    <span className="text-[10px] text-emerald-500 font-bold">
                                        FIA Art. 30.5 OK
                                    </span>
                                </div>
                            )
                        )}

                        {/* Rincian Per Stint (Stint 1 segini, Stint 2 segini, dst) */}
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <Timer className="w-3.5 h-3.5 text-amber-400" />
                                Rincian Waktu Per Stint:
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {currentStintBreakdown.map((st) => {
                                    const cProp = TYRE_PROPERTIES[st.compound];
                                    return (
                                        <div
                                            key={st.stintNumber}
                                            className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5 font-mono"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-white flex items-center gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                cProp.color,
                                                        }}
                                                    />
                                                    Stint {st.stintNumber}
                                                </span>
                                                <span
                                                    className="px-1.5 py-0.2 rounded text-[10px] font-black text-black"
                                                    style={{
                                                        backgroundColor:
                                                            cProp.color,
                                                    }}
                                                >
                                                    {cProp.name}
                                                </span>
                                            </div>

                                            <div className="text-[11px] text-neutral-400">
                                                Lap {st.startLap} &rarr; Lap{" "}
                                                {st.endLap} ({st.lapCount} L)
                                            </div>

                                            <div className="pt-1 border-t border-neutral-900 flex items-center justify-between text-xs">
                                                <span className="text-[10px] text-neutral-500">
                                                    Total Stint:
                                                </span>
                                                <span className="font-bold text-white">
                                                    {st.totalStintTime}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-[10px] text-neutral-500">
                                                    Pace Rata-rata:
                                                </span>
                                                <span className="text-cyan-400 font-bold">
                                                    {st.avgLapTime}/l
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Secondary Key Performance Indicators */}
                        <div className="grid grid-cols-3 gap-2 font-mono pt-1 text-center">
                            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                                <div className="text-[10px] text-neutral-500">
                                    Pace Rata-rata
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                                    {currentEditResult.formattedAverageLap}
                                </div>
                            </div>
                            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                                <div className="text-[10px] text-neutral-500">
                                    Fastest Clean Lap
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-purple-400 mt-0.5">
                                    L{currentEditResult.fastestLapNumber} (
                                    {formatLapTime(
                                        currentEditResult.fastestLapSec,
                                    )}
                                    )
                                </div>
                            </div>
                            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                                <div className="text-[10px] text-neutral-500">
                                    Pit Lane Transit
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5">
                                    {circuit.pitLossSec}s per Stop
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Lap-by-Lap Graph Sampai Tamat */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden backdrop-blur-md">
                        <LapTimeDeltaChart
                            results={simulationResults}
                            totalLaps={circuit.totalLaps}
                        />
                    </div>

                    {/* Compare Section (Bandingkan Semua Strategi) */}
                    {showComparison && (
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                                <h3 className="text-base font-black text-white flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-amber-400" />
                                    Bandingkan Semua Strategi (Plan A vs Plan B
                                    vs Plan C)
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowComparison(false)}
                                    className="text-xs font-mono text-neutral-400 hover:text-white"
                                >
                                    Tutup
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {simulationResults.map((res, idx) => {
                                    const stratPlan =
                                        strategies.find(
                                            (s) => s.id === res.strategyId,
                                        ) || strategies[0];
                                    return (
                                        <StrategyComparisonCard
                                            key={res.strategyId}
                                            strategyPlan={stratPlan}
                                            result={res}
                                            totalLaps={circuit.totalLaps}
                                            isFastest={idx === 0}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
