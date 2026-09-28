"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    DRIVERS_RATINGS,
    RIVALRY_PRESETS,
    getDriverPerformance,
} from "@/data/drivers-ratings";
import {
    DriverComparisonStats,
    getIntersectingSeasons,
    fetchDriverSeasonStats,
} from "@/lib/api/driver-comparison";
import { DriverSelectorCard } from "@/components/molecules/DriverSelectorCard";
import { DriverRadarChart } from "@/components/molecules/DriverRadarChart";
import { HeadToHeadStatsCard } from "@/components/molecules/HeadToHeadStatsCard";
import {
    ArrowLeftRight,
    Sparkles,
    Scale,
    CheckCircle2,
    TrendingUp,
    Calendar,
    RefreshCw,
} from "lucide-react";

interface DriverComparisonModuleProps {
    initialDriver1Id?: string;
    initialDriver2Id?: string;
    initialSeason?: string;
    className?: string;
}

export const DriverComparisonModule: React.FC<DriverComparisonModuleProps> = ({
    initialDriver1Id = "max_verstappen",
    initialDriver2Id = "norris",
    initialSeason = "all",
    className = "",
}) => {
    const [driver1Id, setDriver1Id] = useState<string>(initialDriver1Id);
    const [driver2Id, setDriver2Id] = useState<string>(initialDriver2Id);
    const [selectedSeason, setSelectedSeason] = useState<string>(initialSeason);
    const [seasonStats1, setSeasonStats1] = useState<
        DriverComparisonStats | undefined
    >(undefined);
    const [seasonStats2, setSeasonStats2] = useState<
        DriverComparisonStats | undefined
    >(undefined);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

    const availableDrivers = useMemo(() => {
        return Object.values(DRIVERS_RATINGS).sort(
            (a, b) => b.overallRating - a.overallRating,
        );
    }, []);

    const driver1 = useMemo(() => getDriverPerformance(driver1Id), [driver1Id]);
    const driver2 = useMemo(() => getDriverPerformance(driver2Id), [driver2Id]);

    // Calculate intersecting active seasons where BOTH drivers raced in F1
    const intersectingSeasons = useMemo(() => {
        return getIntersectingSeasons(driver1Id, driver2Id);
    }, [driver1Id, driver2Id]);

    // If selected season is not "all" and no longer exists in intersecting seasons, reset
    useEffect(() => {
        if (
            selectedSeason !== "all" &&
            !intersectingSeasons.includes(selectedSeason)
        ) {
            setSelectedSeason(
                intersectingSeasons.length > 0 ? intersectingSeasons[0] : "all",
            );
        }
    }, [driver1Id, driver2Id, intersectingSeasons, selectedSeason]);

    // Fetch live season/career statistics when drivers or season change
    useEffect(() => {
        let isMounted = true;
        const loadStats = async () => {
            setIsLoadingStats(true);
            try {
                // Try fetching from local API route first
                const res = await fetch(
                    `/api/compare?d1=${driver1Id}&d2=${driver2Id}&season=${selectedSeason}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        setSeasonStats1(data.d1Stats);
                        setSeasonStats2(data.d2Stats);
                    }
                } else {
                    // Fallback to in-module fetcher
                    const [s1, s2] = await Promise.all([
                        fetchDriverSeasonStats(driver1Id, selectedSeason),
                        fetchDriverSeasonStats(driver2Id, selectedSeason),
                    ]);
                    if (isMounted) {
                        setSeasonStats1(s1);
                        setSeasonStats2(s2);
                    }
                }
            } catch {
                // Network failure fallback
                const [s1, s2] = await Promise.all([
                    fetchDriverSeasonStats(driver1Id, selectedSeason),
                    fetchDriverSeasonStats(driver2Id, selectedSeason),
                ]);
                if (isMounted) {
                    setSeasonStats1(s1);
                    setSeasonStats2(s2);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingStats(false);
                }
            }
        };

        loadStats();
        return () => {
            isMounted = false;
        };
    }, [driver1Id, driver2Id, selectedSeason]);

    const handleSwap = () => {
        setDriver1Id(driver2Id);
        setDriver2Id(driver1Id);
    };

    // Calculate dynamic analyst verdict
    const analystVerdict = useMemo(() => {
        const d1 = driver1.skills;
        const d2 = driver2.skills;

        const qualiWinner =
            d1.qualifyingPace > d2.qualifyingPace
                ? driver1
                : d2.qualifyingPace > d1.qualifyingPace
                  ? driver2
                  : null;
        const qualiDelta = Math.abs(d1.qualifyingPace - d2.qualifyingPace);

        const raceWinner =
            d1.raceCraft > d2.raceCraft
                ? driver1
                : d2.raceCraft > d1.raceCraft
                  ? driver2
                  : null;
        const raceDelta = Math.abs(d1.raceCraft - d2.raceCraft);

        const wetWinner =
            d1.wetWeather > d2.wetWeather
                ? driver1
                : d2.wetWeather > d1.wetWeather
                  ? driver2
                  : null;

        let overallWinner = driver1;
        if (driver2.overallRating > driver1.overallRating) {
            overallWinner = driver2;
        }

        return {
            qualiWinner,
            qualiDelta,
            raceWinner,
            raceDelta,
            wetWinner,
            overallWinner,
        };
    }, [driver1, driver2]);

    const color1 = driver1.teamColor || "#38BDF8";
    const color2 =
        driver2.teamColor === driver1.teamColor
            ? "#F43F5E"
            : driver2.teamColor || "#E10600";

    // Quick pill seasons (up to 5 most recent intersecting seasons)
    const quickSeasons = intersectingSeasons.slice(0, 5);
    const olderSeasons = intersectingSeasons.slice(5);

    return (
        <div
            data-testid="driver-comparison-module"
            className={`space-y-8 ${className}`}
        >
            {/* Quick Rivalry Presets Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-mono text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white uppercase tracking-wider">
                        Featured Rivalries:
                    </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {RIVALRY_PRESETS.map((preset) => {
                        const isActive =
                            (driver1Id === preset.driver1Id &&
                                driver2Id === preset.driver2Id) ||
                            (driver1Id === preset.driver2Id &&
                                driver2Id === preset.driver1Id);

                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                    setDriver1Id(preset.driver1Id);
                                    setDriver2Id(preset.driver2Id);
                                }}
                                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all border ${
                                    isActive
                                        ? "bg-f1-red text-white border-f1-red shadow-md shadow-f1-red/30"
                                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                                }`}
                            >
                                <span>{preset.title}</span>
                                <span className="ml-1.5 text-[10px] opacity-75 hidden md:inline">
                                    [{preset.badge}]
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Drivers Selection Cards Grid with Swap Button in Center */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
                {/* Driver 1 Card */}
                <DriverSelectorCard
                    slotLabel="Contender 1"
                    driver={driver1}
                    availableDrivers={availableDrivers}
                    onSelectDriver={setDriver1Id}
                    accentColor={color1}
                />

                {/* Central Swap Floating Button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex">
                    <button
                        type="button"
                        onClick={handleSwap}
                        data-testid="swap-drivers-button"
                        className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 shadow-2xl transition-all hover:scale-110 active:scale-95 group"
                        title="Swap Drivers (Tukar Posisi)"
                        aria-label="Swap Drivers"
                    >
                        <ArrowLeftRight className="w-4 h-4 text-f1-red group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                </div>

                {/* Driver 2 Card */}
                <DriverSelectorCard
                    slotLabel="Contender 2"
                    driver={driver2}
                    availableDrivers={availableDrivers}
                    onSelectDriver={setDriver2Id}
                    accentColor={color2}
                />
            </div>

            {/* Season Filter Bar with Intersecting Seasons Logic */}
            <div
                data-testid="season-filter-bar"
                className="flex flex-col gap-3 p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-f1-red/10 border border-f1-red/20 text-f1-red">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                    Filter Musim Balap (Season Head-to-Head)
                                </span>
                                {isLoadingStats && (
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 animate-pulse">
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        Sinkronisasi FIA...
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                {selectedSeason === "all"
                                    ? "Menampilkan rekor karir keseluruhan (All-Time Career)"
                                    : `Menampilkan duel langsung resmi musim Formula 1 ${selectedSeason}`}
                            </p>
                        </div>
                    </div>

                    {/* Season Buttons & Dropdown */}
                    <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
                        {/* All-Time Option */}
                        <button
                            type="button"
                            onClick={() => setSelectedSeason("all")}
                            data-testid="season-btn-all"
                            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border ${
                                selectedSeason === "all"
                                    ? "bg-f1-red text-white border-f1-red shadow-md shadow-f1-red/30"
                                    : "bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                            }`}
                        >
                            All-Time
                        </button>

                        {/* Recent Intersecting Seasons Buttons */}
                        {quickSeasons.map((season) => (
                            <button
                                key={season}
                                type="button"
                                onClick={() => setSelectedSeason(season)}
                                data-testid={`season-btn-${season}`}
                                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border ${
                                    selectedSeason === season
                                        ? "bg-f1-red text-white border-f1-red shadow-md shadow-f1-red/30"
                                        : "bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                                }`}
                            >
                                {season}
                            </button>
                        ))}

                        {/* Dropdown for older intersecting seasons if available */}
                        {olderSeasons.length > 0 && (
                            <select
                                value={
                                    olderSeasons.includes(selectedSeason)
                                        ? selectedSeason
                                        : ""
                                }
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setSelectedSeason(e.target.value);
                                    }
                                }}
                                aria-label="Musim Beririsan Lainnya"
                                className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white font-mono text-xs focus:outline-none focus:border-f1-red"
                            >
                                <option value="" disabled>
                                    + {olderSeasons.length} Musim Lainnya...
                                </option>
                                {olderSeasons.map((year) => (
                                    <option key={year} value={year}>
                                        Musim {year}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Explanatory Note on Intersecting Seasons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>
                        Irisan musim aktif {driver1.code} &amp; {driver2.code}:{" "}
                        <strong className="text-neutral-200">
                            {intersectingSeasons.length > 0
                                ? intersectingSeasons.join(", ")
                                : "Tidak ada irisan tahun (hanya All-Time)"}
                        </strong>
                        {intersectingSeasons.length > 0 && (
                            <span className="text-neutral-500 ml-1">
                                (Tahun di mana salah satu pembalap belum/tidak
                                balapan tidak dapat dipilih)
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Core Analytics Grid: Radar Chart + Head-to-Head Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* 6-Axis Performance Radar Chart */}
                <DriverRadarChart driver1={driver1} driver2={driver2} />

                {/* Head-to-Head Metrics Card */}
                <HeadToHeadStatsCard
                    driver1={driver1}
                    driver2={driver2}
                    seasonStats1={seasonStats1}
                    seasonStats2={seasonStats2}
                    selectedSeason={selectedSeason}
                />
            </div>

            {/* AI Race Analyst Verdict Banner */}
            <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-8 shadow-xl font-mono">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Scale className="w-4 h-4" />
                    <span>Motorsport Engineering Verdict</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Qualifying Edge */}
                    <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                            Single-Lap Pace
                        </span>
                        <div className="text-sm font-bold text-white">
                            {analystVerdict.qualiWinner
                                ? `${analystVerdict.qualiWinner.fullName} (+${analystVerdict.qualiDelta} Pts)`
                                : "Performa Kualifikasi Setara"}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                            {analystVerdict.qualiWinner
                                ? `${analystVerdict.qualiWinner.code} memiliki keunggulan traksi dan komitmen apex di kualifikasi Q3 ban lunak.`
                                : "Kedua pembalap memiliki kecepatan satu lap yang identik di batas grip ban lunak."}
                        </p>
                    </div>

                    {/* Race Craft Edge */}
                    <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Sunday Race Craft
                        </span>
                        <div className="text-sm font-bold text-white">
                            {analystVerdict.raceWinner
                                ? `${analystVerdict.raceWinner.fullName} (+${analystVerdict.raceDelta} Pts)`
                                : "Manajemen Balap Imbang"}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                            {analystVerdict.raceWinner
                                ? `${analystVerdict.raceWinner.code} lebih unggul dalam menjaga suhu ban di stint panjang dan manuver wheel-to-wheel.`
                                : "Keduanya memiliki kapasitas race pace dan manajemen degradasi ban yang setara."}
                        </p>
                    </div>

                    {/* Wet Weather & Tactical Experience */}
                    <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Wet &amp; Tactical Edge
                        </span>
                        <div className="text-sm font-bold text-white">
                            {analystVerdict.wetWinner
                                ? `${analystVerdict.wetWinner.fullName}`
                                : "Spesialis Hujan Seimbang"}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                            {analystVerdict.wetWinner
                                ? `${analystVerdict.wetWinner.code} mencatat rating lintasan basah lebih tinggi dengan respon feeling pedal rem yang presisi.`
                                : "Kemampuan membaca grip aspal licin kedua pembalap sangat terlatih."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
