import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/atoms/Badge";

describe("Badge Component (Atom)", () => {
    it("renders children text content properly", () => {
        render(<Badge>Ferrari</Badge>);
        expect(screen.getByText("Ferrari")).toBeInTheDocument();
    });

    it("applies primary variant classes correctly", () => {
        render(<Badge variant="primary">Round 1</Badge>);
        const badge = screen.getByText("Round 1");
        expect(badge.className).toContain("bg-f1-red");
    });

    it("applies sprint variant styles", () => {
        render(<Badge variant="sprint">Sprint</Badge>);
        const badge = screen.getByText("Sprint");
        expect(badge.className).toContain("from-purple-900");
    });

    it("applies custom teamColor dynamically", () => {
        render(<Badge teamColor="#E80020">Scuderia</Badge>);
        const badge = screen.getByText("Scuderia");
        expect(badge).toHaveStyle({
            color: "#e80020",
            backgroundColor: "rgba(232, 0, 32, 0.133)",
        });
    });
});
