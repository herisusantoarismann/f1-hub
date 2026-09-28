"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, MapPin, Flag } from "lucide-react";
import { getNationalityFlag } from "@/lib/utils/asset-helper";

export interface RaceCountdownProps {
    date: string;
    time?: string;
    raceName: string;
    circuitName: string;
    country: string;
    round: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
}

function calculateTimeLeft(date: string, time?: string): TimeLeft {
    // Default to 13:00 UTC if time is missing
    const targetIso = `${date}T${time || "13:00:00Z"}`;
    const targetDate = new Date(targetIso).getTime();
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
}

export const RaceCountdown: React.FC<RaceCountdownProps> = ({
    date,
    time,
    raceName,
    circuitName,
    country,
    round,
}) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
        calculateTimeLeft(date, time),
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(date, time));
        }, 1000);

        return () => clearInterval(timer);
    }, [date, time]);

    const flag = getNationalityFlag(country);
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="flex flex-col gap-6" data-testid="race-countdown">
            {/* Round & Location Pill */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-f1-red/20 text-f1-red border border-f1-red/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-f1-red animate-ping" />
                    ROUND {round.padStart(2, "0")}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-mono text-neutral-300 bg-neutral-900/80 border border-neutral-800 flex items-center gap-1.5">
                    <span className="text-sm leading-none">{flag}</span>
                    <span>{country}</span>
                </span>
            </div>

            {/* Race & Circuit Title */}
            <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {raceName}
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-f1-red shrink-0" />
                    <span>{circuitName}</span>
                    <span className="text-neutral-600">•</span>
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* High-Tech Monospace Countdown Digits */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg">
                {[
                    { label: "DAYS", value: timeLeft.days },
                    { label: "HOURS", value: timeLeft.hours },
                    { label: "MINS", value: timeLeft.minutes },
                    { label: "SECS", value: timeLeft.seconds },
                ].map((unit, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-neutral-700 transition-colors"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-f1-red/40 to-transparent" />
                        <span className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tighter">
                            {isMounted
                                ? String(unit.value).padStart(2, "0")
                                : "--"}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-400 uppercase mt-1 font-semibold">
                            {unit.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
