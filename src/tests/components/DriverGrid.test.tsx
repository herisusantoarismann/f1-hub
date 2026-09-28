import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DriverGrid } from "@/components/organisms/DriverGrid";
import { DriverWithTeam } from "@/types/f1";

const mockDrivers: DriverWithTeam[] = [
    {
        driverId: "max_verstappen",
        permanentNumber: "1",
        code: "VER",
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        url: "https://en.wikipedia.org/wiki/Max_Verstappen",
        team: {
            constructorId: "red_bull",
            name: "Oracle Red Bull Racing",
            nationality: "Austrian",
            url: "",
        },
        position: "1",
        points: "450",
        isReserve: false,
    },
    {
        driverId: "iwasa",
        permanentNumber: "36",
        givenName: "Ayumu",
        familyName: "Iwasa",
        nationality: "Japanese",
        url: "",
        team: {
            constructorId: "red_bull",
            name: "Oracle Red Bull Racing",
            nationality: "",
            url: "",
        },
        isReserve: true,
        reserveRole: "Official Reserve & Test Driver",
    },
];

describe("DriverGrid Organism Component", () => {
    it("renders all drivers by default and shows category counts", () => {
        render(<DriverGrid drivers={mockDrivers} />);

        expect(screen.getByText(/Semua \(2\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Pembalap Utama \(1\)/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Pembalap Cadangan \(1\)/i),
        ).toBeInTheDocument();

        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
        expect(screen.getByText("Ayumu Iwasa")).toBeInTheDocument();
    });

    it("filters to reserve drivers only when clicking Pembalap Cadangan tab", () => {
        render(<DriverGrid drivers={mockDrivers} />);

        const reserveTab = screen.getByText(/Pembalap Cadangan \(1\)/i);
        fireEvent.click(reserveTab);

        expect(screen.queryByText("Max Verstappen")).not.toBeInTheDocument();
        expect(screen.getByText("Ayumu Iwasa")).toBeInTheDocument();
    });

    it("filters to race drivers only when clicking Pembalap Utama tab", () => {
        render(<DriverGrid drivers={mockDrivers} />);

        const raceTab = screen.getByText(/Pembalap Utama \(1\)/i);
        fireEvent.click(raceTab);

        expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
        expect(screen.queryByText("Ayumu Iwasa")).not.toBeInTheDocument();
    });

    it("filters drivers dynamically via search input", () => {
        render(<DriverGrid drivers={mockDrivers} />);

        const searchInput = screen.getByPlaceholderText(/search drivers/i);
        fireEvent.change(searchInput, { target: { value: "Iwasa" } });

        expect(screen.queryByText("Max Verstappen")).not.toBeInTheDocument();
        expect(screen.getByText("Ayumu Iwasa")).toBeInTheDocument();
    });
});
