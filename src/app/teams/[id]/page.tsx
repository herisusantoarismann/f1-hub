import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { f1Client } from "@/lib/api/f1-client";
import {
    getTeamLogo,
    getTeamColor,
    getNationalityFlag,
    getDriverImage,
    DEFAULT_AVATARS,
} from "@/lib/utils/asset-helper";
import { getTeamTechnicalProfile } from "@/data/teams-database";
import {
    ArrowLeft,
    Trophy,
    Shield,
    ExternalLink,
    Users,
    Zap,
    Award,
    Building2,
    Calendar,
    MapPin,
    Wrench,
    Gauge,
    CheckCircle2,
    Sparkles,
    Briefcase,
    Cpu,
    Flame,
    Box,
} from "lucide-react";

interface TeamDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: TeamDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const constructor = await f1Client.getConstructor(id);
        const techProfile = getTeamTechnicalProfile(id);
        const name =
            techProfile?.officialTeamName || constructor?.name || "Profil Tim";
        return {
            title: `${name} | F1 Hub`,
            description: `Profil teknis, spesifikasi sasis 2026, markas pusat, dan struktur manajerial ${name} di FIA Formula 1 World Championship.`,
        };
    } catch {
        return {
            title: "Profil Tim | F1 Hub",
        };
    }
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
    const { id } = await params;

    let constructorData = null;
    let standingsData: any[] = [];
    let driversData: any[] = [];

    try {
        const [constructorRes, standingsRes, driversRes] = await Promise.all([
            f1Client.getConstructor(id),
            f1Client.getConstructorStandings(),
            f1Client.getDrivers(),
        ]);

        constructorData = constructorRes;
        standingsData = standingsRes;
        driversData = driversRes;
    } catch (error) {
        console.error("Failed to load constructor details:", error);
        notFound();
    }

    if (!constructorData) {
        notFound();
    }

    const constructor = constructorData;
    const standing = standingsData.find(
        (s) => s.Constructor.constructorId === constructor.constructorId,
    );

    const teamLogo = getTeamLogo(constructor.constructorId);
    const teamColor = getTeamColor(constructor.constructorId);
    const flag = getNationalityFlag(constructor.nationality);
    const techProfile = getTeamTechnicalProfile(constructor.constructorId);

    const hq = techProfile?.headquarters;
    const management = techProfile?.management || [];
    const carSpecs = techProfile?.carSpecs;

    // Filter drivers belonging to this constructor
    const teamDrivers = driversData.filter(
        (d: any) =>
            d.driverId &&
            d.team &&
            d.team.constructorId === constructor.constructorId,
    );

    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl space-y-10">
                {/* Back Button */}
                <div>
                    <Link
                        href="/teams"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800"
                    >
                        <ArrowLeft className="w-4 h-4 text-f1-red" />
                        <span>Kembali ke Daftar Tim</span>
                    </Link>
                </div>

                {/* Team Hero Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-10 shadow-2xl">
                    {/* Top Team Color Accent Bar */}
                    <div
                        className="absolute top-0 left-0 right-0 h-3"
                        style={{ backgroundColor: teamColor }}
                    />

                    {/* Background Radial Glow */}
                    <div
                        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                        style={{ backgroundColor: teamColor }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mt-2">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            {/* Team Emblem Badge Tile (White background for dark logos like Mercedes) */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-3.5 shrink-0 flex items-center justify-center shadow-2xl border border-neutral-200">
                                <Image
                                    src={teamLogo}
                                    alt={`${constructor.name} logo`}
                                    width={80}
                                    height={80}
                                    className="object-contain max-h-full w-auto"
                                    unoptimized
                                />
                            </div>

                            {/* Team Header Info */}
                            <div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                                        <span className="text-sm leading-none">
                                            {flag}
                                        </span>
                                        <span>{constructor.nationality}</span>
                                    </span>

                                    {techProfile?.carModel && (
                                        <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                            <Gauge className="w-3.5 h-3.5" />
                                            <span>
                                                Challenger:{" "}
                                                {techProfile.carModel}
                                            </span>
                                        </span>
                                    )}

                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                                        ID: {constructor.constructorId}
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
                                    {techProfile?.officialTeamName ||
                                        constructor.name}
                                </h1>

                                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                                    Konstruktor resmi FIA Formula 1 World
                                    Championship. Bertarung di garis terdepan
                                    kompetisi motorsport global.
                                </p>

                                {/* Wikipedia link */}
                                {constructor.url && (
                                    <a
                                        href={constructor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-f1-red transition-colors"
                                    >
                                        <span>
                                            Buka Profil Lengkap di Wikipedia
                                        </span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Current Standing Badge */}
                        {standing?.position && (
                            <div className="flex flex-col items-center md:items-end justify-center p-4 sm:p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 min-w-[150px] shadow-lg shrink-0">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                                    Klasemen Konstruktor
                                </span>
                                <span className="text-3xl sm:text-4xl font-black font-mono text-white flex items-center gap-2 my-1">
                                    <Trophy className="w-6 h-6 text-amber-400" />
                                    P{standing.position}
                                </span>
                                <span className="text-xs font-mono text-neutral-400">
                                    {standing.points} Total Poin
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 1: BLUEPRINT SPESIFIKASI TEKNIS MOBIL REGULASI 2026 */}
                <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                    <div
                        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
                        style={{ backgroundColor: teamColor }}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800 relative z-10">
                        <div>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-f1-red/10 text-f1-red border border-f1-red/30 w-fit mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                FIA Technical Regulations 2026 Blueprint
                            </span>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {techProfile?.carModel ||
                                    "Challenger Regulasi 2026"}
                            </h2>
                        </div>
                    </div>

                    {/* Engineering Specs Grid */}
                    {carSpecs && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                    Unit Daya (Power Unit)
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.engine}
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    Rasio tenaga seimbang: 50% ICE (~400 kW) /
                                    50% MGU-K (350 kW).
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                                    Arsitektur Sasis &amp; Bobot
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.weightKg} kg (Bobot Minimum FIA
                                    2026)
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    Lebih ringan 30 kg, lebar sasis berkurang ke
                                    1900 mm demi manuver lincah.
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                    Aerodinamika Aktif (Active Aero)
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.aerodynamics ||
                                        "FIA Active Aero (Z-Mode & X-Mode)"}
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    Z-Mode (downforce tinggi di tikungan) &amp;
                                    X-Mode (hambatan rendah di trek lurus).
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                                    Komposisi Bahan Bakar
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.fuelSpec ||
                                        "100% Advanced Sustainable Drop-in E-Fuel"}
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    100% bahan bakar ramah lingkungan tanpa
                                    emisi karbon baru.
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Gauge className="w-3.5 h-3.5 text-blue-400" />
                                    Transmisi &amp; Drivetrain
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.transmission}
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    Sistem perpindahan gigi instan dengan
                                    integrasi kontrol aerodinamika aktif.
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                                    Sistem Pengereman (Brakes &amp; BBW)
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {carSpecs.brakes}
                                </span>
                                <span className="text-[11px] text-neutral-400 block pt-1">
                                    Pemulihan energi pengereman regeneratif
                                    ditingkatkan hingga 8.5 MJ per lap.
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION 2: MARKAS TIM & PUSAT FASILITAS TEKNIS (HEADQUARTERS) */}
                {hq && (
                    <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                            <div>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit mb-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    Technical Base &amp; Headquarters
                                </span>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Markas &amp; Fasilitas Rekayasa:{" "}
                                    {hq.facilityName}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-950/80 px-3.5 py-2 rounded-xl border border-neutral-800 self-start sm:self-auto">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                <span>
                                    Beroperasi Sejak Tahun {hq.establishedYear}
                                </span>
                            </div>
                        </div>

                        {/* Headquarters Key Metric Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-f1-red" />
                                    Lokasi Pabrik
                                </span>
                                <span className="text-sm font-bold text-white leading-tight block">
                                    {hq.location}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                                    Luas Fasilitas
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {hq.facilitySize}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                                    Tenaga Kerja &amp; Tim
                                </span>
                                <span className="text-sm font-bold text-white block">
                                    {hq.workforce}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    Pemasok Unit Daya (PU)
                                </span>
                                <span className="text-xs font-bold text-amber-300 block leading-tight">
                                    {hq.powerUnitPartner}
                                </span>
                            </div>
                        </div>

                        {/* Factory Description Narrative */}
                        <div className="p-5 rounded-2xl bg-neutral-950/50 border border-neutral-800/80 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                            {hq.description}
                        </div>

                        {/* Key Facilities Badges */}
                        <div>
                            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                                Fasilitas Kunci &amp; Laboratorium On-Site:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {hq.keyFacilities.map((fac, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90 text-xs font-mono text-neutral-200"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>{fac}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTION 3: STRUKTUR MANAJERIAL (NAMA & JABATAN TANPA FOTO) */}
                <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                        <div>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit mb-2">
                                <Briefcase className="w-3.5 h-3.5" />
                                Leadership &amp; Pit Wall Structure
                            </span>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Struktur Manajerial &amp; Tokoh Kunci
                            </h2>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                            Pimpinan Strategis &amp; Arsitek Teknis
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {management.map((person, index) => {
                            const personFlag = getNationalityFlag(
                                person.nationality,
                            );

                            return (
                                <div
                                    key={index}
                                    className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-f1-red">
                                            {person.role}
                                        </span>
                                        <span
                                            className="text-sm leading-none flex items-center gap-1.5 text-neutral-400 text-xs"
                                            title={person.nationality}
                                        >
                                            <span>{personFlag}</span>
                                            <span>{person.nationality}</span>
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-white pt-1">
                                        {person.name}
                                    </h3>

                                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                                        {person.bio}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SECTION 4: PEMBALAP RESMI TIM */}
                {teamDrivers.length > 0 && (
                    <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                            <div>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-800 text-neutral-300 border border-neutral-700 w-fit mb-2">
                                    <Users className="w-3.5 h-3.5" />
                                    Active Driver Lineup
                                </span>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Pembalap Resmi Musim Ini
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {teamDrivers.map((driver: any) => {
                                const driverFlag = getNationalityFlag(
                                    driver.nationality,
                                );
                                const driverImg = getDriverImage(
                                    driver.driverId,
                                );
                                const number =
                                    driver.permanentNumber ||
                                    driver.code ||
                                    "–";

                                return (
                                    <Link
                                        key={driver.driverId}
                                        href={`/drivers/${driver.driverId}`}
                                        className="group p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                                    >
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-900 border border-neutral-700 p-1 shrink-0 flex items-center justify-center">
                                            <Image
                                                src={driverImg}
                                                alt={`${driver.givenName} ${driver.familyName}`}
                                                width={56}
                                                height={56}
                                                className="object-contain w-full h-full rounded-full"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-f1-red">
                                                    #{number}
                                                </span>
                                                <span className="text-xs text-neutral-400">
                                                    {driverFlag}{" "}
                                                    {driver.nationality}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-black text-white group-hover:text-f1-red transition-colors truncate">
                                                {driver.givenName}{" "}
                                                {driver.familyName}
                                            </h3>
                                        </div>

                                        <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-f1-red transition-colors shrink-0" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SECTION 5: PEMBALAP CADANGAN / KETIGA & TEST DRIVER */}
                {techProfile?.reserveDrivers &&
                    techProfile.reserveDrivers.length > 0 && (
                        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
                                <div>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit mb-2">
                                        <Shield className="w-3.5 h-3.5" />
                                        Reserve &amp; Test Drivers
                                    </span>
                                    <h2 className="text-2xl font-black text-white tracking-tight">
                                        Pembalap Cadangan &amp; Penguji
                                    </h2>
                                </div>
                                <span className="text-xs font-mono text-neutral-400">
                                    Skuad Cadangan Resmi Musim 2026
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {techProfile.reserveDrivers.map((driver) => {
                                    const driverFlag = getNationalityFlag(
                                        driver.nationality,
                                    );
                                    const driverImg = getDriverImage(
                                        driver.driverId,
                                    );
                                    const number =
                                        driver.permanentNumber || "–";

                                    return (
                                        <Link
                                            key={driver.driverId}
                                            href={`/drivers/${driver.driverId}`}
                                            className="group p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                                        >
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-900 border border-neutral-700 p-1 shrink-0 flex items-center justify-center">
                                                <Image
                                                    src={driverImg}
                                                    alt={`${driver.givenName} ${driver.familyName}`}
                                                    width={56}
                                                    height={56}
                                                    className="object-contain w-full h-full rounded-full"
                                                    unoptimized
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-amber-400">
                                                        #{number}
                                                    </span>
                                                    <span className="text-xs text-neutral-400">
                                                        {driverFlag}{" "}
                                                        {driver.nationality}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors truncate">
                                                    {driver.givenName}{" "}
                                                    {driver.familyName}
                                                </h3>
                                                <span className="text-[11px] font-mono text-neutral-400 block truncate">
                                                    {driver.role}
                                                </span>
                                            </div>

                                            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-amber-400 transition-colors shrink-0" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
            </div>
        </main>
    );
}
