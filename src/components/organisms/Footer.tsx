import React from "react";
import Link from "next/link";
import { Flag, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Column 1: Brand & Identity */}
                    <div className="md:col-span-2 space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-f1-red text-white shadow-sm shadow-f1-red/40">
                                <Flag className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-lg font-black tracking-tight text-white">
                                F1<span className="text-f1-red">HUB</span>
                            </span>
                        </Link>
                        <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
                            Your comprehensive motorsport portal for Formula 1
                            racing intelligence, season schedules, championship
                            standings, driver profiles, and technical
                            regulations.
                        </p>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                            <span className="w-2 h-2 rounded-full bg-f1-red" />
                            <span>
                                2026 FIA Formula 1 World Championship Season
                            </span>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Championship
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link
                                    href="/schedule"
                                    className="hover:text-white transition-colors"
                                >
                                    Race Calendar 2026
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/standings"
                                    className="hover:text-white transition-colors"
                                >
                                    Championship Standings
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/drivers"
                                    className="hover:text-white transition-colors"
                                >
                                    Driver Roster
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/teams"
                                    className="hover:text-white transition-colors"
                                >
                                    Constructor Teams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Regulations & Sources */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Resources
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link
                                    href="/regulations"
                                    className="hover:text-white transition-colors"
                                >
                                    2026 Technical Regulations
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://api.jolpi.ca/ergast/f1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    <span>Jolpica Ergast API</span>
                                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Legal Disclaimer & Copyright */}
                <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
                    <p className="text-center sm:text-left leading-relaxed max-w-2xl">
                        Disclaimer: This website is unofficial and is not
                        associated in any way with the Formula 1 companies. F1,
                        FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD
                        CHAMPIONSHIP, GRAND PRIX and related marks are
                        trademarks of Formula One Licensing B.V. All racing data
                        is provided for educational non-commercial purposes
                        courtesy of the Jolpica Ergast open-source project.
                    </p>

                    <div className="flex items-center gap-4 shrink-0 font-mono">
                        <span>F1 Hub © {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
