"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
    RotateCcw,
    Play,
    Pause,
    Eye,
    ArrowLeft,
    Compass,
    MousePointer,
    FileCode,
    Car,
    Sun,
    Moon,
    Layers,
} from "lucide-react";

// Dynamic import with ssr: false to prevent hydration mismatch in Next.js
const F1ModelViewer = dynamic(
    () =>
        import("@/components/organisms/F1ModelViewer").then(
            (mod) => mod.F1ModelViewer,
        ),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-[#050505]">
                <div className="w-12 h-12 rounded-full border-2 border-f1-red border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
                    Initializing WebGL 3D Canvas...
                </span>
            </div>
        ),
    },
);

export default function Test3DPlaygroundPage() {
    const [autoRotate, setAutoRotate] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const [bgTheme, setBgTheme] = useState<"black" | "white">("black");
    const [useProcedural, setUseProcedural] = useState(false);
    const [showInspector, setShowInspector] = useState(false);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    const handleResetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    const isWhite = bgTheme === "white";

    return (
        <div
            className={`relative w-full h-[calc(100vh-4rem)] overflow-hidden select-none transition-colors duration-500 ${
                isWhite ? "bg-white" : "bg-[#050505]"
            }`}
        >
            {/* 3D Canvas Layer - Pure Car Showcase */}
            <div className="absolute inset-0 z-0">
                <F1ModelViewer
                    modelUrl="/models/f1-car.glb"
                    autoRotate={autoRotate}
                    wireframe={wireframe}
                    backgroundTheme={bgTheme}
                    controlsRef={controlsRef}
                    useFallbackModel={useProcedural}
                    showSceneInspector={showInspector}
                    onToggleInspector={() => setShowInspector((prev) => !prev)}
                    className="w-full h-full"
                />
            </div>

            {/* Top Bar Header Overlay */}
            <header
                className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 pointer-events-none transition-colors duration-500 ${
                    isWhite
                        ? "bg-gradient-to-b from-white/90 via-white/40 to-transparent"
                        : "bg-gradient-to-b from-neutral-950/90 via-neutral-950/40 to-transparent"
                }`}
            >
                <div className="flex items-center gap-3 pointer-events-auto">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors border ${
                            isWhite
                                ? "bg-white/80 hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-sm"
                                : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-800"
                        }`}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>F1 Hub</span>
                    </Link>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h1
                                className={`text-sm sm:text-base font-black tracking-tight ${
                                    isWhite ? "text-neutral-900" : "text-white"
                                }`}
                            >
                                F1 3D Model Playground
                            </h1>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-f1-red/20 text-f1-red border border-f1-red/40 font-bold">
                                360° Studio
                            </span>
                        </div>
                        <p
                            className={`text-[11px] hidden sm:block ${
                                isWhite
                                    ? "text-neutral-500"
                                    : "text-neutral-400"
                            }`}
                        >
                            {useProcedural
                                ? "Displaying Procedural F1 Aerodynamic Geometry"
                                : "Displaying Aston Martin AMR23 (Sketchfab GLB)"}
                        </p>
                    </div>
                </div>

                {/* Top Right Model Source Switcher */}
                <div className="pointer-events-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setUseProcedural((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all border shadow-lg ${
                            isWhite
                                ? "bg-white/90 hover:bg-neutral-100 text-neutral-800 border-neutral-300"
                                : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-700/60"
                        }`}
                    >
                        <Car className="w-3.5 h-3.5 text-f1-red" />
                        <span>
                            {useProcedural
                                ? "Load Sketchfab GLB"
                                : "Load Procedural Car"}
                        </span>
                    </button>
                </div>
            </header>

            {/* Bottom Control Bar Overlay */}
            <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 rounded-2xl shadow-2xl backdrop-blur-lg border transition-all ${
                    isWhite
                        ? "bg-white/90 border-neutral-300/90 text-neutral-800"
                        : "bg-neutral-900/85 border-neutral-800/80 text-neutral-200"
                }`}
            >
                {/* Auto Rotate Toggle */}
                <button
                    type="button"
                    onClick={() => setAutoRotate((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        autoRotate
                            ? "bg-f1-red text-white shadow-md shadow-f1-red/40"
                            : isWhite
                              ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                              : "bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                    title="Toggle 360° Auto Spin"
                >
                    {autoRotate ? (
                        <Pause className="w-3.5 h-3.5" />
                    ) : (
                        <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{autoRotate ? "Pause Spin" : "Auto Spin"}</span>
                </button>

                {/* Camera Reset */}
                <button
                    type="button"
                    onClick={handleResetCamera}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isWhite
                            ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                    title="Reset Camera Angle"
                >
                    <RotateCcw className="w-3.5 h-3.5 text-f1-red" />
                    <span>Reset View</span>
                </button>

                <div
                    className={`w-px h-5 mx-0.5 ${
                        isWhite ? "bg-neutral-300" : "bg-neutral-800"
                    }`}
                />

                {/* Plain Background Toggle: Black / White */}
                <button
                    type="button"
                    onClick={() =>
                        setBgTheme((prev) =>
                            prev === "black" ? "white" : "black",
                        )
                    }
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isWhite
                            ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                            : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                    title="Ganti latar hitam atau putih polos"
                >
                    {isWhite ? (
                        <>
                            <Moon className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Latar: Putih Polos</span>
                        </>
                    ) : (
                        <>
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>Latar: Hitam Polos</span>
                        </>
                    )}
                </button>

                {/* Wireframe Mode Toggle */}
                <button
                    type="button"
                    onClick={() => setWireframe((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        wireframe
                            ? "bg-cyan-600 text-white"
                            : isWhite
                              ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                              : "bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                    title="Toggle Wireframe Inspection"
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Wireframe</span>
                </button>

                {/* Scene Tree Inspector Toggle */}
                <button
                    type="button"
                    onClick={() => setShowInspector((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        showInspector
                            ? "bg-f1-red text-white shadow-md shadow-f1-red/40"
                            : isWhite
                              ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                              : "bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                    title="Lihat Struktur Tree Model 3D & Highlight Part"
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Scene Tree</span>
                </button>
            </div>

            {/* Navigation HUD Instructions in Bottom-Left Corner */}
            <aside
                className={`absolute bottom-6 left-6 z-20 hidden sm:flex flex-col gap-1.5 p-3.5 rounded-xl border text-[11px] font-mono backdrop-blur-md max-w-xs shadow-lg transition-colors ${
                    isWhite
                        ? "bg-white/85 border-neutral-300 text-neutral-600"
                        : "bg-neutral-900/80 border-neutral-800/80 text-neutral-400"
                }`}
            >
                <div
                    className={`flex items-center gap-2 font-sans font-bold text-xs mb-1 ${
                        isWhite ? "text-neutral-900" : "text-white"
                    }`}
                >
                    <Compass className="w-4 h-4 text-f1-red" />
                    <span>360° Controls</span>
                </div>
                <div className="flex items-center gap-2">
                    <MousePointer className="w-3 h-3 text-neutral-400" />
                    <span>Klik & Seret: Putar Mobil Bebas (360°)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 text-center text-neutral-400">↕</span>
                    <span>Scroll: Zoom In / Zoom Out</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 text-center text-neutral-400">↔</span>
                    <span>Klik Kanan + Seret: Geser Posisi</span>
                </div>
            </aside>

            {/* Quick Model Guide in Bottom-Right Corner */}
            <aside
                className={`absolute bottom-6 right-6 z-20 hidden lg:flex flex-col gap-1 p-3.5 rounded-xl border text-[11px] backdrop-blur-md max-w-xs shadow-lg transition-colors ${
                    isWhite
                        ? "bg-white/85 border-neutral-300 text-neutral-600"
                        : "bg-neutral-900/80 border-neutral-800/80 text-neutral-400"
                }`}
            >
                <div
                    className={`flex items-center gap-1.5 font-semibold text-xs mb-0.5 ${
                        isWhite ? "text-neutral-900" : "text-white"
                    }`}
                >
                    <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Model 3D Aktif</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                    File:{" "}
                    <code className="text-amber-500 font-mono font-medium">
                        public/models/f1-car.glb
                    </code>
                    <br />
                    Tampilan: Minimalis & Polos (Hanya Mobil)
                </p>
            </aside>
        </div>
    );
}
