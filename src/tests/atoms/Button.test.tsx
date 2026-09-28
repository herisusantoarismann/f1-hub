import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Button } from "@/components/atoms/Button";

describe("Button Atom Component", () => {
    it("renders children and default primary variant", () => {
        render(<Button>Click Me</Button>);
        const btn = screen.getByRole("button", { name: "Click Me" });
        expect(btn).toBeInTheDocument();
        expect(btn.className).toContain("bg-f1-red");
    });

    it("applies secondary, outline, and ghost variants properly", () => {
        const { rerender } = render(
            <Button variant="secondary">Secondary</Button>,
        );
        expect(screen.getByRole("button").className).toContain("bg-f1-carbon");

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole("button").className).toContain(
            "border-f1-charcoal",
        );

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole("button").className).toContain("text-f1-gray");
    });

    it("applies different sizes", () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole("button").className).toContain("text-xs");

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole("button").className).toContain("text-base");
    });

    it("handles click events and disabled state", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        const { rerender } = render(
            <Button onClick={handleClick}>Enabled</Button>,
        );
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);

        rerender(
            <Button disabled onClick={handleClick}>
                Disabled
            </Button>,
        );
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1); // Not incremented
    });
});
