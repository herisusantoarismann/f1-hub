import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CircuitInfoCard } from "@/components/molecules/CircuitInfoCard";
import { Circuit } from "@/types/f1";

const mockCircuit: Circuit = {
    circuitId: "monaco",
    url: "https://en.wikipedia.org/wiki/Circuit_de_Monaco",
    circuitName: "Circuit de Monaco",
    Location: {
        lat: "43.7347",
        long: "7.42056",
        locality: "Monte-Carlo",
        country: "Monaco",
    },
};

describe("CircuitInfoCard Molecule", () => {
    it("renders circuit name, locality, country, and specs", () => {
        render(
            <CircuitInfoCard
                circuit={mockCircuit}
                round="8"
                raceName="Monaco Grand Prix"
            />,
        );

        expect(screen.getByText("Circuit de Monaco")).toBeInTheDocument();
        expect(screen.getByText(/Monte-Carlo,\s*Monaco/)).toBeInTheDocument();
        expect(screen.getByText("3.337 km")).toBeInTheDocument();
        expect(screen.getByText("78 Laps")).toBeInTheDocument();
    });

    it("renders link to interactive circuit explorer", () => {
        render(
            <CircuitInfoCard
                circuit={mockCircuit}
                round="8"
                raceName="Monaco Grand Prix"
            />,
        );

        const link = screen.getByRole("link", {
            name: /Inspect Full Technical Profile/i,
        });
        expect(link).toHaveAttribute("href", "/circuits/monaco");
    });
});
