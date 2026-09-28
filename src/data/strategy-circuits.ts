/**
 * Formula 1 Strategy & Circuit Simulation Database
 * Realistic track parameters for lap time simulation, tire degradation, and pit lane transit losses.
 */

export interface StrategyCircuitConfig {
    circuitId: string;
    name: string;
    grandPrixName: string;
    totalLaps: number;
    baseLapTimeSec: number; // Raw pole/base pace in seconds (e.g., 82.5s = 1:22.500)
    pitLossSec: number; // Time lost for a normal green-flag pit stop (transit + stationary)
    scPitLossSec: number; // Time lost under Safety Car / VSC (~45% less)
    tyreWearMultiplier: number; // 0.8 (low wear like Monza) to 1.4 (high wear like Bahrain)
    fuelConsumptionPerLapKg: number; // ~1.5 - 2.0 kg per lap
    fuelTimePenaltyPerKg: number; // ~0.035s per kg of fuel
    defaultStrategies: {
        id: string;
        name: string;
        description: string;
        stints: {
            compound: "SOFT" | "MEDIUM" | "HARD";
            startLap: number;
            endLap: number;
        }[];
    }[];
}

export const STRATEGY_CIRCUITS: Record<string, StrategyCircuitConfig> = {
    bahrain: {
        circuitId: "bahrain",
        name: "Bahrain International Circuit",
        grandPrixName: "Bahrain Grand Prix",
        totalLaps: 57,
        baseLapTimeSec: 94.0, // ~1:34.000
        pitLossSec: 23.5,
        scPitLossSec: 12.0,
        tyreWearMultiplier: 1.35, // High abrasion asphalt
        fuelConsumptionPerLapKg: 1.85,
        fuelTimePenaltyPerKg: 0.033,
        defaultStrategies: [
            {
                id: "bahrain-opt-1",
                name: "Standard 2-Stop (Soft -> Hard -> Hard)",
                description:
                    "Pirelli's recommended 2-stop to counter Sakhir's rough track surface.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 15 },
                    { compound: "HARD", startLap: 16, endLap: 36 },
                    { compound: "HARD", startLap: 37, endLap: 57 },
                ],
            },
            {
                id: "bahrain-opt-2",
                name: "Aggressive 2-Stop (Soft -> Medium -> Soft)",
                description:
                    "Sprint-style high pace with a late soft tire blitz for fastest lap.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 14 },
                    { compound: "MEDIUM", startLap: 15, endLap: 38 },
                    { compound: "SOFT", startLap: 39, endLap: 57 },
                ],
            },
            {
                id: "bahrain-opt-3",
                name: "Conservative 1-Stop (Medium -> Hard)",
                description:
                    "High tyre management gamble aiming for track position over raw lap time.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 24 },
                    { compound: "HARD", startLap: 25, endLap: 57 },
                ],
            },
        ],
    },
    albert_park: {
        circuitId: "albert_park",
        name: "Albert Park Circuit",
        grandPrixName: "Australian Grand Prix",
        totalLaps: 58,
        baseLapTimeSec: 80.5, // ~1:20.500
        pitLossSec: 21.2,
        scPitLossSec: 11.5,
        tyreWearMultiplier: 1.05,
        fuelConsumptionPerLapKg: 1.75,
        fuelTimePenaltyPerKg: 0.035,
        defaultStrategies: [
            {
                id: "melbourne-opt-1",
                name: "Primary 1-Stop (Medium -> Hard)",
                description:
                    "Default Melbourne strategy with minimal degradation on smooth bitumen.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 22 },
                    { compound: "HARD", startLap: 23, endLap: 58 },
                ],
            },
            {
                id: "melbourne-opt-2",
                name: "Aggressive 2-Stop (Soft -> Hard -> Medium)",
                description:
                    "Great if Safety Car triggers early during the race.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 16 },
                    { compound: "HARD", startLap: 17, endLap: 40 },
                    { compound: "MEDIUM", startLap: 41, endLap: 58 },
                ],
            },
            {
                id: "melbourne-opt-3",
                name: "Reverse 1-Stop (Hard -> Medium)",
                description:
                    "Overcut strategy running long to capitalize on late-race incidents.",
                stints: [
                    { compound: "HARD", startLap: 1, endLap: 36 },
                    { compound: "MEDIUM", startLap: 37, endLap: 58 },
                ],
            },
        ],
    },
    silverstone: {
        circuitId: "silverstone",
        name: "Silverstone Circuit",
        grandPrixName: "British Grand Prix",
        totalLaps: 52,
        baseLapTimeSec: 89.5, // ~1:29.500
        pitLossSec: 20.0, // Short pit lane entry through Vale
        scPitLossSec: 10.8,
        tyreWearMultiplier: 1.25, // High lateral G-forces through Maggotts/Becketts
        fuelConsumptionPerLapKg: 1.9,
        fuelTimePenaltyPerKg: 0.034,
        defaultStrategies: [
            {
                id: "silverstone-opt-1",
                name: "Optimal 2-Stop (Medium -> Hard -> Medium)",
                description:
                    "Countering intense lateral wear across high-speed sweeps.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 17 },
                    { compound: "HARD", startLap: 18, endLap: 37 },
                    { compound: "MEDIUM", startLap: 38, endLap: 52 },
                ],
            },
            {
                id: "silverstone-opt-2",
                name: "High Management 1-Stop (Medium -> Hard)",
                description:
                    "Risky front-left tire graining management to protect track position.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 22 },
                    { compound: "HARD", startLap: 23, endLap: 52 },
                ],
            },
            {
                id: "silverstone-opt-3",
                name: "Soft Attack 2-Stop (Soft -> Hard -> Soft)",
                description:
                    "Fastest start off the line into Abbey, boxing early to undercut.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 13 },
                    { compound: "HARD", startLap: 14, endLap: 36 },
                    { compound: "SOFT", startLap: 37, endLap: 52 },
                ],
            },
        ],
    },
    monza: {
        circuitId: "monza",
        name: "Autodromo Nazionale Monza",
        grandPrixName: "Italian Grand Prix",
        totalLaps: 53,
        baseLapTimeSec: 82.0, // ~1:22.000
        pitLossSec: 24.2, // Long high-speed pit lane
        scPitLossSec: 13.0,
        tyreWearMultiplier: 0.85, // Low downforce, low cornering stress
        fuelConsumptionPerLapKg: 1.8,
        fuelTimePenaltyPerKg: 0.031,
        defaultStrategies: [
            {
                id: "monza-opt-1",
                name: "Temple of Speed 1-Stop (Medium -> Hard)",
                description:
                    "The undisputed king of strategies at Monza due to minimal tire degradation.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 23 },
                    { compound: "HARD", startLap: 24, endLap: 53 },
                ],
            },
            {
                id: "monza-opt-2",
                name: "Aggressive 2-Stop (Soft -> Medium -> Medium)",
                description:
                    "High risk: requires intense overtakes on the straight into Variante del Rettifilo.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 15 },
                    { compound: "MEDIUM", startLap: 16, endLap: 35 },
                    { compound: "MEDIUM", startLap: 36, endLap: 53 },
                ],
            },
            {
                id: "monza-opt-3",
                name: "Reverse 1-Stop (Hard -> Medium)",
                description:
                    "Running long hoping for a mid-race safety car discount.",
                stints: [
                    { compound: "HARD", startLap: 1, endLap: 34 },
                    { compound: "MEDIUM", startLap: 35, endLap: 53 },
                ],
            },
        ],
    },
    monaco: {
        circuitId: "monaco",
        name: "Circuit de Monaco",
        grandPrixName: "Monaco Grand Prix",
        totalLaps: 78,
        baseLapTimeSec: 74.0, // ~1:14.000
        pitLossSec: 20.8,
        scPitLossSec: 10.5,
        tyreWearMultiplier: 0.7, // Ultra low abrasion, zero tire wear
        fuelConsumptionPerLapKg: 1.3,
        fuelTimePenaltyPerKg: 0.038,
        defaultStrategies: [
            {
                id: "monaco-opt-1",
                name: "Track Position 1-Stop (Medium -> Hard)",
                description:
                    "Track position is absolute. Pit only to fulfill the mandatory 2-compound rule.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 35 },
                    { compound: "HARD", startLap: 36, endLap: 78 },
                ],
            },
            {
                id: "monaco-opt-2",
                name: "Overcut Specialist 1-Stop (Hard -> Medium)",
                description:
                    "Paces in clean air when cars ahead pit into traffic.",
                stints: [
                    { compound: "HARD", startLap: 1, endLap: 50 },
                    { compound: "MEDIUM", startLap: 51, endLap: 78 },
                ],
            },
            {
                id: "monaco-opt-3",
                name: "Soft Launch 1-Stop (Soft -> Hard)",
                description:
                    "Aiming to take P1 into Sainte Devote off the start line.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 22 },
                    { compound: "HARD", startLap: 23, endLap: 78 },
                ],
            },
        ],
    },
    spa: {
        circuitId: "spa",
        name: "Circuit de Spa-Francorchamps",
        grandPrixName: "Belgian Grand Prix",
        totalLaps: 44,
        baseLapTimeSec: 106.0, // ~1:46.000 (longest lap on the calendar)
        pitLossSec: 22.5,
        scPitLossSec: 12.0,
        tyreWearMultiplier: 1.2,
        fuelConsumptionPerLapKg: 2.2,
        fuelTimePenaltyPerKg: 0.036,
        defaultStrategies: [
            {
                id: "spa-opt-1",
                name: "Standard 2-Stop (Medium -> Hard -> Medium)",
                description:
                    "Keeps tires in their peak operating window across the long 7 km lap.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 14 },
                    { compound: "HARD", startLap: 15, endLap: 30 },
                    { compound: "MEDIUM", startLap: 31, endLap: 44 },
                ],
            },
            {
                id: "spa-opt-2",
                name: "One-Stop Masterclass (Medium -> Hard)",
                description:
                    "George Russell style extreme tire preservation across 34 laps on Hard.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 12 },
                    { compound: "HARD", startLap: 13, endLap: 44 },
                ],
            },
            {
                id: "spa-opt-3",
                name: "Soft Sprint 2-Stop (Soft -> Hard -> Soft)",
                description:
                    "High straight-line speed into Kemmel straight with fresh rubber.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 10 },
                    { compound: "HARD", startLap: 11, endLap: 28 },
                    { compound: "SOFT", startLap: 29, endLap: 44 },
                ],
            },
        ],
    },
    zandvoort: {
        circuitId: "zandvoort",
        name: "Circuit Zandvoort",
        grandPrixName: "Dutch Grand Prix",
        totalLaps: 72,
        baseLapTimeSec: 73.0, // ~1:13.000
        pitLossSec: 21.0,
        scPitLossSec: 11.2,
        tyreWearMultiplier: 1.15,
        fuelConsumptionPerLapKg: 1.6,
        fuelTimePenaltyPerKg: 0.035,
        defaultStrategies: [
            {
                id: "zandvoort-opt-1",
                name: "Optimal 2-Stop (Soft -> Medium -> Hard)",
                description:
                    "Balanced attack navigating the banked turns and dune sand.",
                stints: [
                    { compound: "SOFT", startLap: 1, endLap: 18 },
                    { compound: "MEDIUM", startLap: 19, endLap: 45 },
                    { compound: "HARD", startLap: 46, endLap: 72 },
                ],
            },
            {
                id: "zandvoort-opt-2",
                name: "Track Position 1-Stop (Medium -> Hard)",
                description:
                    "Because overtaking is tricky around the narrow Zandvoort dunes.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 28 },
                    { compound: "HARD", startLap: 29, endLap: 72 },
                ],
            },
            {
                id: "zandvoort-opt-3",
                name: "Soft Finish 2-Stop (Medium -> Hard -> Soft)",
                description:
                    "Attacking late when other cars are struggling on old hards.",
                stints: [
                    { compound: "MEDIUM", startLap: 1, endLap: 22 },
                    { compound: "HARD", startLap: 23, endLap: 52 },
                    { compound: "SOFT", startLap: 53, endLap: 72 },
                ],
            },
        ],
    },
};
