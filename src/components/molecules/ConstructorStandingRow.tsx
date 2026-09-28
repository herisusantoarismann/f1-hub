import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConstructorStanding } from "@/types/standings";
import {
    getTeamLogo,
    getTeamColor,
    getNationalityFlag,
} from "@/lib/utils/asset-helper";

interface ConstructorStandingRowProps {
    standing: ConstructorStanding;
}

export const ConstructorStandingRow: React.FC<ConstructorStandingRowProps> = ({
    standing,
}) => {
    const { position, points, wins, Constructor: team } = standing;
    const teamLogo = getTeamLogo(team.constructorId);
    const teamColor = getTeamColor(team.constructorId);
    const flag = getNationalityFlag(team.nationality);

    const isP1 = position === "1";
    const isP2 = position === "2";
    const isP3 = position === "3";

    return (
        <tr
            data-testid={`constructor-standing-row-${team.constructorId}`}
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

            {/* Team Identity Column */}
            <td className="py-3.5 px-4">
                <Link
                    href={`/teams/${team.constructorId}`}
                    className="inline-flex items-center gap-3 group-hover:text-f1-red transition-colors"
                >
                    {/* White Emblem Tile for transparent or dark logos */}
                    <div className="relative w-9 h-9 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-sm border border-white/20">
                        <Image
                            src={teamLogo}
                            alt={`${team.name} logo`}
                            width={28}
                            height={28}
                            className="object-contain max-h-full w-auto"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm leading-snug group-hover:text-f1-red transition-colors flex items-center gap-2">
                            <span>{team.name}</span>
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: teamColor }}
                                aria-hidden="true"
                            />
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 sm:hidden">
                            {flag} {team.nationality}
                        </span>
                    </div>
                </Link>
            </td>

            {/* Nationality Column */}
            <td className="py-3.5 px-4 hidden sm:table-cell text-xs font-medium text-neutral-300">
                <span className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{flag}</span>
                    <span>{team.nationality}</span>
                </span>
            </td>

            {/* Wins Column */}
            <td className="py-3.5 px-4 text-center font-mono font-medium text-xs text-neutral-300 hidden md:table-cell">
                {wins}
            </td>

            {/* Points Column */}
            <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-base">
                <span data-testid="constructor-points">{points}</span>{" "}
                <span className="text-[10px] text-neutral-500 font-normal">
                    PTS
                </span>
            </td>
        </tr>
    );
};
