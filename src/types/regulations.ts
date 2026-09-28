/**
 * F1 Regulations & Technical Glossary Domain Types
 */

export type GlossaryCategory = "Aero" | "Engine" | "Strategy" | "Safety";

export interface GlossaryTerm {
    id: string;
    term: string;
    category: GlossaryCategory;
    shortDefinition: string;
    detailedExplanation?: string;
    relevance2026?: string;
}

export type TechnicalAspectCategory =
    "Powertrain" | "Aerodynamics" | "Chassis & Weight" | "Safety & Fuel";

export interface TechnicalFeature {
    id: string;
    category: TechnicalAspectCategory;
    parameter: string;
    era2022_2025: string;
    era2026: string;
    technicalImpact: string;
}

export interface EraMetadata {
    name: string;
    period: string;
    tagline: string;
    keyPhilosophy: string;
}

export interface RegulationEraComparison {
    title: string;
    description: string;
    eraCurrent: EraMetadata;
    eraNew: EraMetadata;
    features: TechnicalFeature[];
}
