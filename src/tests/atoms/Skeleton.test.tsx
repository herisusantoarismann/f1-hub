import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

describe("Skeleton Atom Component", () => {
    it("renders with default shimmer effect class", () => {
        const { container } = render(<Skeleton data-testid="skeleton" />);
        const el = container.firstChild as HTMLElement;
        expect(el).toBeInTheDocument();
        expect(el.className).toContain("rounded-md");
        expect(el.className).toContain("before:animate-[shimmer_2s_infinite]");
    });

    it("renders without shimmer effect when shimmer=false", () => {
        const { container } = render(<Skeleton shimmer={false} />);
        const el = container.firstChild as HTMLElement;
        expect(el.className).not.toContain(
            "before:animate-[shimmer_2s_infinite]",
        );
    });

    it("merges custom className properly", () => {
        const { container } = render(<Skeleton className="w-48 h-12" />);
        const el = container.firstChild as HTMLElement;
        expect(el.className).toContain("w-48");
        expect(el.className).toContain("h-12");
    });
});
