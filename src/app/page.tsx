import React from "react";
import Link from "next/link";
import Image from "next/image";
import { f1Client } from "@/lib/api/f1-client";
import { RaceCountdown } from "@/components/molecules/RaceCountdown";
import {
    getDriverImage,
    getTeamLogo,
    getTeamColor,
    getNationalityFlag,
} from "@/lib/utils/asset-helper";
import {
    Calendar,
    ChevronRight,
    Trophy,
    BookOpen,
    Users,
    Shield,
    ArrowRight,
    Flame,
    Flag,
} from "lucide-react";

export const revalidate = 1800; // 30 minutes static revalidation

export default async function HomePage() {
    // Parallel RSC data fetching
    const [nextRaceData, driverStandings, constructorStandings, fullSchedule] =
        await Promise.all([
            f1Client.getNextRace().catch(() => null),
            f1Client.getDriverStandings("current").catch(() => []),
            f1Client.getConstructorStandings("current").catch(() => []),
            f1Client.getSeasonSchedule("current").catch(() => []),
        ]);

    // Fallback to the first scheduled race if nextRace is unavailable
    const nextRace = nextRaceData || fullSchedule[0] || null;

    // Extract top 3 leaders
    const topDrivers = driverStandings.slice(0, 3);
    const topConstructors = constructorStandings.slice(0, 3);

    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
            <div className="container mx-auto max-w-7xl space-y-16 sm:space-y-20">
                {/* SECTION 1: HERO BANNER & NEXT RACE COUNTDOWN */}
                <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-12 shadow-2xl">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-96 w-96 rounded-full bg-f1-red/15 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-20 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left Side: Countdown & Next GP */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-f1-red/30 bg-f1-red/10 px-3.5 py-1 text-xs font-semibold text-f1-red">
                                <Flame className="w-3.5 h-3.5 fill-current" />
                                <span>NEXT GRAND PRIX SPOTLIGHT</span>
                            </div>

                            {nextRace ? (
                                <RaceCountdown
                                    date={nextRace.date}
                                    time={nextRace.time}
                                    raceName={nextRace.raceName}
                                    circuitName={nextRace.Circuit.circuitName}
                                    country={nextRace.Circuit.Location.country}
                                    round={nextRace.round}
                                />
                            ) : (
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white">
                                        Formula 1 World Championship
                                    </h2>
                                    <p className="text-sm text-neutral-400">
                                        Stay tuned for upcoming Grand Prix dates
                                        and official FIA timetables.
                                    </p>
                                </div>
                            )}

                            {/* Quick Action CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link
                                    href="/schedule"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-f1-red hover:bg-f1-darkred text-white text-xs sm:text-sm font-bold shadow-lg shadow-f1-red/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Full Race Calendar</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/standings"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 text-neutral-200 hover:text-white text-xs sm:text-sm font-semibold border border-neutral-700/80 backdrop-blur-md transition-all"
                                >
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span>Championship Standings</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side: High-Impact Motorsport Teaser Card */}
                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-6 space-y-4 backdrop-blur-md shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Flag className="w-4 h-4 text-f1-red" />
                                        Championship Overview
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold">
                                        2026 SEASON
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                    Track driver and constructor title battles,
                                    Grand Prix timetables, team line-ups, and
                                    the revolutionary 2026 technical regulations
                                    throughout the motorsport season.
                                </p>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80 text-center font-mono">
                                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                                        <span className="text-[10px] text-neutral-400 block uppercase">
                                            Rounds Scheduled
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {fullSchedule.length || 24}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                                        <span className="text-[10px] text-neutral-400 block uppercase">
                                            Active Teams
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {constructorStandings.length || 10}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: CHAMPIONSHIP LEADERS SNAPSHOT (2 COLUMNS) */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                                    World Title Fight
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Championship Leaders Snapshot
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                                Top contenders battling for the Drivers&apos;
                                and Constructors&apos; crowns.
                            </p>
                        </div>

                        <Link
                            href="/standings"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-f1-red hover:underline self-start sm:self-auto group"
                        >
                            <span>View Full Standings</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Column 1: Top 3 Drivers */}
                        <div className="flex flex-col rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 shadow-xl">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span>Top 3 Drivers</span>
                                </h3>
                                <Link
                                    href="/drivers"
                                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                                >
                                    All Drivers &rarr;
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {topDrivers.map((st, index) => {
                                    const driver = st.Driver;
                                    const team = st.Constructors[0];
                                    const teamColor = getTeamColor(
                                        team?.constructorId,
                                    );
                                    const flag = getNationalityFlag(
                                        driver.nationality,
                                    );
                                    const driverImg = getDriverImage(
                                        driver.driverId,
                                    );
                                    const isLeader = index === 0;

                                    return (
                                        <Link
                                            key={driver.driverId}
                                            href={`/drivers/${driver.driverId}`}
                                            className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                                                isLeader
                                                    ? "bg-neutral-900 border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                                                    : "bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {/* Rank Badge */}
                                                <span
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                                        isLeader
                                                            ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/30"
                                                            : index === 1
                                                              ? "bg-neutral-300 text-neutral-950"
                                                              : "bg-amber-700 text-white"
                                                    }`}
                                                >
                                                    P{st.position}
                                                </span>

                                                {/* Headshot */}
                                                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                                                    <Image
                                                        src={driverImg}
                                                        alt={`${driver.givenName} ${driver.familyName}`}
                                                        width={44}
                                                        height={44}
                                                        className="object-cover w-full h-full"
                                                        unoptimized
                                                    />
                                                </div>

                                                {/* Name & Team */}
                                                <div>
                                                    <span className="font-bold text-sm text-white group-hover:text-f1-red transition-colors flex items-center gap-1.5">
                                                        <span>
                                                            {driver.givenName}{" "}
                                                            {driver.familyName}
                                                        </span>
                                                        <span className="text-xs">
                                                            {flag}
                                                        </span>
                                                    </span>
                                                    <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                                                        <span
                                                            className="w-2 h-2 rounded-full shrink-0"
                                                            style={{
                                                                backgroundColor:
                                                                    teamColor,
                                                            }}
                                                        />
                                                        <span className="truncate max-w-[140px] sm:max-w-[200px]">
                                                            {team?.name ||
                                                                "Independent"}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Points */}
                                            <div className="text-right">
                                                <span className="font-mono font-black text-base text-white block">
                                                    {st.points}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                                                    PTS
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Column 2: Top 3 Constructors */}
                        <div className="flex flex-col rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 shadow-xl">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-f1-red" />
                                    <span>Top 3 Constructors</span>
                                </h3>
                                <Link
                                    href="/teams"
                                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                                >
                                    All Teams &rarr;
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {topConstructors.map((st, index) => {
                                    const team = st.Constructor;
                                    const teamColor = getTeamColor(
                                        team.constructorId,
                                    );
                                    const teamLogo = getTeamLogo(
                                        team.constructorId,
                                    );
                                    const flag = getNationalityFlag(
                                        team.nationality,
                                    );
                                    const isLeader = index === 0;

                                    return (
                                        <Link
                                            key={team.constructorId}
                                            href={`/teams/${team.constructorId}`}
                                            className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                                                isLeader
                                                    ? "bg-neutral-900 border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                                                    : "bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {/* Rank Badge */}
                                                <span
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                                        isLeader
                                                            ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/30"
                                                            : index === 1
                                                              ? "bg-neutral-300 text-neutral-950"
                                                              : "bg-amber-700 text-white"
                                                    }`}
                                                >
                                                    P{st.position}
                                                </span>

                                                {/* White Emblem Tile */}
                                                <div className="relative w-11 h-11 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-md border border-white/20">
                                                    <Image
                                                        src={teamLogo}
                                                        alt={`${team.name} logo`}
                                                        width={32}
                                                        height={32}
                                                        className="object-contain max-h-full w-auto"
                                                        unoptimized
                                                    />
                                                </div>

                                                {/* Name & Origin */}
                                                <div>
                                                    <span className="font-bold text-sm text-white group-hover:text-f1-red transition-colors flex items-center gap-1.5">
                                                        <span>{team.name}</span>
                                                        <span className="text-xs">
                                                            {flag}
                                                        </span>
                                                    </span>
                                                    <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                                                        <span
                                                            className="w-2 h-2 rounded-full shrink-0"
                                                            style={{
                                                                backgroundColor:
                                                                    teamColor,
                                                            }}
                                                        />
                                                        <span>
                                                            {team.nationality}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Points */}
                                            <div className="text-right">
                                                <span className="font-mono font-black text-base text-white block">
                                                    {st.points}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                                                    PTS
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: KNOWLEDGE & DIRECTORY FAST TRACK */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Motorsport Knowledge & Directory
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                            Explore the upcoming 2026 technical regulations,
                            full season calendar, and constructor portfolios.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1: 2026 Regulations */}
                        <Link
                            href="/regulations"
                            className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 relative overflow-hidden"
                        >
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                                        FIA Technical Directive
                                    </span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        2026 Engine & Aero Era
                                    </h3>
                                </div>

                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                    Examine the massive shift to 350kW MGU-K
                                    electrical output, 100% sustainable fuels,
                                    active aerodynamic modes, and the removal of
                                    MGU-H.
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                                <span>Read Regulation Guide</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Feature 2: 2026 Race Calendar */}
                        <Link
                            href="/schedule"
                            className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 relative overflow-hidden"
                        >
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                    <Calendar className="w-6 h-6" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                                        FIA World Tour
                                    </span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        Grand Prix Calendar
                                    </h3>
                                </div>

                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                    Explore all scheduled race dates, circuit
                                    layouts, session timetables, and track
                                    characteristics across the world
                                    championship.
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                                <span>View Full Calendar</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Feature 3: Team & Driver Directory */}
                        <Link
                            href="/teams"
                            className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 relative overflow-hidden"
                        >
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-f1-red/10 border border-f1-red/20 text-f1-red flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-f1-red font-bold block">
                                        Championship Grid
                                    </span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-f1-red transition-colors">
                                        Teams & Drivers Directory
                                    </h3>
                                </div>

                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                    Access biographies, racing numbers, national
                                    origins, constructor headquarters, and
                                    official lineups across all Formula 1 teams.
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-f1-red">
                                <span>Explore Directory</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
