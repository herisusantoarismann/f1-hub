"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Circuit } from "@/types/f1";
import { CircuitListCard } from "@/components/molecules/CircuitListCard";
import { getCircuitTechSpecs, CircuitTrackType } from "@/data/circuits-tech";
import {
    getCircuitDiagram,
    DEFAULT_CIRCUIT_DIAGRAM,
} from "@/lib/utils/circuit-assets";
import { getNationalityFlag } from "@/lib/utils/asset-helper";
import { TrackSpecsBadge } from "@/components/molecules/TrackSpecsBadge";
import {
    Search,
    X,
    Layers,
    LayoutGrid,
    List,
    Milestone,
    MapPin,
    ArrowRight,
    Timer,
} from "lucide-react";

interface CircuitGridProps {
    initialCircuits: Circuit[];
}

type TrackTypeFilter = "All" | CircuitTrackType;
type ViewMode = "grid" | "list";

export const CircuitGrid: React.FC<CircuitGridProps> = ({
    initialCircuits,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<TrackTypeFilter>("All");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const filteredCircuits = useMemo(() => {
        return initialCircuits.filter((circuit) => {
            const specs = getCircuitTechSpecs(circuit.circuitId);

            // Filter track type
            if (selectedType !== "All" && specs.type !== selectedType) {
                return false;
            }

            // Filter search query
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            const nameMatch = circuit.circuitName.toLowerCase().includes(q);
            const countryMatch = circuit.Location.country
                .toLowerCase()
                .includes(q);
            const cityMatch = circuit.Location.locality
                .toLowerCase()
                .includes(q);

            return nameMatch || countryMatch || cityMatch;
        });
    }, [initialCircuits, searchQuery, selectedType]);

    return (
        <div className="space-y-6" data-testid="circuit-grid-wrapper">
            {/* Control Bar: Search, Track Type Pills, & View Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/50 p-2 sm:p-3 rounded-2xl border border-neutral-800 backdrop-blur-md">
                {/* Track Type Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 overflow-x-auto">
                    {(
                        [
                            "All",
                            "Permanent",
                            "Street",
                            "Hybrid",
                        ] as TrackTypeFilter[]
                    ).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType(type)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                selectedType === type
                                    ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Right Controls: Search Bar & View Mode Toggle */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Local Search Input */}
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search circuit, city, or country..."
                            className="w-full pl-10 pr-9 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-f1-red focus:ring-1 focus:ring-f1-red transition-all"
                            aria-label="Filter circuits"
                            data-testid="circuit-search-input"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                                aria-label="Clear circuit search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* View Mode Toggle Button */}
                    <div
                        role="group"
                        aria-label="View Mode"
                        className="flex items-center p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 shrink-0"
                    >
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === "grid"
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-500 hover:text-white"
                            }`}
                            title="Grid Card View"
                            aria-label="Grid Card View"
                            aria-pressed={viewMode === "grid"}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === "list"
                                    ? "bg-neutral-800 text-white"
                                    : "text-neutral-500 hover:text-white"
                            }`}
                            title="List Table View"
                            aria-label="List Table View"
                            aria-pressed={viewMode === "list"}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                <span>
                    Showing {filteredCircuits.length} of{" "}
                    {initialCircuits.length} Championship Circuits
                </span>
                {selectedType !== "All" && (
                    <span className="text-neutral-400">
                        Filtered by {selectedType} layouts
                    </span>
                )}
            </div>

            {/* Circuit Content: Grid or List Table View */}
            {filteredCircuits.length > 0 ? (
                viewMode === "grid" ? (
                    /* GRID VIEW */
                    <div
                        data-testid="circuit-cards-grid"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredCircuits.map((circuit, index) => (
                            <CircuitListCard
                                key={circuit.circuitId}
                                circuit={circuit}
                                priority={index < 4}
                            />
                        ))}
                    </div>
                ) : (
                    /* LIST TABLE VIEW */
                    <div
                        data-testid="circuit-list-table"
                        className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-sm"
                    >
                        <table className="w-full text-left text-sm text-neutral-300">
                            <thead className="bg-neutral-950/80 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                                <tr>
                                    <th className="py-3.5 px-4 w-24">Layout</th>
                                    <th className="py-3.5 px-4">Circuit</th>
                                    <th className="py-3.5 px-4 hidden sm:table-cell">
                                        Type
                                    </th>
                                    <th className="py-3.5 px-4">Length</th>
                                    <th className="py-3.5 px-4 hidden md:table-cell">
                                        Turns
                                    </th>
                                    <th className="py-3.5 px-4 hidden lg:table-cell">
                                        Characteristics
                                    </th>
                                    <th className="py-3.5 px-4 hidden xl:table-cell">
                                        Lap Record
                                    </th>
                                    <th className="py-3.5 px-4 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/60 font-sans">
                                {filteredCircuits.map((circuit, index) => {
                                    const specs = getCircuitTechSpecs(
                                        circuit.circuitId,
                                    );
                                    const flag = getNationalityFlag(
                                        circuit.Location.country,
                                    );
                                    const diagramUrl = getCircuitDiagram(
                                        circuit.circuitId,
                                    );

                                    return (
                                        <tr
                                            key={circuit.circuitId}
                                            className="hover:bg-neutral-850/50 transition-colors group"
                                        >
                                            {/* Mini Track Diagram */}
                                            <td className="py-3 px-4 w-24">
                                                <div className="w-16 h-12 rounded-xl bg-neutral-950/80 border border-neutral-800 p-1 flex items-center justify-center overflow-hidden">
                                                    <Image
                                                        src={diagramUrl}
                                                        alt={`${circuit.circuitName} mini layout`}
                                                        width={64}
                                                        height={40}
                                                        className="object-contain max-h-full w-auto"
                                                        priority={index < 5}
                                                        loading={
                                                            index < 5
                                                                ? "eager"
                                                                : "lazy"
                                                        }
                                                        unoptimized
                                                    />
                                                </div>
                                            </td>

                                            {/* Circuit Name & Location */}
                                            <td className="py-3 px-4">
                                                <Link
                                                    href={`/circuits/${circuit.circuitId}`}
                                                    className="font-bold text-white group-hover:text-f1-red transition-colors block leading-snug"
                                                >
                                                    {circuit.circuitName}
                                                </Link>
                                                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                                                    <MapPin className="w-3 h-3 text-f1-red shrink-0" />
                                                    <span>
                                                        {
                                                            circuit.Location
                                                                .locality
                                                        }
                                                        ,{" "}
                                                        {
                                                            circuit.Location
                                                                .country
                                                        }
                                                    </span>
                                                    <span>{flag}</span>
                                                </div>
                                            </td>

                                            {/* Track Type */}
                                            <td className="py-3 px-4 hidden sm:table-cell text-xs font-mono">
                                                <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 text-neutral-300">
                                                    {specs.type}
                                                </span>
                                            </td>

                                            {/* Length & Laps */}
                                            <td className="py-3 px-4 font-mono text-xs text-neutral-200">
                                                <span className="font-bold block">
                                                    {specs.lengthKm.toFixed(3)}{" "}
                                                    km
                                                </span>
                                                <span className="text-[10px] text-neutral-500">
                                                    {specs.laps} Laps
                                                </span>
                                            </td>

                                            {/* Turns */}
                                            <td className="py-3 px-4 hidden md:table-cell font-mono text-xs text-neutral-300">
                                                <span>{specs.turns}</span>
                                                <span className="text-[10px] text-neutral-500 block">
                                                    {specs.turnsLeft}L /{" "}
                                                    {specs.turnsRight}R
                                                </span>
                                            </td>

                                            {/* Specs Badges */}
                                            <td className="py-3 px-4 hidden lg:table-cell">
                                                <TrackSpecsBadge
                                                    downforce={specs.downforce}
                                                    drsZones={specs.drsZones}
                                                    tyreStress={
                                                        specs.tyreStress
                                                    }
                                                />
                                            </td>

                                            {/* Lap Record */}
                                            <td className="py-3 px-4 hidden xl:table-cell font-mono text-xs">
                                                <span className="text-purple-300 font-bold block flex items-center gap-1">
                                                    <Timer className="w-3 h-3 text-purple-400" />
                                                    {specs.lapRecord.time}
                                                </span>
                                                <span className="text-[10px] text-neutral-500 truncate max-w-[140px] block">
                                                    {specs.lapRecord.driver} (
                                                    {specs.lapRecord.year})
                                                </span>
                                            </td>

                                            {/* CTA Inspect */}
                                            <td className="py-3 px-4 text-right">
                                                <Link
                                                    href={`/circuits/${circuit.circuitId}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
                                                >
                                                    <span>View</span>
                                                    <ArrowRight className="w-3 h-3 text-f1-red" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                /* Empty Search State */
                <div
                    data-testid="circuit-empty-state"
                    className="p-12 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-3"
                >
                    <Layers className="w-10 h-10 text-neutral-500 mx-auto" />
                    <h3 className="text-base font-bold text-white">
                        No circuits found
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        We couldn&apos;t find any circuit matching &quot;
                        {searchQuery}&quot;. Try searching by country or reset
                        your filter.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedType("All");
                        }}
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
                    >
                        Reset Search
                    </button>
                </div>
            )}
        </div>
    );
};
