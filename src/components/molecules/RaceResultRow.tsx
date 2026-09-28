import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RaceResult } from "@/types/f1";
import {
    getDriverImage,
    getTeamColor,
    getNationalityFlag,
} from "@/lib/utils/asset-helper";
import { ArrowUp, ArrowDown, Minus, Zap, Timer } from "lucide-react";

interface RaceResultRowProps {
    result: RaceResult;
    isWinner?: boolean;
}

export const RaceResultRow: React.FC<RaceResultRowProps> = ({
    result,
    isWinner,
}) => {
    const {
        position,
        grid,
        points,
        status,
        Time: timeData,
        FastestLap: fastestLap,
        Driver: driver,
        Constructor: team,
    } = result;

    const teamColor = getTeamColor(team.constructorId);
    const flag = getNationalityFlag(driver.nationality);
    const driverImg = getDriverImage(driver.driverId);

    const posNum = parseInt(position, 10);
    const gridNum = parseInt(grid, 10);

    const isP1 = position === "1" || isWinner;
    const isP2 = position === "2";
    const isP3 = position === "3";
    const isDnf =
        status.toLowerCase() !== "finished" && !status.startsWith("+");
    const hasFastestLap = fastestLap?.rank === "1";

    // Calculate grid delta (gain or loss)
    const hasValidGrid = !isNaN(gridNum) && gridNum > 0 && !isNaN(posNum);
    const gridDelta = hasValidGrid ? gridNum - posNum : 0;

    // Format display time / interval / status
    const formatDisplayTime = () => {
        if (timeData?.time) {
            return timeData.time;
        }
        return status;
    };

    const displayTime = formatDisplayTime();

    return (
        <tr
            data-testid={`race-result-row-${driver.driverId}`}
            className={`border-b border-neutral-800/60 transition-colors hover:bg-neutral-850/50 ${
                isP1
                    ? "bg-amber-500/[0.04]"
                    : isDnf
                      ? "opacity-75 bg-neutral-950/40"
                      : ""
            }`}
        >
            {/* Position Column */}
            <td className="py-3.5 px-4 text-center font-mono font-bold text-sm w-16">
                <span
                    data-testid="result-position-badge"
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                        isP1
                            ? "bg-amber-400 text-neutral-950 font-black shadow-md shadow-amber-400/20 ring-1 ring-amber-400/50"
                            : isP2
                              ? "bg-neutral-300 text-neutral-950 font-black"
                              : isP3
                                ? "bg-amber-700 text-white font-black"
                                : isDnf
                                  ? "bg-neutral-900 text-neutral-400 border border-neutral-800"
                                  : "text-neutral-400 font-medium"
                    }`}
                >
                    {isDnf && isNaN(posNum) ? "DNF" : position}
                </span>
            </td>

            {/* Grid Delta Movement */}
            <td className="py-3.5 px-3 text-center font-mono text-xs w-16">
                {hasValidGrid ? (
                    gridDelta > 0 ? (
                        <span
                            data-testid="grid-delta"
                            className="inline-flex items-center gap-0.5 text-emerald-400 font-bold"
                            title={`Started P${grid}, gained ${gridDelta} positions`}
                        >
                            <ArrowUp className="w-3 h-3" />+{gridDelta}
                        </span>
                    ) : gridDelta < 0 ? (
                        <span
                            data-testid="grid-delta"
                            className="inline-flex items-center gap-0.5 text-rose-400 font-bold"
                            title={`Started P${grid}, lost ${Math.abs(gridDelta)} positions`}
                        >
                            <ArrowDown className="w-3 h-3" />
                            {gridDelta}
                        </span>
                    ) : (
                        <span
                            data-testid="grid-delta"
                            className="inline-flex items-center text-neutral-500 font-semibold"
                            title="Maintained starting grid position"
                        >
                            <Minus className="w-3 h-3" />
                        </span>
                    )
                ) : (
                    <span className="text-neutral-600 font-mono">–</span>
                )}
            </td>

            {/* Driver Column */}
            <td className="py-3.5 px-4">
                <Link
                    href={`/drivers/${driver.driverId}`}
                    className="inline-flex items-center gap-3 group"
                >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/80 shadow-sm">
                        <Image
                            src={driverImg}
                            alt={`${driver.givenName} ${driver.familyName}`}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm leading-snug group-hover:text-f1-red transition-colors">
                                {driver.givenName} {driver.familyName}
                            </span>
                            <span className="text-xs">{flag}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                            {driver.code && (
                                <span className="font-bold text-neutral-300 uppercase">
                                    {driver.code}
                                </span>
                            )}
                            {driver.permanentNumber && (
                                <span className="text-neutral-500">
                                    #{driver.permanentNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            </td>

            {/* Team / Constructor Column */}
            <td className="py-3.5 px-4 text-xs font-semibold text-neutral-200">
                <Link
                    href={`/teams/${team.constructorId}`}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                    <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: teamColor }}
                        aria-hidden="true"
                    />
                    <span className="hover:underline">{team.name}</span>
                </Link>
            </td>

            {/* Starting Grid Column */}
            <td className="py-3.5 px-4 text-center font-mono text-xs text-neutral-400 hidden sm:table-cell">
                {gridNum > 0 ? `P${grid}` : "Pit Lane"}
            </td>

            {/* Laps Completed */}
            <td className="py-3.5 px-4 text-center font-mono text-xs text-neutral-300 hidden md:table-cell">
                {result.laps}
            </td>

            {/* Time / Interval / Status Column */}
            <td className="py-3.5 px-4 text-right font-mono text-xs sm:text-sm">
                <div className="flex flex-col items-end">
                    <span
                        data-testid="result-time-status"
                        className={`font-semibold ${
                            isP1
                                ? "text-amber-400 font-bold"
                                : isDnf
                                  ? "text-rose-400 font-bold"
                                  : "text-neutral-300"
                        }`}
                    >
                        {displayTime}
                    </span>

                    {/* Fastest Lap Purple Badge */}
                    {hasFastestLap && (
                        <span
                            data-testid="fastest-lap-badge"
                            className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-700/50 shadow-xs"
                            title={`Fastest Lap: ${fastestLap?.Time.time || "Fastest"}`}
                        >
                            <Zap className="w-2.5 h-2.5 fill-current text-purple-400" />
                            <span>
                                {fastestLap?.Time.time || "Fastest Lap"}
                            </span>
                        </span>
                    )}
                </div>
            </td>

            {/* Points Awarded Column */}
            <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-base">
                <span data-testid="result-points">{points}</span>{" "}
                <span className="text-[10px] text-neutral-500 font-normal">
                    PTS
                </span>
            </td>
        </tr>
    );
};
