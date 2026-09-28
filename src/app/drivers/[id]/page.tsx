import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { f1Client } from "@/lib/api/f1-client";
import {
    getDriverImage,
    getNationalityFlag,
    getTeamColor,
    DEFAULT_AVATARS,
} from "@/lib/utils/asset-helper";
import {
    ArrowLeft,
    Trophy,
    Flag,
    Calendar,
    Hash,
    ExternalLink,
    Shield,
    Award,
    Zap,
} from "lucide-react";
import { getDriverCareer } from "@/data/drivers-career";
import { DriverCareerTimeline } from "@/components/organisms/DriverCareerTimeline";

interface DriverDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: DriverDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const detail = await f1Client.getDriverDetails(id);

    if (!detail) {
        return {
            title: "Driver Not Found | F1 Hub",
        };
    }

    const { driver, team } = detail;
    const fullName = `${driver.givenName} ${driver.familyName}`;
    const teamName = team ? ` (${team.name})` : "";

    return {
        title: `${fullName}${teamName} - F1 Profile & Stats | F1 Hub`,
        description: `Official Formula 1 career statistics, biography, and championship standing for ${fullName}.`,
    };
}

export default async function DriverDetailPage({
    params,
}: DriverDetailPageProps) {
    const { id } = await params;
    const detail = await f1Client.getDriverDetails(id);

    if (!detail) {
        notFound();
    }

    const { driver, standing, team } = detail;
    const fullName = `${driver.givenName} ${driver.familyName}`;
    const raceNumber = driver.permanentNumber || driver.code || "–";
    const teamColor = getTeamColor(team?.constructorId);
    const flag = getNationalityFlag(driver.nationality);
    const driverImage = getDriverImage(driver.driverId);

    // Calculate age if dateOfBirth exists
    let age: number | null = null;
    if (driver.dateOfBirth) {
        const birthDate = new Date(driver.dateOfBirth);
        const diffMs = Date.now() - birthDate.getTime();
        age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }

    // Driver career progression and championship timeline
    const career = getDriverCareer(driver.driverId) || {
        driverId: driver.driverId,
        fullName,
        juniorTitles: [],
        f1Career: team
            ? [
                  {
                      years: "Current Season",
                      teamName: team.name,
                      constructorId: team.constructorId,
                      role: "Race Driver",
                      isCurrent: true,
                  },
              ]
            : [],
        juniorCareer: [
            {
                years: "Karting & Junior Series",
                category: "Junior Feeder Ladder",
                result: "Graduated to Formula 1 World Championship",
                isChampion: false,
            },
        ],
        careerSummary: `Active Formula 1 driver competing for ${team?.name || "Formula 1"}.`,
    };

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/drivers"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800"
                    >
                        <ArrowLeft className="w-4 h-4 text-f1-red" />
                        <span>Back to Drivers</span>
                    </Link>
                </div>

                {/* Driver Hero Card */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-10 mb-8 shadow-2xl">
                    {/* Top Team Color Accent Bar */}
                    <div
                        className="absolute top-0 left-0 right-0 h-2.5"
                        style={{ backgroundColor: teamColor }}
                    />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-2">
                        {/* Driver Headshot Portrait */}
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-neutral-800/90 border-4 border-neutral-700/60 p-1.5 shrink-0 shadow-xl">
                            <Image
                                src={driverImage}
                                alt={fullName}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full rounded-full"
                                unoptimized
                            />
                        </div>

                        {/* Driver Info Header */}
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
                                <span
                                    className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md text-white shadow-sm"
                                    style={{ backgroundColor: teamColor }}
                                >
                                    #{raceNumber}
                                </span>

                                <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                                    <span className="text-sm leading-none">
                                        {flag}
                                    </span>
                                    <span>{driver.nationality}</span>
                                </span>

                                {driver.code && (
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                                        {driver.code}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
                                {fullName}
                            </h1>

                            {team ? (
                                <Link
                                    href={`/teams/${team.constructorId}`}
                                    className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-neutral-300 hover:text-white transition-colors group"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: teamColor }}
                                    />
                                    <span>{team.name}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-f1-red transition-colors" />
                                </Link>
                            ) : (
                                <span className="text-sm text-neutral-500 italic">
                                    Unassigned / Reserve Driver
                                </span>
                            )}

                            {/* Wikipedia Reference Link */}
                            {driver.url && (
                                <a
                                    href={driver.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-f1-red transition-colors"
                                >
                                    <span>Read Biography on Wikipedia</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Championship Stats Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {/* Rank */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Championship Rank
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                                {standing?.position
                                    ? `P${standing.position}`
                                    : "–"}
                            </span>
                        </div>
                    </div>

                    {/* Total Points */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Season Points
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Zap className="w-5 h-5 text-cyan-400" />
                            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                                {standing?.points ?? "0"}
                            </span>
                        </div>
                    </div>

                    {/* Race Wins */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Season Wins
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Award className="w-5 h-5 text-f1-red" />
                            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                                {standing?.wins ?? "0"}
                            </span>
                        </div>
                    </div>

                    {/* Age / DOB */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Age / Birth Date
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                                {age ? `${age} yo` : "–"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Driver Career Progression & Junior Feeder Series Pathway */}
                <DriverCareerTimeline career={career} className="mb-8" />

                {/* Bio Data Details Card */}
                <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-f1-red" />
                        <span>Driver Information & Telemetry Specs</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between items-center py-2.5 border-b border-neutral-800/80">
                            <span className="text-neutral-400">
                                Driver Code
                            </span>
                            <span className="font-mono font-bold text-white">
                                {driver.code || "–"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-neutral-800/80">
                            <span className="text-neutral-400">
                                Permanent Number
                            </span>
                            <span className="font-mono font-bold text-white">
                                #{raceNumber}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-neutral-800/80">
                            <span className="text-neutral-400">
                                Date of Birth
                            </span>
                            <span className="font-mono text-white">
                                {driver.dateOfBirth || "Unknown"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 border-b border-neutral-800/80">
                            <span className="text-neutral-400">
                                Country of Origin
                            </span>
                            <span className="flex items-center gap-1.5 text-white font-medium">
                                <span>{flag}</span>
                                <span>{driver.nationality}</span>
                            </span>
                        </div>

                        {team && (
                            <div className="flex justify-between items-center py-2.5 border-b border-neutral-800/80 sm:col-span-2">
                                <span className="text-neutral-400">
                                    Constructor Team
                                </span>
                                <Link
                                    href={`/teams/${team.constructorId}`}
                                    className="font-bold text-f1-red hover:underline flex items-center gap-1"
                                >
                                    <span>{team.name}</span>
                                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
