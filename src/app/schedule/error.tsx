"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ScheduleError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to telemetry/monitoring service (e.g. Sentry, Datadog)
        console.error("[ScheduleError] Error loading F1 calendar:", error);
    }, [error]);

    return (
        <div
            role="alert"
            className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6"
        >
            <div className="inline-flex p-4 rounded-full bg-rose-950/60 border border-f1-red/40 text-f1-red shadow-f1-glow">
                <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">
                    Telemetry Offline: Failed to Load Schedule
                </h2>
                <p className="text-sm text-f1-gray max-w-md mx-auto">
                    We couldn't connect to the Formula 1 timing feed (
                    {error.message || "Network issue"}). Pit wall engineers are
                    on the case.
                </p>
            </div>

            <div className="pt-2">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-f1-red hover:bg-f1-darkred text-white text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Pit Stop</span>
                </button>
            </div>
        </div>
    );
}
