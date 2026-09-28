"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Flag,
    Trophy,
    Calendar,
    Users,
    BookOpen,
    Shield,
    Menu,
    X,
    ChevronDown,
    Milestone,
    Scale,
    Calculator,
    Wrench,
} from "lucide-react";

export const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isChampionshipOpen, setIsChampionshipOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const championshipDropdownRef = useRef<HTMLDivElement>(null);
    const toolsDropdownRef = useRef<HTMLDivElement>(null);

    // Close mobile menu and dropdowns on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsChampionshipOpen(false);
        setIsToolsOpen(false);
    }, [pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                championshipDropdownRef.current &&
                !championshipDropdownRef.current.contains(event.target as Node)
            ) {
                setIsChampionshipOpen(false);
            }
            if (
                toolsDropdownRef.current &&
                !toolsDropdownRef.current.contains(event.target as Node)
            ) {
                setIsToolsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    const isChampionshipActive =
        pathname.startsWith("/drivers") || pathname.startsWith("/teams");

    const isToolsActive =
        pathname.startsWith("/compare") ||
        pathname.startsWith("/calculator") ||
        pathname.startsWith("/strategy");

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md transition-all">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group select-none"
                    aria-label="F1 Hub Homepage"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-f1-red to-f1-darkred text-white shadow-md shadow-f1-red/30 transition-transform group-hover:scale-105">
                        <Flag className="w-4 h-4 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-black tracking-tighter text-white font-sans">
                                F1<span className="text-f1-red">HUB</span>
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-semibold border border-neutral-700/60">
                                2026
                            </span>
                        </div>
                        <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400 -mt-1 font-medium">
                            Motorsport Intel
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav
                    className="hidden md:flex items-center gap-1.5 text-sm font-medium"
                    aria-label="Main Navigation"
                >
                    {/* Schedule */}
                    <Link
                        href="/schedule"
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive("/schedule")
                                ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                        }`}
                    >
                        <Calendar
                            className={`w-3.5 h-3.5 ${
                                isActive("/schedule")
                                    ? "text-f1-red"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span>Schedule</span>
                        {isActive("/schedule") && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                        )}
                    </Link>

                    {/* Circuits */}
                    <Link
                        href="/circuits"
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive("/circuits")
                                ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                        }`}
                    >
                        <Milestone
                            className={`w-3.5 h-3.5 ${
                                isActive("/circuits")
                                    ? "text-f1-red"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span>Circuits</span>
                        {isActive("/circuits") && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                        )}
                    </Link>

                    {/* Standings */}
                    <Link
                        href="/standings"
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive("/standings")
                                ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                        }`}
                    >
                        <Trophy
                            className={`w-3.5 h-3.5 ${
                                isActive("/standings")
                                    ? "text-f1-red"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span>Standings</span>
                        {isActive("/standings") && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                        )}
                    </Link>

                    {/* Championship Dropdown (Drivers & Teams) */}
                    <div
                        className="relative"
                        ref={championshipDropdownRef}
                        onMouseEnter={() => setIsChampionshipOpen(true)}
                        onMouseLeave={() => setIsChampionshipOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setIsChampionshipOpen((prev) => !prev)
                            }
                            aria-expanded={isChampionshipOpen}
                            aria-haspopup="true"
                            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isChampionshipActive
                                    ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                            }`}
                        >
                            <Users
                                className={`w-3.5 h-3.5 ${
                                    isChampionshipActive
                                        ? "text-f1-red"
                                        : "text-neutral-400"
                                }`}
                            />
                            <span>Championship</span>
                            <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${
                                    isChampionshipOpen
                                        ? "rotate-180 text-white"
                                        : "text-neutral-400"
                                }`}
                            />
                            {isChampionshipActive && (
                                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isChampionshipOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-52 rounded-2xl bg-neutral-900/95 border border-neutral-800 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                                <Link
                                    href="/drivers"
                                    onClick={() => setIsChampionshipOpen(false)}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive("/drivers")
                                            ? "bg-neutral-800 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isActive("/drivers")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-tight">
                                            Drivers
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            Profiles & Numbers
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    href="/teams"
                                    onClick={() => setIsChampionshipOpen(false)}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive("/teams")
                                            ? "bg-neutral-800 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isActive("/teams")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-tight">
                                            Teams
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            Constructors & Lineups
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Tools Dropdown (Compare, Calculator, Strategy) */}
                    <div
                        className="relative"
                        ref={toolsDropdownRef}
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setIsToolsOpen((prev) => !prev)}
                            aria-expanded={isToolsOpen}
                            aria-haspopup="true"
                            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isToolsActive
                                    ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                            }`}
                        >
                            <Wrench
                                className={`w-3.5 h-3.5 ${
                                    isToolsActive
                                        ? "text-f1-red"
                                        : "text-neutral-400"
                                }`}
                            />
                            <span>Tools</span>
                            <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${
                                    isToolsOpen
                                        ? "rotate-180 text-white"
                                        : "text-neutral-400"
                                }`}
                            />
                            {isToolsActive && (
                                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isToolsOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-60 rounded-2xl bg-neutral-900/95 border border-neutral-800 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                                <Link
                                    href="/compare"
                                    onClick={() => setIsToolsOpen(false)}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive("/compare")
                                            ? "bg-neutral-800 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isActive("/compare")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-tight">
                                            Compare
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            Driver Head-to-Head
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    href="/calculator"
                                    onClick={() => setIsToolsOpen(false)}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive("/calculator")
                                            ? "bg-neutral-800 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isActive("/calculator")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Calculator className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-tight">
                                            Calculator
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            Points & Clinch Simulator
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    href="/strategy"
                                    onClick={() => setIsToolsOpen(false)}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                        isActive("/strategy")
                                            ? "bg-neutral-800 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isActive("/strategy")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Wrench className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-tight">
                                            Strategy
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            Pit Stop & Degradation
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Regulations */}
                    <Link
                        href="/regulations"
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive("/regulations")
                                ? "text-white bg-neutral-900 border border-neutral-800 shadow-sm"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                        }`}
                    >
                        <BookOpen
                            className={`w-3.5 h-3.5 ${
                                isActive("/regulations")
                                    ? "text-f1-red"
                                    : "text-neutral-400"
                            }`}
                        />
                        <span>Regulations</span>
                        {isActive("/regulations") && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-f1-red rounded-full shadow-f1-glow" />
                        )}
                    </Link>
                </nav>

                {/* Right Header Status & Mobile Hamburger Toggle */}
                <div className="flex items-center gap-3">
                    {/* Season Tag */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-f1-red" />
                        <span className="text-neutral-300 text-[11px] font-semibold">
                            2026 World Championship
                        </span>
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="md:hidden flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
                        aria-label={
                            isMobileMenuOpen ? "Close menu" : "Open menu"
                        }
                        aria-expanded={isMobileMenuOpen}
                        data-testid="mobile-menu-toggle"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-white" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
                    data-testid="mobile-menu-drawer"
                >
                    <nav className="flex flex-col gap-6">
                        {/* Section 1: Racing & Calendar */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-1">
                                Racing & Calendar
                            </span>
                            {/* Schedule */}
                            <Link
                                href="/schedule"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/schedule")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/schedule")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span>Schedule</span>
                                </div>
                                {isActive("/schedule") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>

                            {/* Circuits */}
                            <Link
                                href="/circuits"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/circuits")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/circuits")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Milestone className="w-4 h-4" />
                                    </div>
                                    <span>Circuits</span>
                                </div>
                                {isActive("/circuits") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>

                            {/* Standings */}
                            <Link
                                href="/standings"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/standings")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/standings")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <span>Standings</span>
                                </div>
                                {isActive("/standings") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>
                        </div>

                        {/* Section 2: Championship */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-1">
                                Championship
                            </span>
                            {/* Drivers */}
                            <Link
                                href="/drivers"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/drivers")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/drivers")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span>Drivers</span>
                                </div>
                                {isActive("/drivers") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>

                            {/* Teams */}
                            <Link
                                href="/teams"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/teams")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/teams")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span>Teams</span>
                                </div>
                                {isActive("/teams") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>
                        </div>

                        {/* Section 3: Interactive Tools */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-1">
                                Interactive Tools
                            </span>
                            {/* Compare */}
                            <Link
                                href="/compare"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/compare")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/compare")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <span>Compare Drivers</span>
                                </div>
                                {isActive("/compare") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>

                            {/* Calculator */}
                            <Link
                                href="/calculator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/calculator")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/calculator")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Calculator className="w-4 h-4" />
                                    </div>
                                    <span>Points Calculator</span>
                                </div>
                                {isActive("/calculator") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>

                            {/* Strategy */}
                            <Link
                                href="/strategy"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/strategy")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/strategy")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <Wrench className="w-4 h-4" />
                                    </div>
                                    <span>Strategy Simulator</span>
                                </div>
                                {isActive("/strategy") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>
                        </div>

                        {/* Section 4: Technical & Regulations */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-1">
                                Technical
                            </span>
                            {/* Regulations */}
                            <Link
                                href="/regulations"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all border ${
                                    isActive("/regulations")
                                        ? "bg-neutral-900 border-neutral-800 text-white"
                                        : "bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-xl ${
                                            isActive("/regulations")
                                                ? "bg-f1-red text-white"
                                                : "bg-neutral-800 text-neutral-400"
                                        }`}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <span>Regulations</span>
                                </div>
                                {isActive("/regulations") && (
                                    <span className="w-2 h-2 rounded-full bg-f1-red shadow-f1-glow" />
                                )}
                            </Link>
                        </div>
                    </nav>

                    <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-f1-red" />
                            Formula 1 Championship
                        </span>
                        <span>2026 Season</span>
                    </div>
                </div>
            )}
        </header>
    );
};
