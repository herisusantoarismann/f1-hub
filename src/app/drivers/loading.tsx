import React from "react";

export default function DriversLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="container mx-auto max-w-7xl">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-f1-charcoal">
                    <div className="space-y-2.5">
                        <div className="h-5 w-36 bg-neutral-800 rounded-full" />
                        <div className="h-10 w-72 bg-neutral-800 rounded-xl" />
                        <div className="h-4 w-96 max-w-full bg-neutral-800/60 rounded-md" />
                    </div>
                    <div className="h-9 w-40 bg-neutral-800 rounded-xl" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="h-16 w-full bg-neutral-900/60 rounded-2xl border border-neutral-800 mb-8" />

                {/* Driver Cards Skeleton Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 flex flex-col items-center"
                        >
                            <div className="w-full flex justify-between items-center mb-4">
                                <div className="h-6 w-12 bg-neutral-800 rounded" />
                                <div className="h-5 w-14 bg-neutral-800 rounded-full" />
                            </div>
                            <div className="w-28 h-28 rounded-full bg-neutral-800 mb-4" />
                            <div className="h-3 w-20 bg-neutral-850 rounded mb-2" />
                            <div className="h-5 w-36 bg-neutral-800 rounded mb-2" />
                            <div className="h-3 w-24 bg-neutral-850 rounded mb-4" />
                            <div className="w-full pt-3 border-t border-neutral-800/80 flex justify-between">
                                <div className="h-4 w-16 bg-neutral-800 rounded" />
                                <div className="h-4 w-12 bg-neutral-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
