import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Footer } from "@/components/organisms/Footer";

describe("Footer Organism", () => {
    it("renders branding, quick links, and legal disclaimer", () => {
        render(<Footer />);

        expect(screen.getByText("F1")).toBeInTheDocument();
        expect(screen.getByText("HUB")).toBeInTheDocument();
        expect(screen.getByText("Race Calendar 2026")).toBeInTheDocument();
        expect(screen.getByText("Championship Standings")).toBeInTheDocument();
        expect(
            screen.getByText("2026 Technical Regulations"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Disclaimer: This website is unofficial/i),
        ).toBeInTheDocument();
    });
});
