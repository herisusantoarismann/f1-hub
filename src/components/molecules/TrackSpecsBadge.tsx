import React from "react";
import { DownforceLevel } from "@/data/circuits-tech";
import { Wind, Gauge, Disc, Zap } from "lucide-react";

interface TrackSpecsBadgeProps {
    downforce: DownforceLevel;
    drsZones: number;
    tyreStress: number;
    className?: string;
}

export const TrackSpecsBadge: React.FC<TrackSpecsBadgeProps> = ({
    downforce,
    drsZones,
    tyreStress,
    className = "",
}) => {
    // Downforce color badge
    const downforceStyles =
        downforce === "High"
            ? "bg-rose-950/60 text-rose-300 border-rose-800/40"
            : downforce === "Medium"
              ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
              : "bg-emerald-950/60 text-emerald-300 border-emerald-800/40";

    return (
        <div
            data-testid="track-specs-badge"
            className={`flex flex-wrap items-center gap-2 font-mono text-[11px] ${className}`}
        >
            {/* Downforce */}
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-semibold ${downforceStyles}`}
                title={`Downforce level: ${downforce}`}
            >
                <Wind className="w-3 h-3" />
                <span>{downforce} DF</span>
            </span>

            {/* 2026 Overtake Mode (Manual Override / Active Aero X-Mode) */}
            <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-cyan-300 border border-neutral-800 font-semibold"
                title={`${drsZones} 2026 Active Aero & Overtake Modes (X-Mode / Manual Override)`}
            >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{drsZones} Overtake</span>
            </span>

            {/* Tyre Stress */}
            <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 font-semibold"
                title={`Pirelli Tyre Stress level: ${tyreStress}/5`}
            >
                <Disc className="w-3 h-3 text-amber-400" />
                <span>Stress {tyreStress}/5</span>
            </span>
        </div>
    );
};
