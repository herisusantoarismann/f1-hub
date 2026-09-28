"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DriverWithTeam } from "@/types/f1";
import {
    getDriverImage,
    getNationalityFlag,
    getTeamColor,
    DEFAULT_AVATARS,
} from "@/lib/utils/asset-helper";
import { Trophy, ArrowUpRight } from "lucide-react";

export interface DriverCardProps {
    driver: DriverWithTeam;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
    const [imgSrc, setImgSrc] = useState<string>(() =>
        getDriverImage(driver.driverId),
    );

    const teamId = driver.team?.constructorId;
    const teamColor = getTeamColor(teamId);
    const flag = getNationalityFlag(driver.nationality);
    const fullName = `${driver.givenName} ${driver.familyName}`;
    const raceNumber = driver.permanentNumber || driver.code || "–";

    const handleImageError = () => {
        setImgSrc(DEFAULT_AVATARS.driver);
    };

    return (
        <Link
            href={`/drivers/${driver.driverId}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
            data-testid="driver-card"
        >
            {/* Team Color Top Accent Stripe */}
            <div
                className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                style={{ backgroundColor: teamColor }}
            />

            {/* Card Body */}
            <div className="flex flex-col p-5 flex-1">
                {/* Header: Racing Number & Position Badge */}
                <div className="flex items-center justify-between mb-4">
                    <span
                        className="text-2xl font-black font-mono tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ color: teamColor }}
                        data-testid="driver-number"
                    >
                        #{raceNumber}
                    </span>

                    {driver.isReserve ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Cadangan
                        </span>
                    ) : driver.position ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                            <Trophy className="w-3 h-3 text-amber-400" />P
                            {driver.position}
                        </span>
                    ) : null}
                </div>

                {/* Driver Photo & Avatar Container */}
                <div className="relative w-full aspect-square max-w-[140px] mx-auto mb-4 rounded-full overflow-hidden bg-neutral-800/80 border-2 border-neutral-700/60 p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={imgSrc}
                        alt={fullName}
                        width={140}
                        height={140}
                        className="object-cover w-full h-full rounded-full"
                        onError={handleImageError}
                        unoptimized
                    />
                </div>

                {/* Driver Identity */}
                <div className="flex flex-col text-center flex-1 justify-between">
                    <div>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mb-1">
                            <span className="text-base leading-none">
                                {flag}
                            </span>
                            <span className="font-medium tracking-wide uppercase text-[10px]">
                                {driver.nationality}
                            </span>
                        </div>

                        <h3
                            className="text-base font-extrabold text-white group-hover:text-f1-red transition-colors line-clamp-1"
                            data-testid="driver-name"
                        >
                            {fullName}
                        </h3>

                        {driver.team ? (
                            <p
                                className="text-xs font-semibold text-neutral-400 mt-1 line-clamp-1 flex items-center justify-center gap-1.5"
                                data-testid="driver-team"
                            >
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: teamColor }}
                                />
                                {driver.team.name}
                            </p>
                        ) : (
                            <p
                                className="text-xs text-neutral-500 mt-1 italic"
                                data-testid="driver-team"
                            >
                                Free Agent / Unassigned
                            </p>
                        )}
                    </div>

                    {/* Footer Stats / CTA */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                        <span>
                            {driver.points ? (
                                <strong className="text-white font-mono">
                                    {driver.points} PTS
                                </strong>
                            ) : (
                                <span className="font-mono text-neutral-500">
                                    0 PTS
                                </span>
                            )}
                        </span>

                        <span className="flex items-center gap-0.5 text-f1-red font-medium group-hover:translate-x-0.5 transition-transform">
                            <span>Profile</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
