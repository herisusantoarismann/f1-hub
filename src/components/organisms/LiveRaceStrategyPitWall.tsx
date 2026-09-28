"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    INITIAL_LIVE_RACE_SESSION,
    LiveRaceSession,
    RaceFlagStatus,
    calculateLivePitRejoin,
} from "@/lib/live-race-simulator";
import { TyreCompound, TYRE_PROPERTIES } from "@/lib/strategy-simulator";
import {
    Radio,
    ShieldAlert,
    Gauge,
    Zap,
    Timer,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    TrendingDown,
    Flag,
    Thermometer,
    Car,
    Clock,
} from "lucide-react";

interface NextRaceInfo {
    name: string;
    circuit: string;
    dateStart: string;
    location: string;
}

interface LiveRaceStrategyPitWallProps {
    initialSession?: LiveRaceSession | null;
    initialNextRace?: NextRaceInfo | null;
}

export const LiveRaceStrategyPitWall: React.FC<
    LiveRaceStrategyPitWallProps
> = ({ initialSession, initialNextRace = null }) => {
    // Current Live Session state
    const [session, setSession] = useState<LiveRaceSession | null>(
        initialSession !== undefined ? initialSession : null,
    );
    const [nextRace, setNextRace] = useState<NextRaceInfo | null>(
        initialNextRace,
    );
    const [loading, setLoading] = useState<boolean>(
        initialSession === undefined,
    );

    // Selected Driver to analyze (default: VER / Max Verstappen)
    const [selectedDriverId, setSelectedDriverId] =
        useState<string>("max_verstappen");

    // Target tire compound to install during pit stop
    const [chosenCompound, setChosenCompound] = useState<TyreCompound>("HARD");

    // Fetch real live session status from OpenF1 API route on mount if not provided
    React.useEffect(() => {
        if (initialSession !== undefined) return;

        let isMounted = true;
        fetch("/api/strategy/live-race")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (isMounted) {
                    if (data?.isLive && data?.session) {
                        setSession(data.session);
                        if (data.session.drivers?.length > 0) {
                            setSelectedDriverId(
                                data.session.drivers[0].driverId,
                            );
                        }
                    } else {
                        setSession(null);
                        setNextRace(data?.nextRace || null);
                    }
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setSession(null);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [initialSession]);

    // Rejoin & pit exit analysis
    const rejoinAnalysis = useMemo(() => {
        if (!session) return null;
        return calculateLivePitRejoin(
            session,
            selectedDriverId,
            chosenCompound,
        );
    }, [session, selectedDriverId, chosenCompound]);

    // Handle race flag change (GREEN, SC, VSC)
    const handleFlagChange = (newFlag: RaceFlagStatus) => {
        if (!session) return;
        setSession((prev) =>
            prev
                ? {
                      ...prev,
                      flagStatus: newFlag,
                  }
                : null,
        );
    };

    // Handle lap change for simulation
    const handleLapChange = (newLap: number) => {
        setSession((prev) =>
            prev
                ? {
                      ...prev,
                      currentLap: newLap,
                      drivers: prev.drivers.map((d) => ({
                          ...d,
                          tyreAge: Math.max(
                              1,
                              d.tyreAge + (newLap - prev.currentLap),
                          ),
                      })),
                  }
                : null,
        );
    };

    if (loading) {
        return (
            <div
                data-testid="live-race-loading"
                className="py-24 text-center space-y-3 font-mono"
            >
                <div className="w-10 h-10 border-4 border-f1-red border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-neutral-400 text-xs">
                    Menghubungkan ke OpenF1 Live Telemetry API...
                </p>
            </div>
        );
    }

    if (!session) {
        return (
            <div
                data-testid="live-race-no-session"
                className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6"
            >
                <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
                    <Radio className="w-8 h-8 opacity-40 text-neutral-500" />
                </div>

                <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 text-neutral-400 border border-neutral-800 inline-block">
                        OPENF1 LIVE TELEMETRY
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                        Tidak Ada Sesi Balapan yang Sedang Berlangsung
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-lg mx-auto font-sans leading-relaxed">
                        Live Race Strategy Pit Wall hanya aktif saat sesi
                        balapan resmi Formula 1 sedang berjalan di lintasan
                        secara real-time.
                    </p>
                </div>

                {nextRace && (
                    <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-left space-y-2 font-mono text-xs max-w-md mx-auto">
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                            Sesi Balapan Grand Prix Berikutnya:
                        </div>
                        <div className="text-base font-black text-white">
                            {nextRace.name}
                        </div>
                        <div className="text-neutral-400">
                            {nextRace.circuit} &bull; {nextRace.location}
                        </div>
                        <div className="text-cyan-400 text-[11px] pt-1">
                            Mulai:{" "}
                            {new Date(nextRace.dateStart).toLocaleString(
                                "id-ID",
                                { dateStyle: "full", timeStyle: "short" },
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Link
                        href="/strategy"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold border border-neutral-700 transition-all shadow-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Simulator Strategi Offline</span>
                    </Link>
                </div>
            </div>
        );
    }

    const targetDriver =
        session.drivers.find((d) => d.driverId === selectedDriverId) ||
        session.drivers[0];

    const currentTyreProp = TYRE_PROPERTIES[targetDriver.currentCompound];
    const targetTyreProp = TYRE_PROPERTIES[chosenCompound];

    return (
        <div data-testid="live-race-strategy-pit-wall" className="space-y-6">
            {/* Navigation back to General Simulator */}
            <div className="flex items-center justify-between">
                <Link
                    href="/strategy"
                    className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Offline Strategy Simulator</span>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                        <Radio className="w-3.5 h-3.5" />
                        LIVE RACE PIT WALL ACTIVE
                    </span>
                </div>
            </div>

            {/* Top Command Bar: Session Status, Circuit, Flag & Weather */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Grand Prix Title & Current Lap */}
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-f1-red/15 text-f1-red border border-f1-red/30">
                            <Gauge className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                                    {session.grandPrixName}
                                </h1>
                                <span className="px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-xs font-bold">
                                    {session.circuitName}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                Real-time Pit Wall Telemetry &bull; FIA 2026
                                Engine
                            </p>
                        </div>
                    </div>

                    {/* Flag Status Switcher (Green, SC, VSC) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-mono text-neutral-400 mr-1">
                            Status Balapan:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleFlagChange("GREEN")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                                session.flagStatus === "GREEN"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-sm"
                                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                        >
                            🟢 Green Flag
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFlagChange("SC")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                                session.flagStatus === "SC"
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm animate-pulse"
                                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                        >
                            🟡 Safety Car (SC)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFlagChange("VSC")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                                session.flagStatus === "VSC"
                                    ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-sm"
                                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                        >
                            🟣 VSC
                        </button>
                    </div>
                </div>

                {/* Session Telemetry Strip (Lap counter slider & Pit Delta) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs pt-1">
                    {/* Lap Counter */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Lap Sekarang
                        </div>
                        <div className="text-lg font-black text-white">
                            Lap {session.currentLap}{" "}
                            <span className="text-xs font-normal text-neutral-500">
                                / {session.totalLaps}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                            <input
                                type="range"
                                min="1"
                                max={session.totalLaps - 1}
                                value={session.currentLap}
                                onChange={(e) =>
                                    handleLapChange(
                                        parseInt(e.target.value, 10),
                                    )
                                }
                                aria-label="Simulate Current Lap"
                                className="w-full accent-f1-red cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Pit Loss Active */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Pit Loss Aktif
                        </div>
                        <div
                            className={`text-lg font-black mt-0.5 ${
                                session.flagStatus === "SC"
                                    ? "text-emerald-400"
                                    : session.flagStatus === "VSC"
                                      ? "text-purple-400"
                                      : "text-white"
                            }`}
                        >
                            {session.flagStatus === "SC"
                                ? `${session.scPitLossSec}s (SC Cheap)`
                                : session.flagStatus === "VSC"
                                  ? `${session.vscPitLossSec}s (VSC)`
                                  : `${session.normalPitLossSec}s (Green)`}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                            {session.flagStatus === "SC"
                                ? `Hemat ${(session.normalPitLossSec - session.scPitLossSec).toFixed(1)}s waktu pit!`
                                : "Kehilangan waktu di pit lane"}
                        </div>
                    </div>

                    {/* Track Conditions */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-amber-400" />
                            Suhu Lintasan
                        </div>
                        <div className="text-lg font-black text-amber-400 mt-0.5">
                            {session.trackTempC}°C
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                            Udara {session.airTempC}°C &bull; Kering (Dry)
                        </div>
                    </div>

                    {/* Laps Remaining */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                            <Flag className="w-3 h-3 text-cyan-400" />
                            Sisa Balapan
                        </div>
                        <div className="text-lg font-black text-cyan-400 mt-0.5">
                            {session.totalLaps - session.currentLap} Laps
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                            Menuju Chequered Flag
                        </div>
                    </div>
                </div>

                {/* Safety Car Cheap Pit Alert Banner */}
                {session.flagStatus === "SC" && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border-2 border-amber-500/70 flex items-center justify-between gap-3 text-xs font-mono text-amber-200 shadow-md shadow-amber-950/40">
                        <div className="flex items-center gap-2.5">
                            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                            <div>
                                <span className="font-bold text-amber-300">
                                    SAFETY CAR WINDOW OPPORTUNITY:
                                </span>{" "}
                                Mobil melaju lambat di trek! Waktu pit stop
                                berkurang drastis menjadi{" "}
                                <strong>{session.scPitLossSec}s</strong> (Hemat{" "}
                                {(
                                    session.normalPitLossSec -
                                    session.scPitLossSec
                                ).toFixed(1)}
                                s). Peluang emas untuk pit stop murah (*cheap
                                pit stop*)!
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Split Screen Pit Wall: KIRI (Live Leaderboard & Driver Select) | KANAN (Rejoin & Strategy Decision) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ========================================================
                    KOLOM KIRI: LIVE LEADERBOARD & SELEKSI PEMBALAP
                   ======================================================== */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                            <div className="flex items-center gap-2">
                                <Car className="w-4 h-4 text-f1-red" />
                                <h2 className="text-base font-black text-white">
                                    Live Race Running Order (Leaderboard)
                                </h2>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">
                                Klik pembalap untuk racik strategi
                            </span>
                        </div>

                        {/* Leaderboard Table */}
                        <div className="space-y-2 font-mono text-xs overflow-x-auto">
                            {session.drivers.map((driver) => {
                                const isSelected =
                                    driver.driverId === selectedDriverId;
                                const compProp =
                                    TYRE_PROPERTIES[driver.currentCompound];

                                return (
                                    <button
                                        key={driver.driverId}
                                        type="button"
                                        onClick={() =>
                                            setSelectedDriverId(driver.driverId)
                                        }
                                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                                            isSelected
                                                ? "bg-f1-red/15 border-f1-red text-white shadow-md shadow-f1-red/10"
                                                : "bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700 text-neutral-300"
                                        }`}
                                    >
                                        {/* Pos, Driver Code & Team */}
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                                    driver.position <= 3
                                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                                        : "bg-neutral-800 text-neutral-400"
                                                }`}
                                            >
                                                P{driver.position}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-1.5 h-6 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            driver.teamColor,
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-black text-white flex items-center gap-1.5">
                                                        <span>
                                                            {driver.code}
                                                        </span>
                                                        <span className="text-[11px] font-normal text-neutral-400">
                                                            {
                                                                driver.name.split(
                                                                    " ",
                                                                )[1]
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-neutral-500">
                                                        {driver.team}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tyre Compound & Age */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[11px]">
                                                <span
                                                    className="px-1.5 py-0.2 rounded text-[10px] font-black text-black"
                                                    style={{
                                                        backgroundColor:
                                                            compProp.color,
                                                    }}
                                                >
                                                    {compProp.name[0]}
                                                </span>
                                                <span className="text-neutral-400">
                                                    {driver.tyreAge} Laps
                                                </span>
                                            </div>

                                            {/* Gap to Leader */}
                                            <div className="text-right w-16">
                                                <div className="font-bold text-white text-xs">
                                                    {driver.position === 1
                                                        ? "LEADER"
                                                        : `+${driver.gapToLeaderSec.toFixed(
                                                              2,
                                                          )}s`}
                                                </div>
                                                {driver.position > 1 && (
                                                    <div className="text-[10px] text-neutral-500">
                                                        +
                                                        {driver.intervalToAheadSec.toFixed(
                                                            1,
                                                        )}
                                                        s
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    KOLOM KANAN: REJOIN PIT WINDOW & REMAINING STINT CALCULATOR
                   ======================================================== */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Selected Driver Banner */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-f1-red font-bold flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5" />
                                    Pit Wall Strategy Analysis
                                </span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    {targetDriver.name} ({targetDriver.code})
                                </h3>
                                <p className="text-xs text-neutral-400 font-mono">
                                    Posisi Saat Ini:{" "}
                                    <strong className="text-white">
                                        P{targetDriver.position}
                                    </strong>{" "}
                                    &bull; Ban: {currentTyreProp.name} (
                                    {targetDriver.tyreAge} Laps Old)
                                </p>
                            </div>

                            {/* Target Tire Selector */}
                            <div className="space-y-1 sm:text-right">
                                <span className="text-[10px] font-mono uppercase text-neutral-400">
                                    Pasang Ban Baru:
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {(
                                        [
                                            "SOFT",
                                            "MEDIUM",
                                            "HARD",
                                        ] as TyreCompound[]
                                    ).map((c) => {
                                        const cProp = TYRE_PROPERTIES[c];
                                        const isChosen = chosenCompound === c;
                                        return (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() =>
                                                    setChosenCompound(c)
                                                }
                                                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border transition-all ${
                                                    isChosen
                                                        ? "border-white text-black shadow-md"
                                                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                                                }`}
                                                style={
                                                    isChosen
                                                        ? {
                                                              backgroundColor:
                                                                  cProp.color,
                                                          }
                                                        : {}
                                                }
                                            >
                                                {c}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* REJOIN OUTCOME CARD ("Kalo pit sekarang keluar di posisi berapa dan di belakang siapa?") */}
                        {rejoinAnalysis && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 font-mono">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                                            Proyeksi Keluar Pit (Pit Rejoin):
                                        </span>
                                        <span className="text-amber-400 font-bold">
                                            Pit Loss: -
                                            {rejoinAnalysis.pitLossAppliedSec}s
                                        </span>
                                    </div>

                                    {/* Position Drop & Delta Highlight */}
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center min-w-20">
                                            <div className="text-[10px] text-neutral-400 uppercase">
                                                Rejoin Pos
                                            </div>
                                            <div className="text-3xl font-black text-amber-400 mt-0.5">
                                                P
                                                {
                                                    rejoinAnalysis.projectedPosition
                                                }
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <div className="text-white font-bold flex items-center gap-1.5">
                                                <TrendingDown className="w-4 h-4 text-rose-400" />
                                                <span>
                                                    Turun dari P
                                                    {
                                                        rejoinAnalysis.currentPosition
                                                    }{" "}
                                                    ke P
                                                    {
                                                        rejoinAnalysis.projectedPosition
                                                    }{" "}
                                                    (
                                                    {rejoinAnalysis.projectedPosition -
                                                        rejoinAnalysis.currentPosition}{" "}
                                                    Posisi)
                                                </span>
                                            </div>
                                            <div className="text-neutral-400">
                                                Gap ke Leader Baru:{" "}
                                                <strong className="text-white">
                                                    +
                                                    {rejoinAnalysis.projectedGapToLeaderSec.toFixed(
                                                        2,
                                                    )}
                                                    s
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Di Belakang Siapa & Di Depan Siapa */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-900">
                                        {/* Di Belakang */}
                                        <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                                            <div className="text-[10px] text-neutral-400">
                                                Keluar di Belakang:
                                            </div>
                                            {rejoinAnalysis.rejoinsBehind ? (
                                                <div className="font-bold text-white text-xs mt-0.5">
                                                    {
                                                        rejoinAnalysis
                                                            .rejoinsBehind.name
                                                    }{" "}
                                                    (
                                                    {
                                                        rejoinAnalysis
                                                            .rejoinsBehind.code
                                                    }
                                                    ){" "}
                                                    <span className="text-rose-400 font-mono">
                                                        (+
                                                        {rejoinAnalysis.rejoinsBehind.gapSec.toFixed(
                                                            1,
                                                        )}
                                                        s)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="font-bold text-emerald-400 text-xs mt-0.5">
                                                    P1 (Memimpin Balapan)
                                                </div>
                                            )}
                                        </div>

                                        {/* Di Depan */}
                                        <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                                            <div className="text-[10px] text-neutral-400">
                                                Keluar di Depan:
                                            </div>
                                            {rejoinAnalysis.rejoinsAheadOf ? (
                                                <div className="font-bold text-white text-xs mt-0.5">
                                                    {
                                                        rejoinAnalysis
                                                            .rejoinsAheadOf.name
                                                    }{" "}
                                                    (
                                                    {
                                                        rejoinAnalysis
                                                            .rejoinsAheadOf.code
                                                    }
                                                    ){" "}
                                                    <span className="text-emerald-400 font-mono">
                                                        (+
                                                        {rejoinAnalysis.rejoinsAheadOf.gapSec.toFixed(
                                                            1,
                                                        )}
                                                        s)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="font-bold text-neutral-500 text-xs mt-0.5">
                                                    Paling Belakang
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Traffic Condition Advice */}
                                    <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-start gap-2 text-xs">
                                        <AlertTriangle
                                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                                                rejoinAnalysis.trafficStatus ===
                                                    "CLEAN_AIR" ||
                                                rejoinAnalysis.trafficStatus ===
                                                    "CLEAR_TRACK"
                                                    ? "text-emerald-400"
                                                    : "text-amber-400"
                                            }`}
                                        />
                                        <p className="text-neutral-300 font-sans leading-relaxed">
                                            {rejoinAnalysis.trafficDescription}
                                        </p>
                                    </div>
                                </div>

                                {/* NEXT STINT & PIT WINDOW STRATEGY ("Harus ganti di lap berapa lagi?") */}
                                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 font-mono">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-400 uppercase tracking-wider text-[11px] font-bold flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                            Skenario Stint Berikutnya:
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                                                rejoinAnalysis.nextPitWindow
                                                    .strategyType ===
                                                "1-Stop to End"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-cyan-500/20 text-cyan-400"
                                            }`}
                                        >
                                            {
                                                rejoinAnalysis.nextPitWindow
                                                    .strategyType
                                            }
                                        </span>
                                    </div>

                                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                                        {rejoinAnalysis.nextPitWindow.analysis}
                                    </p>

                                    {rejoinAnalysis.nextPitWindow
                                        .recommendedNextBoxLap ? (
                                        <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">
                                                Jendela Pit Stop Kedua:
                                            </span>
                                            <span className="font-bold text-amber-400">
                                                Target Lap{" "}
                                                {
                                                    rejoinAnalysis.nextPitWindow
                                                        .recommendedNextBoxLap
                                                }
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>
                                                Bisa terus melaju sampai
                                                Chequered Flag tanpa pit stop
                                                lagi!
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* UNDERCUT THREATS MONITOR */}
                                {rejoinAnalysis.undercutThreats.length > 0 && (
                                    <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2 font-mono text-xs">
                                        <div className="flex items-center gap-2 text-red-400 font-bold">
                                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                            <span>
                                                Ancaman Undercut Terdeteksi:
                                            </span>
                                        </div>
                                        {rejoinAnalysis.undercutThreats.map(
                                            (threat) => (
                                                <div
                                                    key={threat.driverCode}
                                                    className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[11px]"
                                                >
                                                    <div className="flex items-center justify-between font-bold">
                                                        <span className="text-white">
                                                            {threat.driverName}{" "}
                                                            ({threat.driverCode}
                                                            )
                                                        </span>
                                                        <span className="text-rose-400">
                                                            Gap: +
                                                            {threat.gapSec.toFixed(
                                                                1,
                                                            )}
                                                            s (
                                                            {threat.threatLevel}
                                                            )
                                                        </span>
                                                    </div>
                                                    <p className="text-neutral-300 font-sans mt-0.5">
                                                        {threat.advice}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
