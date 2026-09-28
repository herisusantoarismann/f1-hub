import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DriverStanding } from "@/types/standings";
import {
    getDriverImage,
    getTeamColor,
    getNationalityFlag,
} from "@/lib/utils/asset-helper";

interface DriverStandingRowProps {
    standing: DriverStanding;
}

export const DriverStandingRow: React.FC<DriverStandingRowProps> = ({
    standing,
}) => {
    const { position, points, wins, Driver: driver, Constructors } = standing;
    const team = Constructors?.[0];
    const teamColor = getTeamColor(team?.constructorId);
    const flag = getNationalityFlag(driver.nationality);
    const driverImg = getDriverImage(driver.driverId);

    const isP1 = position === "1";
    const isP2 = position === "2";
    const isP3 = position === "3";

    return (
        <tr
            data-testid={`driver-standing-row-${driver.driverId}`}
            className={`hover:bg-neutral-850/60 transition-colors group border-b border-neutral-800/60 ${
                isP1 ? "bg-amber-500/[0.04]" : ""
            }`}
        >
            {/* Position Column */}
            <td className="py-3.5 px-4 text-center font-mono font-bold text-sm w-16">
                <span
                    data-testid="standing-position-badge"
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                        isP1
                            ? "bg-amber-400 text-neutral-950 font-black shadow-md shadow-amber-400/20 ring-1 ring-amber-400/50"
                            : isP2
                              ? "bg-neutral-300 text-neutral-950 font-black"
                              : isP3
                                ? "bg-amber-700 text-white font-black"
                                : "text-neutral-400 font-medium"
                    }`}
                >
                    {position}
                </span>
            </td>

            {/* Driver Identity Column */}
            <td className="py-3.5 px-4">
                <Link
                    href={`/drivers/${driver.driverId}`}
                    className="inline-flex items-center gap-3 group-hover:text-f1-red transition-colors"
                >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/80 shadow-sm">
                        <Image
                            src={driverImg}
                            alt={`${driver.givenName} ${driver.familyName}`}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm leading-snug group-hover:text-f1-red transition-colors">
                            {driver.givenName} {driver.familyName}
                        </span>
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

            {/* Nationality Column */}
            <td className="py-3.5 px-4 hidden sm:table-cell text-xs font-medium text-neutral-300">
                <span className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{flag}</span>
                    <span>{driver.nationality}</span>
                </span>
            </td>

            {/* Constructor Column */}
            <td className="py-3.5 px-4 text-xs font-semibold text-neutral-200">
                {team ? (
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
                ) : (
                    <span className="text-neutral-500 italic">–</span>
                )}
            </td>

            {/* Wins Column */}
            <td className="py-3.5 px-4 text-center font-mono font-medium text-xs text-neutral-300 hidden md:table-cell">
                {wins}
            </td>

            {/* Points Column */}
            <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-base">
                <span data-testid="driver-points">{points}</span>{" "}
                <span className="text-[10px] text-neutral-500 font-normal">
                    PTS
                </span>
            </td>
        </tr>
    );
};
