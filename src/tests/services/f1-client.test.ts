import { describe, it, expect, vi, beforeEach } from "vitest";
import { F1ApiClient, F1_CACHE_TAGS } from "@/lib/api/f1-client";

describe("F1ApiClient (Service Layer Integration)", () => {
    let client: F1ApiClient;

    beforeEach(() => {
        client = new F1ApiClient("https://api.jolpi.ca/ergast/f1");
        vi.restoreAllMocks();
    });

    it("fetches and extracts the season race calendar", async () => {
        const mockApiResponse = {
            MRData: {
                xmlns: "http://ergast.com/mrd/1.5",
                series: "f1",
                url: "https://api.jolpi.ca/ergast/f1/2024/races.json",
                limit: "30",
                offset: "0",
                total: "1",
                RaceTable: {
                    season: "2024",
                    Races: [
                        {
                            season: "2024",
                            round: "1",
                            url: "https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix",
                            raceName: "Bahrain Grand Prix",
                            Circuit: {
                                circuitId: "bahrain",
                                url: "https://en.wikipedia.org/wiki/Bahrain_International_Circuit",
                                circuitName: "Bahrain International Circuit",
                                Location: {
                                    lat: "26.0325",
                                    long: "50.5106",
                                    locality: "Sakhir",
                                    country: "Bahrain",
                                },
                            },
                            date: "2024-03-02",
                            time: "15:00:00Z",
                        },
                    ],
                },
            },
        };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockApiResponse,
        });
        global.fetch = fetchMock;

        const schedule = await client.getSeasonSchedule("2024");

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.jolpi.ca/ergast/f1/2024/races.json",
            expect.objectContaining({
                next: expect.objectContaining({
                    tags: expect.arrayContaining([
                        F1_CACHE_TAGS.SCHEDULE,
                        "f1-schedule-2024",
                    ]),
                }),
            }),
        );
        expect(schedule).toHaveLength(1);
        expect(schedule[0].raceName).toBe("Bahrain Grand Prix");
    });

    it("annotates upcoming and next race status relative to reference date", async () => {
        const mockRaces = [
            {
                season: "2024",
                round: "1",
                url: "url-1",
                raceName: "Past GP",
                Circuit: {
                    circuitId: "circ1",
                    url: "c-url",
                    circuitName: "Circuit 1",
                    Location: {
                        lat: "0",
                        long: "0",
                        locality: "City",
                        country: "Country",
                    },
                },
                date: "2024-03-01",
                time: "12:00:00Z",
            },
            {
                season: "2024",
                round: "2",
                url: "url-2",
                raceName: "Next GP",
                Circuit: {
                    circuitId: "circ2",
                    url: "c-url",
                    circuitName: "Circuit 2",
                    Location: {
                        lat: "0",
                        long: "0",
                        locality: "City",
                        country: "Country",
                    },
                },
                date: "2024-03-15",
                time: "12:00:00Z",
            },
            {
                season: "2024",
                round: "3",
                url: "url-3",
                raceName: "Future GP",
                Circuit: {
                    circuitId: "circ3",
                    url: "c-url",
                    circuitName: "Circuit 3",
                    Location: {
                        lat: "0",
                        long: "0",
                        locality: "City",
                        country: "Country",
                    },
                },
                date: "2024-04-01",
                time: "12:00:00Z",
            },
        ];

        vi.spyOn(client, "getSeasonSchedule").mockResolvedValue(
            mockRaces as any,
        );

        // Reference date set between race 1 and race 2
        const referenceDate = new Date("2024-03-10T00:00:00Z");
        const annotated = await client.getAnnotatedSchedule(
            "2024",
            referenceDate,
        );

        expect(annotated[0].status).toBe("completed");
        expect(annotated[1].status).toBe("next");
        expect(annotated[1].daysRemaining).toBe(6);
        expect(annotated[2].status).toBe("upcoming");
    });

    it("throws descriptive error when API request fails", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 503,
            statusText: "Service Unavailable",
        });

        await expect(client.getSeasonSchedule("current")).rejects.toThrow(
            /HTTP error! Status: 503/,
        );
    });
});
