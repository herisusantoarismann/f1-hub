import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLiveRaceTelemetry } from "@/lib/api/openf1-client";

describe("OpenF1 Client - Live Race Telemetry", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns isLive: false and nextRace when current time is between race weekends (no live race)", async () => {
        // Mock fetch to return sessions list from OpenF1
        vi.spyOn(global, "fetch").mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            session_key: 11001,
                            session_type: "Race",
                            session_name: "Race",
                            date_start: "2026-03-15T04:00:00Z",
                            date_end: "2026-03-15T06:00:00Z",
                            circuit_key: 1,
                            circuit_short_name: "Melbourne",
                            country_name: "Australia",
                            location: "Melbourne",
                            year: 2026,
                        },
                        {
                            session_key: 11002,
                            session_type: "Race",
                            session_name: "Race",
                            date_start: "2026-04-05T06:00:00Z",
                            date_end: "2026-04-05T08:00:00Z",
                            circuit_key: 2,
                            circuit_short_name: "Suzuka",
                            country_name: "Japan",
                            location: "Suzuka",
                            year: 2026,
                        },
                    ]),
            } as any),
        );

        // Date is March 20 (between Australia and Japan races)
        const currentDate = new Date("2026-03-20T12:00:00Z");
        const result = await getLiveRaceTelemetry(currentDate);

        expect(result.isLive).toBe(false);
        expect(result.session).toBeNull();
        expect(result.nextRace?.name).toBe("Japan Grand Prix");
        expect(result.nextRace?.circuit).toBe("Suzuka");
    });

    it("returns isLive: true and compiled LiveRaceSession when a race session is currently underway", async () => {
        // Mock fetch calls for sessions, intervals, stints, weather, race_control
        const fetchSpy = vi.spyOn(global, "fetch");

        // 1. sessions
        fetchSpy.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            session_key: 9999,
                            session_type: "Race",
                            session_name: "Race",
                            date_start: "2026-03-15T04:00:00Z",
                            date_end: "2026-03-15T06:00:00Z",
                            circuit_key: 1,
                            circuit_short_name: "Melbourne",
                            country_name: "Australia",
                            location: "Melbourne",
                            year: 2026,
                        },
                    ]),
            } as any),
        );

        // 2. intervals
        fetchSpy.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { driver_number: 1, gap_to_leader: 0.0, interval: 0.0 },
                        { driver_number: 4, gap_to_leader: 2.1, interval: 2.1 },
                    ]),
            } as any),
        );

        // 3. stints
        fetchSpy.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { driver_number: 1, stint_number: 1, compound: "MEDIUM", tyre_age_at_start: 20 },
                        { driver_number: 4, stint_number: 1, compound: "HARD", tyre_age_at_start: 12 },
                    ]),
            } as any),
        );

        // 4. weather
        fetchSpy.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { track_temperature: 36, air_temperature: 25, rainfall: 0, humidity: 45 },
                    ]),
            } as any),
        );

        // 5. race_control
        fetchSpy.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { category: "Flag", flag: "GREEN", message: "TRACK CLEAR" },
                    ]),
            } as any),
        );

        // Current time is right in the middle of the Australian GP (05:00 UTC)
        const liveDate = new Date("2026-03-15T05:00:00Z");
        const result = await getLiveRaceTelemetry(liveDate);

        expect(result.isLive).toBe(true);
        expect(result.session).not.toBeNull();
        expect(result.session?.circuitName).toBe("Melbourne");
        expect(result.session?.grandPrixName).toBe("Australia Grand Prix");
        expect(result.session?.trackTempC).toBe(36);
        expect(result.session?.drivers.length).toBe(2);
        expect(result.session?.drivers[0].currentCompound).toBe("MEDIUM");
    });
});
