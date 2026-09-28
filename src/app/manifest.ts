import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "F1 Hub | Formula 1 Telemetry & Strategy",
        short_name: "F1 Hub",
        description:
            "Modern Formula 1 education, telemetry analysis, pit stop simulator, and real-time live race strategy pit wall.",
        start_url: "/",
        display: "standalone",
        background_color: "#0d0d12",
        theme_color: "#e10600",
        icons: [
            {
                src: "/icon",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-icon",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
