import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CircuitCard } from "@/components/molecules/CircuitCard";
import { Circuit } from "@/types/f1";

const mockSilverstoneCircuit: Circuit = {
    circuitId: "silverstone",
    url: "https://en.wikipedia.org/wiki/Silverstone_Circuit",
    circuitName: "Silverstone Circuit",
    Location: {
        lat: "52.0786",
        long: "-1.01694",
        locality: "Silverstone",
        country: "UK",
    },
};

const mockMonacoCircuit: Circuit = {
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

describe("CircuitCard Component (Molecule)", () => {
    it("renders circuit name, location, and track type badge", () => {
        render(<CircuitCard circuit={mockSilverstoneCircuit} />);

        // Circuit name and locality
        expect(screen.getByTestId("circuit-card-name")).toHaveTextContent(
            "Silverstone Circuit",
        );
        expect(screen.getByText(/Silverstone, UK/i)).toBeInTheDocument();

        // Track type badge
        expect(screen.getByText(/Permanent Track/i)).toBeInTheDocument();
    });

    it("renders accurate track length and turns from tech specs data", () => {
        render(<CircuitCard circuit={mockSilverstoneCircuit} />);

        // Silverstone length: 5.891 km, 18 turns
        expect(screen.getByTestId("circuit-length")).toHaveTextContent(
            "5.891 km",
        );
        expect(screen.getByTestId("circuit-turns")).toHaveTextContent(
            "18 Turns",
        );
    });

    it("renders aerodynamic and mechanical badges (downforce, DRS, tyre stress)", () => {
        render(<CircuitCard circuit={mockSilverstoneCircuit} />);

        // Silverstone has High downforce, 2 2026 Overtake zones, 5/5 tyre stress
        expect(screen.getByText("High DF")).toBeInTheDocument();
        expect(screen.getByText("2 Overtake")).toBeInTheDocument();
        expect(screen.getByText("Stress 5/5")).toBeInTheDocument();
    });

    it("renders track outline image with appropriate alt text and image src", () => {
        render(<CircuitCard circuit={mockSilverstoneCircuit} />);

        const img = screen.getByRole("img", {
            name: /Silverstone Circuit track layout/i,
        });
        expect(img).toBeInTheDocument();
        expect(img.getAttribute("src")).toContain(
            "/images/circuits/silverstone.svg",
        );
    });

    it("renders street track specifications for urban circuits like Monaco", () => {
        render(<CircuitCard circuit={mockMonacoCircuit} />);

        expect(screen.getByText(/Street Track/i)).toBeInTheDocument();
        expect(screen.getByTestId("circuit-length")).toHaveTextContent(
            "3.337 km",
        );
        expect(screen.getByTestId("circuit-turns")).toHaveTextContent(
            "19 Turns",
        );
    });

    it("links to the correct circuit technical detail route", () => {
        render(<CircuitCard circuit={mockSilverstoneCircuit} />);

        const inspectLink = screen.getByRole("link", {
            name: /View technical profile for Silverstone Circuit/i,
        });
        expect(inspectLink).toHaveAttribute("href", "/circuits/silverstone");
    });
});
