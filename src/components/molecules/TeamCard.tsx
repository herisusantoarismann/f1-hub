"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConstructorWithDetails } from "@/types/f1";
import {
    getTeamLogo,
    getTeamColor,
    getNationalityFlag,
    DEFAULT_AVATARS,
} from "@/lib/utils/asset-helper";
import { Trophy, ArrowUpRight, Shield } from "lucide-react";

export interface TeamCardProps {
    team: ConstructorWithDetails;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
    const [logoSrc, setLogoSrc] = useState<string>(() =>
        getTeamLogo(team.constructorId),
    );

    const teamColor = getTeamColor(team.constructorId);
    const flag = getNationalityFlag(team.nationality);
    const standing = team.standing;

    const handleLogoError = () => {
        setLogoSrc(DEFAULT_AVATARS.team);
    };

    return (
        <Link
            href={`/teams/${team.constructorId}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
            data-testid="team-card"
        >
            {/* Top Team Color Accent Line */}
            <div
                className="h-2 w-full transition-all duration-300 group-hover:h-2.5"
                style={{ backgroundColor: teamColor }}
            />

            <div className="flex flex-col p-6 flex-1 justify-between">
                {/* Header with Rank & Logo */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                            <span className="text-base leading-none">
                                {flag}
                            </span>
                            <span className="font-medium tracking-wide uppercase text-[10px]">
                                {team.nationality}
                            </span>
                        </div>
                        <h3
                            className="text-lg font-black text-white group-hover:text-f1-red transition-colors line-clamp-1"
                            data-testid="team-name"
                        >
                            {team.name}
                        </h3>
                    </div>

                    {/* Logo Thumbnail (Clean White Container for Optimal Contrast) */}
                    <div className="relative w-12 h-12 rounded-xl bg-white border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                        <Image
                            src={logoSrc}
                            alt={`${team.name} logo`}
                            width={40}
                            height={40}
                            className="object-contain max-h-full"
                            onError={handleLogoError}
                            unoptimized
                        />
                    </div>
                </div>

                {/* Team Standings / Stats Bar */}
                <div className="grid grid-cols-2 gap-2 my-2 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                            Championship
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-sm font-black font-mono text-white">
                                {standing?.position
                                    ? `P${standing.position}`
                                    : "–"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                            Total Points
                        </span>
                        <span className="text-sm font-black font-mono text-white mt-0.5 block">
                            {standing?.points ?? "0"}{" "}
                            <span className="text-[10px] font-normal text-neutral-400">
                                PTS
                            </span>
                        </span>
                    </div>
                </div>

                {/* Footer with Card CTA */}
                <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Shield className="w-3.5 h-3.5 text-neutral-500" />
                        <span>F1 Constructor</span>
                    </span>

                    <span className="flex items-center gap-0.5 text-f1-red font-medium group-hover:translate-x-0.5 transition-transform">
                        <span>Lihat Profil Tim</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
};
