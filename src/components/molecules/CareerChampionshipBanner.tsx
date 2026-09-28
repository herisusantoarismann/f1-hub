import React from "react";
import { DriverWorldChampionship } from "@/data/drivers-career";
import { Trophy, Crown, Sparkles, Award } from "lucide-react";

interface CareerChampionshipBannerProps {
    worldChampionships?: DriverWorldChampionship;
    juniorTitles?: { year: number | string; title: string; category: string }[];
}

export const CareerChampionshipBanner: React.FC<
    CareerChampionshipBannerProps
> = ({ worldChampionships, juniorTitles = [] }) => {
    const isWorldChampion = Boolean(
        worldChampionships && worldChampionships.total > 0,
    );

    if (!isWorldChampion && juniorTitles.length === 0) {
        return null;
    }

    return (
        <div
            data-testid="career-championship-banner"
            className="overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-8 shadow-2xl relative"
        >
            {/* Ambient Background Glow */}
            <div
                className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                    isWorldChampion ? "bg-amber-500/15" : "bg-cyan-500/10"
                }`}
            />

            {isWorldChampion && worldChampionships ? (
                <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                                <Crown className="w-6 h-6 fill-amber-400" />
                            </div>
                            <div>
                                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                                    FIA Formula 1 World Championship
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                    <span>
                                        {worldChampionships.total}× World
                                        Champion
                                    </span>
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                            <Trophy className="w-4 h-4 fill-amber-400" />
                            <span>Title Winner</span>
                        </div>
                    </div>

                    {/* Championship Years Badges */}
                    <div className="pt-2">
                        <span className="text-xs text-neutral-400 font-mono block mb-2">
                            Championship Years:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {worldChampionships.years.map((year) => (
                                <div
                                    key={year}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-200 font-mono font-black text-sm flex items-center gap-1.5 shadow-md"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{year}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Junior Championship Accolades for rising stars */
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                                    Feeder Series Honours
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    Junior Formula Champion
                                </h3>
                            </div>
                        </div>

                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
                            {juniorTitles.length} Titles Won
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {juniorTitles.map((t, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-xl bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 text-xs font-mono font-medium flex items-center gap-1.5"
                            >
                                <span className="text-cyan-400 font-bold">
                                    {t.year}
                                </span>
                                <span className="text-neutral-500">•</span>
                                <span>{t.title}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
