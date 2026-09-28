import { DriverStanding, ConstructorStanding } from "@/types/standings";

/**
 * Fallback current Formula 1 Championship Standings
 * Used when Jolpica API is offline, pre-season, or in testing environments.
 */
export const FALLBACK_DRIVER_STANDINGS: DriverStanding[] = [
    {
        position: "1",
        positionText: "1",
        points: "393",
        wins: "8",
        Driver: {
            driverId: "max_verstappen",
            permanentNumber: "1",
            code: "VER",
            givenName: "Max",
            familyName: "Verstappen",
            nationality: "Dutch",
        },
        Constructors: [
            {
                constructorId: "red_bull",
                name: "Red Bull Racing",
                nationality: "Austrian",
            },
        ],
    },
    {
        position: "2",
        positionText: "2",
        points: "331",
        wins: "3",
        Driver: {
            driverId: "norris",
            permanentNumber: "4",
            code: "NOR",
            givenName: "Lando",
            familyName: "Norris",
            nationality: "British",
        },
        Constructors: [
            {
                constructorId: "mclaren",
                name: "McLaren",
                nationality: "British",
            },
        ],
    },
    {
        position: "3",
        positionText: "3",
        points: "307",
        wins: "3",
        Driver: {
            driverId: "leclerc",
            permanentNumber: "16",
            code: "LEC",
            givenName: "Charles",
            familyName: "Leclerc",
            nationality: "Monegasque",
        },
        Constructors: [
            {
                constructorId: "ferrari",
                name: "Ferrari",
                nationality: "Italian",
            },
        ],
    },
    {
        position: "4",
        positionText: "4",
        points: "262",
        wins: "2",
        Driver: {
            driverId: "piastri",
            permanentNumber: "81",
            code: "PIA",
            givenName: "Oscar",
            familyName: "Piastri",
            nationality: "Australian",
        },
        Constructors: [
            {
                constructorId: "mclaren",
                name: "McLaren",
                nationality: "British",
            },
        ],
    },
    {
        position: "5",
        positionText: "5",
        points: "219",
        wins: "1",
        Driver: {
            driverId: "sainz",
            permanentNumber: "55",
            code: "SAI",
            givenName: "Carlos",
            familyName: "Sainz",
            nationality: "Spanish",
        },
        Constructors: [
            {
                constructorId: "ferrari",
                name: "Ferrari",
                nationality: "Italian",
            },
        ],
    },
    {
        position: "6",
        positionText: "6",
        points: "190",
        wins: "2",
        Driver: {
            driverId: "hamilton",
            permanentNumber: "44",
            code: "HAM",
            givenName: "Lewis",
            familyName: "Hamilton",
            nationality: "British",
        },
        Constructors: [
            {
                constructorId: "mercedes",
                name: "Mercedes",
                nationality: "German",
            },
        ],
    },
    {
        position: "7",
        positionText: "7",
        points: "182",
        wins: "1",
        Driver: {
            driverId: "russell",
            permanentNumber: "63",
            code: "RUS",
            givenName: "George",
            familyName: "Russell",
            nationality: "British",
        },
        Constructors: [
            {
                constructorId: "mercedes",
                name: "Mercedes",
                nationality: "German",
            },
        ],
    },
    {
        position: "8",
        positionText: "8",
        points: "151",
        wins: "0",
        Driver: {
            driverId: "perez",
            permanentNumber: "11",
            code: "PER",
            givenName: "Sergio",
            familyName: "Perez",
            nationality: "Mexican",
        },
        Constructors: [
            {
                constructorId: "red_bull",
                name: "Red Bull Racing",
                nationality: "Austrian",
            },
        ],
    },
    {
        position: "9",
        positionText: "9",
        points: "62",
        wins: "0",
        Driver: {
            driverId: "alonso",
            permanentNumber: "14",
            code: "ALO",
            givenName: "Fernando",
            familyName: "Alonso",
            nationality: "Spanish",
        },
        Constructors: [
            {
                constructorId: "aston_martin",
                name: "Aston Martin",
                nationality: "British",
            },
        ],
    },
    {
        position: "10",
        positionText: "10",
        points: "42",
        wins: "0",
        Driver: {
            driverId: "hulkenberg",
            permanentNumber: "27",
            code: "HUL",
            givenName: "Nico",
            familyName: "Hülkenberg",
            nationality: "German",
        },
        Constructors: [
            {
                constructorId: "haas",
                name: "Haas",
                nationality: "American",
            },
        ],
    },
    {
        position: "11",
        positionText: "11",
        points: "36",
        wins: "0",
        Driver: {
            driverId: "gasly",
            permanentNumber: "10",
            code: "GAS",
            givenName: "Pierre",
            familyName: "Gasly",
            nationality: "French",
        },
        Constructors: [
            {
                constructorId: "alpine",
                name: "Alpine",
                nationality: "French",
            },
        ],
    },
    {
        position: "12",
        positionText: "12",
        points: "28",
        wins: "0",
        Driver: {
            driverId: "tsunoda",
            permanentNumber: "22",
            code: "TSU",
            givenName: "Yuki",
            familyName: "Tsunoda",
            nationality: "Japanese",
        },
        Constructors: [
            {
                constructorId: "rb",
                name: "RB",
                nationality: "Italian",
            },
        ],
    },
    {
        position: "13",
        positionText: "13",
        points: "24",
        wins: "0",
        Driver: {
            driverId: "stroll",
            permanentNumber: "18",
            code: "STR",
            givenName: "Lance",
            familyName: "Stroll",
            nationality: "Canadian",
        },
        Constructors: [
            {
                constructorId: "aston_martin",
                name: "Aston Martin",
                nationality: "British",
            },
        ],
    },
    {
        position: "14",
        positionText: "14",
        points: "23",
        wins: "0",
        Driver: {
            driverId: "ocon",
            permanentNumber: "31",
            code: "OCO",
            givenName: "Esteban",
            familyName: "Ocon",
            nationality: "French",
        },
        Constructors: [
            {
                constructorId: "alpine",
                name: "Alpine",
                nationality: "French",
            },
        ],
    },
    {
        position: "15",
        positionText: "15",
        points: "12",
        wins: "0",
        Driver: {
            driverId: "albon",
            permanentNumber: "23",
            code: "ALB",
            givenName: "Alexander",
            familyName: "Albon",
            nationality: "Thai",
        },
        Constructors: [
            {
                constructorId: "williams",
                name: "Williams",
                nationality: "British",
            },
        ],
    },
];

export const FALLBACK_CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
    {
        position: "1",
        positionText: "1",
        points: "593",
        wins: "5",
        Constructor: {
            constructorId: "mclaren",
            name: "McLaren",
            nationality: "British",
        },
    },
    {
        position: "2",
        positionText: "2",
        points: "544",
        wins: "5",
        Constructor: {
            constructorId: "red_bull",
            name: "Red Bull Racing",
            nationality: "Austrian",
        },
    },
    {
        position: "3",
        positionText: "3",
        points: "526",
        wins: "5",
        Constructor: {
            constructorId: "ferrari",
            name: "Ferrari",
            nationality: "Italian",
        },
    },
    {
        position: "4",
        positionText: "4",
        points: "372",
        wins: "3",
        Constructor: {
            constructorId: "mercedes",
            name: "Mercedes",
            nationality: "German",
        },
    },
    {
        position: "5",
        positionText: "5",
        points: "86",
        wins: "0",
        Constructor: {
            constructorId: "aston_martin",
            name: "Aston Martin",
            nationality: "British",
        },
    },
    {
        position: "6",
        positionText: "6",
        points: "59",
        wins: "0",
        Constructor: {
            constructorId: "alpine",
            name: "Alpine",
            nationality: "French",
        },
    },
    {
        position: "7",
        positionText: "7",
        points: "46",
        wins: "0",
        Constructor: {
            constructorId: "haas",
            name: "Haas",
            nationality: "American",
        },
    },
    {
        position: "8",
        positionText: "8",
        points: "44",
        wins: "0",
        Constructor: {
            constructorId: "rb",
            name: "RB",
            nationality: "Italian",
        },
    },
    {
        position: "9",
        positionText: "9",
        points: "17",
        wins: "0",
        Constructor: {
            constructorId: "williams",
            name: "Williams",
            nationality: "British",
        },
    },
    {
        position: "10",
        positionText: "10",
        points: "0",
        wins: "0",
        Constructor: {
            constructorId: "sauber",
            name: "Kick Sauber",
            nationality: "Swiss",
        },
    },
];
