/**
 * Standings Domain Types
 * Strict typing for Formula 1 World Championship Standings (Drivers & Constructors)
 */

export interface StandingDriver {
    driverId: string;
    permanentNumber?: string;
    code?: string;
    url?: string;
    givenName: string;
    familyName: string;
    dateOfBirth?: string;
    nationality: string;
}

export interface StandingConstructor {
    constructorId: string;
    url?: string;
    name: string;
    nationality: string;
}

export interface DriverStanding {
    position: string;
    positionText?: string;
    points: string;
    wins: string;
    Driver: StandingDriver;
    Constructors: StandingConstructor[];
}

export interface ConstructorStanding {
    position: string;
    positionText?: string;
    points: string;
    wins: string;
    Constructor: StandingConstructor;
}

export type StandingsTabType = "drivers" | "constructors";
