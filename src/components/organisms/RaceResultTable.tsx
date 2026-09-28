import React from "react";
import { RaceResult } from "@/types/f1";
import { RaceResultRow } from "@/components/molecules/RaceResultRow";
import { Trophy, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RaceResultTableProps {
    results: RaceResult[];
    raceName: string;
}

export const RaceResultTable: React.FC<RaceResultTableProps> = ({
    results,
    raceName,
}) => {
    const winner = results.find((r) => r.position === "1");
    const fastestLapResult = results.find((r) => r.FastestLap?.rank === "1");
    const dnfCount = results.filter(
        (r) =>
            r.status.toLowerCase() !== "finished" && !r.status.startsWith("+"),
    ).length;

    return (
        <section className="space-y-4" data-testid="race-results-section">
            {/* Table Header & Quick Highlights */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span>Official Race Classification</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                        Final finishing order and championship points awarded
                        for the {raceName}.
                    </p>
                </div>

                {/* Quick Race Stat Badges */}
                <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                    {fastestLapResult && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/40">
                            <Zap className="w-3.5 h-3.5 fill-current text-purple-400" />
                            <span>
                                FL:{" "}
                                {fastestLapResult.Driver.code ||
                                    fastestLapResult.Driver.familyName}{" "}
                                ({fastestLapResult.FastestLap?.Time.time})
                            </span>
                        </div>
                    )}

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{results.length - dnfCount} Classified</span>
                    </div>

                    {dnfCount > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/40">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{dnfCount} DNF</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Classification Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-sm">
                <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="bg-neutral-950/90 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                        <tr>
                            <th className="py-3.5 px-4 w-16 text-center">
                                Pos
                            </th>
                            <th className="py-3.5 px-3 w-16 text-center">
                                +/-
                            </th>
                            <th className="py-3.5 px-4">Driver</th>
                            <th className="py-3.5 px-4">Constructor</th>
                            <th className="py-3.5 px-4 text-center hidden sm:table-cell">
                                Grid
                            </th>
                            <th className="py-3.5 px-4 text-center hidden md:table-cell">
                                Laps
                            </th>
                            <th className="py-3.5 px-4 text-right">
                                Time / Gap
                            </th>
                            <th className="py-3.5 px-4 text-right">PTS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-sans">
                        {results.map((result) => (
                            <RaceResultRow
                                key={result.Driver.driverId}
                                result={result}
                                isWinner={result.position === "1"}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
