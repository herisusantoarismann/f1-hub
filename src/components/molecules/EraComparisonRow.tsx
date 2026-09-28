import React from "react";
import { TechnicalFeature } from "@/types/regulations";
import { Badge } from "@/components/atoms/Badge";
import {
    ArrowRight,
    Cpu,
    Wind,
    Scale,
    ShieldAlert,
    LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface EraComparisonRowProps {
    feature: TechnicalFeature;
    className?: string;
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
    Powertrain: Cpu,
    Aerodynamics: Wind,
    "Chassis & Weight": Scale,
    "Safety & Fuel": ShieldAlert,
};

export const EraComparisonRow: React.FC<EraComparisonRowProps> = ({
    feature,
    className,
}) => {
    const Icon: LucideIcon = CATEGORY_ICON_MAP[feature.category] ?? Cpu;

    return (
        <div
            data-testid="era-comparison-row"
            className={cn(
                "group grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-xl border border-f1-charcoal bg-f1-carbon/60 hover:bg-f1-carbon hover:border-f1-red/40 transition-all",
                className,
            )}
        >
            {/* Parameter & Category info (Columns 1-4 on Desktop) */}
            <div className="md:col-span-4 flex flex-col justify-center space-y-1.5">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        size="sm"
                        className="font-mono text-[10px]"
                    >
                        <Icon className="w-3 h-3 text-f1-red mr-1" />
                        {feature.category}
                    </Badge>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-f1-red transition-colors">
                    {feature.parameter}
                </h4>
                <p className="text-xs text-f1-gray line-clamp-2 leading-relaxed">
                    {feature.technicalImpact}
                </p>
            </div>

            {/* 2022–2025 Era Column (Columns 5-7 on Desktop) */}
            <div className="md:col-span-4 flex flex-col justify-center rounded-lg bg-f1-black/50 p-3.5 border border-f1-charcoal/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-f1-gray">
                    2022–2025 (Ground Effect)
                </span>
                <span className="text-xs sm:text-sm font-semibold text-f1-lightgray mt-1">
                    {feature.era2022_2025}
                </span>
            </div>

            {/* 2026 New Era Column (Columns 8-12 on Desktop) */}
            <div className="md:col-span-4 flex flex-col justify-center rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                        <span>2026 Reset</span>
                        <ArrowRight className="w-3 h-3" />
                    </span>
                    <Badge
                        variant="success"
                        size="sm"
                        className="text-[9px] py-0 px-1.5"
                    >
                        NEW SPEC
                    </Badge>
                </div>
                <span className="text-xs sm:text-sm font-bold text-white mt-1">
                    {feature.era2026}
                </span>
            </div>
        </div>
    );
};
