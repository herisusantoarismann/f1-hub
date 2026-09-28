import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
    SceneTreeInspector,
    SceneNodeItem,
} from "@/components/molecules/SceneTreeInspector";

const mockSceneTree: SceneNodeItem = {
    id: "root-1",
    name: "Formula 1 Car",
    type: "Group",
    visible: true,
    children: [
        {
            id: "node-body",
            name: "Monocoque Body",
            type: "Mesh",
            visible: true,
            triangleCount: 1250,
            vertexCount: 2500,
            materialName: "Red Paint",
            children: [],
        },
        {
            id: "node-cockpit",
            name: "Cockpit Assembly",
            type: "Group",
            visible: true,
            children: [
                {
                    id: "node-steering",
                    name: "Steering Wheel",
                    type: "Mesh",
                    visible: true,
                    triangleCount: 420,
                    vertexCount: 840,
                    materialName: "Carbon Alcantara",
                    children: [],
                },
                {
                    id: "node-helmet",
                    name: "Driver Helmet",
                    type: "Mesh",
                    visible: true,
                    triangleCount: 800,
                    vertexCount: 1600,
                    materialName: "Gold Visor",
                    children: [],
                },
            ],
        },
        {
            id: "node-wing",
            name: "Front Wing Assembly",
            type: "Group",
            visible: true,
            children: [
                {
                    id: "node-wing-plane",
                    name: "Front Wing Main Plane",
                    type: "Mesh",
                    visible: true,
                    triangleCount: 650,
                    children: [],
                },
            ],
        },
    ],
};

describe("SceneTreeInspector Component (Molecule)", () => {
    it("renders tree nodes and statistics when open", () => {
        render(
            <SceneTreeInspector
                sceneTree={mockSceneTree}
                selectedNodeId={null}
                onSelectNode={vi.fn()}
                isOpen={true}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByTestId("scene-tree-inspector")).toBeInTheDocument();
        expect(screen.getByText("Model Scene Tree")).toBeInTheDocument();
        expect(screen.getByText("Formula 1 Car")).toBeInTheDocument();
        expect(screen.getByText("Monocoque Body")).toBeInTheDocument();
        expect(
            screen.getByTestId("scene-node-node-steering"),
        ).toBeInTheDocument();
        expect(screen.getByText("Driver Helmet")).toBeInTheDocument();
    });

    it("triggers onSelectNode when a node is clicked", () => {
        const onSelect = vi.fn();
        render(
            <SceneTreeInspector
                sceneTree={mockSceneTree}
                selectedNodeId={null}
                onSelectNode={onSelect}
                isOpen={true}
                onClose={vi.fn()}
            />,
        );

        const steeringNode = screen.getByTestId("scene-node-node-steering");
        fireEvent.click(steeringNode);

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Steering Wheel",
                id: "node-steering",
            }),
        );
    });

    it("displays details of selected node", () => {
        render(
            <SceneTreeInspector
                sceneTree={mockSceneTree}
                selectedNodeId="node-steering"
                onSelectNode={vi.fn()}
                isOpen={true}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText(/Highlighted Node/i)).toBeInTheDocument();
        expect(screen.getByText(/Carbon Alcantara/i)).toBeInTheDocument();
        expect(screen.getByText(/420 Polygons/i)).toBeInTheDocument();
    });

    it("filters nodes when typing into search input", () => {
        render(
            <SceneTreeInspector
                sceneTree={mockSceneTree}
                selectedNodeId={null}
                onSelectNode={vi.fn()}
                isOpen={true}
                onClose={vi.fn()}
            />,
        );

        const searchInput = screen.getByPlaceholderText(/Cari part:/i);
        fireEvent.change(searchInput, { target: { value: "helmet" } });

        expect(screen.getByText("Driver Helmet")).toBeInTheDocument();
        expect(screen.queryByText("Monocoque Body")).not.toBeInTheDocument();
    });

    it("calls onToggleVisibility when eye icon is clicked", () => {
        const onToggleVis = vi.fn();
        render(
            <SceneTreeInspector
                sceneTree={mockSceneTree}
                selectedNodeId={null}
                onSelectNode={vi.fn()}
                onToggleVisibility={onToggleVis}
                isOpen={true}
                onClose={vi.fn()}
            />,
        );

        const hideButtons = screen.getAllByTitle("Hide Node");
        fireEvent.click(hideButtons[0]);

        expect(onToggleVis).toHaveBeenCalledTimes(1);
    });
});
