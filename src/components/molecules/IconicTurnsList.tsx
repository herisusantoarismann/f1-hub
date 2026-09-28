"use client";

import React from "react";
import { IconicTurn } from "@/data/circuits-database";
import { Compass, CornerDownRight } from "lucide-react";

interface IconicTurnsListProps {
    turns: IconicTurn[];
    className?: string;
}

export const IconicTurnsList: React.FC<IconicTurnsListProps> = ({
    turns,
    className = "",
}) => {
    if (!turns || turns.length === 0) {
        return null;
    }

    return (
        <section
            data-testid="iconic-turns-section"
            className={`space-y-4 ${className}`}
        >
            <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-f1-red/10 border border-f1-red/30 text-f1-red">
                    <Compass className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                    Iconic Corners & Historic Turns
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {turns.map((turn, index) => (
                    <div
                        key={`${turn.turn}-${index}`}
                        data-testid={`iconic-turn-${index}`}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-f1-red flex items-center gap-1.5">
                                <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                                {turn.turn}
                            </span>
                            <span className="text-sm font-bold text-white truncate">
                                {turn.name}
                            </span>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                            {turn.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
