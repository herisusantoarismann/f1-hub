import { StrategyCircuitConfig } from "@/data/strategy-circuits";

export type TyreCompound = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";

export type WeatherCondition = "dry" | "damp" | "wet";
export type WindDirection = "calm" | "headwind" | "tailwind" | "crosswind";

export interface EnvironmentConfig {
    trackTempC: number; // 15°C to 55°C (baseline: 35°C)
    weatherCondition: WeatherCondition; // "dry" | "damp" | "wet"
    windSpeedKmh: number; // 0 to 50 km/h
    windDirection: WindDirection;
}

export const DEFAULT_ENVIRONMENT: EnvironmentConfig = {
    trackTempC: 35,
    weatherCondition: "dry",
    windSpeedKmh: 12,
    windDirection: "headwind",
};

/**
 * 2026 FIA Formula 1 Technical & Sporting Regulations Reference Specs
 */
export const F1_2026_REGULATIONS = {
    carMinWeightKg: 768, // 30kg reduction from 2022-2025 ground-effect era
    maxFuelCapacityKg: 75, // 100% sustainable fuels (~75kg capacity vs 110kg previously)
    fuelConsumptionPerLapKg: 1.25, // Lower energy flow rate (~70kg/h vs 100kg/h previously)
    fuelTimePenaltyPerKg: 0.03, // ~0.030s lap penalty per kg of fuel
    frontTyreWidthMm: 280, // 25mm narrower than 2025 (305mm)
    rearTyreWidthMm: 375, // 30mm narrower than 2025 (405mm)
    wheelRimDiameterInches: 18,
    activeAerodynamics: "MIM (Straight Mode / Corner Mode)",
    mandatoryDryCompounds: 2, // Article 30.5: Must use at least 2 distinct slick compounds in dry races
    minPitStopsDry: 1,
    pitLaneSpeedLimitKmh: 80,
} as const;

export interface StintConfig {
    compound: TyreCompound;
    startLap: number; // 1-indexed
    endLap: number; // 1-indexed, inclusive
}

export interface StrategyPlan {
    id: string;
    name: string;
    description?: string;
    stints: StintConfig[];
}

export interface SimulatedLapData {
    lapNumber: number;
    stintIndex: number;
    compound: TyreCompound;
    tyreAge: number;
    lapTimeSec: number;
    formattedLapTime: string;
    isPitInLap: boolean;
    isPitOutLap: boolean;
    pitLossAppliedSec: number;
    accumulatedTimeSec: number;
    tyreDegradationPenaltySec: number;
    fuelPenaltySec: number;
    weatherPenaltySec: number;
}

export interface StrategySimulationResult {
    strategyId: string;
    strategyName: string;
    totalRaceTimeSec: number;
    formattedTotalTime: string;
    deltaToFastestSec: number;
    formattedDelta: string;
    pitStopCount: number;
    compoundsUsed: TyreCompound[];
    meetsTwoCompoundRule: boolean; // FIA rule: must use at least 2 different dry compounds (waived in wet)
    fiaRegulationStatus: {
        isCompliant: boolean;
        ruleCode: string;
        message: string;
    };
    laps: SimulatedLapData[];
    averageLapTimeSec: number;
    formattedAverageLap: string;
    fastestLapSec: number;
    fastestLapNumber: number;
    optimalLifespans: {
        stintIndex: number;
        compound: TyreCompound;
        optimalLaps: number;
        cliffLap: number;
        degradationPerLapSec: number;
    }[];
}

/**
 * Pirelli Tyre Compound Physical Characteristics
 * Reflecting 2026 narrower 18" tire specifications
 */
export const TYRE_PROPERTIES: Record<
    TyreCompound,
    {
        name: string;
        color: string;
        bgClass: string;
        textClass: string;
        borderClass: string;
        baseDeltaSec: number; // Raw speed offset relative to Medium
        baseDegRatePerLapSec: number; // Seconds lost per lap due to tread wear
        cliffLap: number; // Lap where thermal degradation drops off
        cliffDegMultiplier: number;
        isWetCompound: boolean;
    }
> = {
    SOFT: {
        name: "Soft (C3/C4/C5)",
        color: "#EF4444", // Red
        bgClass: "bg-red-500",
        textClass: "text-red-400",
        borderClass: "border-red-500",
        baseDeltaSec: -0.85, // 0.85s faster than Medium on lap 1
        baseDegRatePerLapSec: 0.082,
        cliffLap: 18,
        cliffDegMultiplier: 2.8,
        isWetCompound: false,
    },
    MEDIUM: {
        name: "Medium (C2/C3/C4)",
        color: "#FBBF24", // Yellow
        bgClass: "bg-amber-400",
        textClass: "text-amber-400",
        borderClass: "border-amber-400",
        baseDeltaSec: 0.0, // Reference baseline
        baseDegRatePerLapSec: 0.046,
        cliffLap: 28,
        cliffDegMultiplier: 2.5,
        isWetCompound: false,
    },
    HARD: {
        name: "Hard (C1/C2/C3)",
        color: "#F3F4F6", // White
        bgClass: "bg-white",
        textClass: "text-neutral-200",
        borderClass: "border-white",
        baseDeltaSec: 0.75, // 0.75s slower than Medium on lap 1
        baseDegRatePerLapSec: 0.022,
        cliffLap: 42,
        cliffDegMultiplier: 2.2,
        isWetCompound: false,
    },
    INTERMEDIATE: {
        name: "Intermediate (Green)",
        color: "#10B981", // Green
        bgClass: "bg-emerald-500",
        textClass: "text-emerald-400",
        borderClass: "border-emerald-500",
        baseDeltaSec: 4.8, // Baseline delta relative to dry slicks
        baseDegRatePerLapSec: 0.055,
        cliffLap: 26,
        cliffDegMultiplier: 2.4,
        isWetCompound: true,
    },
    WET: {
        name: "Full Wet (Blue)",
        color: "#3B82F6", // Blue
        bgClass: "bg-blue-500",
        textClass: "text-blue-400",
        borderClass: "border-blue-500",
        baseDeltaSec: 9.5, // Heavy tread displacement delta
        baseDegRatePerLapSec: 0.048,
        cliffLap: 34,
        cliffDegMultiplier: 2.1,
        isWetCompound: true,
    },
};

/**
 * Format raw seconds into standard F1 timing string (m:ss.xxx)
 */
export function formatLapTime(seconds: number): string {
    if (isNaN(seconds) || seconds <= 0) return "--:--.---";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const wholeSecs = Math.floor(remainingSeconds);
    const millis = Math.round((remainingSeconds - wholeSecs) * 1000);

    const padSecs = wholeSecs < 10 ? `0${wholeSecs}` : `${wholeSecs}`;
    const padMillis =
        millis < 10 ? `00${millis}` : millis < 100 ? `0${millis}` : `${millis}`;

    return `${minutes}:${padSecs}.${padMillis}`;
}

/**
 * Format total race time into standard F1 race format (h:mm:ss.xxx)
 */
export function formatRaceTime(seconds: number): string {
    if (isNaN(seconds) || seconds <= 0) return "--:--:--.---";
    const hours = Math.floor(seconds / 3600);
    const remainder = seconds % 3600;
    const minutes = Math.floor(remainder / 60);
    const remainingSeconds = remainder % 60;
    const wholeSecs = Math.floor(remainingSeconds);
    const millis = Math.round((remainingSeconds - wholeSecs) * 1000);

    const padMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const padSecs = wholeSecs < 10 ? `0${wholeSecs}` : `${wholeSecs}`;
    const padMillis =
        millis < 10 ? `00${millis}` : millis < 100 ? `0${millis}` : `${millis}`;

    return `${hours}h ${padMins}m ${padSecs}.${padMillis}s`;
}

/**
 * Format delta difference with leading sign (+x.xxx s)
 */
export function formatDeltaTime(deltaSec: number): string {
    if (Math.abs(deltaSec) < 0.001) return "FASTEST";
    const sign = deltaSec > 0 ? "+" : "-";
    return `${sign}${Math.abs(deltaSec).toFixed(3)}s`;
}

/**
 * Calculate dynamic thermal & weather wear modifier for a given tire compound
 */
export function calculateTyreThermalAndWeatherModifier(
    compound: TyreCompound,
    environment: EnvironmentConfig,
): {
    wearMultiplier: number;
    effectiveCliffLap: number;
    paceDeltaOffsetSec: number;
} {
    const prop = TYRE_PROPERTIES[compound];
    const { trackTempC, weatherCondition, windSpeedKmh, windDirection } =
        environment;

    let wearMultiplier = 1.0;
    let effectiveCliffLap = prop.cliffLap;
    let paceDeltaOffsetSec = 0;

    // 1. Track Temperature Effect (baseline 35°C)
    if (compound === "SOFT") {
        if (trackTempC > 35) {
            // Overheating & blistering: wear increases +2.5% per °C above 35°C
            const extraHeat = trackTempC - 35;
            wearMultiplier += extraHeat * 0.025;
            effectiveCliffLap = Math.max(
                8,
                prop.cliffLap - Math.round(extraHeat / 4),
            );
        } else if (trackTempC < 25) {
            // Cold conditions preserve Soft tyre tread
            const coolDelta = 25 - trackTempC;
            wearMultiplier = Math.max(0.75, wearMultiplier - coolDelta * 0.015);
            effectiveCliffLap = prop.cliffLap + Math.round(coolDelta / 3);
        }
    } else if (compound === "HARD") {
        if (trackTempC < 25) {
            // Cold track makes Hard tyre struggle to reach operating window (graining)
            const coolDelta = 25 - trackTempC;
            wearMultiplier += coolDelta * 0.02;
            paceDeltaOffsetSec += 0.35; // Initial warm-up struggle
        } else if (trackTempC > 40) {
            // Hot track is ideal for Hard tire compound
            wearMultiplier = Math.max(0.85, wearMultiplier - 0.08);
            effectiveCliffLap = prop.cliffLap + 3;
        }
    }

    // 2. Wind Effect
    if (windSpeedKmh > 0) {
        if (windDirection === "crosswind") {
            // Lateral slip angle increases micro abrasion
            wearMultiplier += (windSpeedKmh / 50) * 0.12;
        } else if (windDirection === "headwind") {
            // Higher aero resistance on straights
            paceDeltaOffsetSec += (windSpeedKmh / 50) * 0.18;
        } else if (windDirection === "tailwind") {
            // Braking instability into heavy deceleration zones
            paceDeltaOffsetSec += (windSpeedKmh / 50) * 0.12;
        }
    }

    // 3. Track Moisture / Rain Penalty
    if (weatherCondition === "dry") {
        if (prop.isWetCompound) {
            // Running wet tyres on dry track causes extreme thermal destruction
            wearMultiplier *= 4.5;
            paceDeltaOffsetSec += compound === "INTERMEDIATE" ? 5.5 : 11.0;
        }
    } else if (weatherCondition === "damp") {
        if (!prop.isWetCompound) {
            // Slicks on damp surface lose massive grip and risk aquaplaning
            paceDeltaOffsetSec += 12.5;
            wearMultiplier *= 1.5;
        } else if (compound === "WET") {
            // Full wet on damp track is too slow
            paceDeltaOffsetSec += 3.2;
        }
    } else if (weatherCondition === "wet") {
        if (!prop.isWetCompound) {
            // Slicks on wet track are undriveable (+30s or off track)
            paceDeltaOffsetSec += 28.0;
        } else if (compound === "INTERMEDIATE") {
            // Intermediate on deep water struggles with standing water
            paceDeltaOffsetSec += 4.5;
        }
    }

    return {
        wearMultiplier,
        effectiveCliffLap,
        paceDeltaOffsetSec,
    };
}

/**
 * Simulate race execution lap-by-lap according to 2026 regulations & custom weather
 */
export function simulateStrategy(
    circuit: StrategyCircuitConfig,
    strategy: StrategyPlan,
    safetyCarLap: number | null = null,
    environment: EnvironmentConfig = DEFAULT_ENVIRONMENT,
): StrategySimulationResult {
    const totalLaps = circuit.totalLaps;
    const lapsData: SimulatedLapData[] = [];
    let accumulatedTime = 0;
    let fastestLapSec = Infinity;
    let fastestLapNum = 1;

    // Track pit stops: transition between stint i and stint i+1
    const pitStopLaps = new Set<number>();
    for (let i = 0; i < strategy.stints.length - 1; i++) {
        pitStopLaps.add(strategy.stints[i].endLap);
    }

    const compoundsUsedSet = new Set<TyreCompound>();
    const dryCompoundsUsedSet = new Set<TyreCompound>();
    strategy.stints.forEach((s) => {
        compoundsUsedSet.add(s.compound);
        if (!TYRE_PROPERTIES[s.compound].isWetCompound) {
            dryCompoundsUsedSet.add(s.compound);
        }
    });

    // 2026 FIA Regulation 30.5 Check:
    // In dry weather, must use at least 2 distinct slick compounds & at least 1 pit stop
    const isDryRace = environment.weatherCondition === "dry";
    const meetsTwoCompoundRule =
        !isDryRace ||
        (dryCompoundsUsedSet.size >=
            F1_2026_REGULATIONS.mandatoryDryCompounds &&
            pitStopLaps.size >= F1_2026_REGULATIONS.minPitStopsDry);

    let fiaMessage =
        "Sesuai Regulasi FIA 2026 (Article 30.5 - 2 Compound Kering Digunakan)";
    if (!isDryRace) {
        fiaMessage =
            "Kondisi Basah: Regulasi 2-compound kering dibebaskan oleh FIA Race Control.";
    } else if (!meetsTwoCompoundRule) {
        fiaMessage =
            "PELANGGARAN FIA: Wajib menggunakan minimal 2 compound ban kering berbeda dalam balapan kering!";
    }

    const fiaRegulationStatus = {
        isCompliant: meetsTwoCompoundRule,
        ruleCode: "FIA Sporting Regulations Art. 30.5 (2026)",
        message: fiaMessage,
    };

    // Calculate optimal lifespans for each stint in this plan
    const optimalLifespans = strategy.stints.map((stint, idx) => {
        const { wearMultiplier, effectiveCliffLap } =
            calculateTyreThermalAndWeatherModifier(stint.compound, environment);
        const prop = TYRE_PROPERTIES[stint.compound];
        const degRate =
            prop.baseDegRatePerLapSec *
            circuit.tyreWearMultiplier *
            wearMultiplier;
        return {
            stintIndex: idx,
            compound: stint.compound,
            optimalLaps: Math.max(5, Math.round(effectiveCliffLap * 0.7)),
            cliffLap: effectiveCliffLap,
            degradationPerLapSec: degRate,
        };
    });

    // 2026 Fuel model: max 75kg fuel capacity, burns ~1.25kg per lap
    const totalFuelKg = Math.min(
        F1_2026_REGULATIONS.maxFuelCapacityKg,
        totalLaps * F1_2026_REGULATIONS.fuelConsumptionPerLapKg,
    );

    for (let lap = 1; lap <= totalLaps; lap++) {
        // Find which stint this lap belongs to
        let activeStintIndex = strategy.stints.findIndex(
            (s) => lap >= s.startLap && lap <= s.endLap,
        );
        if (activeStintIndex === -1) {
            activeStintIndex = strategy.stints.length - 1;
        }

        const stint = strategy.stints[activeStintIndex];
        const compound = stint.compound;
        const prop = TYRE_PROPERTIES[compound];
        const tyreAge = lap - stint.startLap + 1; // 1 on first lap of stint

        // Environmental & thermal calculation
        const { wearMultiplier, effectiveCliffLap, paceDeltaOffsetSec } =
            calculateTyreThermalAndWeatherModifier(compound, environment);

        // 1. Base Pace Offset
        const compoundOffset = prop.baseDeltaSec;

        // 2. 2026 Fuel Burn-off Effect
        // Car burns fuel each lap, getting lighter and faster (-0.038s per lap)
        const fuelRemainingLaps = totalLaps - lap;
        const currentFuelKg = Math.max(
            0,
            fuelRemainingLaps * F1_2026_REGULATIONS.fuelConsumptionPerLapKg,
        );
        const fuelPenaltySec =
            currentFuelKg * F1_2026_REGULATIONS.fuelTimePenaltyPerKg;

        // 3. Tyre Degradation Effect (with non-linear cliff penalty)
        const baseCircuitWear = circuit.tyreWearMultiplier * wearMultiplier;
        let tyreDegPenaltySec = 0;
        if (tyreAge <= effectiveCliffLap) {
            tyreDegPenaltySec =
                tyreAge * prop.baseDegRatePerLapSec * baseCircuitWear;
        } else {
            const normalDeg =
                effectiveCliffLap * prop.baseDegRatePerLapSec * baseCircuitWear;
            const cliffLaps = tyreAge - effectiveCliffLap;
            const extraDeg =
                cliffLaps *
                (prop.baseDegRatePerLapSec * prop.cliffDegMultiplier) *
                baseCircuitWear;
            tyreDegPenaltySec = normalDeg + extraDeg;
        }

        // 4. Pit Stop Loss
        const isPitIn = pitStopLaps.has(lap);
        const isPitOut = activeStintIndex > 0 && lap === stint.startLap;

        let pitLossApplied = 0;
        if (isPitIn) {
            // Check if this pit stop happens under Safety Car / VSC
            const isUnderSC =
                safetyCarLap !== null && Math.abs(lap - safetyCarLap) <= 1;
            pitLossApplied = isUnderSC
                ? circuit.scPitLossSec
                : circuit.pitLossSec;
        }

        // Clean Lap Time (without pit loss, for fastest lap tracking)
        const cleanLapTimeSec =
            circuit.baseLapTimeSec +
            compoundOffset +
            fuelPenaltySec +
            tyreDegPenaltySec +
            paceDeltaOffsetSec;

        // Total Lap Time
        const lapTimeSec = cleanLapTimeSec + pitLossApplied;
        accumulatedTime += lapTimeSec;

        if (cleanLapTimeSec < fastestLapSec) {
            fastestLapSec = cleanLapTimeSec;
            fastestLapNum = lap;
        }

        lapsData.push({
            lapNumber: lap,
            stintIndex: activeStintIndex,
            compound,
            tyreAge,
            lapTimeSec,
            formattedLapTime: formatLapTime(lapTimeSec),
            isPitInLap: isPitIn,
            isPitOutLap: isPitOut,
            pitLossAppliedSec: pitLossApplied,
            accumulatedTimeSec: accumulatedTime,
            tyreDegradationPenaltySec: tyreDegPenaltySec,
            fuelPenaltySec: fuelPenaltySec,
            weatherPenaltySec: paceDeltaOffsetSec,
        });
    }

    const averageLapTime = accumulatedTime / totalLaps;

    return {
        strategyId: strategy.id,
        strategyName: strategy.name,
        totalRaceTimeSec: accumulatedTime,
        formattedTotalTime: formatRaceTime(accumulatedTime),
        deltaToFastestSec: 0, // Will be normalized when comparing multiple
        formattedDelta: "FASTEST",
        pitStopCount: strategy.stints.length - 1,
        compoundsUsed: Array.from(compoundsUsedSet),
        meetsTwoCompoundRule,
        fiaRegulationStatus,
        laps: lapsData,
        averageLapTimeSec: averageLapTime,
        formattedAverageLap: formatLapTime(averageLapTime),
        fastestLapSec,
        fastestLapNumber: fastestLapNum,
        optimalLifespans,
    };
}

/**
 * Compare multiple strategies on a circuit and rank them by total race time
 */
export function compareStrategies(
    circuit: StrategyCircuitConfig,
    strategies: StrategyPlan[],
    safetyCarLap: number | null = null,
    environment: EnvironmentConfig = DEFAULT_ENVIRONMENT,
): StrategySimulationResult[] {
    const results = strategies.map((strat) =>
        simulateStrategy(circuit, strat, safetyCarLap, environment),
    );

    // Sort by fastest total race time ascending
    results.sort((a, b) => a.totalRaceTimeSec - b.totalRaceTimeSec);

    const fastestTime = results[0]?.totalRaceTimeSec || 0;

    return results.map((res) => {
        const delta = res.totalRaceTimeSec - fastestTime;
        return {
            ...res,
            deltaToFastestSec: delta,
            formattedDelta: formatDeltaTime(delta),
        };
    });
}

/**
 * Calculate Undercut / Overcut Gain
 * Estimates the time gained by pitting 1 or 2 laps earlier versus staying out on worn tires
 */
export function calculateUndercutGain(
    circuit: StrategyCircuitConfig,
    inLapNumber: number,
    oldCompound: TyreCompound,
    oldTyreAge: number,
    newCompound: TyreCompound,
    environment: EnvironmentConfig = DEFAULT_ENVIRONMENT,
): {
    undercutDeltaSec: number;
    isUndercutAdvantage: boolean;
    analysis: string;
    gapThresholdSec: number;
} {
    const oldProp = TYRE_PROPERTIES[oldCompound];
    const newProp = TYRE_PROPERTIES[newCompound];
    const { wearMultiplier: oldWear, paceDeltaOffsetSec: oldWeatherOffset } =
        calculateTyreThermalAndWeatherModifier(oldCompound, environment);
    const { wearMultiplier: newWear, paceDeltaOffsetSec: newWeatherOffset } =
        calculateTyreThermalAndWeatherModifier(newCompound, environment);

    const circuitWear = circuit.tyreWearMultiplier;

    // Projected pace of the old tire staying out one more lap:
    const oldDegCurrent =
        oldTyreAge * oldProp.baseDegRatePerLapSec * circuitWear * oldWear;
    const oldPace =
        circuit.baseLapTimeSec +
        oldProp.baseDeltaSec +
        oldDegCurrent +
        oldWeatherOffset;

    // Projected out-lap pace of new tire (fresh rubber, 1 lap of degradation):
    const newDegOutLap =
        1 * newProp.baseDegRatePerLapSec * circuitWear * newWear;
    const newPace =
        circuit.baseLapTimeSec +
        newProp.baseDeltaSec +
        newDegOutLap +
        newWeatherOffset;

    // Advantage on the out-lap = old pace - new pace
    const delta = oldPace - newPace;
    const isAdvantage = delta > 0.4; // At least 0.4s to overcome pit transit margin

    let analysis = "";
    if (isAdvantage) {
        analysis = `Undercut Sangat Efektif! Ban baru ${newProp.name} diproyeksikan lebih cepat ${delta.toFixed(
            2,
        )}s per lap dibandingkan ban aus ${oldProp.name} (usia ${oldTyreAge} lap). Anda berpeluang menyalip mobil di depan jika gap saat ini di bawah ${delta.toFixed(
            1,
        )}s.`;
    } else {
        analysis = `Undercut Kurang Efektif. Ban baru ${newProp.name} butuh waktu pemanasan dan selisih pace hanya ${Math.abs(
            delta,
        ).toFixed(
            2,
        )}s. Overcut atau bertahan di lintasan untuk mengejar keuntungan ban lebih segar di akhir stint lebih disarankan.`;
    }

    return {
        undercutDeltaSec: delta,
        isUndercutAdvantage: isAdvantage,
        analysis,
        gapThresholdSec: Math.max(0.5, delta),
    };
}
