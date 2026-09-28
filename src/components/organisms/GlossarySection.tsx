"use client";

import React, { useState, useMemo } from "react";
import { GlossaryTerm, GlossaryCategory } from "@/types/regulations";
import { GlossaryCard } from "@/components/molecules/GlossaryCard";
import { Search, BookOpen, Filter } from "lucide-react";

export interface GlossarySectionProps {
    terms: GlossaryTerm[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ terms }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const categories: ("All" | GlossaryCategory)[] = [
        "All",
        "Aero",
        "Engine",
        "Strategy",
        "Safety",
    ];

    const filteredTerms = useMemo(() => {
        return terms.filter((term) => {
            // Category filter
            if (activeCategory !== "All" && term.category !== activeCategory) {
                return false;
            }

            // Keyword search filter
            if (searchTerm.trim() !== "") {
                const query = searchTerm.toLowerCase();
                const matchesTerm = term.term.toLowerCase().includes(query);
                const matchesDef = term.shortDefinition
                    .toLowerCase()
                    .includes(query);
                const matchesDetail =
                    term.detailedExplanation?.toLowerCase().includes(query) ??
                    false;

                return matchesTerm || matchesDef || matchesDetail;
            }

            return true;
        });
    }, [terms, activeCategory, searchTerm]);

    return (
        <section className="space-y-6" data-testid="glossary-section">
            {/* Header and Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-f1-charcoal pb-6">
                <div>
                    <div className="flex items-center gap-2 text-f1-red text-xs font-bold uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>F1 Motorsport Glossary</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        Technical Lexicon & Strategy Dictionary
                    </h2>
                    <p className="text-xs sm:text-sm text-f1-gray mt-1 max-w-xl">
                        Demystifying trackside jargon, telemetry vernacular, and
                        race engineering principles.
                    </p>
                </div>

                {/* Search & Category Pills */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-f1-gray" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search terminology..."
                            aria-label="Search technical terms"
                            className="w-full rounded-lg bg-f1-carbon border border-f1-charcoal pl-9 pr-4 py-2 text-xs text-white placeholder-f1-gray focus:outline-none focus:border-f1-red transition-colors"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="inline-flex rounded-lg bg-f1-carbon p-1 border border-f1-charcoal text-xs overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all whitespace-nowrap ${
                                    activeCategory === cat
                                        ? "bg-f1-red text-white shadow-sm"
                                        : "text-f1-gray hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid of Glossary Cards */}
            {filteredTerms.length > 0 ? (
                <div
                    data-testid="glossary-grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {filteredTerms.map((term) => (
                        <GlossaryCard key={term.id} term={term} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div
                    data-testid="glossary-empty-state"
                    className="rounded-xl border border-dashed border-f1-charcoal p-12 text-center bg-f1-carbon/30"
                >
                    <Filter className="w-10 h-10 text-f1-gray mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-white">
                        No terms found
                    </h3>
                    <p className="text-xs text-f1-gray mt-1 max-w-sm mx-auto">
                        We couldn't find any F1 term matching "{searchTerm}".
                        Try another search or reset category filters.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setActiveCategory("All");
                        }}
                        className="mt-4 px-4 py-1.5 text-xs bg-f1-carbon hover:bg-f1-charcoal text-white rounded-md border border-f1-charcoal transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </section>
    );
};
