/**
 * Live Race Strategy & Rejoin Pit Wall Engine
 * Simulates real-time Grand Prix telemetry, pit window exit projections,
 * traffic re-entry analysis, and remaining stint calculations.
 */

import { TyreCompound, TYRE_PROPERTIES } from "./strategy-simulator";

export type RaceFlagStatus = "GREEN" | "SC" | "VSC" | "RED";

export interface LiveRaceDriver {
    position: number;
    driverId: string;
    code: string;
    name: string;
    team: string;
    teamColor: string;
    currentCompound: TyreCompound;
    tyreAge: number;
    gapToLeaderSec: number;
    intervalToAheadSec: number;
    pitStopCount: number;
    lastLapTimeSec: number;
    isPittingNow?: boolean;
}

export interface LiveRaceSession {
    circuitId: string;
    circuitName: string;
    grandPrixName: string;
    currentLap: number;
    totalLaps: number;
    flagStatus: RaceFlagStatus;
    trackTempC: number;
    airTempC: number;
    weatherCondition: "dry" | "damp" | "wet";
    normalPitLossSec: number;
    scPitLossSec: number;
    vscPitLossSec: number;
    drivers: LiveRaceDriver[];
}

export interface PitRejoinAnalysis {
    targetDriver: LiveRaceDriver;
    chosenCompound: TyreCompound;
    currentPosition: number;
    projectedPosition: number;
    pitLossAppliedSec: number;
    projectedGapToLeaderSec: number;
    rejoinsBehind: {
        code: string;
        name: string;
        gapSec: number;
    } | null;
    rejoinsAheadOf: {
        code: string;
        name: string;
        gapSec: number;
    } | null;
    trafficStatus: "CLEAN_AIR" | "DRS_TRAIN" | "DIRTY_AIR" | "CLEAR_TRACK";
    trafficDescription: string;
    remainingLaps: number;
    nextPitWindow: {
        canGoToEnd: boolean;
        recommendedNextBoxLap: number | null;
        strategyType: "1-Stop to End" | "2-Stop Sprint";
        tireLifeRemainingLaps: number;
        analysis: string;
    };
    undercutThreats: {
        driverCode: string;
        driverName: string;
        gapSec: number;
        threatLevel: "CRITICAL" | "MODERATE" | "LOW";
        advice: string;
    }[];
}

/**
 * Initial Live Race Scenario: Australian Grand Prix (Lap 24/58)
 */
export const INITIAL_LIVE_RACE_SESSION: LiveRaceSession = {
    circuitId: "albert_park",
    circuitName: "Albert Park Circuit",
    grandPrixName: "Australian Grand Prix",
    currentLap: 24,
    totalLaps: 58,
    flagStatus: "GREEN",
    trackTempC: 38,
    airTempC: 26,
    weatherCondition: "dry",
    normalPitLossSec: 21.2,
    scPitLossSec: 12.8,
    vscPitLossSec: 15.5,
    drivers: [
        {
            position: 1,
            driverId: "max_verstappen",
            code: "VER",
            name: "Max Verstappen",
            team: "Red Bull Racing",
            teamColor: "#3671C6",
            currentCompound: "MEDIUM",
            tyreAge: 24,
            gapToLeaderSec: 0.0,
            intervalToAheadSec: 0.0,
            pitStopCount: 0,
            lastLapTimeSec: 81.42,
        },
        {
            position: 2,
            driverId: "norris",
            code: "NOR",
            name: "Lando Norris",
            team: "McLaren",
            teamColor: "#FF8000",
            currentCompound: "MEDIUM",
            tyreAge: 24,
            gapToLeaderSec: 2.34,
            intervalToAheadSec: 2.34,
            pitStopCount: 0,
            lastLapTimeSec: 81.58,
        },
        {
            position: 3,
            driverId: "leclerc",
            code: "LEC",
            name: "Charles Leclerc",
            team: "Ferrari",
            teamColor: "#E80020",
            currentCompound: "HARD",
            tyreAge: 12,
            gapToLeaderSec: 8.75,
            intervalToAheadSec: 6.41,
            pitStopCount: 1,
            lastLapTimeSec: 81.35,
        },
        {
            position: 4,
            driverId: "russell",
            code: "RUS",
            name: "George Russell",
            team: "Mercedes",
            teamColor: "#27F4D2",
            currentCompound: "MEDIUM",
            tyreAge: 24,
            gapToLeaderSec: 14.2,
            intervalToAheadSec: 5.45,
            pitStopCount: 0,
            lastLapTimeSec: 81.92,
        },
        {
            position: 5,
            driverId: "piastri",
            code: "PIA",
            name: "Oscar Piastri",
            team: "McLaren",
            teamColor: "#FF8000",
            currentCompound: "HARD",
            tyreAge: 10,
            gapToLeaderSec: 19.8,
            intervalToAheadSec: 5.6,
            pitStopCount: 1,
            lastLapTimeSec: 81.4,
        },
        {
            position: 6,
            driverId: "hamilton",
            code: "HAM",
            name: "Lewis Hamilton",
            team: "Ferrari",
            teamColor: "#E80020",
            currentCompound: "MEDIUM",
            tyreAge: 24,
            gapToLeaderSec: 23.6,
            intervalToAheadSec: 3.8,
            pitStopCount: 0,
            lastLapTimeSec: 82.1,
        },
        {
            position: 7,
            driverId: "antonelli",
            code: "ANT",
            name: "Kimi Antonelli",
            team: "Mercedes",
            teamColor: "#27F4D2",
            currentCompound: "HARD",
            tyreAge: 11,
            gapToLeaderSec: 28.4,
            intervalToAheadSec: 4.8,
            pitStopCount: 1,
            lastLapTimeSec: 81.65,
        },
        {
            position: 8,
            driverId: "sainz",
            code: "SAI",
            name: "Carlos Sainz",
            team: "Williams",
            teamColor: "#00A0DE",
            currentCompound: "HARD",
            tyreAge: 24,
            gapToLeaderSec: 35.1,
            intervalToAheadSec: 6.7,
            pitStopCount: 0,
            lastLapTimeSec: 82.55,
        },
        {
            position: 9,
            driverId: "alonso",
            code: "ALO",
            name: "Fernando Alonso",
            team: "Aston Martin",
            teamColor: "#229971",
            currentCompound: "MEDIUM",
            tyreAge: 24,
            gapToLeaderSec: 41.3,
            intervalToAheadSec: 6.2,
            pitStopCount: 0,
            lastLapTimeSec: 82.8,
        },
        {
            position: 10,
            driverId: "tsunoda",
            code: "TSU",
            name: "Yuki Tsunoda",
            team: "Racing Bulls",
            teamColor: "#6692FF",
            currentCompound: "HARD",
            tyreAge: 14,
            gapToLeaderSec: 48.0,
            intervalToAheadSec: 6.7,
            pitStopCount: 1,
            lastLapTimeSec: 82.35,
        },
    ],
};

/**
 * Calculate Rejoin Position & Pit Exit Window for a Target Driver
 */
export function calculateLivePitRejoin(
    session: LiveRaceSession,
    targetDriverId: string,
    chosenCompound: TyreCompound = "HARD",
): PitRejoinAnalysis | null {
    const driver = session.drivers.find((d) => d.driverId === targetDriverId);
    if (!driver) return null;

    // 1. Determine pit loss time according to active race flag status
    let pitLoss = session.normalPitLossSec;
    if (session.flagStatus === "SC") {
        pitLoss = session.scPitLossSec;
    } else if (session.flagStatus === "VSC") {
        pitLoss = session.vscPitLossSec;
    }

    // 2. Projected gap to leader after exiting pit lane
    const projectedGap = driver.gapToLeaderSec + pitLoss;

    // 3. Find other drivers' gaps (assuming they stay on track)
    const otherDrivers = session.drivers.filter(
        (d) => d.driverId !== targetDriverId,
    );

    // Sort all cars by gap to leader including driver's projected gap
    const simulatedField = [
        ...otherDrivers.map((d) => ({
            ...d,
            isTarget: false,
            simGap: d.gapToLeaderSec,
        })),
        {
            ...driver,
            isTarget: true,
            simGap: projectedGap,
        },
    ].sort((a, b) => a.simGap - b.simGap);

    const projectedIndex = simulatedField.findIndex((d) => d.isTarget);
    const projectedPos = projectedIndex + 1;

    // Find car immediately ahead and behind
    const carAhead =
        projectedIndex > 0 ? simulatedField[projectedIndex - 1] : null;
    const carBehind =
        projectedIndex < simulatedField.length - 1
            ? simulatedField[projectedIndex + 1]
            : null;

    const gapToAhead = carAhead ? projectedGap - carAhead.simGap : 0;
    const gapToBehind = carBehind ? carBehind.simGap - projectedGap : 0;

    // 4. Traffic & Airflow analysis
    let trafficStatus: PitRejoinAnalysis["trafficStatus"] = "CLEAN_AIR";
    let trafficDesc = "";

    if (carAhead && gapToAhead < 1.0) {
        trafficStatus = "DRS_TRAIN";
        trafficDesc = `Keluar tepat di belakang ${carAhead.name} (+${gapToAhead.toFixed(
            1,
        )}s) dalam zona DRS. Berisiko tertahan jika mobil di depan bertahan ketat.`;
    } else if (carAhead && gapToAhead < 2.0) {
        trafficStatus = "DIRTY_AIR";
        trafficDesc = `Keluar di udara kotor (*dirty air*) di belakang ${carAhead.name} (+${gapToAhead.toFixed(
            1,
        )}s). Degradasi ban depan meningkat jika tidak segera menyalip.`;
    } else if (carAhead && gapToAhead >= 2.0) {
        trafficStatus = "CLEAN_AIR";
        trafficDesc = `Udara bersih (*clean air*)! Jarak ke ${carAhead.name} di depan cukup longgar (+${gapToAhead.toFixed(
            1,
        )}s). Sangat optimal untuk push lap out!`;
    } else {
        trafficStatus = "CLEAR_TRACK";
        trafficDesc = `Memimpin balapan! Keluar di posisi P1 dengan keunggulan ${gapToBehind.toFixed(
            1,
        )}s di depan ${carBehind?.name || "posisi 2"}.`;
    }

    // 5. Remaining Laps & Next Pit Window Strategy
    const remainingLaps = session.totalLaps - session.currentLap;
    const prop = TYRE_PROPERTIES[chosenCompound];
    const canGoToEnd = remainingLaps <= prop.cliffLap;

    let strategyType: "1-Stop to End" | "2-Stop Sprint" = canGoToEnd
        ? "1-Stop to End"
        : "2-Stop Sprint";
    let recommendedNextBoxLap: number | null = null;
    let nextStintAnalysis = "";

    if (chosenCompound === "HARD") {
        if (remainingLaps <= 38) {
            strategyType = "1-Stop to End";
            recommendedNextBoxLap = null;
            nextStintAnalysis = `Ban Hard mampu bertahan hingga lap finis (${remainingLaps} lap tersisa). Tidak perlu pit lagi (1-Stop to End). Manajemen ban stabil.`;
        } else {
            strategyType = "2-Stop Sprint";
            recommendedNextBoxLap = session.currentLap + 24;
            nextStintAnalysis = `Sisa ${remainingLaps} lap terlalu panjang untuk 1 set ban Hard. Disarankan pit kembali di Lap ${recommendedNextBoxLap} untuk ban Medium/Soft.`;
        }
    } else if (chosenCompound === "MEDIUM") {
        if (remainingLaps <= 22) {
            strategyType = "1-Stop to End";
            recommendedNextBoxLap = null;
            nextStintAnalysis = `Ban Medium optimal untuk menghabiskan ${remainingLaps} lap terakhir dengan pace tinggi hingga chequered flag.`;
        } else {
            strategyType = "2-Stop Sprint";
            recommendedNextBoxLap = Math.min(
                session.totalLaps - 5,
                session.currentLap + 18,
            );
            nextStintAnalysis = `Ban Medium akan drop cliff sekitar Lap ${session.currentLap + 22}. Butuh pit stop kedua di kisaran Lap ${recommendedNextBoxLap} untuk ganti ke Soft/Hard.`;
        }
    } else {
        // Soft
        recommendedNextBoxLap = Math.min(
            session.totalLaps - 3,
            session.currentLap + 12,
        );
        strategyType = "2-Stop Sprint";
        nextStintAnalysis = `Ban Soft hanya bertahan 10-14 lap. Wajib pit stop kedua di Lap ${recommendedNextBoxLap}. Strategi sprint agresif untuk mengejar posisi.`;
    }

    // 6. Undercut Threats Detector (cars trailing within 2.8s)
    const undercutThreats: PitRejoinAnalysis["undercutThreats"] = [];
    session.drivers.forEach((d) => {
        if (d.position > driver.position) {
            const gapBehind = d.gapToLeaderSec - driver.gapToLeaderSec;
            if (gapBehind > 0 && gapBehind <= 2.8) {
                undercutThreats.push({
                    driverCode: d.code,
                    driverName: d.name,
                    gapSec: gapBehind,
                    threatLevel: gapBehind < 1.5 ? "CRITICAL" : "MODERATE",
                    advice:
                        gapBehind < 1.5
                            ? `${d.code} berada di ancaman undercut kritis (${gapBehind.toFixed(
                                  1,
                              )}s). Jika mereka box sekarang, mereka berpotensi menyalip di pit exit!`
                            : `${d.code} dalam jangkauan pit window (${gapBehind.toFixed(
                                  1,
                              )}s). Bersiap merespons lap berikutnya.`,
                });
            }
        }
    });

    return {
        targetDriver: driver,
        chosenCompound,
        currentPosition: driver.position,
        projectedPosition: projectedPos,
        pitLossAppliedSec: pitLoss,
        projectedGapToLeaderSec: projectedGap,
        rejoinsBehind: carAhead
            ? {
                  code: carAhead.code,
                  name: carAhead.name,
                  gapSec: gapToAhead,
              }
            : null,
        rejoinsAheadOf: carBehind
            ? {
                  code: carBehind.code,
                  name: carBehind.name,
                  gapSec: gapToBehind,
              }
            : null,
        trafficStatus,
        trafficDescription: trafficDesc,
        remainingLaps,
        nextPitWindow: {
            canGoToEnd,
            recommendedNextBoxLap,
            strategyType,
            tireLifeRemainingLaps: prop.cliffLap,
            analysis: nextStintAnalysis,
        },
        undercutThreats,
    };
}
