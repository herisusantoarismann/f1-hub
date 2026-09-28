import React from "react";

export default function TeamDetailLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="container mx-auto max-w-5xl">
                {/* Back button skeleton */}
                <div className="h-8 w-32 bg-neutral-800 rounded-lg mb-6" />

                {/* Team Hero card skeleton */}
                <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-10 mb-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6 w-full">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-800 shrink-0" />
                        <div className="space-y-3 w-full">
                            <div className="h-5 w-32 bg-neutral-800 rounded-full" />
                            <div className="h-10 w-64 bg-neutral-800 rounded-xl" />
                            <div className="h-4 w-44 bg-neutral-800/60 rounded" />
                        </div>
                    </div>
                    <div className="w-36 h-24 bg-neutral-800 rounded-2xl shrink-0" />
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center space-y-2"
                        >
                            <div className="h-3 w-24 bg-neutral-800 rounded" />
                            <div className="h-8 w-16 bg-neutral-800 rounded-lg" />
                        </div>
                    ))}
                </div>

                {/* Drivers lineup block skeleton */}
                <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-4">
                    <div className="h-6 w-48 bg-neutral-800 rounded mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-20 bg-neutral-950/70 border border-neutral-800 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
