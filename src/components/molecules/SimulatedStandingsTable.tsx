"use client";

import React from "react";
import Image from "next/image";
import {
    SimulatedDriverStanding,
    SimulatedConstructorStanding,
} from "@/lib/calculator-utils";
import {
    getDriverImage,
    getTeamLogo,
    getNationalityFlag,
    getTeamColor,
} from "@/lib/utils/asset-helper";
import {
    ChevronUp,
    ChevronDown,
    Minus,
    Trophy,
    Users,
    Shield,
} from "lucide-react";

interface SimulatedStandingsTableProps {
    tab: "drivers" | "constructors";
    onTabChange: (tab: "drivers" | "constructors") => void;
    driverStandings: SimulatedDriverStanding[];
    constructorStandings: SimulatedConstructorStanding[];
}

export const SimulatedStandingsTable: React.FC<
    SimulatedStandingsTableProps
> = ({ tab, onTabChange, driverStandings, constructorStandings }) => {
    return (
        <div
            data-testid="simulated-standings-table"
            className="rounded-3xl border border-neutral-800 bg-neutral-900/60 overflow-hidden backdrop-blur-md shadow-xl space-y-0"
        >
            {/* Tab Header Bar */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/60">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onTabChange("drivers")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            tab === "drivers"
                                ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                        data-testid="tab-simulated-drivers"
                    >
                        <Users className="w-4 h-4" />
                        <span>Drivers (WDC)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange("constructors")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            tab === "constructors"
                                ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                        data-testid="tab-simulated-constructors"
                    >
                        <Shield className="w-4 h-4" />
                        <span>Constructors (WCC)</span>
                    </button>
                </div>

                <div className="text-[11px] font-mono text-neutral-400">
                    Live Recalculated Standings
                </div>
            </div>

            {/* Drivers Standings Table */}
            {tab === "drivers" && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-950/90 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th className="py-3 px-4 w-16 text-center">
                                    Pos
                                </th>
                                <th className="py-3 px-3 w-16 text-center">
                                    Shift
                                </th>
                                <th className="py-3 px-4">Driver</th>
                                <th className="py-3 px-4 hidden sm:table-cell">
                                    Team
                                </th>
                                <th className="py-3 px-4 text-center hidden md:table-cell">
                                    Wins
                                </th>
                                <th className="py-3 px-4 text-right">
                                    Pts Added
                                </th>
                                <th className="py-3 px-4 text-right font-black">
                                    Simulated Pts
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 font-sans">
                            {driverStandings.slice(0, 15).map((st) => {
                                const driver = st.Driver;
                                const constructor = st.Constructors[0];
                                const teamColor = getTeamColor(
                                    constructor?.constructorId,
                                );
                                const isPodium = st.simulatedPosition <= 3;

                                return (
                                    <tr
                                        key={driver.driverId}
                                        className={`hover:bg-neutral-800/40 transition-colors ${
                                            st.positionChange !== 0
                                                ? "bg-neutral-900/40"
                                                : ""
                                        }`}
                                    >
                                        {/* Rank */}
                                        <td className="py-3 px-4 text-center font-mono">
                                            <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                                                    st.simulatedPosition === 1
                                                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                                                        : st.simulatedPosition ===
                                                            2
                                                          ? "bg-neutral-300 text-black"
                                                          : st.simulatedPosition ===
                                                              3
                                                            ? "bg-amber-700 text-white"
                                                            : "text-neutral-400 bg-neutral-950/60"
                                                }`}
                                            >
                                                {st.simulatedPosition}
                                            </span>
                                        </td>

                                        {/* Position Shift (Climbed / Dropped / Same) */}
                                        <td className="py-3 px-3 text-center font-mono text-xs">
                                            {st.positionChange > 0 ? (
                                                <span className="inline-flex items-center text-emerald-400 font-bold">
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                    +{st.positionChange}
                                                </span>
                                            ) : st.positionChange < 0 ? (
                                                <span className="inline-flex items-center text-red-400 font-bold">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    {st.positionChange}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">
                                                    <Minus className="w-3 h-3 inline" />
                                                </span>
                                            )}
                                        </td>

                                        {/* Driver Name & Headshot */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                                                    <Image
                                                        src={getDriverImage(
                                                            driver.driverId,
                                                        )}
                                                        alt={driver.familyName}
                                                        fill
                                                        className="object-cover object-top"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                                                        <span className="truncate">
                                                            {driver.givenName}{" "}
                                                            {driver.familyName}
                                                        </span>
                                                        <span>
                                                            {getNationalityFlag(
                                                                driver.nationality,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-neutral-400 font-mono sm:hidden truncate">
                                                        {constructor?.name ||
                                                            "Independent"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Constructor Name */}
                                        <td className="py-3 px-4 hidden sm:table-cell">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            teamColor,
                                                    }}
                                                />
                                                <span className="truncate text-neutral-300">
                                                    {constructor?.name ||
                                                        "Independent"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Wins */}
                                        <td className="py-3 px-4 text-center font-mono text-xs hidden md:table-cell text-neutral-400">
                                            {st.simulatedWins}
                                        </td>

                                        {/* Points Added in Simulation */}
                                        <td className="py-3 px-4 text-right font-mono text-xs">
                                            {st.pointsAdded > 0 ? (
                                                <span className="text-emerald-400 font-bold">
                                                    +{st.pointsAdded}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Total Simulated Points */}
                                        <td className="py-3 px-4 text-right font-mono font-black text-sm text-white">
                                            {st.simulatedPoints}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Constructors Standings Table */}
            {tab === "constructors" && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-950/90 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th className="py-3 px-4 w-16 text-center">
                                    Pos
                                </th>
                                <th className="py-3 px-3 w-16 text-center">
                                    Shift
                                </th>
                                <th className="py-3 px-4">Constructor</th>
                                <th className="py-3 px-4 text-center hidden md:table-cell">
                                    Wins
                                </th>
                                <th className="py-3 px-4 text-right">
                                    Pts Added
                                </th>
                                <th className="py-3 px-4 text-right font-black">
                                    Simulated Pts
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 font-sans">
                            {constructorStandings.map((st) => {
                                const team = st.Constructor;
                                const teamColor = getTeamColor(
                                    team.constructorId,
                                );
                                const teamLogo = getTeamLogo(
                                    team.constructorId,
                                );

                                return (
                                    <tr
                                        key={team.constructorId}
                                        className={`hover:bg-neutral-800/40 transition-colors ${
                                            st.positionChange !== 0
                                                ? "bg-neutral-900/40"
                                                : ""
                                        }`}
                                    >
                                        {/* Rank */}
                                        <td className="py-3 px-4 text-center font-mono">
                                            <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                                                    st.simulatedPosition === 1
                                                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                                                        : st.simulatedPosition ===
                                                            2
                                                          ? "bg-neutral-300 text-black"
                                                          : st.simulatedPosition ===
                                                              3
                                                            ? "bg-amber-700 text-white"
                                                            : "text-neutral-400 bg-neutral-950/60"
                                                }`}
                                            >
                                                {st.simulatedPosition}
                                            </span>
                                        </td>

                                        {/* Position Shift */}
                                        <td className="py-3 px-3 text-center font-mono text-xs">
                                            {st.positionChange > 0 ? (
                                                <span className="inline-flex items-center text-emerald-400 font-bold">
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                    +{st.positionChange}
                                                </span>
                                            ) : st.positionChange < 0 ? (
                                                <span className="inline-flex items-center text-red-400 font-bold">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    {st.positionChange}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">
                                                    <Minus className="w-3 h-3 inline" />
                                                </span>
                                            )}
                                        </td>

                                        {/* Team Name & Logo */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-neutral-200 p-1 shrink-0 flex items-center justify-center shadow-sm">
                                                    <Image
                                                        src={teamLogo}
                                                        alt={team.name}
                                                        width={24}
                                                        height={24}
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                teamColor,
                                                        }}
                                                    />
                                                    <span className="font-bold text-white text-xs sm:text-sm truncate">
                                                        {team.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Wins */}
                                        <td className="py-3 px-4 text-center font-mono text-xs hidden md:table-cell text-neutral-400">
                                            {st.simulatedWins}
                                        </td>

                                        {/* Points Added */}
                                        <td className="py-3 px-4 text-right font-mono text-xs">
                                            {st.pointsAdded > 0 ? (
                                                <span className="text-emerald-400 font-bold">
                                                    +{st.pointsAdded}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {/* Total Simulated Points */}
                                        <td className="py-3 px-4 text-right font-mono font-black text-sm text-white">
                                            {st.simulatedPoints}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
