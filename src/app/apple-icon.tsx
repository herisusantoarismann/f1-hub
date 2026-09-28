import { ImageResponse } from "next/og";

export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        <div
            style={{
                background: "linear-gradient(135deg, #15151e 0%, #0d0d12 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 36,
                border: "4px solid #e10600",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Red racing stripe banner */}
            <div
                style={{
                    position: "absolute",
                    top: -30,
                    right: -20,
                    width: 50,
                    height: 240,
                    background: "#e10600",
                    transform: "rotate(25deg)",
                    opacity: 0.85,
                }}
            />
            <div
                style={{
                    fontSize: 82,
                    fontWeight: 900,
                    fontFamily: "sans-serif",
                    color: "#ffffff",
                    letterSpacing: "-0.06em",
                    display: "flex",
                    alignItems: "baseline",
                    zIndex: 1,
                }}
            >
                <span style={{ color: "#e10600" }}>F</span>
                <span>1</span>
            </div>
            <div
                style={{
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: "#9ca3af",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    zIndex: 1,
                    marginTop: -8,
                }}
            >
                HUB
            </div>
        </div>,
        {
            ...size,
        },
    );
}
