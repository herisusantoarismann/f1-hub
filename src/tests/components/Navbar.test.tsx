import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/organisms/Navbar";

// Mock next/navigation usePathname
const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));

describe("Navbar Component (Organism)", () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue("/");
    });

    it("renders the F1 Hub brand logo pointing to root", () => {
        render(<Navbar />);

        const brandLink = screen.getByLabelText("F1 Hub Homepage");
        expect(brandLink).toBeInTheDocument();
        expect(brandLink).toHaveAttribute("href", "/");
    });

    it("renders concise primary desktop navigation links and Championship dropdown", () => {
        render(<Navbar />);

        // Top level links
        expect(screen.getByRole("link", { name: /schedule/i })).toHaveAttribute(
            "href",
            "/schedule",
        );
        expect(screen.getByRole("link", { name: /circuits/i })).toHaveAttribute(
            "href",
            "/circuits",
        );
        expect(
            screen.getByRole("link", { name: /standings/i }),
        ).toHaveAttribute("href", "/standings");
        expect(
            screen.getByRole("link", { name: /regulations/i }),
        ).toHaveAttribute("href", "/regulations");

        // Test 3D link must NOT exist
        expect(screen.queryByRole("link", { name: /3d/i })).toBeNull();

        // Championship dropdown toggle
        const championshipBtn = screen.getByRole("button", {
            name: /championship/i,
        });
        expect(championshipBtn).toBeInTheDocument();
        expect(championshipBtn).toHaveAttribute("aria-expanded", "false");

        // Open championship dropdown by clicking
        fireEvent.click(championshipBtn);
        expect(championshipBtn).toHaveAttribute("aria-expanded", "true");

        // Drivers and Teams should now be visible in desktop dropdown
        expect(screen.getByRole("link", { name: /drivers/i })).toHaveAttribute(
            "href",
            "/drivers",
        );
        expect(screen.getByRole("link", { name: /teams/i })).toHaveAttribute(
            "href",
            "/teams",
        );

        // Tools dropdown toggle
        const toolsBtn = screen.getByRole("button", {
            name: /tools/i,
        });
        expect(toolsBtn).toBeInTheDocument();
        expect(toolsBtn).toHaveAttribute("aria-expanded", "false");

        // Open tools dropdown by clicking
        fireEvent.click(toolsBtn);
        expect(toolsBtn).toHaveAttribute("aria-expanded", "true");

        // Compare, Calculator, and Strategy should now be visible in desktop dropdown
        expect(screen.getByRole("link", { name: /compare/i })).toHaveAttribute(
            "href",
            "/compare",
        );
        expect(
            screen.getByRole("link", { name: /calculator/i }),
        ).toHaveAttribute("href", "/calculator");
        expect(screen.getByRole("link", { name: /strategy/i })).toHaveAttribute(
            "href",
            "/strategy",
        );
    });

    it("renders the mobile menu toggle button", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByTestId("mobile-menu-toggle");
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    });

    it("opens the mobile drawer with concise navigation links when clicked", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByTestId("mobile-menu-toggle");
        fireEvent.click(toggleBtn);

        expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
        const drawer = screen.getByTestId("mobile-menu-drawer");
        expect(drawer).toBeInTheDocument();

        // Check that mobile drawer contains key pages (Schedule, Circuits, Standings, Drivers, Teams, Regulations, Compare, Calculator, Strategy)
        const mobileLinks = drawer.querySelectorAll("a");
        expect(mobileLinks.length).toBe(9);

        // Verify test-3d is not in the drawer
        const linkHrefs = Array.from(mobileLinks).map((a) =>
            a.getAttribute("href"),
        );
        expect(linkHrefs).not.toContain("/test-3d");
        expect(linkHrefs).toContain("/schedule");
        expect(linkHrefs).toContain("/circuits");
        expect(linkHrefs).toContain("/standings");
        expect(linkHrefs).toContain("/drivers");
        expect(linkHrefs).toContain("/teams");
        expect(linkHrefs).toContain("/compare");
        expect(linkHrefs).toContain("/calculator");
        expect(linkHrefs).toContain("/strategy");
        expect(linkHrefs).toContain("/regulations");
    });

    it("applies active indicator when route matches pathname", () => {
        mockUsePathname.mockReturnValue("/schedule");
        render(<Navbar />);

        const scheduleLink = screen.getByRole("link", { name: /schedule/i });
        expect(scheduleLink.className).toContain("text-white");
    });

    it("highlights Championship dropdown when viewing a driver or team page", () => {
        mockUsePathname.mockReturnValue("/drivers/max_verstappen");
        render(<Navbar />);

        const championshipBtn = screen.getByRole("button", {
            name: /championship/i,
        });
        expect(championshipBtn.className).toContain("text-white");
    });

    it("highlights Tools dropdown when viewing an interactive tool page", () => {
        mockUsePathname.mockReturnValue("/strategy");
        render(<Navbar />);

        const toolsBtn = screen.getByRole("button", {
            name: /tools/i,
        });
        expect(toolsBtn.className).toContain("text-white");
    });
});
