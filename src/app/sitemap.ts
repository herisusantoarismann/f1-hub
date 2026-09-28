import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://f1-hub.local";
    const currentDate = new Date().toISOString();

    const staticRoutes = [
        "",
        "/schedule",
        "/drivers",
        "/teams",
        "/standings",
        "/calculator",
        "/comparison",
        "/strategy",
        "/strategy/live",
        "/glossary",
    ];

    return staticRoutes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: route.includes("live")
            ? "always"
            : route.includes("schedule") || route.includes("standings")
              ? "daily"
              : "weekly",
        priority: route === "" ? 1.0 : route.includes("strategy") ? 0.9 : 0.8,
    }));
}
