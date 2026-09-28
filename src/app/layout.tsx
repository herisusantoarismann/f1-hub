import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://f1-hub.local";

export const viewport: Viewport = {
    themeColor: "#e10600",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "F1 Hub | Modern Formula 1 Education & Telemetry",
        template: "%s | F1 Hub",
    },
    description:
        "Comprehensive Formula 1 telemetry platform. Real-time pit stop strategy simulator, Pirelli tyre degradation curves, live race pit wall rejoin predictor, championship mathematics, and interactive circuit breakdowns.",
    keywords: [
        "Formula 1",
        "F1",
        "Pit Stop Strategy",
        "Pirelli Tyres",
        "Tyre Degradation",
        "Live Race Telemetry",
        "Pit Wall Strategy",
        "OpenF1",
        "Driver Comparison",
        "Championship Calculator",
        "2026 Regulations",
        "F1 Standings",
        "F1 Schedule",
    ],
    authors: [{ name: "F1 Hub Engineering Team" }],
    creator: "F1 Hub",
    publisher: "F1 Hub",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: "F1 Hub",
        title: "F1 Hub | Modern Formula 1 Education & Telemetry",
        description:
            "Simulate pit stops, model tyre degradation curves, predict pit exit gaps, and explore 2026 F1 regulations with real-time telemetry.",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "F1 Hub - Formula 1 Education & Telemetry Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "F1 Hub | Modern Formula 1 Education & Telemetry",
        description:
            "Simulate pit stops, model tyre degradation curves, predict pit exit gaps, and explore 2026 F1 regulations with real-time telemetry.",
        creator: "@f1hub",
        images: ["/opengraph-image"],
    },
    icons: {
        icon: [{ url: "/icon", sizes: "32x32", type: "image/png" }],
        apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head />
            <body className="bg-f1-black text-f1-lightgray min-h-screen flex flex-col antialiased selection:bg-f1-red selection:text-white overflow-x-hidden">
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
