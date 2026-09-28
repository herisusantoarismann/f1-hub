import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export interface DashboardLayoutProps {
    children: React.ReactNode;
    headerTitle?: string;
    headerSubtitle?: string;
    sidebar?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    headerTitle,
    headerSubtitle,
    sidebar,
}) => {
    return (
        <div className="min-h-screen flex flex-col bg-f1-black text-f1-lightgray">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {(headerTitle || headerSubtitle) && (
                    <header className="mb-8 border-b border-f1-charcoal pb-6">
                        {headerTitle && (
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                                {headerTitle}
                            </h1>
                        )}
                        {headerSubtitle && (
                            <p className="text-sm text-f1-gray mt-2 max-w-2xl">
                                {headerSubtitle}
                            </p>
                        )}
                    </header>
                )}

                <div
                    className={
                        sidebar
                            ? "grid grid-cols-1 lg:grid-cols-4 gap-8"
                            : "w-full"
                    }
                >
                    {sidebar && (
                        <aside className="lg:col-span-1">{sidebar}</aside>
                    )}
                    <main className={sidebar ? "lg:col-span-3" : "w-full"}>
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};
