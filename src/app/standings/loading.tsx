import React from "react";

export default function StandingsLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div className="space-y-3">
                        <div className="h-6 w-48 rounded-full bg-neutral-800" />
                        <div className="h-9 w-80 rounded-xl bg-neutral-800" />
                        <div className="h-4 w-96 rounded-lg bg-neutral-900" />
                    </div>
                    <div className="h-9 w-32 rounded-xl bg-neutral-800" />
                </div>

                {/* Tabs & Search Controls Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800">
                    <div className="flex gap-2">
                        <div className="h-10 w-44 rounded-xl bg-neutral-800" />
                        <div className="h-10 w-36 rounded-xl bg-neutral-900" />
                    </div>
                    <div className="h-10 w-full sm:w-72 rounded-xl bg-neutral-900" />
                </div>

                {/* Table Skeleton */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
                    {/* Table Head */}
                    <div className="h-12 bg-neutral-950/80 border-b border-neutral-800 flex items-center px-4 gap-4">
                        <div className="h-4 w-8 rounded bg-neutral-800" />
                        <div className="h-4 w-32 rounded bg-neutral-800" />
                        <div className="h-4 w-24 rounded bg-neutral-800 hidden sm:block" />
                        <div className="h-4 w-28 rounded bg-neutral-800" />
                        <div className="h-4 w-12 rounded bg-neutral-800 hidden md:block" />
                        <div className="h-4 w-16 rounded bg-neutral-800 ml-auto" />
                    </div>

                    {/* Table Body Rows Skeleton */}
                    <div className="divide-y divide-neutral-800/60 p-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 py-3.5 px-4"
                            >
                                <div className="h-7 w-7 rounded-lg bg-neutral-800 shrink-0" />
                                <div className="h-9 w-9 rounded-full bg-neutral-800 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-4 w-36 rounded bg-neutral-800" />
                                    <div className="h-3 w-16 rounded bg-neutral-900" />
                                </div>
                                <div className="h-4 w-24 rounded bg-neutral-800 hidden sm:block" />
                                <div className="h-4 w-28 rounded bg-neutral-800" />
                                <div className="h-4 w-8 rounded bg-neutral-800 hidden md:block text-center" />
                                <div className="h-5 w-14 rounded bg-neutral-800 ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
