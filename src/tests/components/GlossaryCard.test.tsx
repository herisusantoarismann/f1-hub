import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlossaryCard } from "@/components/molecules/GlossaryCard";
import { GlossaryTerm } from "@/types/regulations";

const mockTerm: GlossaryTerm = {
    id: "porpoising",
    term: "Porpoising",
    category: "Aero",
    shortDefinition:
        "High-speed aerodynamic bouncing caused by cyclic stalling of airflow through underfloor Venturi tunnels.",
    detailedExplanation:
        "As car speed increases, the Venturi tunnels suck the floor closer to the track until airflow separates.",
    relevance2026:
        "2026 floor regulations mandate partially flat floors to eradicate violent ground effect porpoising.",
};

describe("GlossaryCard Component (Molecule)", () => {
    it("renders the technical term title correctly", () => {
        render(<GlossaryCard term={mockTerm} />);
        const title = screen.getByTestId("glossary-term-title");
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent("Porpoising");
    });

    it("renders the category badge with correct category label", () => {
        render(<GlossaryCard term={mockTerm} />);
        const badge = screen.getByTestId("glossary-category-badge");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent("Aero");
    });

    it("renders the short definition text", () => {
        render(<GlossaryCard term={mockTerm} />);
        const definition = screen.getByTestId("glossary-short-definition");
        expect(definition).toBeInTheDocument();
        expect(definition).toHaveTextContent(
            "High-speed aerodynamic bouncing caused by cyclic stalling",
        );
    });

    it("toggles the deep dive detailed explanation when clicking the expand button", async () => {
        const user = userEvent.setup();
        render(<GlossaryCard term={mockTerm} />);

        // Initially detailed explanation should not be in document
        expect(
            screen.queryByTestId("glossary-expanded-content"),
        ).not.toBeInTheDocument();

        const toggleBtn = screen.getByTestId("glossary-toggle-btn");
        expect(toggleBtn).toHaveTextContent("Deep Dive");

        // Click to expand
        await user.click(toggleBtn);

        expect(
            screen.getByTestId("glossary-expanded-content"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/As car speed increases, the Venturi tunnels/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/2026 Shift:/i)).toBeInTheDocument();
        expect(toggleBtn).toHaveTextContent("Show Less");

        // Click to collapse
        await user.click(toggleBtn);
        expect(
            screen.queryByTestId("glossary-expanded-content"),
        ).not.toBeInTheDocument();
    });
});
