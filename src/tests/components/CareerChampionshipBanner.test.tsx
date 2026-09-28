import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CareerChampionshipBanner } from "@/components/molecules/CareerChampionshipBanner";

describe("CareerChampionshipBanner Molecule", () => {
    it("renders null if driver has 0 world championships and no junior titles", () => {
        const { container } = render(
            <CareerChampionshipBanner
                worldChampionships={{ total: 0, years: [] }}
                juniorTitles={[]}
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders F1 world championship banner with crown and years", () => {
        render(
            <CareerChampionshipBanner
                worldChampionships={{ total: 3, years: [2021, 2022, 2023] }}
            />,
        );
        expect(
            screen.getByTestId("career-championship-banner"),
        ).toBeInTheDocument();
        expect(screen.getByText("3× World Champion")).toBeInTheDocument();
        expect(screen.getByText("2021")).toBeInTheDocument();
        expect(screen.getByText("2022")).toBeInTheDocument();
        expect(screen.getByText("2023")).toBeInTheDocument();
    });

    it("renders junior championships when available", () => {
        render(
            <CareerChampionshipBanner
                juniorTitles={[
                    {
                        year: 2020,
                        title: "FIA Formula 3 Champion",
                        category: "F3",
                    },
                ]}
            />,
        );
        expect(screen.getByText("Feeder Series Honours")).toBeInTheDocument();
        expect(screen.getByText("Junior Formula Champion")).toBeInTheDocument();
        expect(screen.getByText("FIA Formula 3 Champion")).toBeInTheDocument();
    });
});
