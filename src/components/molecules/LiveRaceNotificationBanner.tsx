"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LiveRaceStatusResponse } from "@/lib/api/openf1-client";

interface LiveRaceNotificationBannerProps {
    initialStatus?: LiveRaceStatusResponse | null;
}

export const LiveRaceNotificationBanner: React.FC<
    LiveRaceNotificationBannerProps
> = ({ initialStatus = null }) => {
    const [status, setStatus] = useState<LiveRaceStatusResponse | null>(
        initialStatus,
    );
    const [loading, setLoading] = useState(initialStatus === null);

    useEffect(() => {
        if (initialStatus !== null) return;

        let isMounted = true;
        fetch("/api/strategy/live-race")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (isMounted) {
                    setStatus(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setStatus({ isLive: false, session: null });
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [initialStatus]);

    // If loading or definitely NOT live, do NOT render any banner
    if (loading || !status?.isLive || !status?.session) {
        return null;
    }

    const session = status.session;

    return (
        <div
            data-testid="live-race-notification-banner"
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-neutral-900/90 to-neutral-900/90 border-2 border-red-500/60 shadow-xl shadow-red-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        LIVE RACE SEDANG BERLANGSUNG
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                        {session.grandPrixName} &bull; Lap {session.currentLap}/{session.totalLaps}
                    </span>
                </div>
                <h2 className="text-lg font-black text-white">
                    Nih ada Live Race, coba racik strategi di sini!
                </h2>
                <p className="text-xs text-neutral-300 max-w-2xl font-sans">
                    Hitung posisi keluar pit (*rejoin* di belakang siapa), jendela *traffic clean air*, ancaman *undercut*, dan rekomendasi sisa stint secara *real-time*.
                </p>
            </div>

            <Link
                href="/strategy/live"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-f1-red hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-f1-red/25 shrink-0"
            >
                <span>Racik di Live Race Strategy</span>
                <span aria-hidden="true">&rarr;</span>
            </Link>
        </div>
    );
};
