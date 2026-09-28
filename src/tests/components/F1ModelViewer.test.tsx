import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { F1ModelViewer } from "@/components/organisms/F1ModelViewer";

// Mock @react-three/fiber Canvas to prevent WebGL context error in jsdom
vi.mock("@react-three/fiber", () => ({
    Canvas: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-three-canvas">{children}</div>
    ),
    useFrame: vi.fn(),
    useThree: () => ({ camera: { position: [0, 0, 5] }, gl: {} }),
}));

// Mock @react-three/drei controls and helpers
vi.mock("@react-three/drei", () => ({
    OrbitControls: () => <div data-testid="mock-orbit-controls" />,
    Center: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Environment: () => null,
    Html: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    useProgress: () => ({ progress: 100 }),
    ContactShadows: () => null,
    useGLTF: vi.fn().mockReturnValue({
        scene: {
            traverse: vi.fn(),
            clone: vi.fn().mockReturnValue({ traverse: vi.fn() }),
        },
    }),
}));

describe("F1ModelViewer Component (3D Organism)", () => {
    it("renders the canvas wrapper container", () => {
        render(<F1ModelViewer />);
        const viewer = screen.getByTestId("f1-3d-model-viewer");
        expect(viewer).toBeInTheDocument();
    });

    it("renders the mocked three canvas and orbit controls", () => {
        render(<F1ModelViewer autoRotate={true} />);
        expect(screen.getByTestId("mock-three-canvas")).toBeInTheDocument();
        expect(screen.getByTestId("mock-orbit-controls")).toBeInTheDocument();
    });

    it("renders the toggle scene inspector button and toggles the drawer", () => {
        render(<F1ModelViewer useFallbackModel={true} />);
        const toggleBtn = screen.getByTestId("toggle-scene-inspector");
        expect(toggleBtn).toBeInTheDocument();
        expect(
            screen.queryByTestId("scene-tree-inspector"),
        ).not.toBeInTheDocument();

        fireEvent.click(toggleBtn);
        expect(screen.getByTestId("scene-tree-inspector")).toBeInTheDocument();
    });
});
