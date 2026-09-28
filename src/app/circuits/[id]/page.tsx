import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { f1Client } from "@/lib/api/f1-client";
import { getCircuitTechSpecs } from "@/data/circuits-tech";
import { getCircuitDatabase, CircuitProfile } from "@/data/circuits-database";
import { getNationalityFlag } from "@/lib/utils/asset-helper";
import { CircuitStatsGrid } from "@/components/molecules/CircuitStatsGrid";
import { CircuitInteractiveSimulator } from "@/components/organisms/CircuitInteractiveSimulator";
import { IconicTurnsList } from "@/components/molecules/IconicTurnsList";
import { TrackSpecsBadge } from "@/components/molecules/TrackSpecsBadge";
import {
    ChevronLeft,
    MapPin,
    Milestone,
    Calendar,
    ArrowRight,
    Wind,
    Disc,
    Fuel,
    CornerDownRight,
    RotateCcw,
} from "lucide-react";

interface CircuitDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({
    params,
}: CircuitDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const db = getCircuitDatabase(id);
    const circuit = await f1Client.getCircuitDetails(id);

    if (!circuit && !db) {
        return {
            title: "Circuit Not Found | F1 Hub",
        };
    }

    const titleName = db?.officialName || circuit?.circuitName || "Circuit";
    const countryName = db?.country || circuit?.Location.country || "Formula 1";

    return {
        title: `${titleName} Profile & Historic Heritage | F1 Hub`,
        description: `Explore track telemetry, lap record, Overtake zones, iconic turns, and World Championship history for ${titleName} in ${countryName}.`,
    };
}

export default async function CircuitDetailPage({
    params,
}: CircuitDetailPageProps) {
    const { id } = await params;

    // Parallel fetch circuit details and full season schedule for cross-link discovery
    const [rawCircuit, schedule] = await Promise.all([
        f1Client.getCircuitDetails(id),
        f1Client.getSeasonSchedule("current").catch(() => []),
    ]);

    const dbProfile =
        getCircuitDatabase(id) ||
        (rawCircuit ? getCircuitDatabase(rawCircuit.circuitId) : undefined);

    // Guaranteed circuit object even if external API has a temporary downtime or missing endpoint
    const circuit =
        rawCircuit ||
        (dbProfile
            ? {
                  circuitId: dbProfile.circuitId,
                  circuitName: dbProfile.officialName,
                  Location: {
                      lat: "40.468",
                      long: "-3.619",
                      locality: dbProfile.locality,
                      country: dbProfile.country,
                  },
                  url: "https://en.wikipedia.org/wiki/Formula_One",
              }
            : null);

    if (!circuit) {
        notFound();
    }

    const techSpecs = getCircuitTechSpecs(circuit.circuitId);
    const flag = getNationalityFlag(circuit.Location.country);

    // Guaranteed complete circuit profile
    const profile: CircuitProfile = dbProfile || {
        circuitId: circuit.circuitId,
        officialName: circuit.circuitName,
        locality: circuit.Location.locality,
        country: circuit.Location.country,
        lengthKm: techSpecs.lengthKm,
        turns: techSpecs.turns,
        drsZones: techSpecs.drsZones,
        firstGrandPrix: 1950,
        racesHeld: 1,
        lapRecord: {
            time: techSpecs.lapRecord.time,
            driver: techSpecs.lapRecord.driver,
            team: techSpecs.lapRecord.team,
            year: techSpecs.lapRecord.year,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 1,
            team: "Ferrari",
            teamWins: 1,
        },
        iconicTurns: [],
        description: techSpecs.description,
    };

    // Cross-link: find if this circuit is scheduled for a Grand Prix this season
    const matchingRace = schedule.find(
        (r) => r.Circuit.circuitId === circuit.circuitId,
    );

    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="container mx-auto max-w-7xl space-y-10">
                {/* Back to Circuits Breadcrumbs */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/circuits"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>All Circuits</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold uppercase tracking-wider">
                            {techSpecs.type} Circuit
                        </span>
                    </div>
                </div>

                {/* Circuit Header Hero Section */}
                <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-10 shadow-2xl">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-f1-red/30 bg-f1-red/10 px-3.5 py-1 text-xs font-semibold text-f1-red">
                                <Milestone className="w-3.5 h-3.5" />
                                <span>FIA HOMOLOGATED GRADE 1</span>
                            </div>

                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                                    <span>{profile.officialName}</span>
                                    <span className="text-2xl sm:text-3xl leading-none">
                                        {flag}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-neutral-400 mt-2 flex-wrap">
                                    <MapPin className="w-4 h-4 text-f1-red shrink-0" />
                                    <span>
                                        {circuit.Location.locality},{" "}
                                        {circuit.Location.country}
                                    </span>
                                    <span className="text-neutral-600">•</span>
                                    <span className="font-mono text-xs">
                                        GPS:{" "}
                                        {Number(circuit.Location.lat).toFixed(
                                            3,
                                        )}
                                        °N,{" "}
                                        {Number(circuit.Location.long).toFixed(
                                            3,
                                        )}
                                        °E
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                {profile.description || techSpecs.description}
                            </p>

                            {/* Cross link CTA if part of calendar */}
                            {matchingRace && (
                                <div className="pt-2">
                                    <Link
                                        href={`/schedule/${matchingRace.round}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-f1-red hover:bg-f1-darkred text-white text-xs sm:text-sm font-bold shadow-lg shadow-f1-red/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            View {matchingRace.raceName}{" "}
                                            Schedule & Results
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Top Highlights Badge */}
                        <div className="shrink-0 flex flex-col gap-3 font-mono">
                            <TrackSpecsBadge
                                downforce={techSpecs.downforce}
                                drsZones={profile.drsZones}
                                tyreStress={techSpecs.tyreStress}
                            />
                        </div>
                    </div>
                </section>

                {/* 4-Tile Historical & Record Stats Grid */}
                <CircuitStatsGrid profile={profile} />

                {/* Interactive 2D Circuit Simulator with Live Telemetry & Elevation Profile */}
                <CircuitInteractiveSimulator profile={profile} />

                {/* Iconic Turns Breakdown */}
                {profile.iconicTurns.length > 0 && (
                    <IconicTurnsList turns={profile.iconicTurns} />
                )}

                {/* Technical Engineering & Aerodynamics Specification Grid */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-f1-red" />
                        <span>Engineering & Race Demands</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 font-mono text-xs">
                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Milestone className="w-3.5 h-3.5 text-f1-red" />
                                Track Length
                            </span>
                            <span className="text-base font-bold text-white">
                                {profile.lengthKm.toFixed(3)} km
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                                Total Corners
                            </span>
                            <span className="text-base font-bold text-white">
                                {techSpecs.turns} ({techSpecs.turnsLeft}L /{" "}
                                {techSpecs.turnsRight}R)
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                                GP Laps
                            </span>
                            <span className="text-base font-bold text-white">
                                {techSpecs.laps} Laps
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                                Downforce
                            </span>
                            <span className="text-base font-bold text-white">
                                {techSpecs.downforce} Level
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Disc className="w-3.5 h-3.5 text-rose-400" />
                                Tyre Stress
                            </span>
                            <span className="text-base font-bold text-white">
                                {techSpecs.tyreStress} / 5
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Fuel className="w-3.5 h-3.5 text-orange-400" />
                                Fuel Load
                            </span>
                            <span className="text-base font-bold text-white">
                                {techSpecs.fuelConsumption}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
