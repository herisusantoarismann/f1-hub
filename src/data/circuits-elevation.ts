export interface ElevationPoint {
    distancePct: number; // 0 to 100% of lap
    elevationMeters: number;
    label?: string;
    turnNumber?: number;
}

export interface BankedCorner {
    turnNumber: number;
    turnName: string;
    bankingAngleDeg: number;
    inclinePct?: number;
    description: string;
}

export interface CircuitElevationData {
    circuitId: string;
    lowestPointMeters: number;
    highestPointMeters: number;
    elevationDeltaMeters: number;
    altitudeAboveSeaLevelMeters: number;
    profilePoints: ElevationPoint[];
    bankedCorners: BankedCorner[];
    elevationNotes: string;
}

export const CIRCUITS_ELEVATION: Record<string, CircuitElevationData> = {
    zandvoort: {
        circuitId: "zandvoort",
        lowestPointMeters: 3,
        highestPointMeters: 18.2,
        elevationDeltaMeters: 15.2,
        altitudeAboveSeaLevelMeters: 8,
        elevationNotes:
            "Sirkuit di tengah bukit pasir pantai Belanda dengan dua tikungan beremban (banked turns) ekstrem: Hugenholtzbocht (19°) dan Arie Luyendykbocht (18°), melebihi kemiringan sirkuit oval Indianapolis.",
        bankedCorners: [
            {
                turnNumber: 3,
                turnName: "Hugenholtzbocht",
                bankingAngleDeg: 19,
                inclinePct: 34.4,
                description:
                    "Parabolic banking 19° memungkinkan dua mobil melaju berdampingan dengan grip gravitasi ekstrem menuju bukit Hunserug.",
            },
            {
                turnNumber: 14,
                turnName: "Arie Luyendykbocht",
                bankingAngleDeg: 18,
                inclinePct: 32.5,
                description:
                    "Tikungan terakhir beremban 18° dilalui flat-out dengan kecepatan 270+ km/h sambil membuka Active Aero sebelum garis start/finish.",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 6.5, label: "Start/Finish" },
            {
                distancePct: 12,
                elevationMeters: 5.2,
                label: "T1 Tarzanbocht",
                turnNumber: 1,
            },
            {
                distancePct: 22,
                elevationMeters: 3.8,
                label: "T3 Hugenholtz (19° Banking)",
                turnNumber: 3,
            },
            { distancePct: 30, elevationMeters: 17.5, label: "Hunserug Crest" },
            {
                distancePct: 45,
                elevationMeters: 12.0,
                label: "T7 Scheivlak",
                turnNumber: 7,
            },
            {
                distancePct: 60,
                elevationMeters: 4.5,
                label: "T9 Mastersbocht",
                turnNumber: 9,
            },
            {
                distancePct: 75,
                elevationMeters: 8.0,
                label: "T11 Hans Ernst",
                turnNumber: 11,
            },
            {
                distancePct: 88,
                elevationMeters: 18.2,
                label: "Kumhobocht Peak",
                turnNumber: 13,
            },
            {
                distancePct: 95,
                elevationMeters: 10.5,
                label: "T14 Luyendyk (18° Banking)",
                turnNumber: 14,
            },
            { distancePct: 100, elevationMeters: 6.5, label: "Start/Finish" },
        ],
    },
    spa: {
        circuitId: "spa",
        lowestPointMeters: 373.8,
        highestPointMeters: 476.0,
        elevationDeltaMeters: 102.2,
        altitudeAboveSeaLevelMeters: 420,
        elevationNotes:
            "Rollercoaster legendaris Ardennes dengan perbedaan ketinggian terbesar di kalender F1 (102.2 meter) dan tanjakan kompresi vertikal 17% di Eau Rouge - Raidillon.",
        bankedCorners: [
            {
                turnNumber: 3,
                turnName: "Eau Rouge - Raidillon",
                bankingAngleDeg: 8,
                inclinePct: 17.0,
                description:
                    "Kompresi vertikal 17% dari lembah sungai Eau Rouge ke puncak Raidillon dengan gaya tekan hingga +5G.",
            },
            {
                turnNumber: 12,
                turnName: "Pouhon",
                bankingAngleDeg: 5,
                inclinePct: -6.5,
                description:
                    "Turunan tajam melengkung berkecepatan tinggi yang menuntut kestabilan aerodinamika ekstrem.",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 405.0, label: "Start/Finish" },
            {
                distancePct: 8,
                elevationMeters: 412.0,
                label: "T1 La Source",
                turnNumber: 1,
            },
            {
                distancePct: 16,
                elevationMeters: 373.8,
                label: "Eau Rouge Valley Bottom",
                turnNumber: 3,
            },
            {
                distancePct: 24,
                elevationMeters: 410.5,
                label: "Raidillon Crest",
                turnNumber: 4,
            },
            {
                distancePct: 38,
                elevationMeters: 476.0,
                label: "Les Combes Peak",
                turnNumber: 5,
            },
            {
                distancePct: 52,
                elevationMeters: 435.0,
                label: "T8 Bruxelles",
                turnNumber: 8,
            },
            {
                distancePct: 65,
                elevationMeters: 395.0,
                label: "T10 Pouhon",
                turnNumber: 10,
            },
            {
                distancePct: 80,
                elevationMeters: 385.0,
                label: "Stavelot Corner",
                turnNumber: 15,
            },
            {
                distancePct: 90,
                elevationMeters: 398.0,
                label: "Blanchimont Fast",
                turnNumber: 17,
            },
            {
                distancePct: 96,
                elevationMeters: 404.0,
                label: "Bus Stop Chicane",
                turnNumber: 19,
            },
            { distancePct: 100, elevationMeters: 405.0, label: "Start/Finish" },
        ],
    },
    red_bull_ring: {
        circuitId: "red_bull_ring",
        lowestPointMeters: 677.2,
        highestPointMeters: 740.7,
        elevationDeltaMeters: 63.5,
        altitudeAboveSeaLevelMeters: 700,
        elevationNotes:
            "Sirkuit pegunungan Styria dengan tanjakan 12% dari tikungan 1 menuju titik pengereman menanjak ekstrem di tikungan 3.",
        bankedCorners: [
            {
                turnNumber: 3,
                turnName: "Turn 3 (Niki Lauda Kurve)",
                bankingAngleDeg: 4,
                inclinePct: 12.0,
                description:
                    "Puncak tanjakan terjal 12% tempat manuver overtaking utama dengan kompresi pengereman menanjak.",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 680.0, label: "Start/Finish" },
            {
                distancePct: 15,
                elevationMeters: 695.0,
                label: "T1 Niki Lauda",
                turnNumber: 1,
            },
            {
                distancePct: 38,
                elevationMeters: 740.7,
                label: "T3 Peak (Highest)",
                turnNumber: 3,
            },
            {
                distancePct: 55,
                elevationMeters: 710.0,
                label: "T4 Downhill",
                turnNumber: 4,
            },
            {
                distancePct: 70,
                elevationMeters: 685.0,
                label: "T6 Gerhard Berger",
                turnNumber: 6,
            },
            {
                distancePct: 85,
                elevationMeters: 677.2,
                label: "T9 Valley Bottom",
                turnNumber: 9,
            },
            { distancePct: 100, elevationMeters: 680.0, label: "Start/Finish" },
        ],
    },
    monaco: {
        circuitId: "monaco",
        lowestPointMeters: 45.8,
        highestPointMeters: 88.0,
        elevationDeltaMeters: 42.2,
        altitudeAboveSeaLevelMeters: 60,
        elevationNotes:
            "Tanjakan Beau Rivage dari pantai menuju Casino Square (+42.2m), diikuti turunan curam Mirabeau menuju hairpin terpelan di F1.",
        bankedCorners: [
            {
                turnNumber: 6,
                turnName: "Fairmont Hairpin",
                bankingAngleDeg: 3,
                inclinePct: -9.5,
                description:
                    "Turunan tajam dengan radius paling sempit di Formula 1 (kecepatan hanya 48 km/h).",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 48.0, label: "Start/Finish" },
            {
                distancePct: 12,
                elevationMeters: 52.0,
                label: "T1 Sainte Dévote",
                turnNumber: 1,
            },
            {
                distancePct: 30,
                elevationMeters: 88.0,
                label: "Casino Square Peak",
                turnNumber: 4,
            },
            {
                distancePct: 45,
                elevationMeters: 65.0,
                label: "T5 Mirabeau Haute",
                turnNumber: 5,
            },
            {
                distancePct: 55,
                elevationMeters: 50.0,
                label: "T6 Fairmont Hairpin",
                turnNumber: 6,
            },
            {
                distancePct: 70,
                elevationMeters: 45.8,
                label: "Tunnel Exit Lowest",
                turnNumber: 9,
            },
            {
                distancePct: 85,
                elevationMeters: 47.0,
                label: "Swimming Pool",
                turnNumber: 13,
            },
            {
                distancePct: 95,
                elevationMeters: 48.0,
                label: "Rascasse",
                turnNumber: 18,
            },
            { distancePct: 100, elevationMeters: 48.0, label: "Start/Finish" },
        ],
    },
    americas: {
        circuitId: "americas",
        lowestPointMeters: 134.5,
        highestPointMeters: 175.0,
        elevationDeltaMeters: 40.5,
        altitudeAboveSeaLevelMeters: 155,
        elevationNotes:
            "Tanjakan buta 11% setinggi 40.5 meter menuju apex tikungan 1 yang menjadi ciri khas spektakuler Circuit of the Americas.",
        bankedCorners: [
            {
                turnNumber: 1,
                turnName: "Turn 1 Blind Apex",
                bankingAngleDeg: 6,
                inclinePct: 11.2,
                description:
                    "Tanjakan terjal 40 meter yang langsung berbelok tajam ke kiri secara buta (blind apex).",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 139.0, label: "Start/Finish" },
            {
                distancePct: 15,
                elevationMeters: 175.0,
                label: "T1 Peak Summit",
                turnNumber: 1,
            },
            {
                distancePct: 35,
                elevationMeters: 145.0,
                label: "Esses Downhill",
                turnNumber: 4,
            },
            {
                distancePct: 55,
                elevationMeters: 134.5,
                label: "T11 Lowest Point",
                turnNumber: 11,
            },
            {
                distancePct: 75,
                elevationMeters: 142.0,
                label: "Backstraight",
                turnNumber: 12,
            },
            {
                distancePct: 90,
                elevationMeters: 140.0,
                label: "Stadium Section",
                turnNumber: 16,
            },
            { distancePct: 100, elevationMeters: 139.0, label: "Start/Finish" },
        ],
    },
    interlagos: {
        circuitId: "interlagos",
        lowestPointMeters: 762.0,
        highestPointMeters: 805.0,
        elevationDeltaMeters: 43.0,
        altitudeAboveSeaLevelMeters: 780,
        elevationNotes:
            "Sirkuit amfiteater alami Sao Paulo dengan turunan Senna S dan tanjakan panjang Subida dos Boxes menuju start/finish.",
        bankedCorners: [
            {
                turnNumber: 1,
                turnName: "Senna 'S'",
                bankingAngleDeg: 5,
                inclinePct: -8.0,
                description:
                    "Turunan cepat berbelok ganda menantang kestabilan ban depan kiri.",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 802.0, label: "Start/Finish" },
            {
                distancePct: 15,
                elevationMeters: 785.0,
                label: "T1-T2 Senna S",
                turnNumber: 1,
            },
            {
                distancePct: 35,
                elevationMeters: 762.0,
                label: "T4 Descida do Lago Lowest",
                turnNumber: 4,
            },
            {
                distancePct: 60,
                elevationMeters: 775.0,
                label: "Ferradura",
                turnNumber: 6,
            },
            {
                distancePct: 78,
                elevationMeters: 770.0,
                label: "Bico de Pato",
                turnNumber: 10,
            },
            {
                distancePct: 90,
                elevationMeters: 792.0,
                label: "Junção",
                turnNumber: 12,
            },
            {
                distancePct: 100,
                elevationMeters: 805.0,
                label: "Subida dos Boxes Peak",
            },
        ],
    },
    suzuka: {
        circuitId: "suzuka",
        lowestPointMeters: 44.2,
        highestPointMeters: 97.0,
        elevationDeltaMeters: 52.8,
        altitudeAboveSeaLevelMeters: 65,
        elevationNotes:
            "Layout angka delapan bersejarah dengan tanjakan S-Curves berirama dan turunan cepat 130R.",
        bankedCorners: [
            {
                turnNumber: 15,
                turnName: "130R",
                bankingAngleDeg: 4,
                inclinePct: -3.5,
                description:
                    "Tikungan berkecepatan lebih dari 305 km/h dengan sedikit banking dan gaya lateral 4G.",
            },
        ],
        profilePoints: [
            { distancePct: 0, elevationMeters: 50.0, label: "Start/Finish" },
            {
                distancePct: 20,
                elevationMeters: 65.0,
                label: "S-Curves Climb",
                turnNumber: 3,
            },
            {
                distancePct: 40,
                elevationMeters: 80.0,
                label: "Degner Curves",
                turnNumber: 8,
            },
            {
                distancePct: 55,
                elevationMeters: 44.2,
                label: "Hairpin Lowest",
                turnNumber: 11,
            },
            {
                distancePct: 70,
                elevationMeters: 97.0,
                label: "Spoon Summit",
                turnNumber: 13,
            },
            {
                distancePct: 88,
                elevationMeters: 58.0,
                label: "130R",
                turnNumber: 15,
            },
            { distancePct: 100, elevationMeters: 50.0, label: "Start/Finish" },
        ],
    },
    albert_park: {
        circuitId: "albert_park",
        lowestPointMeters: 9.4,
        highestPointMeters: 12.0,
        elevationDeltaMeters: 2.6,
        altitudeAboveSeaLevelMeters: 10,
        elevationNotes:
            "Sirkuit jalan raya taman kota yang mengitari danau Albert Park di Melbourne dengan kontur hampir rata (delta hanya 2.6 meter).",
        bankedCorners: [],
        profilePoints: [
            { distancePct: 0, elevationMeters: 10.2, label: "Start/Finish" },
            {
                distancePct: 25,
                elevationMeters: 9.4,
                label: "Lakeside Straight",
                turnNumber: 6,
            },
            {
                distancePct: 55,
                elevationMeters: 12.0,
                label: "T9-10 Chicane Peak",
                turnNumber: 9,
            },
            {
                distancePct: 80,
                elevationMeters: 10.8,
                label: "T11-12 Fast Section",
                turnNumber: 11,
            },
            { distancePct: 100, elevationMeters: 10.2, label: "Start/Finish" },
        ],
    },
    default: {
        circuitId: "default",
        lowestPointMeters: 20,
        highestPointMeters: 42,
        elevationDeltaMeters: 22,
        altitudeAboveSeaLevelMeters: 30,
        elevationNotes:
            "Profil kontur elevasi topografi sirkuit standar FIA Grade 1 dengan variasi tanjakan dan turunan teknis.",
        bankedCorners: [],
        profilePoints: [
            { distancePct: 0, elevationMeters: 24, label: "Start/Finish" },
            { distancePct: 25, elevationMeters: 38, label: "Sector 1 Crest" },
            { distancePct: 50, elevationMeters: 20, label: "Sector 2 Dip" },
            { distancePct: 75, elevationMeters: 42, label: "Sector 3 Peak" },
            { distancePct: 100, elevationMeters: 24, label: "Start/Finish" },
        ],
    },
};

export function getCircuitElevation(circuitId?: string): CircuitElevationData {
    if (!circuitId) return CIRCUITS_ELEVATION["default"];
    const cleanId = circuitId.toLowerCase().trim();
    const mappedId = cleanId === "madrid" ? "madring" : cleanId;
    return (
        CIRCUITS_ELEVATION[cleanId] ||
        CIRCUITS_ELEVATION[mappedId] || {
            ...CIRCUITS_ELEVATION["default"],
            circuitId: cleanId,
        }
    );
}
