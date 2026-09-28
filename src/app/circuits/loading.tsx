import React from "react";

export default function CircuitsLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="container mx-auto max-w-7xl space-y-10">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
                    <div className="space-y-3">
                        <div className="h-6 w-48 rounded-full bg-neutral-800" />
                        <div className="h-9 w-80 rounded-xl bg-neutral-800" />
                        <div className="h-4 w-96 rounded-lg bg-neutral-900" />
                    </div>
                    <div className="h-9 w-32 rounded-xl bg-neutral-800" />
                </div>

                {/* Filter Control Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800">
                    <div className="flex gap-2">
                        <div className="h-9 w-16 rounded-xl bg-neutral-800" />
                        <div className="h-9 w-24 rounded-xl bg-neutral-900" />
                        <div className="h-9 w-20 rounded-xl bg-neutral-900" />
                    </div>
                    <div className="h-10 w-full sm:w-80 rounded-xl bg-neutral-900" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4"
                        >
                            <div className="h-44 w-full rounded-2xl bg-neutral-800/80" />
                            <div className="h-6 w-48 rounded bg-neutral-800" />
                            <div className="h-4 w-32 rounded bg-neutral-900" />
                            <div className="h-8 w-full rounded-xl bg-neutral-900/60" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
