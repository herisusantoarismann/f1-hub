/**
 * F1 Hub Domain Types
 * Enterprise-grade TypeScript definitions for Formula 1 entities based on the Jolpica/Ergast F1 API spec.
 */

export interface Location {
    lat: string;
    long: string;
    locality: string;
    country: string;
}

export interface Circuit {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
}

export interface Driver {
    driverId: string;
    permanentNumber?: string;
    code?: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth?: string;
    nationality: string;
}

export interface Constructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}

export interface RaceSession {
    date: string;
    time?: string;
}

export interface RaceTime {
    millis?: string;
    time: string;
}

export interface FastestLap {
    rank: string;
    lap: string;
    Time: {
        time: string;
    };
    AverageSpeed?: {
        units: string;
        speed: string;
    };
}

export interface RaceResult {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    grid: string;
    laps: string;
    status: string;
    Time?: RaceTime;
    FastestLap?: FastestLap;
}

export interface Race {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time?: string;
    FirstPractice?: RaceSession;
    SecondPractice?: RaceSession;
    ThirdPractice?: RaceSession;
    Qualifying?: RaceSession;
    Sprint?: RaceSession;
    SprintQualifying?: RaceSession;
    Results?: RaceResult[];
}

export interface DriverStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: Driver;
    Constructors: Constructor[];
}

export interface ConstructorStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: Constructor;
}

// Jolpica / Ergast API Envelope Types
export interface RaceTable {
    season: string;
    round?: string;
    Races: Race[];
}

export interface DriverTable {
    season?: string;
    driverId?: string;
    Drivers: Driver[];
}

export interface ConstructorTable {
    season?: string;
    constructorId?: string;
    Constructors: Constructor[];
}

export interface StandingsList {
    season: string;
    round: string;
    DriverStandings?: DriverStanding[];
    ConstructorStandings?: ConstructorStanding[];
}

export interface StandingsTable {
    season: string;
    StandingsLists: StandingsList[];
}

export interface CircuitTable {
    season?: string;
    circuitId?: string;
    Circuits: Circuit[];
}

export interface MRData<T = unknown> {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable?: RaceTable;
    DriverTable?: DriverTable;
    ConstructorTable?: ConstructorTable;
    StandingsTable?: StandingsTable;
    CircuitTable?: CircuitTable;
}

export interface JolpicaF1Response<T = unknown> {
    MRData: MRData<T>;
}

// UI State & Filter Types
export type RaceStatus = "completed" | "upcoming" | "next";

export interface RaceWithStatus extends Race {
    status: RaceStatus;
    daysRemaining?: number;
}

export interface DriverWithTeam extends Driver {
    team?: Constructor;
    points?: string;
    position?: string;
    wins?: string;
    isReserve?: boolean;
    reserveRole?: string;
}

export interface ConstructorWithDetails extends Constructor {
    standing?: ConstructorStanding;
    drivers?: Driver[];
}

export interface DriverDetail {
    driver: Driver;
    standing?: DriverStanding;
    team?: Constructor;
}

export interface ConstructorDetail {
    constructor: Constructor;
    standing?: ConstructorStanding;
    drivers: Driver[];
}
