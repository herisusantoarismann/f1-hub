"use client";

import React, { useState, useMemo } from "react";
import { DriverStanding, ConstructorStanding } from "@/types/standings";
import {
    DriverRaceOutcome,
    calculateSimulatedDriverStandings,
    calculateSimulatedConstructorStandings,
} from "@/lib/calculator-utils";
import { RaceFinishPositionPicker } from "@/components/molecules/RaceFinishPositionPicker";
import { ChampionshipClinchCard } from "@/components/molecules/ChampionshipClinchCard";
import { SimulatedStandingsTable } from "@/components/molecules/SimulatedStandingsTable";
import { Trophy, Calculator, RotateCcw } from "lucide-react";

interface ChampionshipCalculatorProps {
    initialDriverStandings: DriverStanding[];
    initialConstructorStandings: ConstructorStanding[];
}

export const ChampionshipCalculator: React.FC<ChampionshipCalculatorProps> = ({
    initialDriverStandings,
    initialConstructorStandings,
}) => {
    // Race finishing position outcomes per driver
    const [outcomes, setOutcomes] = useState<Record<string, DriverRaceOutcome>>(
        {},
    );
    const [isSprintWeekend, setIsSprintWeekend] = useState(false);
    const [includeFastestLap, setIncludeFastestLap] = useState(true);
    const [tab, setTab] = useState<"drivers" | "constructors">("drivers");

    // Title Contenders Selection
    const defaultLeader =
        initialDriverStandings[0]?.Driver?.driverId || "max_verstappen";
    const defaultChaser =
        initialDriverStandings[1]?.Driver?.driverId || "norris";

    const [leaderId, setLeaderId] = useState(defaultLeader);
    const [chaserId, setChaserId] = useState(defaultChaser);
    const [remainingRacesAfterThis, setRemainingRacesAfterThis] = useState(3);

    // Compute live recalculated standings
    const simulatedDrivers = useMemo(() => {
        return calculateSimulatedDriverStandings(
            initialDriverStandings,
            outcomes,
            includeFastestLap,
        );
    }, [initialDriverStandings, outcomes, includeFastestLap]);

    const simulatedConstructors = useMemo(() => {
        return calculateSimulatedConstructorStandings(
            initialConstructorStandings,
            simulatedDrivers,
        );
    }, [initialConstructorStandings, simulatedDrivers]);

    // Handle individual driver outcome update
    const handleOutcomeChange = (
        driverId: string,
        outcome: DriverRaceOutcome,
    ) => {
        setOutcomes((prev) => ({
            ...prev,
            [driverId]: outcome,
        }));
    };

    // Apply quick scenario presets
    const handleApplyPreset = (presetName: string) => {
        const next: Record<string, DriverRaceOutcome> = {};

        switch (presetName) {
            case "mclaren_1_2":
                next["norris"] = {
                    driverId: "norris",
                    gpPosition: 1,
                    fastestLap: true,
                };
                next["piastri"] = { driverId: "piastri", gpPosition: 2 };
                next["max_verstappen"] = {
                    driverId: "max_verstappen",
                    gpPosition: 5,
                };
                next["leclerc"] = { driverId: "leclerc", gpPosition: 3 };
                break;

            case "verstappen_win":
                next["max_verstappen"] = {
                    driverId: "max_verstappen",
                    gpPosition: 1,
                    fastestLap: true,
                };
                next["norris"] = { driverId: "norris", gpPosition: 4 };
                next["leclerc"] = { driverId: "leclerc", gpPosition: 2 };
                next["piastri"] = { driverId: "piastri", gpPosition: 3 };
                break;

            case "ferrari_1_2":
                next["leclerc"] = {
                    driverId: "leclerc",
                    gpPosition: 1,
                    fastestLap: true,
                };
                next["hamilton"] = { driverId: "hamilton", gpPosition: 2 };
                next["norris"] = { driverId: "norris", gpPosition: 3 };
                next["max_verstappen"] = {
                    driverId: "max_verstappen",
                    gpPosition: 6,
                };
                break;

            case "norris_max_dnf":
                next["norris"] = {
                    driverId: "norris",
                    gpPosition: 1,
                    fastestLap: true,
                };
                next["max_verstappen"] = {
                    driverId: "max_verstappen",
                    gpPosition: null,
                };
                next["leclerc"] = { driverId: "leclerc", gpPosition: 2 };
                next["piastri"] = { driverId: "piastri", gpPosition: 3 };
                break;

            default:
                break;
        }

        setOutcomes(next);
    };

    const handleResetAll = () => {
        setOutcomes({});
    };

    return (
        <div data-testid="championship-calculator" className="space-y-8">
            {/* Title Clinch Mathematical Scenario Analyzer */}
            <ChampionshipClinchCard
                drivers={simulatedDrivers}
                leaderId={leaderId}
                chaserId={chaserId}
                onLeaderChange={setLeaderId}
                onChaserChange={setChaserId}
                remainingRacesAfterThis={remainingRacesAfterThis}
                onRemainingRacesChange={setRemainingRacesAfterThis}
                hasSprintRemaining={isSprintWeekend}
                includeFastestLap={includeFastestLap}
            />

            {/* Simulated Race Finish Position Picker */}
            <RaceFinishPositionPicker
                drivers={initialDriverStandings}
                outcomes={outcomes}
                onOutcomeChange={handleOutcomeChange}
                onApplyPreset={handleApplyPreset}
                onResetAll={handleResetAll}
                isSprintWeekend={isSprintWeekend}
                onToggleSprintWeekend={setIsSprintWeekend}
                includeFastestLap={includeFastestLap}
                onToggleFastestLap={setIncludeFastestLap}
            />

            {/* Recalculated Standings Table */}
            <SimulatedStandingsTable
                tab={tab}
                onTabChange={setTab}
                driverStandings={simulatedDrivers}
                constructorStandings={simulatedConstructors}
            />
        </div>
    );
};
