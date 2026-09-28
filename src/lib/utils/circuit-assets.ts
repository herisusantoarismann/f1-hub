/**
 * Circuit Asset Utilities
 * Helper mapping circuit diagram outlines and detailed turn-annotated maps with graceful fallback.
 */

export const DEFAULT_CIRCUIT_DIAGRAM = "/images/circuits/default-circuit.svg";
export const DEFAULT_CIRCUIT_OUTLINE = "/images/circuits/outlines/default.svg";
export const DEFAULT_CIRCUIT_DETAILED = "/images/circuits/detailed/default.svg";

/**
 * Returns the public image path for a circuit outline layout.
 */
export function getCircuitDiagram(circuitId?: string): string {
    if (!circuitId) {
        return DEFAULT_CIRCUIT_DIAGRAM;
    }

    const cleanId = circuitId.toLowerCase().trim();
    return `/images/circuits/${cleanId}.svg`;
}

/**
 * Returns the transparent outline silhouette for circuit cards and list views.
 */
export function getCircuitOutline(circuitId?: string): string {
    if (!circuitId) {
        return DEFAULT_CIRCUIT_OUTLINE;
    }

    const cleanId = circuitId.toLowerCase().trim();
    return `/images/circuits/outlines/${cleanId}.svg`;
}

/**
 * Returns the full detailed track map with turn numbers and DRS zones.
 */
export function getCircuitDetailedMap(circuitId?: string): string {
    if (!circuitId) {
        return DEFAULT_CIRCUIT_DETAILED;
    }

    const cleanId = circuitId.toLowerCase().trim();
    return `/images/circuits/detailed/${cleanId}.svg`;
}
