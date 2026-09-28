"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Test3DError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Test3D Error Boundary]:", error);
    }, [error]);

    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-neutral-950 text-white space-y-4">
            <div className="p-4 rounded-full bg-rose-950/60 border border-f1-red/40 text-f1-red">
                <AlertTriangle className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-black">
                3D Engine Initialization Failed
            </h2>
            <p className="text-xs text-neutral-400 max-w-md font-mono bg-neutral-900 p-3 rounded-lg border border-neutral-800 text-rose-300">
                {error.message ||
                    "An unexpected error occurred while initializing WebGL."}
            </p>

            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-f1-red hover:bg-f1-darkred text-white text-xs font-semibold transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reload 3D Engine</span>
                </button>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Hub</span>
                </Link>
            </div>
        </div>
    );
}
