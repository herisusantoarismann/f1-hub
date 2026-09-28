/**
 * Asset Helper for Formula 1 Media & Legal Fallbacks
 * Provides helper functions to safely resolve driver avatars, team emblems, and country flags.
 * Uses 100% legal, non-infringing vector assets.
 */

import { TEAM_COLOR_MAP } from "./image-fallback";

export const DEFAULT_AVATARS = {
    driver: "/images/drivers/default_driver.svg",
    team: "/images/teams/default-team.svg",
    circuit: "/images/circuits/default-circuit.svg",
} as const;

/**
 * Verified set of drivers (all safely routed to legal vector avatar)
 */
export const DRIVERS_WITH_PHOTOS = new Set<string>();

/**
 * Returns safe legal SVG vector avatar for a driver
 */
export function getDriverImage(driverId?: string): string {
    return DEFAULT_AVATARS.driver;
}

/**
 * Returns fallback placeholder for driver when image fails to load
 */
export function getDriverFallback(): string {
    return DEFAULT_AVATARS.driver;
}

/**
 * Returns local logo path or fallback emblem for a constructor
 */
export function getTeamLogo(constructorId?: string): string {
    if (!constructorId) {
        return DEFAULT_AVATARS.team;
    }

    const cleanId = constructorId.trim().toLowerCase();
    return `/images/teams/${cleanId}.png`;
}

/**
 * Returns team primary branding color with fallback
 */
export function getTeamColor(constructorId?: string): string {
    if (!constructorId) return "#E10600";
    const cleanId = constructorId.trim().toLowerCase();
    return TEAM_COLOR_MAP[cleanId] ?? "#E10600";
}

/**
 * Returns country flag emoji corresponding to driver or team nationality
 */
export function getNationalityFlag(nationality?: string): string {
    if (!nationality) return "🏁";

    const flags: Record<string, string> = {
        dutch: "🇳🇱",
        netherlands: "🇳🇱",
        british: "🇬🇧",
        united_kingdom: "🇬🇧",
        spanish: "🇪🇸",
        spain: "🇪🇸",
        monégasque: "🇲🇨",
        monegasque: "🇲🇨",
        monaco: "🇲🇨",
        australian: "🇦🇺",
        australia: "🇦🇺",
        mexican: "🇲🇽",
        mexico: "🇲🇽",
        canadian: "🇨🇦",
        canada: "🇨🇦",
        german: "🇩🇪",
        germany: "🇩🇪",
        french: "🇫🇷",
        france: "🇫🇷",
        japanese: "🇯🇵",
        japan: "🇯🇵",
        thai: "🇹🇭",
        thailand: "🇹🇭",
        finnish: "🇫🇮",
        finland: "🇫🇮",
        chinese: "🇨🇳",
        china: "🇨🇳",
        danish: "🇩🇰",
        denmark: "🇩🇰",
        american: "🇺🇸",
        usa: "🇺🇸",
        italian: "🇮🇹",
        italy: "🇮🇹",
        austrian: "🇦🇹",
        austria: "🇦🇹",
        swiss: "🇨🇭",
        switzerland: "🇨🇭",
        "new zealander": "🇳🇿",
        brazilian: "🇧🇷",
        brazil: "🇧🇷",
        argentine: "🇦🇷",
        argentina: "🇦🇷",
        estonian: "🇪🇪",
        estonia: "🇪🇪",
        indian: "🇮🇳",
        india: "🇮🇳",
        belgian: "🇧🇪",
        belgium: "🇧🇪",
    };

    const clean = nationality.trim().toLowerCase();
    return flags[clean] ?? "🏁";
}
