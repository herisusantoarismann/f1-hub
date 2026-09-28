import { ImageResponse } from "next/og";

export const alt = "F1 Hub - Formula 1 Education, Strategy & Telemetry";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                background:
                    "linear-gradient(135deg, #0d0d12 0%, #15151e 50%, #1a0808 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 80,
                position: "relative",
                overflow: "hidden",
                border: "8px solid #262626",
            }}
        >
            {/* Decorative background grid and racing diagonal */}
            <div
                style={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 500,
                    height: 900,
                    background:
                        "linear-gradient(180deg, rgba(225, 6, 0, 0.25) 0%, rgba(225, 6, 0, 0.05) 100%)",
                    transform: "rotate(30deg)",
                }}
            />

            {/* Header branding */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                    style={{
                        background: "#e10600",
                        color: "#ffffff",
                        fontWeight: 900,
                        fontSize: 32,
                        padding: "8px 18px",
                        borderRadius: 12,
                        letterSpacing: "-0.05em",
                    }}
                >
                    F1
                </div>
                <div
                    style={{
                        color: "#ffffff",
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                    }}
                >
                    HUB
                </div>
                <div
                    style={{
                        marginLeft: 16,
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        color: "#9ca3af",
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "monospace",
                    }}
                >
                    2026 REGULATION READY
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                    style={{
                        fontSize: 58,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.1,
                        letterSpacing: "-0.03em",
                        maxWidth: 950,
                    }}
                >
                    Formula 1 Telemetry, Pit Wall Strategy & Technical Insights
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: "#a3a3a3",
                        maxWidth: 850,
                        lineHeight: 1.4,
                    }}
                >
                    Simulasi degradasi ban Pirelli, kalkulator poin kejuaraan,
                    head-to-head pembalap, dan pit stop rejoin predictor
                    real-time.
                </div>
            </div>

            {/* Footer Badges */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: 24,
                }}
            >
                <div
                    style={{
                        color: "#ef4444",
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "monospace",
                    }}
                >
                    &bull; Live Pit Wall
                </div>
                <div
                    style={{
                        color: "#f59e0b",
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "monospace",
                    }}
                >
                    &bull; Pirelli Tyre Simulator
                </div>
                <div
                    style={{
                        color: "#38bdf8",
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "monospace",
                    }}
                >
                    &bull; 3D Model Inspector
                </div>
                <div
                    style={{
                        color: "#22c55e",
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "monospace",
                    }}
                >
                    &bull; 2026 Active Aero & Engine
                </div>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
