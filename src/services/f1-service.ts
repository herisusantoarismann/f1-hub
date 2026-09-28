import { f1Client } from "@/lib/api/f1-client";
import {
    ConstructorStanding,
    DriverStanding,
    Race,
    RaceWithStatus,
} from "@/types/f1";

/**
 * High-level F1 domain service layer
 * Decouples Next.js React Server Components from the raw API transport
 */
export class F1Service {
    static async getSeasonCalendar(
        season: string | number = "current",
    ): Promise<RaceWithStatus[]> {
        return f1Client.getAnnotatedSchedule(season);
    }

    static async getRawSchedule(
        season: string | number = "current",
    ): Promise<Race[]> {
        return f1Client.getSeasonSchedule(season);
    }

    static async getDriversLeaderboard(
        season: string | number = "current",
    ): Promise<DriverStanding[]> {
        return f1Client.getDriverStandings(season);
    }

    static async getConstructorsLeaderboard(
        season: string | number = "current",
    ): Promise<ConstructorStanding[]> {
        return f1Client.getConstructorStandings(season);
    }

    static async getNextGrandPrix(): Promise<Race | null> {
        return f1Client.getNextRace();
    }
}
