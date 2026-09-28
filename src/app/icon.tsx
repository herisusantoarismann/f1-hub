import { ImageResponse } from "next/og";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                fontSize: 18,
                background: "#0d0d12",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                border: "1.5px solid #e10600",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Racing angled red accent bar */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: "100%",
                    background: "#e10600",
                    transform: "skewX(-20deg)",
                }}
            />
            <div
                style={{
                    fontWeight: 900,
                    fontFamily: "sans-serif",
                    color: "#ffffff",
                    letterSpacing: "-0.05em",
                    display: "flex",
                    alignItems: "baseline",
                    paddingRight: 3,
                }}
            >
                <span style={{ color: "#e10600" }}>F</span>
                <span>1</span>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
