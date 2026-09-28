import {
    Circuit,
    Constructor,
    ConstructorDetail,
    ConstructorStanding,
    ConstructorWithDetails,
    Driver,
    DriverDetail,
    DriverStanding,
    DriverWithTeam,
    JolpicaF1Response,
    Race,
    RaceResult,
    RaceStatus,
    RaceWithStatus,
} from "@/types/f1";
import {
    TEAMS_DATABASE,
    getTeamTechnicalProfile,
    getOfficialTeamName,
    getAllReserveDrivers,
} from "@/data/teams-database";

export const F1_CACHE_TAGS = {
    SCHEDULE: "f1-schedule",
    DRIVER_STANDINGS: "f1-driver-standings",
    CONSTRUCTOR_STANDINGS: "f1-constructor-standings",
    DRIVERS: "f1-drivers",
    CONSTRUCTORS: "f1-constructors",
    RACE_RESULTS: "f1-race-results",
    CIRCUITS: "f1-circuits",
} as const;

export class F1ApiClient {
    private readonly baseUrl: string;
    private readonly defaultRevalidate: number;

    constructor(
        baseUrl: string = "https://api.jolpi.ca/ergast/f1",
        defaultRevalidate: number = 86400, // 24 hours default caching for stable schedule data
    ) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.defaultRevalidate = defaultRevalidate;
    }

    /**
     * Internal generic request handler utilizing Next.js fetch cache extensions
     */
    private async fetchFromApi<T>(
        endpoint: string,
        tags: string[],
        revalidateSeconds: number = this.defaultRevalidate,
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
                next: {
                    revalidate: revalidateSeconds,
                    tags,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `[F1ApiClient] HTTP error! Status: ${response.status} - ${response.statusText} on ${url}`,
                );
            }

            return (await response.json()) as T;
        } catch (error) {
            console.error(`[F1ApiClient] Fetch error fetching ${url}:`, error);
            throw error;
        }
    }

    /**
     * Fetch full season race calendar
     * @param season year or 'current' (default: 'current')
     */
    async getSeasonSchedule(
        season: string | number = "current",
    ): Promise<Race[]> {
        const data = await this.fetchFromApi<JolpicaF1Response<Race>>(
            `/${season}/races.json`,
            [F1_CACHE_TAGS.SCHEDULE, `f1-schedule-${season}`],
        );

        return data.MRData.RaceTable?.Races ?? [];
    }

    /**
     * Fetch full season race calendar annotated with calculated status (completed, next, upcoming)
     */
    async getAnnotatedSchedule(
        season: string | number = "current",
        referenceDate: Date = new Date(),
    ): Promise<RaceWithStatus[]> {
        const races = await this.getSeasonSchedule(season);
        const now = referenceDate.getTime();

        let foundNext = false;

        return races.map((race) => {
            const raceDateTime = new Date(
                `${race.date}T${race.time ?? "13:00:00Z"}`,
            ).getTime();
            const diffMs = raceDateTime - now;
            const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            let status: RaceStatus = "completed";

            if (diffMs > 0) {
                if (!foundNext) {
                    status = "next";
                    foundNext = true;
                } else {
                    status = "upcoming";
                }
            }

            return {
                ...race,
                status,
                daysRemaining: diffMs > 0 ? daysRemaining : undefined,
            };
        });
    }

    /**
     * Fetch current driver championship standings
     */
    async getDriverStandings(
        season: string | number = "current",
    ): Promise<DriverStanding[]> {
        const data = await this.fetchFromApi<JolpicaF1Response<unknown>>(
            `/${season}/driverstandings.json?limit=100`,
            [F1_CACHE_TAGS.DRIVER_STANDINGS, `f1-driver-standings-${season}`],
            3600, // 1 hour revalidation
        );

        const standings =
            data.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings ??
            [];
        return standings;
    }

    /**
     * Fetch current constructor championship standings
     */
    async getConstructorStandings(
        season: string | number = "current",
    ): Promise<ConstructorStanding[]> {
        const data = await this.fetchFromApi<JolpicaF1Response<unknown>>(
            `/${season}/constructorstandings.json?limit=100`,
            [
                F1_CACHE_TAGS.CONSTRUCTOR_STANDINGS,
                `f1-constructor-standings-${season}`,
            ],
            3600,
        );

        const standings =
            data.MRData.StandingsTable?.StandingsLists[0]
                ?.ConstructorStandings ?? [];
        return standings;
    }

    /**
     * Fetch all drivers for the current or specified season, enriched with team & standing data.
     * Guarantees all official team drivers are present and mapped accurately to their constructors.
     */
    async getDrivers(
        season: string | number = "current",
    ): Promise<DriverWithTeam[]> {
        try {
            const [driversData, standingsData] = await Promise.all([
                this.fetchFromApi<JolpicaF1Response<unknown>>(
                    `/${season}/drivers.json?limit=100`,
                    [F1_CACHE_TAGS.DRIVERS, `f1-drivers-${season}`],
                    86400,
                ).catch(
                    () => ({ MRData: { DriverTable: { Drivers: [] } } }) as any,
                ),
                this.getDriverStandings(season).catch(
                    () => [] as DriverStanding[],
                ),
            ]);

            const rawDrivers = driversData.MRData?.DriverTable?.Drivers ?? [];
            const standingsMap = new Map<string, DriverStanding>();

            standingsData.forEach((st) => {
                standingsMap.set(st.Driver.driverId, st);
            });

            const rawMap = new Map<string, Driver>();
            rawDrivers.forEach((d: Driver) => {
                rawMap.set(d.driverId, d);
            });

            const activeDriversList: DriverWithTeam[] = [];
            const processedIds = new Set<string>();

            // 1. First, guarantee official race drivers for all constructors from TEAMS_DATABASE
            for (const key of Object.keys(TEAMS_DATABASE)) {
                const teamProfile = TEAMS_DATABASE[key];
                for (const ad of teamProfile.activeDrivers) {
                    processedIds.add(ad.driverId);
                    const raw = rawMap.get(ad.driverId);
                    const standing = standingsMap.get(ad.driverId);

                    const teamObj: Constructor = {
                        constructorId: teamProfile.constructorId,
                        name: teamProfile.officialTeamName,
                        nationality: teamProfile.headquarters.country,
                        url: "",
                    };

                    activeDriversList.push({
                        driverId: ad.driverId,
                        permanentNumber:
                            ad.permanentNumber || raw?.permanentNumber,
                        code: ad.code || raw?.code,
                        url:
                            raw?.url ||
                            `https://en.wikipedia.org/wiki/${ad.givenName}_${ad.familyName}`,
                        givenName: ad.givenName,
                        familyName: ad.familyName,
                        nationality: ad.nationality,
                        dateOfBirth: raw?.dateOfBirth,
                        team: teamObj,
                        points: standing?.points,
                        position: standing?.position,
                        wins: standing?.wins,
                        isReserve: false,
                    });
                }
            }

            // 2. Add any additional drivers from Jolpica API that competed in the season
            for (const raw of rawDrivers) {
                if (!processedIds.has(raw.driverId)) {
                    processedIds.add(raw.driverId);
                    const standing = standingsMap.get(raw.driverId);
                    const constructorObj = standing?.Constructors?.[0];
                    const officialName = constructorObj
                        ? getOfficialTeamName(
                              constructorObj.constructorId,
                              constructorObj.name,
                          )
                        : undefined;

                    activeDriversList.push({
                        ...raw,
                        team: constructorObj
                            ? {
                                  ...constructorObj,
                                  name: officialName || constructorObj.name,
                              }
                            : undefined,
                        points: standing?.points,
                        position: standing?.position,
                        wins: standing?.wins,
                        isReserve: false,
                    });
                }
            }

            // Sort by championship position if available, then family name
            return activeDriversList.sort((a, b) => {
                if (a.position && b.position) {
                    return parseInt(a.position, 10) - parseInt(b.position, 10);
                }
                if (a.position) return -1;
                if (b.position) return 1;
                return a.familyName.localeCompare(b.familyName);
            });
        } catch (error) {
            console.error(
                `[F1ApiClient] Failed to get drivers for season ${season}:`,
                error,
            );
            return [];
        }
    }

    /**
     * Fetch all drivers including official team reserve & test drivers
     */
    async getAllDriversWithReserves(
        season: string | number = "current",
    ): Promise<DriverWithTeam[]> {
        const activeDrivers = await this.getDrivers(season);
        const reserves = getAllReserveDrivers();

        const reserveDriversList: DriverWithTeam[] = reserves.map((r) => ({
            driverId: r.driverId,
            permanentNumber: r.permanentNumber || "–",
            givenName: r.givenName,
            familyName: r.familyName,
            nationality: r.nationality,
            url: `https://en.wikipedia.org/wiki/${r.givenName}_${r.familyName}`,
            team: {
                constructorId: r.constructorId,
                name: r.officialTeamName,
                nationality: "",
                url: "",
            },
            isReserve: true,
            reserveRole: r.role,
        }));

        return [...activeDrivers, ...reserveDriversList];
    }

    /**
     * Fetch detailed profile and career standing for a specific driver
     */
    async getDriverDetails(driverId: string): Promise<DriverDetail | null> {
        try {
            const [driverRes, standingsRes] = await Promise.all([
                this.fetchFromApi<JolpicaF1Response<unknown>>(
                    `/drivers/${driverId}.json`,
                    [F1_CACHE_TAGS.DRIVERS, `f1-driver-${driverId}`],
                    86400,
                ).catch(() => null),
                this.fetchFromApi<JolpicaF1Response<unknown>>(
                    `/current/drivers/${driverId}/driverstandings.json?limit=100`,
                    [
                        F1_CACHE_TAGS.DRIVER_STANDINGS,
                        `f1-driver-standing-${driverId}`,
                    ],
                    3600,
                ).catch(() => null),
            ]);

            let driver = driverRes?.MRData?.DriverTable?.Drivers?.[0];
            const standing =
                standingsRes?.MRData?.StandingsTable?.StandingsLists?.[0]
                    ?.DriverStandings?.[0];
            let team = standing?.Constructors?.[0];

            // If not found in Jolpica, fall back to TEAMS_DATABASE for active or reserve drivers
            if (!driver) {
                for (const key of Object.keys(TEAMS_DATABASE)) {
                    const prof = TEAMS_DATABASE[key];
                    const activeMatch = prof.activeDrivers.find(
                        (d) => d.driverId === driverId,
                    );
                    if (activeMatch) {
                        driver = {
                            driverId: activeMatch.driverId,
                            permanentNumber: activeMatch.permanentNumber,
                            code:
                                activeMatch.code ||
                                activeMatch.familyName
                                    .substring(0, 3)
                                    .toUpperCase(),
                            url: `https://en.wikipedia.org/wiki/${activeMatch.givenName}_${activeMatch.familyName}`,
                            givenName: activeMatch.givenName,
                            familyName: activeMatch.familyName,
                            nationality: activeMatch.nationality,
                        };
                        team = {
                            constructorId: prof.constructorId,
                            name: prof.officialTeamName,
                            nationality: prof.headquarters.country,
                            url: "",
                        };
                        break;
                    }

                    const reserveMatch = prof.reserveDrivers.find(
                        (r) => r.driverId === driverId,
                    );
                    if (reserveMatch) {
                        driver = {
                            driverId: reserveMatch.driverId,
                            permanentNumber:
                                reserveMatch.permanentNumber || "–",
                            code: reserveMatch.familyName
                                .substring(0, 3)
                                .toUpperCase(),
                            url: `https://en.wikipedia.org/wiki/${reserveMatch.givenName}_${reserveMatch.familyName}`,
                            givenName: reserveMatch.givenName,
                            familyName: reserveMatch.familyName,
                            nationality: reserveMatch.nationality,
                        };
                        team = {
                            constructorId: prof.constructorId,
                            name: prof.officialTeamName,
                            nationality: prof.headquarters.country,
                            url: "",
                        };
                        break;
                    }
                }
            }

            if (!driver) return null;

            if (team) {
                team = {
                    ...team,
                    name: getOfficialTeamName(team.constructorId, team.name),
                };
            }

            return {
                driver,
                standing,
                team,
            };
        } catch (error) {
            console.error(
                `[F1ApiClient] Error fetching driver details for ${driverId}:`,
                error,
            );
            return null;
        }
    }

    /**
     * Fetch constructors for the season, enriched with standings and points
     */
    async getConstructors(
        season: string | number = "current",
    ): Promise<ConstructorWithDetails[]> {
        try {
            const [constructorsData, standingsData] = await Promise.all([
                this.fetchFromApi<JolpicaF1Response<unknown>>(
                    `/${season}/constructors.json?limit=100`,
                    [F1_CACHE_TAGS.CONSTRUCTORS, `f1-constructors-${season}`],
                    86400,
                ),
                this.getConstructorStandings(season).catch(
                    () => [] as ConstructorStanding[],
                ),
            ]);

            const rawConstructors =
                constructorsData.MRData.ConstructorTable?.Constructors ?? [];
            const standingsMap = new Map<string, ConstructorStanding>();

            standingsData.forEach((st) => {
                standingsMap.set(st.Constructor.constructorId, st);
            });

            const enriched: ConstructorWithDetails[] = rawConstructors.map(
                (c) => {
                    const standing = standingsMap.get(c.constructorId);
                    return {
                        ...c,
                        name: getOfficialTeamName(c.constructorId, c.name),
                        standing,
                    };
                },
            );

            // Ensure all 11 teams in TEAMS_DATABASE (including Cadillac) are listed
            const existingIds = new Set(enriched.map((c) => c.constructorId));
            for (const key of Object.keys(TEAMS_DATABASE)) {
                const team = TEAMS_DATABASE[key];
                if (!existingIds.has(team.constructorId)) {
                    existingIds.add(team.constructorId);
                    enriched.push({
                        constructorId: team.constructorId,
                        name: team.officialTeamName,
                        nationality: team.headquarters.country,
                        url: "",
                    });
                }
            }

            // Sort by constructor standing rank if available
            return enriched.sort((a, b) => {
                if (a.standing?.position && b.standing?.position) {
                    return (
                        parseInt(a.standing.position, 10) -
                        parseInt(b.standing.position, 10)
                    );
                }
                if (a.standing?.position) return -1;
                if (b.standing?.position) return 1;
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error(
                `[F1ApiClient] Failed to get constructors for season ${season}:`,
                error,
            );
            return [];
        }
    }

    /**
     * Fetch constructor by ID
     */
    async getConstructor(constructorId: string): Promise<Constructor | null> {
        try {
            const data = await this.fetchFromApi<JolpicaF1Response<unknown>>(
                `/constructors/${constructorId}.json`,
                [F1_CACHE_TAGS.CONSTRUCTORS, `f1-constructor-${constructorId}`],
                86400,
            );
            const found = data.MRData.ConstructorTable?.Constructors?.[0];
            if (found) {
                return {
                    ...found,
                    name: getOfficialTeamName(found.constructorId, found.name),
                };
            }
            const techProfile = getTeamTechnicalProfile(constructorId);
            if (techProfile) {
                return {
                    constructorId: techProfile.constructorId,
                    name: techProfile.officialTeamName,
                    nationality: techProfile.headquarters.country,
                    url: "",
                };
            }
            return null;
        } catch {
            const techProfile = getTeamTechnicalProfile(constructorId);
            if (techProfile) {
                return {
                    constructorId: techProfile.constructorId,
                    name: techProfile.officialTeamName,
                    nationality: techProfile.headquarters.country,
                    url: "",
                };
            }
            return null;
        }
    }

    /**
     * Fetch detailed profile, standings, and active drivers for a specific constructor
     */
    async getConstructorDetails(
        constructorId: string,
    ): Promise<ConstructorDetail | null> {
        try {
            const [constructorRes, standingsRes, driversRes] =
                await Promise.all([
                    this.fetchFromApi<JolpicaF1Response<unknown>>(
                        `/constructors/${constructorId}.json`,
                        [
                            F1_CACHE_TAGS.CONSTRUCTORS,
                            `f1-constructor-${constructorId}`,
                        ],
                        86400,
                    ).catch(() => null),
                    this.fetchFromApi<JolpicaF1Response<unknown>>(
                        `/current/constructors/${constructorId}/constructorstandings.json?limit=100`,
                        [
                            F1_CACHE_TAGS.CONSTRUCTOR_STANDINGS,
                            `f1-constructor-standing-${constructorId}`,
                        ],
                        3600,
                    ).catch(() => null),
                    this.fetchFromApi<JolpicaF1Response<unknown>>(
                        `/current/constructors/${constructorId}/drivers.json?limit=100`,
                        [
                            F1_CACHE_TAGS.DRIVERS,
                            `f1-constructor-drivers-${constructorId}`,
                        ],
                        86400,
                    ).catch(() => null),
                ]);

            let constructor =
                constructorRes?.MRData?.ConstructorTable?.Constructors?.[0];
            const techProfile = getTeamTechnicalProfile(constructorId);

            if (!constructor && techProfile) {
                constructor = {
                    constructorId: techProfile.constructorId,
                    name: techProfile.officialTeamName,
                    nationality: techProfile.headquarters.country,
                    url: "",
                };
            }

            if (!constructor) return null;

            constructor = {
                ...constructor,
                name: getOfficialTeamName(
                    constructor.constructorId,
                    constructor.name,
                ),
            };

            const standing =
                standingsRes?.MRData?.StandingsTable?.StandingsLists?.[0]
                    ?.ConstructorStandings?.[0];

            // Build drivers list: ensure all official active drivers are present!
            const apiDrivers = driversRes?.MRData?.DriverTable?.Drivers ?? [];
            const drivers: Driver[] = [];
            const driverIds = new Set<string>();

            if (techProfile?.activeDrivers) {
                for (const ad of techProfile.activeDrivers) {
                    driverIds.add(ad.driverId);
                    const matchedApi = apiDrivers.find(
                        (d: any) => d.driverId === ad.driverId,
                    );
                    drivers.push({
                        driverId: ad.driverId,
                        permanentNumber:
                            ad.permanentNumber || matchedApi?.permanentNumber,
                        code: ad.code || matchedApi?.code,
                        url:
                            matchedApi?.url ||
                            `https://en.wikipedia.org/wiki/${ad.givenName}_${ad.familyName}`,
                        givenName: ad.givenName,
                        familyName: ad.familyName,
                        nationality: ad.nationality,
                    });
                }
            }

            // Also keep any other driver from API not in activeDrivers
            for (const d of apiDrivers) {
                if (!driverIds.has(d.driverId)) {
                    driverIds.add(d.driverId);
                    drivers.push(d);
                }
            }

            return {
                constructor,
                standing,
                drivers,
            };
        } catch (error) {
            console.error(
                `[F1ApiClient] Error fetching constructor details for ${constructorId}:`,
                error,
            );
            return null;
        }
    }

    /**
     * Fetch race details, circuit info, and timetable for a specific round
     */
    async getRaceDetails(
        round: string,
        season: string | number = "current",
    ): Promise<Race | null> {
        try {
            const data = await this.fetchFromApi<JolpicaF1Response<Race>>(
                `/${season}/${round}.json`,
                [F1_CACHE_TAGS.SCHEDULE, `f1-race-${season}-${round}`],
                86400, // 24 hours
            );
            return data.MRData.RaceTable?.Races?.[0] ?? null;
        } catch {
            // Fallback: look up in full season schedule
            const schedule = await this.getSeasonSchedule(season);
            return schedule.find((r) => r.round === round) ?? null;
        }
    }

    /**
     * Fetch final classification race results for a specific round
     */
    async getRaceResults(
        round: string,
        season: string | number = "current",
    ): Promise<RaceResult[]> {
        try {
            const data = await this.fetchFromApi<JolpicaF1Response<Race>>(
                `/${season}/${round}/results.json`,
                [F1_CACHE_TAGS.RACE_RESULTS, `f1-results-${season}-${round}`],
                3600, // 1 hour revalidation
            );
            return data.MRData.RaceTable?.Races?.[0]?.Results ?? [];
        } catch (error) {
            console.error(
                `[F1ApiClient] Error fetching race results for round ${round}:`,
                error,
            );
            return [];
        }
    }

    /**
     * Fetch list of circuits for a given season or current
     */
    async getCircuits(season: string | number = "current"): Promise<Circuit[]> {
        try {
            const data = await this.fetchFromApi<JolpicaF1Response<Circuit>>(
                `/${season}/circuits.json?limit=100`,
                [F1_CACHE_TAGS.CIRCUITS, `f1-circuits-${season}`],
                86400, // 24 hours
            );
            return data.MRData.CircuitTable?.Circuits ?? [];
            return data.MRData.CircuitTable?.Circuits ?? [];
        } catch (error) {
            console.error(
                `[F1ApiClient] Error fetching circuits for ${season}:`,
                error,
            );
            // Fallback: extract circuits from season schedule
            const schedule = await this.getSeasonSchedule(season);
            const circuitMap = new Map<string, Circuit>();
            for (const race of schedule) {
                if (race.Circuit) {
                    circuitMap.set(race.Circuit.circuitId, race.Circuit);
                }
            }
            return Array.from(circuitMap.values());
        }
    }

    /**
     * Fetch specific circuit details by circuitId
     */
    async getCircuitDetails(
        circuitId: string,
        season: string | number = "current",
    ): Promise<Circuit | null> {
        const cleanId = circuitId.toLowerCase().trim();
        const mappedId = cleanId === "madrid" ? "madring" : cleanId;

        try {
            const data = await this.fetchFromApi<JolpicaF1Response<Circuit>>(
                `/${season}/circuits/${mappedId}.json`,
                [F1_CACHE_TAGS.CIRCUITS, `f1-circuit-${mappedId}`],
                86400,
            );
            const found = data.MRData.CircuitTable?.Circuits?.[0];
            if (found) return found;
        } catch {
            // continue to fallback
        }

        // Fallback: search in getCircuits
        const circuits = await this.getCircuits(season);
        return (
            circuits.find(
                (c) =>
                    c.circuitId.toLowerCase() === cleanId ||
                    c.circuitId.toLowerCase() === mappedId,
            ) ?? null
        );
    }

    /**
     * Fetch next upcoming race on the calendar
     */
    async getNextRace(): Promise<Race | null> {
        try {
            const data = await this.fetchFromApi<JolpicaF1Response<Race>>(
                "/current/next.json",
                [F1_CACHE_TAGS.SCHEDULE],
                1800, // 30 minutes
            );
            return data.MRData.RaceTable?.Races[0] ?? null;
        } catch {
            // Fallback: deduce from annotated schedule
            const schedule = await this.getAnnotatedSchedule();
            return schedule.find((r) => r.status === "next") ?? null;
        }
    }
}

// Export singleton instance for app-wide use
export const f1Client = new F1ApiClient();
