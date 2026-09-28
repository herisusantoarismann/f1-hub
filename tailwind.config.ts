import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                f1: {
                    red: "#E10600",
                    darkred: "#B00400",
                    black: "#15151E",
                    carbon: "#1E1E28",
                    charcoal: "#2A2A38",
                    gray: "#949498",
                    lightgray: "#E0E0E4",
                },
            },
            fontFamily: {
                f1: ["Titillium Web", "sans-serif"],
            },
            boxShadow: {
                "f1-glow": "0 0 20px -5px rgba(225, 6, 0, 0.4)",
            },
        },
    },
    plugins: [],
};

export default config;
