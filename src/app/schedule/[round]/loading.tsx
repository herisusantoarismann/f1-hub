import React from "react";

export default function RaceDetailLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
            <div className="container mx-auto max-w-7xl space-y-10">
                {/* Breadcrumbs Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-4 w-40 rounded bg-neutral-800" />
                    <div className="h-6 w-32 rounded-full bg-neutral-800" />
                </div>

                {/* Circuit Info Card Skeleton */}
                <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div className="h-5 w-32 rounded-full bg-neutral-800" />
                            <div className="h-9 w-72 rounded-xl bg-neutral-800" />
                            <div className="h-4 w-48 rounded bg-neutral-900" />
                            <div className="h-4 w-96 rounded bg-neutral-900" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                            <div className="h-20 w-28 rounded-2xl bg-neutral-800" />
                            <div className="h-20 w-28 rounded-2xl bg-neutral-800" />
                            <div className="h-20 w-28 rounded-2xl bg-neutral-800" />
                        </div>
                    </div>
                </div>

                {/* Table or Session Grid Skeleton */}
                <div className="space-y-4">
                    <div className="h-7 w-64 rounded-xl bg-neutral-800" />
                    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
                        <div className="h-12 bg-neutral-950/80 border-b border-neutral-800 flex items-center px-4 gap-4">
                            <div className="h-4 w-8 rounded bg-neutral-800" />
                            <div className="h-4 w-8 rounded bg-neutral-800" />
                            <div className="h-4 w-32 rounded bg-neutral-800" />
                            <div className="h-4 w-28 rounded bg-neutral-800" />
                            <div className="h-4 w-12 rounded bg-neutral-800 ml-auto" />
                        </div>
                        <div className="divide-y divide-neutral-800/60 p-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 py-3.5 px-4"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-neutral-800 shrink-0" />
                                    <div className="h-5 w-8 rounded bg-neutral-900 shrink-0" />
                                    <div className="h-8 w-8 rounded-full bg-neutral-800 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-4 w-36 rounded bg-neutral-800" />
                                        <div className="h-3 w-16 rounded bg-neutral-900" />
                                    </div>
                                    <div className="h-4 w-28 rounded bg-neutral-800" />
                                    <div className="h-4 w-16 rounded bg-neutral-800 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
