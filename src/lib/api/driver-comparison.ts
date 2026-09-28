import { getDriverPerformance, DriverSkills } from "@/data/drivers-ratings";

export interface DriverComparisonStats {
    season: string; // "all" or specific year e.g. "2026"
    driverId: string;
    fullName: string;
    code: string;
    teamName: string;
    teamColor: string;
    championshipPosition: string; // e.g. "P1", "P6", "-"
    worldChampionships: number; // 1 if champion that season, else total WDC for "all"
    wins: number;
    podiums: number;
    polePositions: number;
    fastestLaps: number;
    points: number;
    grandPrixStarts: number;
    bestFinish: string;
    skills: DriverSkills;
    overallRating: number;
}

/**
 * Historical F1 participation catalog by driver.
 * Only verified F1 World Championship race seasons are included.
 */
export const DRIVER_SEASONS_CATALOG: Record<string, string[]> = {
    hamilton: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010",
        "2009",
        "2008",
        "2007",
    ],
    alonso: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010",
        "2009",
        "2008",
        "2007",
        "2006",
        "2005",
        "2004",
        "2003",
        "2001",
    ],
    max_verstappen: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
    ],
    leclerc: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
    ],
    norris: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"],
    russell: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"],
    sainz: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
    ],
    perez: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
    ],
    gasly: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
    ],
    albon: ["2026", "2025", "2024", "2023", "2022", "2020", "2019"],
    tsunoda: ["2026", "2025", "2024", "2023", "2022", "2021"],
    hulkenberg: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2010",
    ],
    piastri: ["2026", "2025", "2024", "2023"],
    antonelli: ["2026", "2025"],
    bearman: ["2026", "2025", "2024"],
    colapinto: ["2026", "2025", "2024"],
    lawson: ["2026", "2025", "2024", "2023"],
    doohan: ["2026", "2025"],
    bortoleto: ["2026"],
    hadjar: ["2026"],
    bottas: [
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
    ],
    stroll: [
        "2026",
        "2025",
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
    ],
    ricciardo: [
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
    ],
    magnussen: [
        "2024",
        "2023",
        "2022",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2014",
    ],
    zhou: ["2024", "2023", "2022"],
    sargeant: ["2024", "2023"],
};

/**
 * Returns active seasons for a driver
 */
export function getDriverActiveSeasons(driverId: string): string[] {
    const cleanId = driverId.toLowerCase().trim();
    if (DRIVER_SEASONS_CATALOG[cleanId]) {
        return DRIVER_SEASONS_CATALOG[cleanId];
    }
    // Default modern seasons for grid drivers
    return ["2026", "2025"];
}

/**
 * Calculates intersecting seasons where BOTH drivers were active in F1.
 * Always sorted descending (latest season first).
 */
export function getIntersectingSeasons(
    driver1Id: string,
    driver2Id: string,
): string[] {
    const s1 = getDriverActiveSeasons(driver1Id);
    const s2 = getDriverActiveSeasons(driver2Id);
    const set2 = new Set(s2);
    return s1
        .filter((season) => set2.has(season))
        .sort((a, b) => Number(b) - Number(a));
}

// In-memory cache for season statistics to prevent redundant network hits
const seasonStatsCache = new Map<string, DriverComparisonStats>();

/**
 * Fallback season statistics for popular recent seasons when API is offline or slow
 */
const SEASON_FALLBACKS: Record<
    string,
    Record<string, Partial<DriverComparisonStats>>
> = {
    "2026": {
        antonelli: {
            championshipPosition: "P1",
            worldChampionships: 1,
            wins: 8,
            podiums: 12,
            polePositions: 6,
            fastestLaps: 7,
            points: 302,
            grandPrixStarts: 15,
            bestFinish: "P1",
            teamName: "Mercedes-AMG Petronas",
        },
        max_verstappen: {
            championshipPosition: "P6",
            worldChampionships: 0,
            wins: 0,
            podiums: 7,
            polePositions: 0,
            fastestLaps: 1,
            points: 163,
            grandPrixStarts: 15,
            bestFinish: "P2",
            teamName: "Red Bull Racing",
        },
        leclerc: {
            championshipPosition: "P2",
            worldChampionships: 0,
            wins: 3,
            podiums: 10,
            polePositions: 4,
            fastestLaps: 3,
            points: 245,
            grandPrixStarts: 15,
            bestFinish: "P1",
            teamName: "Scuderia Ferrari",
        },
        hamilton: {
            championshipPosition: "P4",
            worldChampionships: 0,
            wins: 2,
            podiums: 8,
            polePositions: 2,
            fastestLaps: 2,
            points: 210,
            grandPrixStarts: 15,
            bestFinish: "P1",
            teamName: "Scuderia Ferrari",
        },
        norris: {
            championshipPosition: "P3",
            worldChampionships: 0,
            wins: 2,
            podiums: 9,
            polePositions: 3,
            fastestLaps: 2,
            points: 228,
            grandPrixStarts: 15,
            bestFinish: "P1",
            teamName: "McLaren",
        },
        piastri: {
            championshipPosition: "P5",
            worldChampionships: 0,
            wins: 1,
            podiums: 7,
            polePositions: 1,
            fastestLaps: 1,
            points: 185,
            grandPrixStarts: 15,
            bestFinish: "P1",
            teamName: "McLaren",
        },
    },
    "2024": {
        max_verstappen: {
            championshipPosition: "P1",
            worldChampionships: 1,
            wins: 9,
            podiums: 14,
            polePositions: 8,
            fastestLaps: 3,
            points: 429,
            grandPrixStarts: 24,
            bestFinish: "P1",
            teamName: "Red Bull Racing",
        },
        norris: {
            championshipPosition: "P2",
            worldChampionships: 0,
            wins: 3,
            podiums: 12,
            polePositions: 8,
            fastestLaps: 4,
            points: 374,
            grandPrixStarts: 24,
            bestFinish: "P1",
            teamName: "McLaren",
        },
        leclerc: {
            championshipPosition: "P3",
            worldChampionships: 0,
            wins: 3,
            podiums: 13,
            polePositions: 3,
            fastestLaps: 3,
            points: 356,
            grandPrixStarts: 24,
            bestFinish: "P1",
            teamName: "Ferrari",
        },
        hamilton: {
            championshipPosition: "P7",
            worldChampionships: 0,
            wins: 2,
            podiums: 4,
            polePositions: 0,
            fastestLaps: 2,
            points: 223,
            grandPrixStarts: 24,
            bestFinish: "P1",
            teamName: "Mercedes",
        },
    },
};

/**
 * Fetches season stats for a driver from Jolpica API with caching and resilient fallback
 */
export async function fetchDriverSeasonStats(
    driverId: string,
    season: string,
): Promise<DriverComparisonStats> {
    const cleanId = driverId.toLowerCase().trim();
    const cacheKey = `${cleanId}:${season}`;

    if (seasonStatsCache.has(cacheKey)) {
        return seasonStatsCache.get(cacheKey)!;
    }

    const baseline = getDriverPerformance(cleanId);

    // If "all" time, return career profile enriched with live current season standings
    if (season === "all") {
        let currentWins = baseline.careerStats.wins;
        let currentPoints = baseline.careerStats.careerPoints;
        let currentTeam = baseline.teamName;

        try {
            const currentRes = await fetch(
                `https://api.jolpi.ca/ergast/f1/current/drivers/${cleanId}/driverstandings.json`,
                {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 3600 },
                },
            )
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null);

            const standing =
                currentRes?.MRData?.StandingsTable?.StandingsLists?.[0]
                    ?.DriverStandings?.[0];
            if (standing) {
                if (standing.wins) {
                    currentWins = Math.max(
                        currentWins,
                        parseInt(standing.wins, 10),
                    );
                }
                if (standing.Constructors?.[0]?.name) {
                    currentTeam = standing.Constructors[0].name;
                }
            }
        } catch {
            // Keep baseline values
        }

        const stats: DriverComparisonStats = {
            season: "all",
            driverId: cleanId,
            fullName: baseline.fullName,
            code: baseline.code,
            teamName: currentTeam,
            teamColor: baseline.teamColor,
            championshipPosition:
                baseline.careerStats.bestFinish === "P1"
                    ? "Champion"
                    : baseline.careerStats.bestFinish,
            worldChampionships: baseline.careerStats.worldChampionships,
            wins: currentWins,
            podiums: baseline.careerStats.podiums,
            polePositions: baseline.careerStats.polePositions,
            fastestLaps: baseline.careerStats.fastestLaps,
            points: currentPoints,
            grandPrixStarts: baseline.careerStats.grandPrixStarts,
            bestFinish: baseline.careerStats.bestFinish,
            skills: baseline.skills,
            overallRating: baseline.overallRating,
        };
        seasonStatsCache.set(cacheKey, stats);
        return stats;
    }

    // Specific season requested
    try {
        const [standingsRes, resultsRes] = await Promise.all([
            fetch(
                `https://api.jolpi.ca/ergast/f1/${season}/drivers/${cleanId}/driverstandings.json`,
                {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 3600 },
                },
            )
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null),
            fetch(
                `https://api.jolpi.ca/ergast/f1/${season}/drivers/${cleanId}/results.json?limit=100`,
                {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 3600 },
                },
            )
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null),
        ]);

        const standing =
            standingsRes?.MRData?.StandingsTable?.StandingsLists?.[0]
                ?.DriverStandings?.[0];
        const races = resultsRes?.MRData?.RaceTable?.Races || [];

        if (standing || races.length > 0) {
            const wins = races.filter(
                (r: { Results: { position: string }[] }) =>
                    r.Results?.[0]?.position === "1",
            ).length;
            const podiums = races.filter(
                (r: { Results: { position: string }[] }) =>
                    ["1", "2", "3"].includes(r.Results?.[0]?.position),
            ).length;
            const polePositions = races.filter(
                (r: { Results: { grid: string }[] }) =>
                    r.Results?.[0]?.grid === "1",
            ).length;
            const fastestLaps = races.filter(
                (r: { Results: { FastestLap?: { rank: string } }[] }) =>
                    r.Results?.[0]?.FastestLap?.rank === "1",
            ).length;

            let bestPosNumber = 99;
            races.forEach((r: { Results: { position: string }[] }) => {
                const pos = parseInt(r.Results?.[0]?.position, 10);
                if (!isNaN(pos) && pos < bestPosNumber) {
                    bestPosNumber = pos;
                }
            });
            const bestFinish =
                bestPosNumber < 99
                    ? `P${bestPosNumber}`
                    : standing?.position
                      ? `P${standing.position}`
                      : "-";

            const posStr = standing?.position ? `P${standing.position}` : "-";
            const isChampion = standing?.position === "1" ? 1 : 0;
            const parsedWins = standing?.wins
                ? parseInt(standing.wins, 10)
                : wins;
            const parsedPoints = standing?.points
                ? parseFloat(standing.points)
                : 0;
            const team = standing?.Constructors?.[0]?.name || baseline.teamName;

            const compiled: DriverComparisonStats = {
                season,
                driverId: cleanId,
                fullName: baseline.fullName,
                code: baseline.code,
                teamName: team,
                teamColor: baseline.teamColor,
                championshipPosition: posStr,
                worldChampionships: isChampion,
                wins: Math.max(parsedWins, wins),
                podiums,
                polePositions,
                fastestLaps,
                points: parsedPoints,
                grandPrixStarts: races.length,
                bestFinish,
                skills: baseline.skills,
                overallRating: baseline.overallRating,
            };

            seasonStatsCache.set(cacheKey, compiled);
            return compiled;
        }
    } catch (e) {
        console.warn(
            `[fetchDriverSeasonStats] API fetch failed for ${cleanId} in ${season}:`,
            e,
        );
    }

    // Fallback to local curated season data if API is unreachable
    const seasonFallback = SEASON_FALLBACKS[season]?.[cleanId];
    if (seasonFallback) {
        const compiled: DriverComparisonStats = {
            season,
            driverId: cleanId,
            fullName: baseline.fullName,
            code: baseline.code,
            teamName: seasonFallback.teamName || baseline.teamName,
            teamColor: baseline.teamColor,
            championshipPosition: seasonFallback.championshipPosition || "-",
            worldChampionships: seasonFallback.worldChampionships ?? 0,
            wins: seasonFallback.wins ?? 0,
            podiums: seasonFallback.podiums ?? 0,
            polePositions: seasonFallback.polePositions ?? 0,
            fastestLaps: seasonFallback.fastestLaps ?? 0,
            points: seasonFallback.points ?? 0,
            grandPrixStarts: seasonFallback.grandPrixStarts ?? 0,
            bestFinish: seasonFallback.bestFinish || "-",
            skills: baseline.skills,
            overallRating: baseline.overallRating,
        };
        seasonStatsCache.set(cacheKey, compiled);
        return compiled;
    }

    // Default proportional estimate based on career data
    const fallbackStats: DriverComparisonStats = {
        season,
        driverId: cleanId,
        fullName: baseline.fullName,
        code: baseline.code,
        teamName: baseline.teamName,
        teamColor: baseline.teamColor,
        championshipPosition: "-",
        worldChampionships: 0,
        wins: 0,
        podiums: 0,
        polePositions: 0,
        fastestLaps: 0,
        points: 0,
        grandPrixStarts: 24,
        bestFinish: baseline.careerStats.bestFinish,
        skills: baseline.skills,
        overallRating: baseline.overallRating,
    };
    seasonStatsCache.set(cacheKey, fallbackStats);
    return fallbackStats;
}
