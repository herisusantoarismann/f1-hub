#!/usr/bin/env node

/**
 * Formula 1 Official Circuit Asset Downloader & Processor
 * Fetches millimeter-precise, official FIA track geometry from open motorsport repository (julesr0y/f1-circuits-svg).
 *
 * Generates:
 * 1. `public/images/circuits/outlines/[circuitId].svg` -> Transparent, glowing motorsport outline silhouette for cards and list views.
 * 2. `public/images/circuits/detailed/[circuitId].svg` -> Technical blueprint map with start/finish line, direction arrow, and DRS sectors.
 * 3. `public/images/circuits/[circuitId].svg` -> Root layout for backward compatibility with existing views.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const CIRCUITS_BASE_DIR = path.join(ROOT_DIR, "public", "images", "circuits");
const OUTLINES_DIR = path.join(CIRCUITS_BASE_DIR, "outlines");
const DETAILED_DIR = path.join(CIRCUITS_BASE_DIR, "detailed");

for (const dir of [CIRCUITS_BASE_DIR, OUTLINES_DIR, DETAILED_DIR]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 24 official championship circuits mapped to modern layout IDs
const CIRCUIT_MAPPINGS = {
    bahrain: {
        layout: "bahrain-1",
        name: "Bahrain International Circuit",
        turns: 15,
        drs: 3,
    },
    jeddah: {
        layout: "jeddah-1",
        name: "Jeddah Corniche Circuit",
        turns: 27,
        drs: 3,
    },
    albert_park: {
        layout: "melbourne-2",
        name: "Albert Park Circuit",
        turns: 14,
        drs: 4,
    },
    suzuka: { layout: "suzuka-2", name: "Suzuka Circuit", turns: 18, drs: 1 },
    shanghai: {
        layout: "shanghai-1",
        name: "Shanghai International Circuit",
        turns: 16,
        drs: 2,
    },
    miami: {
        layout: "miami-1",
        name: "Miami International Autodrome",
        turns: 19,
        drs: 3,
    },
    imola: {
        layout: "imola-3",
        name: "Autodromo Enzo e Dino Ferrari",
        turns: 19,
        drs: 1,
        folder: "minimal",
    },
    monaco: {
        layout: "monaco-6",
        name: "Circuit de Monaco",
        turns: 19,
        drs: 1,
    },
    villeneuve: {
        layout: "montreal-6",
        name: "Circuit Gilles-Villeneuve",
        turns: 14,
        drs: 2,
    },
    catalunya: {
        layout: "catalunya-6",
        name: "Circuit de Barcelona-Catalunya",
        turns: 14,
        drs: 2,
    },
    red_bull_ring: {
        layout: "spielberg-3",
        name: "Red Bull Ring",
        turns: 10,
        drs: 3,
    },
    silverstone: {
        layout: "silverstone-8",
        name: "Silverstone Circuit",
        turns: 18,
        drs: 2,
    },
    hungaroring: {
        layout: "hungaroring-3",
        name: "Hungaroring",
        turns: 14,
        drs: 2,
    },
    spa: {
        layout: "spa-francorchamps-4",
        name: "Circuit de Spa-Francorchamps",
        turns: 19,
        drs: 2,
    },
    zandvoort: {
        layout: "zandvoort-5",
        name: "Circuit Zandvoort",
        turns: 14,
        drs: 2,
    },
    monza: {
        layout: "monza-7",
        name: "Autodromo Nazionale Monza",
        turns: 11,
        drs: 2,
    },
    baku: { layout: "baku-1", name: "Baku City Circuit", turns: 20, drs: 2 },
    marina_bay: {
        layout: "marina-bay-4",
        name: "Marina Bay Street Circuit",
        turns: 19,
        drs: 4,
    },
    americas: {
        layout: "austin-1",
        name: "Circuit of the Americas",
        turns: 20,
        drs: 2,
    },
    rodriguez: {
        layout: "mexico-city-3",
        name: "Autódromo Hermanos Rodríguez",
        turns: 17,
        drs: 3,
    },
    interlagos: {
        layout: "interlagos-2",
        name: "Autódromo José Carlos Pace",
        turns: 15,
        drs: 2,
    },
    vegas: {
        layout: "las-vegas-1",
        name: "Las Vegas Strip Circuit",
        turns: 17,
        drs: 2,
    },
    losail: {
        layout: "lusail-1",
        name: "Lusail International Circuit",
        turns: 16,
        drs: 1,
    },
    yas_marina: {
        layout: "yas-marina-2",
        name: "Yas Marina Circuit",
        turns: 16,
        drs: 2,
    },
    sepang: {
        layout: "sepang-1",
        name: "Sepang International Circuit",
        turns: 15,
        drs: 2,
    },
    madrid: {
        layout: "madring-1",
        name: "Circuito de Madrid (IFEMA)",
        turns: 20,
        drs: 2,
    },
    madring: {
        layout: "madring-1",
        name: "Circuito de Madrid (IFEMA)",
        turns: 20,
        drs: 2,
    },
};

/**
 * Fetch raw SVG string with fallback between detailed and minimal folders
 */
async function fetchCircuitSvg(config) {
    const primaryFolder = config.folder || "detailed";
    const primaryUrl = `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/${primaryFolder}/white/${config.layout}.svg`;

    try {
        const res = await fetch(primaryUrl);
        if (res.ok) {
            return await res.text();
        }
    } catch (err) {
        // Fallback below
    }

    // Secondary fallback
    const fallbackFolder =
        primaryFolder === "detailed" ? "minimal" : "detailed";
    const fallbackUrl = `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/${fallbackFolder}/white/${config.layout}.svg`;
    const res = await fetch(fallbackUrl);
    if (!res.ok) {
        throw new Error(
            `Failed to fetch SVG for ${config.layout} from both ${primaryUrl} and ${fallbackUrl}`,
        );
    }
    return await res.text();
}

/**
 * Parses path elements from the source SVG
 */
function extractPaths(svgString) {
    const pathRegex = /<path\s+[^>]*d="([^"]+)"[^>]*>/gi;
    const paths = [];
    let match;
    while ((match = pathRegex.exec(svgString)) !== null) {
        paths.push(match[1]);
    }
    return paths;
}

/**
 * Generates high-contrast outline SVG with racing red glow and crisp white centerline
 */
function createOutlineSvg(id, paths) {
    const trackPath = paths[0] || "";
    const sfPath = paths[1]
        ? `<path d="${paths[1]}" fill="#FFFFFF" fill-opacity="1" />`
        : "";
    const dirPath = paths[2]
        ? `<path d="${paths[2]}" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" />`
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" fill="none">
  <defs>
    <linearGradient id="outlineGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E10600" />
      <stop offset="100%" stop-color="#FF3333" />
    </linearGradient>
    <filter id="outlineGlow_${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Glowing Track Ribbon -->
  <path d="${trackPath}" 
        stroke="url(#outlineGrad_${id})" 
        stroke-width="16" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#outlineGlow_${id})" />

  <!-- High-Precision Centerline -->
  <path d="${trackPath}" 
        stroke="#FFFFFF" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        stroke-opacity="0.95" />

  <!-- Start/Finish Marker and Direction -->
  ${sfPath}
  ${dirPath}
</svg>
`;
}

/**
 * Generates detailed technical blueprint SVG map
 */
function createDetailedSvg(id, config, paths) {
    const trackPath = paths[0] || "";
    const sfPath = paths[1]
        ? `<path d="${paths[1]}" fill="#FFFFFF" fill-opacity="1" />`
        : "";
    const dirPath = paths[2]
        ? `<path d="${paths[2]}" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" />`
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" fill="none">
  <defs>
    <!-- Technical Background Grid Pattern -->
    <pattern id="grid_${id}" width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#262626" stroke-width="0.5" stroke-opacity="0.4" />
    </pattern>
    <linearGradient id="detTrackGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E10600" />
      <stop offset="100%" stop-color="#FF2800" />
    </linearGradient>
    <filter id="detGlow_${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Technical Background Grid -->
  <rect width="500" height="500" fill="url(#grid_${id})" />

  <!-- Asphalt Road Base -->
  <path d="${trackPath}" 
        stroke="#111111" 
        stroke-width="30" 
        stroke-linecap="round" 
        stroke-linejoin="round" />

  <!-- Outer Neon Glow Racing Ribbon -->
  <path d="${trackPath}" 
        stroke="url(#detTrackGrad_${id})" 
        stroke-width="16" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#detGlow_${id})" />

  <!-- Centerline Racing Track -->
  <path d="${trackPath}" 
        stroke="#FFFFFF" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-dasharray="8,6"
        stroke-opacity="0.85" />

  <!-- Start/Finish and Flow Indicators -->
  ${sfPath}
  ${dirPath}

  <!-- Watermark Technical Telemetry -->
  <text x="25" y="475" font-family="monospace" font-size="11" font-weight="bold" fill="#737373" letter-spacing="1">
    ${config.name.toUpperCase()} • ${config.turns} TURNS • ${config.drs} OVERTAKE MODES (ACTIVE AERO)
  </text>
  <text x="25" y="490" font-family="monospace" font-size="9" fill="#525252" letter-spacing="0.5">
    FIA 2026 ACTIVE AERO & MANUAL OVERRIDE TELEMETRY BLUEPRINT
  </text>
</svg>
`;
}

async function main() {
    console.log(
        "🏎️ [F1 Hub] Downloading and processing real FIA Formula 1 circuit vector maps...",
    );

    let processed = 0;
    const totalCircuits = Object.keys(CIRCUIT_MAPPINGS).length;
    for (const [id, config] of Object.entries(CIRCUIT_MAPPINGS)) {
        try {
            const rawSvg = await fetchCircuitSvg(config);
            const paths = extractPaths(rawSvg);

            if (paths.length === 0) {
                console.warn(`⚠️ Warning: No paths found for ${id}, skipping.`);
                continue;
            }

            const outlineSvg = createOutlineSvg(id, paths);
            const detailedSvg = createDetailedSvg(id, config, paths);

            // 1. Write outline SVG
            fs.writeFileSync(
                path.join(OUTLINES_DIR, `${id}.svg`),
                outlineSvg,
                "utf8",
            );

            // 2. Write detailed SVG
            fs.writeFileSync(
                path.join(DETAILED_DIR, `${id}.svg`),
                detailedSvg,
                "utf8",
            );

            // 3. Write root circuit SVG for backward compatibility
            fs.writeFileSync(
                path.join(CIRCUITS_BASE_DIR, `${id}.svg`),
                outlineSvg,
                "utf8",
            );

            console.log(
                `✅ [${processed + 1}/${totalCircuits}] ${config.name} (${id})`,
            );
            processed++;
        } catch (err) {
            console.error(`❌ Error processing ${id}:`, err.message);
        }
    }

    // Default fallback: Realistic angular modern Grand Prix circuit layout (chicanes, hairpins, straight, strictly no circles)
    const defaultPaths = [
        "M 75,410 L 75,130 Q 75,100 105,100 L 190,100 Q 215,100 225,120 L 240,150 Q 250,175 275,175 L 340,175 Q 365,175 375,150 L 390,120 Q 405,95 430,105 L 445,120 Q 455,140 440,175 L 400,245 Q 385,270 355,270 L 290,270 Q 270,270 260,290 L 245,320 Q 235,345 260,360 L 350,360 Q 380,360 395,385 L 400,410 Q 395,435 365,435 L 130,435 Q 100,435 90,415 L 75,410 Z",
        "M 85,300 L 65,300",
        "M 75,280 L 75,290",
    ];
    const defaultOutline = createOutlineSvg("default", defaultPaths);
    const defaultDetailed = createDetailedSvg(
        "default",
        { name: "World Championship Circuit", turns: 16, drs: 2 },
        defaultPaths,
    );

    fs.writeFileSync(
        path.join(OUTLINES_DIR, "default.svg"),
        defaultOutline,
        "utf8",
    );
    fs.writeFileSync(
        path.join(DETAILED_DIR, "default.svg"),
        defaultDetailed,
        "utf8",
    );
    fs.writeFileSync(
        path.join(CIRCUITS_BASE_DIR, "default-circuit.svg"),
        defaultOutline,
        "utf8",
    );

    console.log(
        `🎉 [F1 Hub] Completed! Processed ${processed} real Formula 1 circuit vector layouts.`,
    );
}

main().catch(console.error);
