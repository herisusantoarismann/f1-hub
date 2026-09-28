"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DriverPerformanceProfile } from "@/data/drivers-ratings";
import {
    getDriverImage,
    getNationalityFlag,
    getTeamLogo,
} from "@/lib/utils/asset-helper";
import { ChevronDown, Shield, Trophy } from "lucide-react";

interface DriverSelectorCardProps {
    slotLabel: string; // e.g. "Contender A" or "Driver 1"
    driver: DriverPerformanceProfile;
    availableDrivers: DriverPerformanceProfile[];
    onSelectDriver: (driverId: string) => void;
    accentColor: string;
    className?: string;
}

export const DriverSelectorCard: React.FC<DriverSelectorCardProps> = ({
    slotLabel,
    driver,
    availableDrivers,
    onSelectDriver,
    accentColor,
    className = "",
}) => {
    const [imgSrc, setImgSrc] = useState(getDriverImage(driver.driverId));
    const flag = getNationalityFlag(driver.nationality);
    const teamLogo = getTeamLogo(driver.constructorId);

    // Sync image when driver changes
    React.useEffect(() => {
        setImgSrc(getDriverImage(driver.driverId));
    }, [driver.driverId]);

    return (
        <div
            data-testid={`driver-selector-${driver.driverId}`}
            className={`relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 backdrop-blur-md transition-all hover:border-neutral-700/80 ${className}`}
        >
            {/* Top Accent Gradient Line */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-colors"
                style={{ backgroundColor: accentColor }}
            />

            {/* Slot Label & Dropdown Selector */}
            <div className="flex items-center justify-between gap-3 mb-4 font-mono">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                    />
                    {slotLabel}
                </span>

                {/* Driver Picker Select Dropdown */}
                <div className="relative">
                    <select
                        value={driver.driverId}
                        onChange={(e) => onSelectDriver(e.target.value)}
                        data-testid="driver-dropdown-select"
                        className="appearance-none bg-neutral-950 hover:bg-neutral-800/80 text-white font-mono text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border border-neutral-800 focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer"
                    >
                        {availableDrivers.map((d) => (
                            <option key={d.driverId} value={d.driverId}>
                                {d.fullName} ({d.code}) - {d.teamName}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            {/* Driver Profile Header */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Driver Headshot with Circular Glow */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-950 border border-neutral-800 p-1 shrink-0 overflow-hidden group">
                    <div
                        className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                        style={{
                            background: `radial-gradient(circle at center, ${accentColor}, transparent 70%)`,
                        }}
                    />
                    <Image
                        src={imgSrc}
                        alt={driver.fullName}
                        fill
                        className="object-cover object-top"
                        onError={() =>
                            setImgSrc("/images/drivers/default_driver.svg")
                        }
                        unoptimized
                    />
                </div>

                {/* Driver Name, Number & Team */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                            {driver.fullName}
                        </span>
                        <span className="text-xl sm:text-2xl">{flag}</span>
                    </div>

                    {/* Team Badge & Driver Number */}
                    <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                        <span
                            className="px-2 py-0.5 rounded-lg text-white font-black text-[11px] shrink-0"
                            style={{ backgroundColor: accentColor }}
                        >
                            #{driver.permanentNumber}
                        </span>

                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 truncate">
                            <div className="relative w-3.5 h-3.5 shrink-0">
                                <Image
                                    src={teamLogo}
                                    alt={driver.teamName}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLElement
                                        ).style.display = "none";
                                    }}
                                    unoptimized
                                />
                            </div>
                            <span className="truncate">{driver.teamName}</span>
                        </div>
                    </div>

                    {/* Overall Rating Pill */}
                    <div className="pt-1 flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 font-mono text-xs">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-neutral-400">OVERALL:</span>
                            <span className="text-sm font-black text-white">
                                {driver.overallRating}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                                /100
                            </span>
                        </div>

                        {driver.careerStats.worldChampionships > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-[11px] font-bold text-amber-300">
                                <Trophy className="w-3 h-3 fill-current" />
                                {driver.careerStats.worldChampionships}x WDC
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Racing Style & Key Strengths Chips */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Racing Style:</span>
                    <span className="text-neutral-300 font-bold">
                        {driver.analystSummary.racingStyle}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {driver.analystSummary.strengths
                        .slice(0, 2)
                        .map((str, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800/90 text-neutral-400 text-[10px]"
                            >
                                &bull; {str}
                            </span>
                        ))}
                </div>
            </div>
        </div>
    );
};
