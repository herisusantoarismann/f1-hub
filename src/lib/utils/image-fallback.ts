/**
 * Image Fallback and Asset Resolver
 * Maps entity IDs (drivers, teams/constructors, circuits) to reliable local fallbacks
 * if remote media is missing or fails to load.
 */

export const TEAM_COLOR_MAP: Record<string, string> = {
    red_bull: "#3671C6",
    ferrari: "#E80020",
    mercedes: "#27F4D2",
    mclaren: "#FF8000",
    aston_martin: "#229971",
    alpine: "#0093CC",
    williams: "#64C4FF",
    rb: "#6692FF",
    kick_sauber: "#52E252",
    haas: "#B6BABD",
    cadillac: "#D4AF37",
};

export const DEFAULT_FALLBACKS = {
    driver: "/images/drivers/default_driver.svg",
    team: "/images/teams/default-team.svg",
    circuit: "/images/circuits/default-circuit.svg",
};

/**
 * Resolves local fallback path for a driver avatar
 */
export function getDriverImagePath(driverId?: string): string {
    if (!driverId) return DEFAULT_FALLBACKS.driver;
    return `/images/drivers/${driverId}.png`;
}

/**
 * Resolves local fallback path for a constructor logo
 */
export function getTeamImagePath(constructorId?: string): string {
    if (!constructorId) return DEFAULT_FALLBACKS.team;
    return `/images/teams/${constructorId}.png`;
}

/**
 * Returns brand accent color for a team
 */
export function getTeamAccentColor(constructorId?: string): string {
    if (!constructorId) return "#E10600";
    return TEAM_COLOR_MAP[constructorId.toLowerCase()] ?? "#E10600";
}
