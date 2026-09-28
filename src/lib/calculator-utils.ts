import { DriverStanding, ConstructorStanding } from "@/types/standings";

/**
 * Standard FIA Formula 1 Points Distribution
 */
export const GP_POINTS_MAP: Record<number, number> = {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1,
};

export const SPRINT_POINTS_MAP: Record<number, number> = {
    1: 8,
    2: 7,
    3: 6,
    4: 5,
    5: 4,
    6: 3,
    7: 2,
    8: 1,
};

export interface DriverRaceOutcome {
    driverId: string;
    gpPosition?: number | null; // 1-20 or null (DNF/DNS)
    fastestLap?: boolean;
    sprintPosition?: number | null; // 1-20 or null
}

export interface SimulatedDriverStanding extends DriverStanding {
    simulatedPoints: number;
    simulatedWins: number;
    pointsAdded: number;
    simulatedPosition: number;
    positionChange: number; // >0 climbed, <0 dropped, 0 unchanged
}

export interface SimulatedConstructorStanding extends ConstructorStanding {
    simulatedPoints: number;
    simulatedWins: number;
    pointsAdded: number;
    simulatedPosition: number;
    positionChange: number;
}

export interface ClinchScenarioResult {
    leaderId: string;
    leaderName: string;
    chaserId: string;
    chaserName: string;
    currentGap: number;
    simulatedGap: number;
    maxPointsRemaining: number;
    canClinchThisRace: boolean;
    isAlreadyClinched: boolean;
    isChaserEliminated: boolean;
    requiredGapToClinch: number;
    clinchSummary: string;
    clinchConditions: string[];
}

/**
 * Calculate points earned by a driver in a simulated race
 */
export function calculateDriverRacePoints(
    outcome: DriverRaceOutcome,
    includeFastestLapBonus: boolean = true,
): number {
    let pts = 0;

    // Grand Prix points
    if (
        outcome.gpPosition &&
        outcome.gpPosition >= 1 &&
        outcome.gpPosition <= 10
    ) {
        pts += GP_POINTS_MAP[outcome.gpPosition] || 0;

        // Fastest lap bonus (only awarded if driver finishes in top 10)
        if (includeFastestLapBonus && outcome.fastestLap) {
            pts += 1;
        }
    }

    // Sprint race points
    if (
        outcome.sprintPosition &&
        outcome.sprintPosition >= 1 &&
        outcome.sprintPosition <= 8
    ) {
        pts += SPRINT_POINTS_MAP[outcome.sprintPosition] || 0;
    }

    return pts;
}

/**
 * Re-calculate driver standings table based on simulated race outcomes
 */
export function calculateSimulatedDriverStandings(
    baseStandings: DriverStanding[],
    outcomes: Record<string, DriverRaceOutcome>,
    includeFastestLapBonus: boolean = true,
): SimulatedDriverStanding[] {
    const list: SimulatedDriverStanding[] = baseStandings.map((st) => {
        const outcome = outcomes[st.Driver.driverId] || {
            driverId: st.Driver.driverId,
        };
        const pointsAdded = calculateDriverRacePoints(
            outcome,
            includeFastestLapBonus,
        );
        const basePts = parseFloat(st.points) || 0;
        const baseWins = parseInt(st.wins, 10) || 0;
        const isWin = outcome.gpPosition === 1;

        return {
            ...st,
            simulatedPoints: basePts + pointsAdded,
            simulatedWins: baseWins + (isWin ? 1 : 0),
            pointsAdded,
            simulatedPosition: parseInt(st.position, 10) || 1,
            positionChange: 0,
        };
    });

    // Sort by points descending, tie breaker: wins descending
    list.sort((a, b) => {
        if (b.simulatedPoints !== a.simulatedPoints) {
            return b.simulatedPoints - a.simulatedPoints;
        }
        return b.simulatedWins - a.simulatedWins;
    });

    // Assign new simulated positions and position changes
    return list.map((item, index) => {
        const newPos = index + 1;
        const oldPos = parseInt(item.position, 10) || newPos;
        return {
            ...item,
            simulatedPosition: newPos,
            positionChange: oldPos - newPos, // e.g. from pos 3 to pos 1: 3 - 1 = +2 (climbed)
        };
    });
}

/**
 * Re-calculate constructor standings based on driver race outcomes
 */
export function calculateSimulatedConstructorStandings(
    baseConstructors: ConstructorStanding[],
    simulatedDrivers: SimulatedDriverStanding[],
): SimulatedConstructorStanding[] {
    // Map constructor ID to points added and wins added from drivers
    const constructorAdditions: Record<
        string,
        { pointsAdded: number; winsAdded: number }
    > = {};

    simulatedDrivers.forEach((driver) => {
        const constructorId = driver.Constructors?.[0]?.constructorId;
        if (!constructorId) return;

        if (!constructorAdditions[constructorId]) {
            constructorAdditions[constructorId] = {
                pointsAdded: 0,
                winsAdded: 0,
            };
        }
        constructorAdditions[constructorId].pointsAdded += driver.pointsAdded;
        if (driver.simulatedWins > (parseInt(driver.wins, 10) || 0)) {
            constructorAdditions[constructorId].winsAdded += 1;
        }
    });

    const list: SimulatedConstructorStanding[] = baseConstructors.map((c) => {
        const additions = constructorAdditions[c.Constructor.constructorId] || {
            pointsAdded: 0,
            winsAdded: 0,
        };
        const basePts = parseFloat(c.points) || 0;
        const baseWins = parseInt(c.wins, 10) || 0;

        return {
            ...c,
            simulatedPoints: basePts + additions.pointsAdded,
            simulatedWins: baseWins + additions.winsAdded,
            pointsAdded: additions.pointsAdded,
            simulatedPosition: parseInt(c.position, 10) || 1,
            positionChange: 0,
        };
    });

    // Sort by points descending, then wins
    list.sort((a, b) => {
        if (b.simulatedPoints !== a.simulatedPoints) {
            return b.simulatedPoints - a.simulatedPoints;
        }
        return b.simulatedWins - a.simulatedWins;
    });

    return list.map((item, index) => {
        const newPos = index + 1;
        const oldPos = parseInt(item.position, 10) || newPos;
        return {
            ...item,
            simulatedPosition: newPos,
            positionChange: oldPos - newPos,
        };
    });
}

/**
 * Analyze Championship Clinch Scenario for title contenders
 */
export function analyzeClinchScenario({
    leader,
    chaser,
    remainingRacesAfterThis,
    hasSprintRemaining = false,
    includeFastestLapBonus = true,
}: {
    leader: SimulatedDriverStanding;
    chaser: SimulatedDriverStanding;
    remainingRacesAfterThis: number;
    hasSprintRemaining?: boolean;
    includeFastestLapBonus?: boolean;
}): ClinchScenarioResult {
    const leaderName = `${leader.Driver.givenName} ${leader.Driver.familyName}`;
    const chaserName = `${chaser.Driver.givenName} ${chaser.Driver.familyName}`;

    const maxPtsPerRace = includeFastestLapBonus ? 26 : 25;
    const sprintBonus = hasSprintRemaining ? 8 : 0;
    const maxPointsRemaining =
        remainingRacesAfterThis * maxPtsPerRace + sprintBonus;

    const currentGap = parseFloat(leader.points) - parseFloat(chaser.points);
    const simulatedGap = leader.simulatedPoints - chaser.simulatedPoints;

    // A driver clinches when the gap exceeds the maximum points remaining in all subsequent races
    const canClinchThisRace = simulatedGap > maxPointsRemaining;
    const isAlreadyClinched = currentGap > maxPointsRemaining + maxPtsPerRace;
    const isChaserEliminated = simulatedGap > maxPointsRemaining;

    // Points buffer required
    const requiredGapToClinch = maxPointsRemaining + 1;

    const conditions: string[] = [];
    let summary = "";

    if (isAlreadyClinched) {
        summary = `${leaderName} telah mengunci gelar Juara Dunia secara matematis! 🏆`;
        conditions.push("Gelar juara dunia telah resmi dipastikan.");
    } else if (canClinchThisRace) {
        summary = `${leaderName} mengunci gelar Juara Dunia pada balapan ini! 🏆 (Unggul ${simulatedGap} poin dengan sisa ${maxPointsRemaining} poin maksimal)`;
        conditions.push(
            `Keunggulan ${simulatedGap} poin sudah tidak dapat dikejar oleh ${chaserName}.`,
        );
    } else {
        const ptsNeeded = requiredGapToClinch - currentGap;
        summary = `${leaderName} memimpin dengan selisih ${simulatedGap} poin. Perebutan gelar masih terbuka (tersisa ${maxPointsRemaining} poin).`;

        if (ptsNeeded <= maxPtsPerRace) {
            conditions.push(
                `Jika ${leaderName} finis P1 (25 poin) dan ${chaserName} finis P3 atau lebih rendah.`,
            );
            conditions.push(
                `Jika ${leaderName} finis P2 dan ${chaserName} finis di luar zona poin / DNF.`,
            );
        } else {
            conditions.push(
                `Perbedaan poin saat ini (${simulatedGap} poin) masih membutuhkan ${Math.ceil(
                    ptsNeeded / maxPtsPerRace,
                )} seri balapan tambahan untuk mengunci gelar.`,
            );
        }
    }

    return {
        leaderId: leader.Driver.driverId,
        leaderName,
        chaserId: chaser.Driver.driverId,
        chaserName,
        currentGap,
        simulatedGap,
        maxPointsRemaining,
        canClinchThisRace,
        isAlreadyClinched,
        isChaserEliminated,
        requiredGapToClinch,
        clinchSummary: summary,
        clinchConditions: conditions,
    };
}

/**
 * 2026 Season Remaining Calendar Definition
 * Used for multi-round progressive season simulation
 */
export interface RemainingRace {
    round: string;
    raceName: string;
    circuitName: string;
    locality: string;
    country: string;
    date: string;
    hasSprint: boolean;
}

export const REMAINING_2026_RACES: RemainingRace[] = [
    {
        round: "16",
        raceName: "Bahrain Grand Prix",
        circuitName: "Bahrain International Circuit",
        locality: "Sakhir",
        country: "Bahrain",
        date: "2026-09-20",
        hasSprint: false,
    },
    {
        round: "17",
        raceName: "Singapore Grand Prix",
        circuitName: "Marina Bay Street Circuit",
        locality: "Marina Bay",
        country: "Singapore",
        date: "2026-10-04",
        hasSprint: true, // Official Sprint weekend with Sprint points!
    },
    {
        round: "18",
        raceName: "United States Grand Prix",
        circuitName: "Circuit of the Americas",
        locality: "Austin",
        country: "USA",
        date: "2026-10-25",
        hasSprint: false,
    },
    {
        round: "19",
        raceName: "Mexico City Grand Prix",
        circuitName: "Autódromo Hermanos Rodríguez",
        locality: "Mexico City",
        country: "Mexico",
        date: "2026-11-01",
        hasSprint: false,
    },
    {
        round: "20",
        raceName: "Brazilian Grand Prix",
        circuitName: "Autódromo José Carlos Pace (Interlagos)",
        locality: "São Paulo",
        country: "Brazil",
        date: "2026-11-08",
        hasSprint: false,
    },
    {
        round: "21",
        raceName: "Las Vegas Grand Prix",
        circuitName: "Las Vegas Strip Circuit",
        locality: "Las Vegas",
        country: "USA",
        date: "2026-11-22",
        hasSprint: false,
    },
    {
        round: "22",
        raceName: "Qatar Grand Prix",
        circuitName: "Lusail International Circuit",
        locality: "Lusail",
        country: "Qatar",
        date: "2026-11-29",
        hasSprint: false,
    },
    {
        round: "23",
        raceName: "Abu Dhabi Grand Prix",
        circuitName: "Yas Marina Circuit",
        locality: "Abu Dhabi",
        country: "UAE",
        date: "2026-12-06",
        hasSprint: false,
    },
];

export interface RoundDriverPoints {
    driverId: string;
    gpPosition?: number | null; // 1-10
    sprintPosition?: number | null; // 1-8
    fastestLap?: boolean;
    manualPoints?: number | null; // custom direct point override (e.g. 25, 18)
}

/**
 * Calculates points earned by a driver in a specific round, taking Sprint into account
 */
export function calculateDriverPointsForRound(
    outcome: RoundDriverPoints,
    hasSprint: boolean,
): number {
    if (
        outcome.manualPoints !== undefined &&
        outcome.manualPoints !== null &&
        !isNaN(outcome.manualPoints)
    ) {
        return Math.max(0, outcome.manualPoints);
    }

    let pts = 0;
    if (outcome.gpPosition && outcome.gpPosition >= 1 && outcome.gpPosition <= 10) {
        pts += GP_POINTS_MAP[outcome.gpPosition] || 0;
        if (outcome.fastestLap) {
            pts += 1;
        }
    }
    if (
        hasSprint &&
        outcome.sprintPosition &&
        outcome.sprintPosition >= 1 &&
        outcome.sprintPosition <= 8
    ) {
        pts += SPRINT_POINTS_MAP[outcome.sprintPosition] || 0;
    }
    return pts;
}

export interface MultiRoundSimulationResult {
    roundByRoundPoints: Record<string, Record<string, number>>; // driverId -> roundId -> points
    cumulativeDriverPoints: Record<string, Record<string, number>>; // driverId -> roundId -> running total
    cumulativeConstructorPoints: Record<string, Record<string, number>>; // constructorId -> roundId -> running total
    totalDriverPointsAdded: Record<string, number>; // driverId -> total pts added
    totalConstructorPointsAdded: Record<string, number>; // constructorId -> total pts added
    simulatedDriverStandings: SimulatedDriverStanding[];
    simulatedConstructorStandings: SimulatedConstructorStanding[];
    clinchMoment: {
        roundNumber: string;
        raceName: string;
        championId: string;
        championName: string;
        gap: number;
    } | null;
}

/**
 * Calculates progressive cumulative standings across multiple rounds of the season
 */
export function calculateMultiRoundProgression(
    baseDrivers: DriverStanding[],
    baseConstructors: ConstructorStanding[],
    multiRoundOutcomes: Record<string, Record<string, RoundDriverPoints>>,
    races: RemainingRace[],
): MultiRoundSimulationResult {
    const roundByRoundPoints: Record<string, Record<string, number>> = {};
    const cumulativeDriverPoints: Record<string, Record<string, number>> = {};
    const cumulativeConstructorPoints: Record<string, Record<string, number>> = {};
    const totalDriverPointsAdded: Record<string, number> = {};
    const totalConstructorPointsAdded: Record<string, number> = {};
    const totalDriverWinsAdded: Record<string, number> = {};

    // Driver to Constructor mapping with fallback defaults
    const driverToConstructor: Record<string, string> = {
        antonelli: "mercedes",
        russell: "mercedes",
        norris: "mclaren",
        piastri: "mclaren",
        leclerc: "ferrari",
        hamilton: "ferrari",
        max_verstappen: "red_bull",
        perez: "red_bull",
        lawson: "rb",
        tsunoda: "rb",
        alonso: "aston_martin",
        stroll: "aston_martin",
        gasly: "alpine",
        doohan: "alpine",
        albon: "williams",
        sainz: "williams",
        hulkenberg: "sauber",
        bearman: "haas",
        ocon: "haas",
    };

    baseDrivers.forEach((d) => {
        const cId = d.Constructors?.[0]?.constructorId;
        if (cId) {
            driverToConstructor[d.Driver.driverId] = cId;
        }
    });

    const runningDriverPoints: Record<string, number> = {};
    const runningConstructorPoints: Record<string, number> = {};

    // Collect all driver IDs from baseDrivers AND multiRoundOutcomes
    const allDriverIds = new Set<string>();
    baseDrivers.forEach((d) => allDriverIds.add(d.Driver.driverId));
    Object.values(multiRoundOutcomes).forEach((roundMap) => {
        Object.keys(roundMap).forEach((dId) => allDriverIds.add(dId));
    });

    allDriverIds.forEach((id) => {
        roundByRoundPoints[id] = {};
        cumulativeDriverPoints[id] = {};
        totalDriverPointsAdded[id] = 0;
        totalDriverWinsAdded[id] = 0;
        const base = baseDrivers.find((d) => d.Driver.driverId === id);
        runningDriverPoints[id] = base ? parseFloat(base.points) || 0 : 0;
    });

    baseConstructors.forEach((c) => {
        const cId = c.Constructor.constructorId;
        cumulativeConstructorPoints[cId] = {};
        totalConstructorPointsAdded[cId] = 0;
        runningConstructorPoints[cId] = parseFloat(c.points) || 0;
    });

    let clinchMoment: MultiRoundSimulationResult["clinchMoment"] = null;

    races.forEach((race, raceIdx) => {
        const roundId = race.round;
        const roundOutcomes = multiRoundOutcomes[roundId] || {};

        // Calculate points gained in this round for all tracked drivers
        allDriverIds.forEach((driverId) => {
            const outcome = roundOutcomes[driverId] || { driverId };
            const ptsGained = calculateDriverPointsForRound(outcome, race.hasSprint);

            roundByRoundPoints[driverId][roundId] = ptsGained;
            totalDriverPointsAdded[driverId] += ptsGained;
            runningDriverPoints[driverId] += ptsGained;
            cumulativeDriverPoints[driverId][roundId] = runningDriverPoints[driverId];

            if (
                outcome.gpPosition === 1 ||
                outcome.manualPoints === 25 ||
                outcome.manualPoints === 26 ||
                outcome.manualPoints === 33 ||
                outcome.manualPoints === 34
            ) {
                totalDriverWinsAdded[driverId] += 1;
            }

            // Add to constructor
            const cId = driverToConstructor[driverId];
            if (cId) {
                totalConstructorPointsAdded[cId] = (totalConstructorPointsAdded[cId] || 0) + ptsGained;
                runningConstructorPoints[cId] = (runningConstructorPoints[cId] || 0) + ptsGained;
            }
        });

        // Record constructor running points after this round
        baseConstructors.forEach((c) => {
            const cId = c.Constructor.constructorId;
            cumulativeConstructorPoints[cId][roundId] = runningConstructorPoints[cId];
        });

        // Check for clinch moment at this round
        if (!clinchMoment) {
            // Sort drivers by current running points
            const currentRanked = [...baseDrivers].sort((a, b) => {
                const ptsA = runningDriverPoints[a.Driver.driverId] || 0;
                const ptsB = runningDriverPoints[b.Driver.driverId] || 0;
                return ptsB - ptsA;
            });

            if (currentRanked.length >= 2) {
                const leader = currentRanked[0];
                const chaser = currentRanked[1];
                const leaderPts = runningDriverPoints[leader.Driver.driverId] || 0;
                const chaserPts = runningDriverPoints[chaser.Driver.driverId] || 0;
                const gap = leaderPts - chaserPts;

                // Max points remaining in subsequent races after this round
                const remainingAfter = races.slice(raceIdx + 1);
                let maxPtsRemaining = 0;
                remainingAfter.forEach((r) => {
                    maxPtsRemaining += 26 + (r.hasSprint ? 8 : 0);
                });

                if (gap > maxPtsRemaining) {
                    clinchMoment = {
                        roundNumber: roundId,
                        raceName: race.raceName,
                        championId: leader.Driver.driverId,
                        championName: `${leader.Driver.givenName} ${leader.Driver.familyName}`,
                        gap,
                    };
                }
            }
        }
    });

    // Compile final simulated Driver Standings
    const simulatedDriverStandings: SimulatedDriverStanding[] = baseDrivers.map((d) => {
        const id = d.Driver.driverId;
        const basePts = parseFloat(d.points) || 0;
        const baseWins = parseInt(d.wins, 10) || 0;
        const ptsAdded = totalDriverPointsAdded[id] || 0;
        const winsAdded = totalDriverWinsAdded[id] || 0;

        return {
            ...d,
            simulatedPoints: basePts + ptsAdded,
            simulatedWins: baseWins + winsAdded,
            pointsAdded: ptsAdded,
            simulatedPosition: parseInt(d.position, 10) || 1,
            positionChange: 0,
        };
    });

    simulatedDriverStandings.sort((a, b) => {
        if (b.simulatedPoints !== a.simulatedPoints) {
            return b.simulatedPoints - a.simulatedPoints;
        }
        return b.simulatedWins - a.simulatedWins;
    });

    simulatedDriverStandings.forEach((item, index) => {
        const newPos = index + 1;
        const oldPos = parseInt(item.position, 10) || newPos;
        item.simulatedPosition = newPos;
        item.positionChange = oldPos - newPos;
    });

    // Compile final simulated Constructor Standings
    const simulatedConstructorStandings: SimulatedConstructorStanding[] = baseConstructors.map((c) => {
        const id = c.Constructor.constructorId;
        const basePts = parseFloat(c.points) || 0;
        const baseWins = parseInt(c.wins, 10) || 0;
        const ptsAdded = totalConstructorPointsAdded[id] || 0;

        return {
            ...c,
            simulatedPoints: basePts + ptsAdded,
            simulatedWins: baseWins,
            pointsAdded: ptsAdded,
            simulatedPosition: parseInt(c.position, 10) || 1,
            positionChange: 0,
        };
    });

    simulatedConstructorStandings.sort((a, b) => {
        if (b.simulatedPoints !== a.simulatedPoints) {
            return b.simulatedPoints - a.simulatedPoints;
        }
        return b.simulatedWins - a.simulatedWins;
    });

    simulatedConstructorStandings.forEach((item, index) => {
        const newPos = index + 1;
        const oldPos = parseInt(item.position, 10) || newPos;
        item.simulatedPosition = newPos;
        item.positionChange = oldPos - newPos;
    });

    return {
        roundByRoundPoints,
        cumulativeDriverPoints,
        cumulativeConstructorPoints,
        totalDriverPointsAdded,
        totalConstructorPointsAdded,
        simulatedDriverStandings,
        simulatedConstructorStandings,
        clinchMoment,
    };
}
