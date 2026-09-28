"use client";

import React, { useState, useMemo } from "react";
import {
    ChevronRight,
    ChevronDown,
    Eye,
    EyeOff,
    Search,
    Layers,
    Box,
    X,
    Sparkles,
    Sliders,
    Info,
    Check,
} from "lucide-react";
import type * as THREE from "three";

export interface SceneNodeItem {
    id: string; // uuid
    name: string;
    type: "Mesh" | "Group" | "Object3D" | "Scene";
    children: SceneNodeItem[];
    visible: boolean;
    vertexCount?: number;
    triangleCount?: number;
    materialName?: string;
    objectRef?: THREE.Object3D;
}

interface SceneTreeInspectorProps {
    sceneTree: SceneNodeItem | null;
    selectedNodeId: string | null;
    onSelectNode: (node: SceneNodeItem | null) => void;
    onToggleVisibility?: (nodeId: string, visible: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
    isIsolatedMode?: boolean;
    onToggleIsolatedMode?: (val: boolean) => void;
    isWhiteTheme?: boolean;
    className?: string;
}

/**
 * Recursive Tree Node Row Component
 */
const TreeNodeRow: React.FC<{
    node: SceneNodeItem;
    depth: number;
    selectedNodeId: string | null;
    onSelectNode: (node: SceneNodeItem | null) => void;
    onToggleVisibility?: (nodeId: string, visible: boolean) => void;
    searchQuery: string;
    isWhite: boolean;
}> = ({
    node,
    depth,
    selectedNodeId,
    onSelectNode,
    onToggleVisibility,
    searchQuery,
    isWhite,
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    // If search query is active, auto-expand
    const matchesSearch = useMemo(() => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const selfMatch =
            node.name.toLowerCase().includes(q) ||
            node.type.toLowerCase().includes(q);
        if (selfMatch) return true;
        const checkChildren = (item: SceneNodeItem): boolean => {
            return (
                item.name.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q) ||
                item.children.some(checkChildren)
            );
        };
        return checkChildren(node);
    }, [searchQuery, node]);

    if (!matchesSearch) return null;

    const isMesh = node.type === "Mesh";

    return (
        <div className="select-none text-xs font-mono">
            <div
                className={`group flex items-center justify-between py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                        ? "bg-f1-red text-white font-bold shadow-md shadow-f1-red/30"
                        : isWhite
                          ? "hover:bg-neutral-200/70 text-neutral-800"
                          : "hover:bg-neutral-800/60 text-neutral-300"
                }`}
                style={{ paddingLeft: `${Math.max(8, depth * 14 + 6)}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(isSelected ? null : node);
                }}
                data-testid={`scene-node-${node.id}`}
            >
                <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                    {/* Expand/Collapse Chevron */}
                    {hasChildren ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="p-0.5 rounded hover:bg-neutral-700/40 text-neutral-400 hover:text-white"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ChevronRight className="w-3 h-3" />
                            )}
                        </button>
                    ) : (
                        <span className="w-3" />
                    )}

                    {/* Icon according to type */}
                    {isMesh ? (
                        <Box
                            className={`w-3.5 h-3.5 shrink-0 ${
                                isSelected
                                    ? "text-white"
                                    : "text-amber-400 group-hover:text-amber-300"
                            }`}
                        />
                    ) : (
                        <Layers
                            className={`w-3.5 h-3.5 shrink-0 ${
                                isSelected
                                    ? "text-white"
                                    : "text-cyan-400 group-hover:text-cyan-300"
                            }`}
                        />
                    )}

                    {/* Node Name */}
                    <span className="truncate" title={node.name}>
                        {node.name}
                    </span>

                    {/* Poly count indicator */}
                    {node.triangleCount !== undefined &&
                        node.triangleCount > 0 && (
                            <span
                                className={`text-[10px] shrink-0 opacity-70 ${
                                    isSelected
                                        ? "text-white"
                                        : "text-neutral-500"
                                }`}
                            >
                                ({node.triangleCount.toLocaleString()} &Delta;)
                            </span>
                        )}
                </div>

                {/* Right Action Icons: Visibility Toggle */}
                <div className="flex items-center gap-1 shrink-0">
                    {onToggleVisibility && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(node.id, !node.visible);
                            }}
                            className={`p-1 rounded transition-colors ${
                                node.visible
                                    ? "text-neutral-400 hover:text-white"
                                    : "text-neutral-600 hover:text-neutral-400"
                            }`}
                            title={node.visible ? "Hide Node" : "Show Node"}
                        >
                            {node.visible ? (
                                <Eye className="w-3.5 h-3.5" />
                            ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Children List */}
            {hasChildren && isExpanded && (
                <div className="flex flex-col">
                    {node.children.map((child, idx) => (
                        <TreeNodeRow
                            key={`${child.id || "node"}-${depth + 1}-${idx}`}
                            node={child}
                            depth={depth + 1}
                            selectedNodeId={selectedNodeId}
                            onSelectNode={onSelectNode}
                            onToggleVisibility={onToggleVisibility}
                            searchQuery={searchQuery}
                            isWhite={isWhite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const SceneTreeInspector: React.FC<SceneTreeInspectorProps> = ({
    sceneTree,
    selectedNodeId,
    onSelectNode,
    onToggleVisibility,
    isOpen,
    onClose,
    isIsolatedMode = false,
    onToggleIsolatedMode,
    isWhiteTheme = false,
    className = "",
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate scene statistics
    const stats = useMemo(() => {
        let totalNodes = 0;
        let totalMeshes = 0;
        let totalTriangles = 0;

        const countRecursively = (item: SceneNodeItem) => {
            totalNodes++;
            if (item.type === "Mesh") {
                totalMeshes++;
                totalTriangles += item.triangleCount || 0;
            }
            item.children.forEach(countRecursively);
        };

        if (sceneTree) {
            countRecursively(sceneTree);
        }

        return { totalNodes, totalMeshes, totalTriangles };
    }, [sceneTree]);

    // Find currently selected node item for detail card
    const selectedNode = useMemo<SceneNodeItem | null>(() => {
        if (!selectedNodeId || !sceneTree) return null;
        let found: SceneNodeItem | null = null;
        const findRecursively = (item: SceneNodeItem) => {
            if (item.id === selectedNodeId) {
                found = item;
                return;
            }
            item.children.forEach(findRecursively);
        };
        findRecursively(sceneTree);
        return found;
    }, [selectedNodeId, sceneTree]);

    // Quick filter preset buttons
    const quickPresets = [
        "Cockpit",
        "Steering Wheel",
        "Front Wing",
        "Rear Wing",
        "Halo",
        "Wheel",
    ];

    if (!isOpen) return null;

    return (
        <aside
            data-testid="scene-tree-inspector"
            className={`fixed top-4 right-4 bottom-4 z-40 w-80 sm:w-96 rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in slide-in-from-right duration-300 ${
                isWhiteTheme
                    ? "bg-white/95 border-neutral-300 text-neutral-800 shadow-neutral-300/50"
                    : "bg-neutral-950/95 border-neutral-800 text-white shadow-black/80"
            } ${className}`}
            role="dialog"
            aria-label="3D Model Scene Graph Inspector"
        >
            {/* Header */}
            <div
                className={`p-4 border-b flex items-center justify-between ${
                    isWhiteTheme
                        ? "border-neutral-200"
                        : "border-neutral-800/80"
                }`}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-f1-red/10 border border-f1-red/30 text-f1-red">
                        <Layers className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-wider">
                            Model Scene Tree
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            {stats.totalNodes} Nodes &bull; {stats.totalMeshes}{" "}
                            Meshes &bull;{" "}
                            {stats.totalTriangles.toLocaleString()} Polys
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    data-testid="close-scene-inspector"
                    className="p-1.5 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close Inspector"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Search & Quick Filter Chips */}
            <div
                className={`p-3 space-y-2.5 border-b text-xs ${
                    isWhiteTheme
                        ? "border-neutral-200 bg-neutral-50/50"
                        : "border-neutral-800/60 bg-neutral-900/30"
                }`}
            >
                {/* Search Input */}
                <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari part: steering, cockpit, wing..."
                        className={`w-full pl-8 pr-7 py-1.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                            isWhiteTheme
                                ? "bg-white border-neutral-300 text-neutral-900 focus:border-f1-red"
                                : "bg-neutral-900 border-neutral-800 text-white focus:border-f1-red"
                        }`}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Quick Selection Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Quick:
                    </span>
                    {quickPresets.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => {
                                setSearchQuery(preset);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors border ${
                                searchQuery === preset
                                    ? "bg-f1-red text-white border-f1-red"
                                    : isWhiteTheme
                                      ? "bg-neutral-200/60 hover:bg-neutral-300 text-neutral-700 border-neutral-300"
                                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                            }`}
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                {/* Isolation / Ghost Mode Toggle */}
                {onToggleIsolatedMode && (
                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                        <span className="text-neutral-400 flex items-center gap-1.5">
                            <Sliders className="w-3 h-3 text-cyan-400" />
                            <span>Isolate Mode (Dim Others)</span>
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                onToggleIsolatedMode(!isIsolatedMode)
                            }
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                                isIsolatedMode
                                    ? "bg-cyan-500"
                                    : "bg-neutral-800"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                    isIsolatedMode
                                        ? "translate-x-4"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* Tree Nodes Scroll Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono">
                {sceneTree ? (
                    <TreeNodeRow
                        node={sceneTree}
                        depth={0}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={onSelectNode}
                        onToggleVisibility={onToggleVisibility}
                        searchQuery={searchQuery}
                        isWhite={isWhiteTheme}
                    />
                ) : (
                    <div className="p-8 text-center text-xs text-neutral-500">
                        Memuat struktur geometri 3D...
                    </div>
                )}
            </div>

            {/* Selected Node Details Card Footer */}
            {selectedNode && (
                <div
                    className={`p-3.5 border-t text-xs font-mono space-y-2 ${
                        isWhiteTheme
                            ? "border-neutral-200 bg-neutral-100"
                            : "border-neutral-800 bg-neutral-900/90"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-f1-red font-bold uppercase tracking-wider flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Highlighted Node
                        </span>
                        <button
                            type="button"
                            onClick={() => onSelectNode(null)}
                            className="text-[10px] text-neutral-400 hover:text-white hover:underline"
                        >
                            Clear Selection
                        </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                        <div
                            className="font-bold text-white text-xs truncate"
                            title={selectedNode.name}
                        >
                            {selectedNode.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                            <span>Type: {selectedNode.type}</span>
                            {selectedNode.triangleCount !== undefined && (
                                <span className="text-amber-400 font-semibold">
                                    {selectedNode.triangleCount.toLocaleString()}{" "}
                                    Polygons
                                </span>
                            )}
                        </div>
                        {selectedNode.materialName && (
                            <div
                                className="text-[10px] text-neutral-500 truncate"
                                title={selectedNode.materialName}
                            >
                                Mat: {selectedNode.materialName}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};
