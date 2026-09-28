import React from "react";
import { CircuitLapRecord } from "@/data/circuits-tech";
import { Timer, Trophy, Calendar } from "lucide-react";

interface TrackRecordCardProps {
    record: CircuitLapRecord;
    className?: string;
}

export const TrackRecordCard: React.FC<TrackRecordCardProps> = ({
    record,
    className = "",
}) => {
    return (
        <div
            data-testid="track-record-card"
            className={`p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-md flex items-center justify-between gap-4 ${className}`}
        >
            <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Timer className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                        Official Lap Record
                    </span>
                    <h4
                        data-testid="lap-record-driver"
                        className="text-sm font-bold text-white leading-tight"
                    >
                        {record.driver}{" "}
                        <span className="text-xs text-neutral-400 font-normal">
                            ({record.team})
                        </span>
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> Set in {record.year}
                    </span>
                </div>
            </div>

            <div className="text-right shrink-0">
                <span
                    data-testid="lap-record-time"
                    className="font-mono font-black text-lg text-white block text-purple-200"
                >
                    {record.time}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Fastest Lap
                </span>
            </div>
        </div>
    );
};
