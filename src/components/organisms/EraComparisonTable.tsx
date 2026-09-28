"use client";

import React, { useState, useMemo } from "react";
import {
    RegulationEraComparison,
    TechnicalAspectCategory,
} from "@/types/regulations";
import { EraComparisonRow } from "@/components/molecules/EraComparisonRow";
import { Badge } from "@/components/atoms/Badge";
import { Zap, Gauge, Sparkles, SlidersHorizontal } from "lucide-react";

export interface EraComparisonTableProps {
    comparisonData: RegulationEraComparison;
}

export const EraComparisonTable: React.FC<EraComparisonTableProps> = ({
    comparisonData,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = useMemo(() => {
        const list = Array.from(
            new Set(comparisonData.features.map((f) => f.category)),
        );
        return ["All", ...list];
    }, [comparisonData.features]);

    const filteredFeatures = useMemo(() => {
        if (selectedCategory === "All") return comparisonData.features;
        return comparisonData.features.filter(
            (f) => f.category === selectedCategory,
        );
    }, [comparisonData.features, selectedCategory]);

    return (
        <section
            className="space-y-8"
            data-testid="era-comparison-table-section"
        >
            {/* Era Philosophy Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2022–2025 Card */}
                <div className="relative overflow-hidden rounded-2xl border border-f1-charcoal bg-gradient-to-br from-f1-carbon to-f1-black p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" size="md">
                            {comparisonData.eraCurrent.period}
                        </Badge>
                        <span className="text-xs font-mono text-f1-gray uppercase">
                            Current Generation
                        </span>
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-white">
                            {comparisonData.eraCurrent.name}
                        </h3>
                        <p className="text-xs font-medium text-f1-red mt-1">
                            {comparisonData.eraCurrent.tagline}
                        </p>
                    </div>

                    <p className="text-xs text-f1-gray leading-relaxed border-t border-f1-charcoal/60 pt-3">
                        {comparisonData.eraCurrent.keyPhilosophy}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-f1-lightgray/80 font-mono">
                        <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-f1-red" /> 798 kg
                            minimum
                        </span>
                        <span>•</span>
                        <span>120 kW MGU-K</span>
                        <span>•</span>
                        <span>E10 Fuel</span>
                    </div>
                </div>

                {/* 2026+ Card */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-f1-carbon to-f1-black p-6 space-y-4 shadow-xl">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between">
                        <Badge
                            variant="success"
                            size="md"
                            className="shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        >
                            {comparisonData.eraNew.period}
                        </Badge>
                        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Next Regulation
                            Reset
                        </span>
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-white">
                            {comparisonData.eraNew.name}
                        </h3>
                        <p className="text-xs font-medium text-emerald-400 mt-1">
                            {comparisonData.eraNew.tagline}
                        </p>
                    </div>

                    <p className="text-xs text-f1-gray leading-relaxed border-t border-f1-charcoal/60 pt-3">
                        {comparisonData.eraNew.keyPhilosophy}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-emerald-300 font-mono">
                        <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-emerald-400" /> 350
                            kW Electric
                        </span>
                        <span>•</span>
                        <span>-30 kg Weight</span>
                        <span>•</span>
                        <span>Active Aero X/Z</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-f1-charcoal pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <SlidersHorizontal className="w-4 h-4 text-f1-red" />
                    <span>Technical Parameters Comparison</span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                                selectedCategory === cat
                                    ? "bg-f1-red text-white shadow-md shadow-f1-red/30"
                                    : "bg-f1-carbon text-f1-gray hover:text-white hover:bg-f1-charcoal border border-f1-charcoal"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rows Container */}
            <div className="space-y-4">
                {filteredFeatures.map((feature) => (
                    <EraComparisonRow key={feature.id} feature={feature} />
                ))}
            </div>
        </section>
    );
};
