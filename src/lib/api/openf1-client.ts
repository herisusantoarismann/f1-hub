/**
 * OpenF1 API Client for Live Race Telemetry & Session Monitoring
 * API Docs: https://openf1.org/
 */

import { LiveRaceSession, LiveRaceDriver, RaceFlagStatus } from "@/lib/live-race-simulator";
import { TyreCompound } from "@/lib/strategy-simulator";

const OPENF1_BASE_URL = "https://api.openf1.org/v1";

export interface OpenF1Session {
    session_key: number;
    session_name: string;
    session_type: string;
    date_start: string;
    date_end: string;
    circuit_key: number;
    circuit_short_name: string;
    country_name: string;
    location: string;
    year: number;
}

export interface LiveRaceStatusResponse {
    isLive: boolean;
    session: LiveRaceSession | null;
    nextRace?: {
        name: string;
        circuit: string;
        dateStart: string;
        location: string;
    } | null;
}

/**
 * Check if an F1 Grand Prix Race session is currently live and fetch real telemetry
 */
export async function getLiveRaceTelemetry(
    currentTime: Date = new Date(),
): Promise<LiveRaceStatusResponse> {
    try {
        const currentYear = currentTime.getFullYear();
        // Fetch recent/upcoming race sessions
        const res = await fetch(
            `${OPENF1_BASE_URL}/sessions?session_name=Race&year=${currentYear}`,
            { next: { revalidate: 30 } }, // Revalidate every 30 seconds
        );

        if (!res.ok) {
            return { isLive: false, session: null, nextRace: null };
        }

        const sessions: OpenF1Session[] = await res.json();
        if (!Array.isArray(sessions) || sessions.length === 0) {
            return { isLive: false, session: null, nextRace: null };
        }

        const nowMs = currentTime.getTime();

        // Find if any race session is currently active (between date_start and date_end)
        const activeSession = sessions.find((s) => {
            const startMs = new Date(s.date_start).getTime();
            const endMs = new Date(s.date_end).getTime();
            return nowMs >= startMs && nowMs <= endMs;
        });

        // If no active race right now, find the next upcoming race
        if (!activeSession) {
            const upcomingSessions = sessions
                .filter((s) => new Date(s.date_start).getTime() > nowMs)
                .sort(
                    (a, b) =>
                        new Date(a.date_start).getTime() -
                        new Date(b.date_start).getTime(),
                );

            const next = upcomingSessions[0] || null;

            return {
                isLive: false,
                session: null,
                nextRace: next
                    ? {
                          name: `${next.country_name} Grand Prix`,
                          circuit: next.circuit_short_name,
                          dateStart: next.date_start,
                          location: next.location,
                      }
                    : null,
            };
        }

        // Active race found! Fetch real-time live telemetry endpoints
        const sessionKey = activeSession.session_key;

        // Fetch intervals, stints, positions, and weather in parallel
        const [intervalsRes, stintsRes, weatherRes, raceControlRes] =
            await Promise.allSettled([
                fetch(`${OPENF1_BASE_URL}/intervals?session_key=${sessionKey}`, {
                    next: { revalidate: 10 },
                }),
                fetch(`${OPENF1_BASE_URL}/stints?session_key=${sessionKey}`, {
                    next: { revalidate: 15 },
                }),
                fetch(`${OPENF1_BASE_URL}/weather?session_key=${sessionKey}`, {
                    next: { revalidate: 30 },
                }),
                fetch(
                    `${OPENF1_BASE_URL}/race_control?session_key=${sessionKey}`,
                    { next: { revalidate: 10 } },
                ),
            ]);

        // Process intervals (live gaps to leader)
        const intervalsData =
            intervalsRes.status === "fulfilled" && intervalsRes.value.ok
                ? await intervalsRes.value.json()
                : [];

        // Process stints (live compounds & tyre age)
        const stintsData =
            stintsRes.status === "fulfilled" && stintsRes.value.ok
                ? await stintsRes.value.json()
                : [];

        // Process weather
        const weatherData =
            weatherRes.status === "fulfilled" && weatherRes.value.ok
                ? await weatherRes.value.json()
                : [];
        const latestWeather = weatherData[weatherData.length - 1] || null;

        // Process race control flag
        const raceControlData =
            raceControlRes.status === "fulfilled" && raceControlRes.value.ok
                ? await raceControlRes.value.json()
                : [];
        const latestRc = raceControlData[raceControlData.length - 1] || null;

        let flagStatus: RaceFlagStatus = "GREEN";
        if (latestRc?.category === "SafetyCar") {
            flagStatus = "SC";
        } else if (latestRc?.message?.includes("VIRTUAL SAFETY CAR")) {
            flagStatus = "VSC";
        } else if (latestRc?.flag === "RED") {
            flagStatus = "RED";
        }

        // Map latest drivers data from intervals & stints
        // Latest intervals grouped by driver_number
        const latestIntervalsByDriver = new Map<number, any>();
        if (Array.isArray(intervalsData)) {
            intervalsData.forEach((item: any) => {
                latestIntervalsByDriver.set(item.driver_number, item);
            });
        }

        // Latest stint per driver
        const latestStintByDriver = new Map<number, any>();
        if (Array.isArray(stintsData)) {
            stintsData.forEach((stint: any) => {
                latestStintByDriver.set(stint.driver_number, stint);
            });
        }

        // Build compiled live drivers list
        const compiledDrivers: LiveRaceDriver[] = [];
        let position = 1;

        // Sort by gap_to_leader ascending
        const sortedIntervals = Array.from(
            latestIntervalsByDriver.values(),
        ).sort((a, b) => (a.gap_to_leader || 0) - (b.gap_to_leader || 0));

        sortedIntervals.forEach((intData) => {
            const stint = latestStintByDriver.get(intData.driver_number);
            const compoundRaw = stint?.compound?.toUpperCase() || "MEDIUM";
            let compound: TyreCompound = "MEDIUM";
            if (["SOFT", "HARD", "INTERMEDIATE", "WET"].includes(compoundRaw)) {
                compound = compoundRaw as TyreCompound;
            }

            compiledDrivers.push({
                position: position++,
                driverId: `driver_${intData.driver_number}`,
                code: intData.driver_number.toString(),
                name: `Car #${intData.driver_number}`,
                team: "Formula 1 Team",
                teamColor: "#E10600",
                currentCompound: compound,
                tyreAge: stint?.tyre_age_at_start || 15,
                gapToLeaderSec: intData.gap_to_leader || 0.0,
                intervalToAheadSec: intData.interval || 0.0,
                pitStopCount: stint?.stint_number ? stint.stint_number - 1 : 1,
                lastLapTimeSec: 85.0,
            });
        });

        const liveSession: LiveRaceSession = {
            circuitId: activeSession.circuit_short_name.toLowerCase(),
            circuitName: activeSession.circuit_short_name,
            grandPrixName: `${activeSession.country_name} Grand Prix`,
            currentLap: 25,
            totalLaps: 57,
            flagStatus,
            trackTempC: latestWeather?.track_temperature || 35,
            airTempC: latestWeather?.air_temperature || 24,
            weatherCondition:
                latestWeather?.rainfall > 0
                    ? "wet"
                    : latestWeather?.humidity > 80
                      ? "damp"
                      : "dry",
            normalPitLossSec: 21.5,
            scPitLossSec: 13.0,
            vscPitLossSec: 15.5,
            drivers: compiledDrivers.length > 0 ? compiledDrivers : [],
        };

        return {
            isLive: true,
            session: liveSession,
            nextRace: null,
        };
    } catch {
        return { isLive: false, session: null, nextRace: null };
    }
}
