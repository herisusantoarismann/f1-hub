import { Metadata } from "next";
import { ERA_COMPARISON_DATA, GLOSSARY_TERMS } from "@/data/regulations";
import { EraComparisonTable } from "@/components/organisms/EraComparisonTable";
import { GlossarySection } from "@/components/organisms/GlossarySection";
import { Cpu, ShieldCheck, Flag } from "lucide-react";

export const metadata: Metadata = {
    title: "F1 Regulations & Technical Guide | F1 Hub",
    description:
        "Explore the engineering revolution of Formula 1: 2022–2025 Ground Effect era vs the 2026 active aerodynamics, sustainable fuel, and 350 kW hybrid reset, plus technical glossary.",
};

export default function RegulationsPage() {
    return (
        <main className="container mx-auto px-4 py-10 max-w-7xl space-y-16">
            {/* Page Header */}
            <section className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-f1-red/10 border border-f1-red/30 text-xs font-semibold text-f1-red uppercase tracking-wider">
                    <Flag className="w-3.5 h-3.5" />
                    <span>FIA Technical Regulations</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    F1 Engineering Blueprint & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red via-rose-500 to-amber-500">
                        Regulation Evolution
                    </span>
                </h1>

                <p className="text-sm sm:text-base text-f1-gray leading-relaxed">
                    Formula 1 stands on the precipice of its biggest regulatory
                    overhaul in modern history. Compare the ground-effect
                    machines of today against the sustainable,
                    active-aerodynamic beasts of 2026.
                </p>

                {/* Quick Highlights Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-f1-carbon border border-f1-charcoal text-f1-lightgray">
                        <Cpu className="w-3.5 h-3.5 text-f1-red" />
                        50/50 Electric & ICE Power
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-f1-carbon border border-f1-charcoal text-f1-lightgray">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        100% Advanced E-Fuels
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-f1-carbon border border-f1-charcoal text-f1-lightgray">
                        Active Aero (X/Z Mode)
                    </span>
                </div>
            </section>

            {/* Part 1: Era Comparison Table */}
            <section className="space-y-4">
                <EraComparisonTable comparisonData={ERA_COMPARISON_DATA} />
            </section>

            {/* Part 2: Technical Glossary */}
            <section className="space-y-4 pt-8 border-t border-f1-charcoal">
                <GlossarySection terms={GLOSSARY_TERMS} />
            </section>
        </main>
    );
}
