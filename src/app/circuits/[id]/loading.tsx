import React from "react";

export default function CircuitDetailLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Breadcrumbs Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-neutral-800" />
                    <div className="h-6 w-28 rounded-full bg-neutral-800" />
                </div>

                {/* Circuit Profile Header Skeleton */}
                <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10 space-y-4">
                    <div className="h-5 w-48 rounded-full bg-neutral-800" />
                    <div className="h-10 w-96 max-w-full rounded-xl bg-neutral-800" />
                    <div className="h-4 w-64 rounded bg-neutral-850" />
                    <div className="h-4 w-full max-w-xl rounded bg-neutral-850" />
                </div>

                {/* 4-Tile Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-32 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3"
                        >
                            <div className="h-3 w-20 rounded bg-neutral-800" />
                            <div className="h-8 w-32 rounded bg-neutral-800" />
                            <div className="h-3 w-24 rounded bg-neutral-850" />
                        </div>
                    ))}
                </div>

                {/* Detailed Hero Map Skeleton */}
                <div className="h-96 w-full rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6" />

                {/* Iconic Corners Grid Skeleton */}
                <div className="space-y-4 pt-4">
                    <div className="h-6 w-56 rounded bg-neutral-800" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-28 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-2"
                            >
                                <div className="h-4 w-32 rounded bg-neutral-800" />
                                <div className="h-3 w-full rounded bg-neutral-850" />
                                <div className="h-3 w-3/4 rounded bg-neutral-850" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
