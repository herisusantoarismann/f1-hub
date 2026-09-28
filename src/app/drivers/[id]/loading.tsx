import React from "react";

export default function DriverDetailLoading() {
    return (
        <main className="min-h-screen bg-f1-black py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="container mx-auto max-w-5xl">
                {/* Back button skeleton */}
                <div className="h-8 w-32 bg-neutral-800 rounded-lg mb-6" />

                {/* Hero card skeleton */}
                <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-10 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-neutral-800 shrink-0" />
                    <div className="space-y-4 w-full text-center md:text-left flex flex-col items-center md:items-start">
                        <div className="h-6 w-32 bg-neutral-800 rounded-md" />
                        <div className="h-12 w-64 bg-neutral-800 rounded-xl" />
                        <div className="h-5 w-40 bg-neutral-800/80 rounded" />
                        <div className="h-4 w-48 bg-neutral-800/60 rounded" />
                    </div>
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center space-y-2"
                        >
                            <div className="h-3 w-20 bg-neutral-800 rounded" />
                            <div className="h-8 w-16 bg-neutral-800 rounded-lg" />
                        </div>
                    ))}
                </div>

                {/* Info block skeleton */}
                <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-4">
                    <div className="h-6 w-48 bg-neutral-800 rounded mb-4" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-8 w-full bg-neutral-850 rounded"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
