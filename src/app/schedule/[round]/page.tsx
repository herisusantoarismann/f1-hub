import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { f1Client } from "@/lib/api/f1-client";
import { CircuitInfoCard } from "@/components/molecules/CircuitInfoCard";
import { RaceResultTable } from "@/components/organisms/RaceResultTable";
import { RaceCountdown } from "@/components/molecules/RaceCountdown";
import {
    Calendar,
    Clock,
    ChevronLeft,
    Flag,
    Zap,
    Trophy,
    CheckCircle,
} from "lucide-react";

interface RacePageProps {
    params: Promise<{
        round: string;
    }>;
}

export const revalidate = 3600; // 1 hour revalidation

export async function generateMetadata({
    params,
}: RacePageProps): Promise<Metadata> {
    const { round } = await params;
    const race = await f1Client.getRaceDetails(round);

    if (!race) {
        return {
            title: "Grand Prix Not Found | F1 Hub",
        };
    }

    return {
        title: `${race.raceName} (Round ${race.round}) | F1 Hub`,
        description: `Official circuit profile, timetable, and race results for the Formula 1 ${race.raceName} at ${race.Circuit.circuitName}.`,
    };
}

export default async function RaceDetailPage({ params }: RacePageProps) {
    const { round } = await params;

    // Parallel fetch: race metadata and classification results
    const [race, results] = await Promise.all([
        f1Client.getRaceDetails(round),
        f1Client.getRaceResults(round),
    ]);

    if (!race) {
        notFound();
    }

    const hasResults = results.length > 0;

    // Format session helper
    const formatSessionDate = (dateStr?: string, timeStr?: string) => {
        if (!dateStr) return null;
        try {
            const d = new Date(`${dateStr}T${timeStr || "12:00:00Z"}`);
            return {
                day: new Intl.DateTimeFormat("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                }).format(d),
                time: timeStr ? timeStr.slice(0, 5) + " UTC" : "TBD",
            };
        } catch {
            return { day: dateStr, time: timeStr || "TBD" };
        }
    };

    const sessions = [
        {
            name: "Practice 1",
            data: race.FirstPractice,
            isSprint: false,
        },
        {
            name: race.SprintQualifying ? "Sprint Qualifying" : "Practice 2",
            data: race.SprintQualifying || race.SecondPractice,
            isSprint: Boolean(race.SprintQualifying),
        },
        {
            name: race.Sprint ? "Sprint Race" : "Practice 3",
            data: race.Sprint || race.ThirdPractice,
            isSprint: Boolean(race.Sprint),
        },
        {
            name: "Qualifying",
            data: race.Qualifying,
            isSprint: false,
        },
        {
            name: "Grand Prix (Main Race)",
            data: { date: race.date, time: race.time },
            isSprint: false,
            isMainRace: true,
        },
    ].filter((s) => s.data?.date);

    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="container mx-auto max-w-7xl space-y-10">
                {/* Back to Calendar Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/schedule"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Race Calendar</span>
                    </Link>

                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                        Season {race.season} • Round {race.round}
                    </span>
                </div>

                {/* Circuit Info Showcase Card */}
                <CircuitInfoCard
                    circuit={race.Circuit}
                    round={race.round}
                    raceName={race.raceName}
                    totalLaps={
                        results[0]?.laps
                            ? parseInt(results[0].laps, 10)
                            : undefined
                    }
                />

                {/* Scenario A: Results Available (Race Finished) */}
                {hasResults ? (
                    <div className="space-y-10">
                        {/* Winner Spotlight Banner */}
                        <div className="relative overflow-hidden rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                                        Grand Prix Winner
                                    </span>
                                    <h4 className="text-lg font-bold text-white">
                                        {results[0].Driver.givenName}{" "}
                                        {results[0].Driver.familyName}{" "}
                                        <span className="text-xs text-neutral-400 font-normal">
                                            ({results[0].Constructor.name})
                                        </span>
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs font-mono">
                                <div className="text-right">
                                    <span className="text-neutral-400 block text-[10px]">
                                        WINNING TIME
                                    </span>
                                    <span className="text-white font-bold text-sm">
                                        {results[0].Time?.time ||
                                            results[0].status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Full Classification Table */}
                        <RaceResultTable
                            results={results}
                            raceName={race.raceName}
                        />
                    </div>
                ) : (
                    /* Scenario B: Race Not Yet Held (Upcoming Session Timetable & Countdown) */
                    <div className="space-y-8">
                        {/* Countdown to Grand Prix */}
                        <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-md">
                            <div className="max-w-3xl space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-f1-red/30 bg-f1-red/10 px-3 py-0.5 text-xs font-semibold text-f1-red">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>UPCOMING GRAND PRIX COUNTDOWN</span>
                                </div>
                                <RaceCountdown
                                    date={race.date}
                                    time={race.time}
                                    raceName={race.raceName}
                                    circuitName={race.Circuit.circuitName}
                                    country={race.Circuit.Location.country}
                                    round={race.round}
                                />
                            </div>
                        </section>

                        {/* Full Weekend Session Timetable */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-f1-red" />
                                    <span>Weekend Session Timetable</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                                    Official FIA schedule across practice,
                                    qualifying, and race day.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sessions.map((session, index) => {
                                    const formatted = formatSessionDate(
                                        session.data?.date,
                                        session.data?.time,
                                    );

                                    return (
                                        <div
                                            key={session.name}
                                            className={`p-4 rounded-2xl border transition-all ${
                                                session.isMainRace
                                                    ? "bg-neutral-900/90 border-f1-red/50 shadow-lg shadow-f1-red/5 ring-1 ring-f1-red/30"
                                                    : session.isSprint
                                                      ? "bg-neutral-900/70 border-purple-800/40"
                                                      : "bg-neutral-950/70 border-neutral-800/80"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                                                    Session {index + 1}
                                                </span>
                                                {session.isSprint && (
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                                                        <Zap className="w-2.5 h-2.5 fill-current" />
                                                        SPRINT
                                                    </span>
                                                )}
                                                {session.isMainRace && (
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-f1-red/20 text-f1-red border border-f1-red/40 font-bold">
                                                        MAIN RACE
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-sm font-bold text-white mb-2">
                                                {session.name}
                                            </h4>

                                            <div className="flex items-center justify-between text-xs font-mono text-neutral-300 pt-2 border-t border-neutral-800/60">
                                                <span>{formatted?.day}</span>
                                                <span className="text-neutral-400 font-semibold">
                                                    {formatted?.time}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
