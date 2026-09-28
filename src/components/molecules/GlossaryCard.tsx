"use client";

import React, { useState } from "react";
import { GlossaryTerm, GlossaryCategory } from "@/types/regulations";
import { Badge } from "@/components/atoms/Badge";
import {
    ChevronDown,
    ChevronUp,
    Wind,
    Cpu,
    GitFork,
    ShieldCheck,
    Sparkles,
    LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface GlossaryCardProps {
    term: GlossaryTerm;
    className?: string;
    defaultExpanded?: boolean;
}

const CATEGORY_CONFIG: Record<
    GlossaryCategory,
    {
        variant: "primary" | "secondary" | "success" | "sprint" | "outline";
        icon: LucideIcon;
        label: string;
    }
> = {
    Aero: {
        variant: "outline",
        icon: Wind,
        label: "Aerodynamics",
    },
    Engine: {
        variant: "primary",
        icon: Cpu,
        label: "Powertrain",
    },
    Strategy: {
        variant: "sprint",
        icon: GitFork,
        label: "Strategy",
    },
    Safety: {
        variant: "success",
        icon: ShieldCheck,
        label: "Safety / Rules",
    },
};

export const GlossaryCard: React.FC<GlossaryCardProps> = ({
    term,
    className,
    defaultExpanded = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const config = CATEGORY_CONFIG[term.category] ?? CATEGORY_CONFIG.Aero;
    const CategoryIcon = config.icon;

    return (
        <article
            data-testid="glossary-card"
            className={cn(
                "group relative flex flex-col justify-between rounded-xl border border-f1-charcoal bg-f1-carbon/90 p-5 transition-all duration-300 hover:border-f1-red/50 hover:shadow-lg",
                className,
            )}
        >
            <div className="space-y-3">
                {/* Header with Term & Category Badge */}
                <div className="flex items-start justify-between gap-3">
                    <h3
                        data-testid="glossary-term-title"
                        className="text-lg font-bold tracking-tight text-white group-hover:text-f1-red transition-colors"
                    >
                        {term.term}
                    </h3>

                    <Badge
                        data-testid="glossary-category-badge"
                        variant={config.variant}
                        size="sm"
                        className="shrink-0 flex items-center gap-1 font-mono"
                    >
                        <CategoryIcon className="w-3 h-3" />
                        <span>{term.category}</span>
                    </Badge>
                </div>

                {/* Short summary definition */}
                <p
                    data-testid="glossary-short-definition"
                    className="text-xs sm:text-sm text-f1-lightgray/90 leading-relaxed"
                >
                    {term.shortDefinition}
                </p>

                {/* Expandable detailed section */}
                {isExpanded && (
                    <div
                        data-testid="glossary-expanded-content"
                        className="pt-3 mt-3 border-t border-f1-charcoal/60 space-y-2.5 text-xs text-f1-gray animate-fadeIn"
                    >
                        {term.detailedExplanation && (
                            <p className="leading-relaxed text-f1-lightgray/80">
                                {term.detailedExplanation}
                            </p>
                        )}

                        {term.relevance2026 && (
                            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-f1-black/50 border border-f1-charcoal/80">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <div className="text-[11px] leading-snug">
                                    <span className="font-semibold text-amber-300">
                                        2026 Shift:{" "}
                                    </span>
                                    <span className="text-f1-lightgray/80">
                                        {term.relevance2026}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Toggle button */}
            {(term.detailedExplanation || term.relevance2026) && (
                <div className="mt-4 pt-3 flex items-center justify-end border-t border-f1-charcoal/40">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        aria-expanded={isExpanded}
                        data-testid="glossary-toggle-btn"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-f1-gray hover:text-white transition-colors"
                    >
                        <span>{isExpanded ? "Show Less" : "Deep Dive"}</span>
                        {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-f1-red" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-f1-red" />
                        )}
                    </button>
                </div>
            )}
        </article>
    );
};
