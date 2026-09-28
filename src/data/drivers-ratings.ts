/**
 * Formula 1 Driver Performance Ratings & Head-to-Head Dataset
 * Quantitative motorsport attributes (0-100 scale), career milestones,
 * and rivalry comparison pairings for the F1 grid.
 */

export interface DriverSkills {
    qualifyingPace: number;
    raceCraft: number;
    consistency: number;
    overtaking: number;
    wetWeather: number;
    experience: number;
}

export interface DriverPerformanceProfile {
    driverId: string;
    fullName: string;
    code: string;
    permanentNumber: string;
    nationality: string;
    constructorId: string;
    teamName: string;
    teamColor: string;
    overallRating: number;
    skills: DriverSkills;
    careerStats: {
        worldChampionships: number;
        wins: number;
        podiums: number;
        polePositions: number;
        fastestLaps: number;
        careerPoints: number;
        grandPrixStarts: number;
        bestFinish: string;
    };
    analystSummary: {
        strengths: string[];
        weaknesses: string[];
        racingStyle: string;
    };
}

export interface RivalryPreset {
    id: string;
    title: string;
    description: string;
    driver1Id: string;
    driver2Id: string;
    badge: string;
}

export const DRIVERS_RATINGS: Record<string, DriverPerformanceProfile> = {
    max_verstappen: {
        driverId: "max_verstappen",
        fullName: "Max Verstappen",
        code: "VER",
        permanentNumber: "1",
        nationality: "dutch",
        constructorId: "red_bull",
        teamName: "Red Bull Racing",
        teamColor: "#3671C6",
        overallRating: 96,
        skills: {
            qualifyingPace: 97,
            raceCraft: 98,
            consistency: 96,
            overtaking: 96,
            wetWeather: 98,
            experience: 92,
        },
        careerStats: {
            worldChampionships: 4,
            wins: 63,
            podiums: 111,
            polePositions: 40,
            fastestLaps: 33,
            careerPoints: 3014.5,
            grandPrixStarts: 206,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Sensasi grip batas ekstrem",
                "Konsistensi waktu lap robotik",
                "Kecepatan di lintasan basah",
            ],
            weaknesses: [
                "Temperamen saat mobil tidak seimbang",
                "Pertahanan agresif di batas regulasi",
            ],
            racingStyle: "Hyper-Agresif & Presisi Klinis",
        },
    },
    norris: {
        driverId: "norris",
        fullName: "Lando Norris",
        code: "NOR",
        permanentNumber: "4",
        nationality: "british",
        constructorId: "mclaren",
        teamName: "McLaren F1 Team",
        teamColor: "#FF8000",
        overallRating: 92,
        skills: {
            qualifyingPace: 94,
            raceCraft: 91,
            consistency: 89,
            overtaking: 88,
            wetWeather: 89,
            experience: 86,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 4,
            podiums: 26,
            polePositions: 8,
            fastestLaps: 12,
            careerPoints: 994,
            grandPrixStarts: 128,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Raw single-lap qualifying pace",
                "Transisi tikungan medium-ke-tinggi",
                "Manajemen ban depan",
            ],
            weaknesses: [
                "Fase start lap 1 di pole position",
                "Keraguan pada radio strategi kritis",
            ],
            racingStyle: "Fluid Speed & High Cornering Agility",
        },
    },
    leclerc: {
        driverId: "leclerc",
        fullName: "Charles Leclerc",
        code: "LEC",
        permanentNumber: "16",
        nationality: "monegasque",
        constructorId: "ferrari",
        teamName: "Scuderia Ferrari",
        teamColor: "#E80020",
        overallRating: 93,
        skills: {
            qualifyingPace: 98,
            raceCraft: 92,
            consistency: 88,
            overtaking: 91,
            wetWeather: 90,
            experience: 88,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 8,
            podiums: 42,
            polePositions: 26,
            fastestLaps: 10,
            careerPoints: 1381,
            grandPrixStarts: 144,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Master kualifikasi satu lap terkencang di F1",
                "Pengereman lambat di apex",
                "Kemampuan sirkuit jalan raya",
            ],
            weaknesses: [
                "Kecenderungan over-driving saat understeer",
                "Kadang terlalu keras mengkritik diri sendiri",
            ],
            racingStyle: "Late-Braking Specialist & Maximum Commitment",
        },
    },
    hamilton: {
        driverId: "hamilton",
        fullName: "Lewis Hamilton",
        code: "HAM",
        permanentNumber: "44",
        nationality: "british",
        constructorId: "ferrari",
        teamName: "Scuderia Ferrari",
        teamColor: "#E80020",
        overallRating: 95,
        skills: {
            qualifyingPace: 93,
            raceCraft: 96,
            consistency: 93,
            overtaking: 94,
            wetWeather: 98,
            experience: 99,
        },
        careerStats: {
            worldChampionships: 7,
            wins: 105,
            podiums: 201,
            polePositions: 104,
            fastestLaps: 67,
            careerPoints: 4829.5,
            grandPrixStarts: 353,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Pengalaman perebutan titel juara dunia",
                "Tyre preservation legendaris",
                "Ketenangan di kondisi basah ekstrem",
            ],
            weaknesses: [
                "Sensitivitas terhadap handling rear-end mobil baru",
                "Kualifikasi yang kini lebih fluktuatif",
            ],
            racingStyle: "Smooth Maestro & Master Strategist",
        },
    },
    piastri: {
        driverId: "piastri",
        fullName: "Oscar Piastri",
        code: "PIA",
        permanentNumber: "81",
        nationality: "australian",
        constructorId: "mclaren",
        teamName: "McLaren F1 Team",
        teamColor: "#FF8000",
        overallRating: 90,
        skills: {
            qualifyingPace: 90,
            raceCraft: 91,
            consistency: 92,
            overtaking: 89,
            wetWeather: 87,
            experience: 80,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 2,
            podiums: 10,
            polePositions: 0,
            fastestLaps: 3,
            careerPoints: 399,
            grandPrixStarts: 44,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Ketenangan mental tingkat dewa (Ice-cool)",
                "Manuver menyalip berani di tikungan pertama",
                "Kurva belajar kilat",
            ],
            weaknesses: [
                "Manajemen degradasi ban belakang di stint panjang",
                "Konsistensi setup di trek baru",
            ],
            racingStyle: "Ice-Cold Composure & Calculated Aggression",
        },
    },
    russell: {
        driverId: "russell",
        fullName: "George Russell",
        code: "RUS",
        permanentNumber: "63",
        nationality: "british",
        constructorId: "mercedes",
        teamName: "Mercedes-AMG Petronas",
        teamColor: "#27F4D2",
        overallRating: 91,
        skills: {
            qualifyingPace: 94,
            raceCraft: 89,
            consistency: 90,
            overtaking: 88,
            wetWeather: 89,
            experience: 86,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 3,
            podiums: 15,
            polePositions: 5,
            fastestLaps: 8,
            careerPoints: 692,
            grandPrixStarts: 125,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Mr. Saturday: kualifikasi di atas kemampuan mobil",
                "Etos kerja telemetri & engineering",
                "Pace di trek lurus",
            ],
            weaknesses: [
                "Tekanan di lap-lap akhir saat memimpin balapan",
                "Kadang terlibat insiden wheel-to-wheel",
            ],
            racingStyle: "Analytical Operator & High Precision",
        },
    },
    alonso: {
        driverId: "alonso",
        fullName: "Fernando Alonso",
        code: "ALO",
        permanentNumber: "14",
        nationality: "spanish",
        constructorId: "aston_martin",
        teamName: "Aston Martin Aramco",
        teamColor: "#229971",
        overallRating: 94,
        skills: {
            qualifyingPace: 91,
            raceCraft: 97,
            consistency: 94,
            overtaking: 95,
            wetWeather: 95,
            experience: 99,
        },
        careerStats: {
            worldChampionships: 2,
            wins: 32,
            podiums: 106,
            polePositions: 22,
            fastestLaps: 26,
            careerPoints: 2329,
            grandPrixStarts: 400,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Visi balap 3 langkah ke depan",
                "Start lap pertama paling eksplosif di F1",
                "Maksimalisasi mobil apa pun",
            ],
            weaknesses: [
                "Kualifikasi murni melawan pembalap muda",
                "Tuntutan performa tim yang tanpa kompromi",
            ],
            racingStyle: "Master Tactician & Tire Whisperer",
        },
    },
    sainz: {
        driverId: "sainz",
        fullName: "Carlos Sainz",
        code: "SAI",
        permanentNumber: "55",
        nationality: "spanish",
        constructorId: "williams",
        teamName: "Williams Racing",
        teamColor: "#64C4FF",
        overallRating: 90,
        skills: {
            qualifyingPace: 89,
            raceCraft: 92,
            consistency: 92,
            overtaking: 88,
            wetWeather: 88,
            experience: 92,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 4,
            podiums: 25,
            polePositions: 6,
            fastestLaps: 4,
            careerPoints: 1226.5,
            grandPrixStarts: 206,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Pemahaman strategi balap ala race engineer",
                "Konsistensi tinggi mencetak poin",
                "Manajemen ban di stint akhir",
            ],
            weaknesses: [
                "Pace kualifikasi lap tunggal di kondisi dingin",
                "Kebutuhan adaptasi setup mobil",
            ],
            racingStyle: "Smooth Operator & Tactical Strategist",
        },
    },
    antonelli: {
        driverId: "antonelli",
        fullName: "Kimi Antonelli",
        code: "ANT",
        permanentNumber: "12",
        nationality: "italian",
        constructorId: "mercedes",
        teamName: "Mercedes-AMG Petronas",
        teamColor: "#27F4D2",
        overallRating: 92,
        skills: {
            qualifyingPace: 93,
            raceCraft: 92,
            consistency: 90,
            overtaking: 91,
            wetWeather: 89,
            experience: 82,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 8,
            podiums: 12,
            polePositions: 6,
            fastestLaps: 7,
            careerPoints: 452,
            grandPrixStarts: 39,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Bakat alami refleks instingtif kilat",
                "Kecepatan di tikungan kecepatan tinggi",
                "Agresivitas start dan racecraft lap pertama",
            ],
            weaknesses: [
                "Tekanan perebutan gelar juara dunia perdana",
                "Manajemen ban stint akhir di suhu trek ekstrem",
            ],
            racingStyle: "Raw Phenom & High Natural Feel",
        },
    },
    albon: {
        driverId: "albon",
        fullName: "Alexander Albon",
        code: "ALB",
        permanentNumber: "23",
        nationality: "thai",
        constructorId: "williams",
        teamName: "Williams Racing",
        teamColor: "#64C4FF",
        overallRating: 86,
        skills: {
            qualifyingPace: 88,
            raceCraft: 86,
            consistency: 86,
            overtaking: 85,
            wetWeather: 84,
            experience: 85,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 0,
            podiums: 2,
            polePositions: 0,
            fastestLaps: 0,
            careerPoints: 240,
            grandPrixStarts: 102,
            bestFinish: "P3",
        },
        analystSummary: {
            strengths: [
                "Memaksimalkan mobil papan tengah ke Q3",
                "Pertahanan posisi defensif tangguh",
                "Feedback teknis tim",
            ],
            weaknesses: ["Performa saat mobil mengalami dirty air di traffic"],
            racingStyle: "Defensive Anchor & Street Fighter",
        },
    },
    gasly: {
        driverId: "gasly",
        fullName: "Pierre Gasly",
        code: "GAS",
        permanentNumber: "10",
        nationality: "french",
        constructorId: "alpine",
        teamName: "Alpine F1 Team",
        teamColor: "#0093CC",
        overallRating: 86,
        skills: {
            qualifyingPace: 87,
            raceCraft: 86,
            consistency: 85,
            overtaking: 85,
            wetWeather: 88,
            experience: 87,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 1,
            podiums: 5,
            polePositions: 0,
            fastestLaps: 3,
            careerPoints: 418,
            grandPrixStarts: 151,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Memanfaatkan peluang balapan kacau (Monza 2020 winner)",
                "Keberanian di kondisi basah",
            ],
            weaknesses: ["Konsistensi saat setup mobil tidak ideal"],
            racingStyle: "Opportunistic Charger & High Heart",
        },
    },
    tsunoda: {
        driverId: "tsunoda",
        fullName: "Yuki Tsunoda",
        code: "TSU",
        permanentNumber: "22",
        nationality: "japanese",
        constructorId: "rb",
        teamName: "Visa Cash App RB",
        teamColor: "#6692FF",
        overallRating: 85,
        skills: {
            qualifyingPace: 87,
            raceCraft: 84,
            consistency: 83,
            overtaking: 86,
            wetWeather: 83,
            experience: 82,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 0,
            podiums: 0,
            polePositions: 0,
            fastestLaps: 1,
            careerPoints: 89,
            grandPrixStarts: 87,
            bestFinish: "P4",
        },
        analystSummary: {
            strengths: [
                "Pengereman agresif dan kontrol apex",
                "Kecepatan kualifikasi satu lap",
            ],
            weaknesses: ["Manajemen emosi di team radio saat balapan tegang"],
            racingStyle: "Banzai Braking & Feisty Combatant",
        },
    },
    hulkenberg: {
        driverId: "hulkenberg",
        fullName: "Nico Hülkenberg",
        code: "HUL",
        permanentNumber: "27",
        nationality: "german",
        constructorId: "sauber",
        teamName: "Stake F1 Team Kick Sauber",
        teamColor: "#52E252",
        overallRating: 85,
        skills: {
            qualifyingPace: 89,
            raceCraft: 84,
            consistency: 86,
            overtaking: 82,
            wetWeather: 85,
            experience: 92,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 0,
            podiums: 0,
            polePositions: 1,
            fastestLaps: 2,
            careerPoints: 561,
            grandPrixStarts: 227,
            bestFinish: "P4",
        },
        analystSummary: {
            strengths: [
                "Spesialis kualifikasi satu lap",
                "Kemampuan adaptasi instan tanpa latihan",
            ],
            weaknesses: [
                "Ketidakberuntungan mengkonversi posisi menjadi podium",
            ],
            racingStyle: "The Ultimate Qualifier & Veteran Yardstick",
        },
    },
    perez: {
        driverId: "perez",
        fullName: "Sergio Pérez",
        code: "PER",
        permanentNumber: "11",
        nationality: "mexican",
        constructorId: "red_bull",
        teamName: "Red Bull Racing",
        teamColor: "#3671C6",
        overallRating: 86,
        skills: {
            qualifyingPace: 83,
            raceCraft: 89,
            consistency: 82,
            overtaking: 88,
            wetWeather: 86,
            experience: 94,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 6,
            podiums: 39,
            polePositions: 3,
            fastestLaps: 12,
            careerPoints: 1637,
            grandPrixStarts: 281,
            bestFinish: "P1",
        },
        analystSummary: {
            strengths: [
                "Raja sirkuit jalan raya (Baku, Monaco, Singapore)",
                "Manajemen ban belakang",
            ],
            weaknesses: [
                "Konsistensi kualifikasi Q3",
                "Pace saat menghadapi front-end tajam",
            ],
            racingStyle: "Minister of Defense & Street Circuit King",
        },
    },
};

export const RIVALRY_PRESETS: RivalryPreset[] = [
    {
        id: "title_fight_2024",
        title: "Max Verstappen vs Lando Norris",
        description:
            "Duel perebutan gelar juara dunia Formula 1 era modern antara dominasi sang juara bertahan dan penantang utama McLaren.",
        driver1Id: "max_verstappen",
        driver2Id: "norris",
        badge: "Title Contenders",
    },
    {
        id: "ferrari_teammates",
        title: "Lewis Hamilton vs Charles Leclerc",
        description:
            "Pertarungan rekan satu tim impian Scuderia Ferrari: Sang 7x Juara Dunia melawan Pangeran Maranello.",
        driver1Id: "hamilton",
        driver2Id: "leclerc",
        badge: "Scuderia Teammates",
    },
    {
        id: "mclaren_papaya_war",
        title: "Lando Norris vs Oscar Piastri",
        description:
            "Intra-team rivalry McLaren: Pembalap senior tim melawan wonderkid berdarah dingin dari Melbourne.",
        driver1Id: "norris",
        driver2Id: "piastri",
        badge: "Papaya Rules",
    },
    {
        id: "historic_giants",
        title: "Max Verstappen vs Lewis Hamilton",
        description:
            "Rivalitas legendaris salah satu pertarungan paling intens dalam sejarah olahraga motorsport modern.",
        driver1Id: "max_verstappen",
        driver2Id: "hamilton",
        badge: "Historic Clash",
    },
    {
        id: "veteran_vs_rookie",
        title: "Fernando Alonso vs George Russell",
        description:
            "Dua generasi pembalap cerdas: Sang legenda tak kenal lelah melawan ujung tombak Mercedes.",
        driver1Id: "alonso",
        driver2Id: "russell",
        badge: "Generational Duel",
    },
];

export function getDriverPerformance(
    driverId?: string,
): DriverPerformanceProfile {
    if (!driverId) return DRIVERS_RATINGS["max_verstappen"];
    const cleanId = driverId.toLowerCase().trim();
    if (DRIVERS_RATINGS[cleanId]) return DRIVERS_RATINGS[cleanId];

    // Generic fallback for any driver not pre-mapped
    return {
        driverId: cleanId,
        fullName: cleanId
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        code: cleanId.substring(0, 3).toUpperCase(),
        permanentNumber: "0",
        nationality: "f1",
        constructorId: "generic",
        teamName: "Formula 1 Team",
        teamColor: "#E10600",
        overallRating: 82,
        skills: {
            qualifyingPace: 82,
            raceCraft: 82,
            consistency: 82,
            overtaking: 82,
            wetWeather: 82,
            experience: 75,
        },
        careerStats: {
            worldChampionships: 0,
            wins: 0,
            podiums: 1,
            polePositions: 0,
            fastestLaps: 0,
            careerPoints: 25,
            grandPrixStarts: 24,
            bestFinish: "P5",
        },
        analystSummary: {
            strengths: ["Potensi performa tinggi", "Pengembangan balap"],
            weaknesses: ["Pengalaman perebutan gelar"],
            racingStyle: "Competitive Formula 1 Driver",
        },
    };
}
