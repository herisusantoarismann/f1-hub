"use client";

import React, {
    Suspense,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Center, useProgress, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Gauge, Layers } from "lucide-react";
import {
    SceneTreeInspector,
    SceneNodeItem,
} from "@/components/molecules/SceneTreeInspector";

// Safe early intercept for cosmetic Three.js deprecation & ANGLE shader rounding logs
if (typeof window !== "undefined") {
    const originalConsoleWarn = console.warn;
    console.warn = (...args: any[]) => {
        const text = typeof args[0] === "string" ? args[0] : "";
        if (
            text.includes("THREE.Clock") ||
            text.includes("Clock: This module has been deprecated") ||
            text.includes("THREE.WebGLProgram") ||
            text.includes("warning X4122") ||
            text.includes("WebGLShadowMap")
        ) {
            return;
        }
        originalConsoleWarn.apply(console, args);
    };
}

export interface F1ModelViewerProps {
    modelUrl?: string;
    autoRotate?: boolean;
    wireframe?: boolean;
    backgroundTheme?: "black" | "white";
    backgroundColor?: string;
    cameraPosition?: [number, number, number];
    controlsRef?: React.MutableRefObject<OrbitControlsImpl | null>;
    onModelLoaded?: () => void;
    useFallbackModel?: boolean;
    showSceneInspector?: boolean;
    onToggleInspector?: () => void;
    selectedNodeId?: string | null;
    onSelectNode?: (node: SceneNodeItem | null) => void;
    className?: string;
}

/**
 * Extracts a complete SceneNodeItem hierarchy from any Three.js Object3D root
 */
export function extractSceneTree(root: THREE.Object3D): SceneNodeItem {
    const isMesh = Boolean((root as THREE.Mesh).isMesh);
    const mesh = isMesh ? (root as THREE.Mesh) : null;

    let vertexCount = 0;
    let triangleCount = 0;
    if (mesh && mesh.geometry) {
        vertexCount = mesh.geometry.attributes.position?.count ?? 0;
        triangleCount = mesh.geometry.index
            ? mesh.geometry.index.count / 3
            : vertexCount / 3;
    }

    let materialName: string | undefined;
    if (mesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
            materialName = mesh.material
                .map((m) => m.name || "Material")
                .join(", ");
        } else {
            materialName = mesh.material.name || "Material";
        }
    }

    const children: SceneNodeItem[] = [];
    if (root.children && root.children.length > 0) {
        for (const child of root.children) {
            if (
                child.type === "Camera" ||
                child.type === "Light" ||
                child.name?.startsWith("__")
            ) {
                continue;
            }
            children.push(extractSceneTree(child));
        }
    }

    return {
        id: root.uuid,
        name: root.name || (isMesh ? `Mesh_${root.id}` : `Group_${root.id}`),
        type: isMesh ? "Mesh" : root.type === "Group" ? "Group" : "Object3D",
        children,
        visible: root.visible,
        vertexCount: isMesh ? vertexCount : undefined,
        triangleCount: isMesh ? Math.round(triangleCount) : undefined,
        materialName,
        objectRef: root,
    };
}

/**
 * High-tech procedural Formula 1 car with explicit sub-assembly naming and steering wheel
 */
export function ProceduralF1Car({
    wireframe = false,
    onSceneReady,
}: {
    wireframe?: boolean;
    onSceneReady?: (group: THREE.Group) => void;
}) {
    const groupRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (groupRef.current && onSceneReady) {
            onSceneReady(groupRef.current);
        }
    }, [onSceneReady]);

    const redMat = useMemo(
        () => ({ color: "#E10600", roughness: 0.2, metalness: 0.8, wireframe }),
        [wireframe],
    );
    const carbonMat = useMemo(
        () => ({ color: "#1E1E28", roughness: 0.4, metalness: 0.6, wireframe }),
        [wireframe],
    );
    const blackMat = useMemo(
        () => ({ color: "#111111", roughness: 0.8, metalness: 0.1, wireframe }),
        [wireframe],
    );
    const haloMat = useMemo(
        () => ({ color: "#333333", roughness: 0.3, metalness: 0.9, wireframe }),
        [wireframe],
    );

    return (
        <group ref={groupRef} name="Formula 1 Car">
            {/* Monocoque Main Body */}
            <mesh name="Monocoque Body" position={[0, 0.35, 0]}>
                <boxGeometry args={[0.9, 0.45, 3.8]} />
                <meshStandardMaterial {...redMat} />
            </mesh>

            {/* Nosecone tapering forward */}
            <mesh
                name="Nosecone"
                position={[0, 0.25, 2.3]}
                rotation={[0.05, 0, 0]}
            >
                <coneGeometry args={[0.4, 1.4, 4]} />
                <meshStandardMaterial {...redMat} />
            </mesh>

            {/* Front Wing Assembly */}
            <group name="Front Wing Assembly" position={[0, 0.15, 2.8]}>
                <mesh name="Front Wing Main Plane">
                    <boxGeometry args={[2.2, 0.05, 0.5]} />
                    <meshStandardMaterial {...carbonMat} />
                </mesh>
                <mesh name="Front Wing Endplate Left" position={[-1.1, 0.1, 0]}>
                    <boxGeometry args={[0.05, 0.25, 0.55]} />
                    <meshStandardMaterial {...redMat} />
                </mesh>
                <mesh name="Front Wing Endplate Right" position={[1.1, 0.1, 0]}>
                    <boxGeometry args={[0.05, 0.25, 0.55]} />
                    <meshStandardMaterial {...redMat} />
                </mesh>
            </group>

            {/* Rear Wing Assembly */}
            <group name="Rear Wing Assembly" position={[0, 0.85, -1.9]}>
                <mesh name="Rear Wing Main Plane">
                    <boxGeometry args={[1.6, 0.05, 0.45]} />
                    <meshStandardMaterial {...carbonMat} />
                </mesh>
                <mesh name="Rear Wing DRS Flap" position={[0, 0.12, -0.05]}>
                    <boxGeometry args={[1.5, 0.04, 0.3]} />
                    <meshStandardMaterial {...redMat} />
                </mesh>
                <mesh name="Rear Wing Endplate Left" position={[-0.8, -0.2, 0]}>
                    <boxGeometry args={[0.05, 0.6, 0.5]} />
                    <meshStandardMaterial {...carbonMat} />
                </mesh>
                <mesh name="Rear Wing Endplate Right" position={[0.8, -0.2, 0]}>
                    <boxGeometry args={[0.05, 0.6, 0.5]} />
                    <meshStandardMaterial {...carbonMat} />
                </mesh>
            </group>

            {/* Sidepods */}
            <group name="Sidepods Assembly">
                <mesh name="Sidepod Left" position={[-0.7, 0.3, -0.1]}>
                    <boxGeometry args={[0.5, 0.35, 1.8]} />
                    <meshStandardMaterial {...redMat} />
                </mesh>
                <mesh name="Sidepod Right" position={[0.7, 0.3, -0.1]}>
                    <boxGeometry args={[0.5, 0.35, 1.8]} />
                    <meshStandardMaterial {...redMat} />
                </mesh>
            </group>

            {/* Engine Cover & Shark Fin */}
            <mesh name="Engine Cover & Shark Fin" position={[0, 0.65, -0.8]}>
                <boxGeometry args={[0.05, 0.35, 1.4]} />
                <meshStandardMaterial {...redMat} />
            </mesh>

            {/* Halo Structure */}
            <group name="Halo Protection Structure" position={[0, 0.65, 0.3]}>
                <mesh name="Halo Front Pillar" position={[0, 0, 0.4]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.4]} />
                    <meshStandardMaterial {...haloMat} />
                </mesh>
                <mesh name="Halo Main Hoop" position={[0, 0.15, 0.1]}>
                    <boxGeometry args={[0.6, 0.05, 0.5]} />
                    <meshStandardMaterial {...haloMat} />
                </mesh>
            </group>

            {/* Cockpit & Driver */}
            <group name="Cockpit Assembly" position={[0, 0.62, 0.2]}>
                <mesh name="Cockpit Opening">
                    <boxGeometry args={[0.5, 0.2, 0.8]} />
                    <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
                </mesh>
                <mesh name="Driver Helmet" position={[0, 0.05, -0.05]}>
                    <sphereGeometry args={[0.16, 16, 16]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        roughness={0.1}
                        metalness={0.9}
                    />
                </mesh>
            </group>

            {/* Steering Wheel Assembly with LCD display */}
            <group
                name="Steering Wheel"
                position={[0, 0.58, 0.42]}
                rotation={[-0.35, 0, 0]}
            >
                <mesh name="Steering Wheel Rim">
                    <boxGeometry args={[0.26, 0.15, 0.025]} />
                    <meshStandardMaterial
                        color="#1E1E28"
                        roughness={0.3}
                        metalness={0.8}
                        wireframe={wireframe}
                    />
                </mesh>
                <mesh name="Left Grip" position={[-0.13, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />
                    <meshStandardMaterial
                        color="#111111"
                        roughness={0.9}
                        wireframe={wireframe}
                    />
                </mesh>
                <mesh name="Right Grip" position={[0.13, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />
                    <meshStandardMaterial
                        color="#111111"
                        roughness={0.9}
                        wireframe={wireframe}
                    />
                </mesh>
                <mesh name="LCD Telemetry Display" position={[0, 0.02, 0.015]}>
                    <planeGeometry args={[0.1, 0.05]} />
                    <meshBasicMaterial color="#00F0FF" />
                </mesh>
            </group>

            {/* Four Wheels */}
            <group name="Wheels Assembly">
                {[
                    {
                        name: "Wheel Front Left",
                        pos: [-1.0, 0.33, 1.6],
                        r: 0.33,
                    },
                    {
                        name: "Wheel Front Right",
                        pos: [1.0, 0.33, 1.6],
                        r: 0.33,
                    },
                    {
                        name: "Wheel Rear Left",
                        pos: [-1.0, 0.38, -1.4],
                        r: 0.38,
                    },
                    {
                        name: "Wheel Rear Right",
                        pos: [1.0, 0.38, -1.4],
                        r: 0.38,
                    },
                ].map((wheel) => (
                    <group
                        key={wheel.name}
                        name={wheel.name}
                        position={wheel.pos as [number, number, number]}
                        rotation={[0, 0, Math.PI / 2]}
                    >
                        <mesh name={`${wheel.name} Tire`}>
                            <cylinderGeometry
                                args={[wheel.r * 1.05, wheel.r * 1.05, 0.4, 24]}
                            />
                            <meshStandardMaterial {...blackMat} />
                        </mesh>
                        <mesh
                            name={`${wheel.name} Rim`}
                            position={[0, wheel.pos[0] > 0 ? 0.21 : -0.21, 0]}
                        >
                            <cylinderGeometry
                                args={[
                                    wheel.r * 0.55,
                                    wheel.r * 0.55,
                                    0.02,
                                    16,
                                ]}
                            />
                            <meshStandardMaterial {...redMat} />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
}

/**
 * GLTF Model Loader that enhances car material finishes and reflections
 */
function SketchfabCarModel({
    url,
    wireframe = false,
    onLoaded,
    onSceneReady,
}: {
    url: string;
    wireframe?: boolean;
    onLoaded?: () => void;
    onSceneReady?: (scene: THREE.Object3D) => void;
}) {
    const gltf = useGLTF(url);

    // Clone scene so React hot-reloading maintains a clean scenegraph
    const clonedScene = useMemo(() => {
        if (!gltf?.scene) return null;
        return typeof gltf.scene.clone === "function"
            ? gltf.scene.clone(true)
            : gltf.scene;
    }, [gltf?.scene]);

    useEffect(() => {
        if (clonedScene) {
            clonedScene.traverse((child: any) => {
                if (child.isMesh && child.material) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];

                    materials.forEach((mat: any) => {
                        mat.wireframe = Boolean(wireframe);

                        // Enhance reflections and finish for clearcoat & metallic surfaces
                        if (
                            mat.isMeshStandardMaterial ||
                            mat.isMeshPhysicalMaterial
                        ) {
                            if (mat.roughness !== undefined) {
                                mat.roughness = Math.min(
                                    mat.roughness ?? 0.5,
                                    0.4,
                                );
                            }
                            if (mat.metalness !== undefined) {
                                mat.metalness = Math.max(
                                    mat.metalness ?? 0.2,
                                    0.35,
                                );
                            }
                            mat.needsUpdate = true;
                        }
                    });
                }
            });
            onSceneReady?.(clonedScene);
            onLoaded?.();
        }
    }, [clonedScene, wireframe, onLoaded, onSceneReady]);

    if (!clonedScene) return null;

    return <primitive object={clonedScene} />;
}

/**
 * Three.js Mesh Highlight & Isolation Controller
 */
function ModelHighlightManager({
    sceneRoot,
    selectedNodeId,
    isIsolatedMode,
}: {
    sceneRoot: THREE.Object3D | null;
    selectedNodeId: string | null;
    isIsolatedMode: boolean;
}) {
    useEffect(() => {
        if (!sceneRoot || typeof sceneRoot.traverse !== "function") return;

        // Find the selected object
        let selectedObj: THREE.Object3D | null = null;
        if (selectedNodeId) {
            sceneRoot.traverse((obj) => {
                if (obj.uuid === selectedNodeId) {
                    selectedObj = obj;
                }
            });
        }

        const isPartOfSelection = (mesh: THREE.Object3D): boolean => {
            if (!selectedObj) return false;
            let curr: THREE.Object3D | null = mesh;
            while (curr) {
                if (curr === selectedObj) return true;
                curr = curr.parent;
            }
            return false;
        };

        sceneRoot.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh || !mesh.material) return;

            // Preserve initial base material in userData
            if (!mesh.userData.__origMaterial) {
                mesh.userData.__origMaterial = mesh.material;
            }
            const origMat = mesh.userData.__origMaterial;

            const isSelected = isPartOfSelection(mesh);

            if (isSelected) {
                // Apply vibrant neon cyan highlight glow
                if (Array.isArray(origMat)) {
                    mesh.material = origMat.map((m) => {
                        const clone = m.clone();
                        if ("emissive" in clone) {
                            clone.emissive = new THREE.Color("#00F0FF");
                            clone.emissiveIntensity = 0.9;
                        }
                        clone.needsUpdate = true;
                        return clone;
                    });
                } else {
                    const clone = origMat.clone();
                    if ("emissive" in clone) {
                        clone.emissive = new THREE.Color("#00F0FF");
                        clone.emissiveIntensity = 0.9;
                    }
                    clone.needsUpdate = true;
                    mesh.material = clone;
                }
            } else if (isIsolatedMode && selectedObj) {
                // Dim non-selected parts in ghost isolation mode
                if (Array.isArray(origMat)) {
                    mesh.material = origMat.map((m) => {
                        const clone = m.clone();
                        clone.transparent = true;
                        clone.opacity = 0.15;
                        clone.needsUpdate = true;
                        return clone;
                    });
                } else {
                    const clone = origMat.clone();
                    clone.transparent = true;
                    clone.opacity = 0.15;
                    clone.needsUpdate = true;
                    mesh.material = clone;
                }
            } else {
                // Restore original material
                mesh.material = origMat;
            }
        });
    }, [sceneRoot, selectedNodeId, isIsolatedMode]);

    return null;
}

/**
 * Pure Showcase F1 3D Model Viewer with Scene Graph Inspector & Part Highlighting
 */
export const F1ModelViewer: React.FC<F1ModelViewerProps> = ({
    modelUrl = "/models/f1-car.glb",
    autoRotate = false,
    wireframe = false,
    backgroundTheme = "black",
    backgroundColor,
    cameraPosition = [3.8, 1.4, 4.2],
    controlsRef,
    onModelLoaded,
    useFallbackModel = false,
    showSceneInspector,
    onToggleInspector,
    selectedNodeId,
    onSelectNode,
    className = "w-full h-full",
}) => {
    const internalControlsRef = useRef<OrbitControlsImpl | null>(null);
    const activeControlsRef = controlsRef ?? internalControlsRef;

    // Track loading state via drei useProgress outside of Three.js canvas
    const { progress, active } = useProgress();
    const [modelReady, setModelReady] = useState(false);

    // Scene Graph & Highlighting state
    const [sceneTree, setSceneTree] = useState<SceneNodeItem | null>(null);
    const [internalInspectorOpen, setInternalInspectorOpen] = useState(false);
    const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
        null,
    );
    const [isIsolatedMode, setIsIsolatedMode] = useState(false);
    const [sceneRootObj, setSceneRootObj] = useState<THREE.Object3D | null>(
        null,
    );

    const isInspectorOpen =
        showSceneInspector !== undefined
            ? showSceneInspector
            : internalInspectorOpen;
    const activeSelectedNodeId =
        selectedNodeId !== undefined ? selectedNodeId : internalSelectedId;

    const handleSceneReady = useCallback((root: THREE.Object3D) => {
        if (!root) return;
        setSceneRootObj(root);
        try {
            const tree = extractSceneTree(root);
            setSceneTree(tree);
        } catch {
            // ignore in testing environments without full scene graph
        }
    }, []);

    const handleSelectNode = useCallback(
        (node: SceneNodeItem | null) => {
            if (onSelectNode) {
                onSelectNode(node);
            } else {
                setInternalSelectedId(node ? node.id : null);
            }
        },
        [onSelectNode],
    );

    const handleToggleVisibility = useCallback(
        (nodeId: string, visible: boolean) => {
            if (!sceneRootObj || typeof sceneRootObj.traverse !== "function")
                return;
            sceneRootObj.traverse((obj) => {
                if (obj.uuid === nodeId) {
                    obj.visible = visible;
                }
            });
            setSceneTree((prev) => {
                if (!prev) return null;
                const updateVisibility = (
                    item: SceneNodeItem,
                ): SceneNodeItem => {
                    if (item.id === nodeId) {
                        return { ...item, visible };
                    }
                    return {
                        ...item,
                        children: item.children.map(updateVisibility),
                    };
                };
                return updateVisibility(prev);
            });
        },
        [sceneRootObj],
    );

    const handleCloseInspector = useCallback(() => {
        if (onToggleInspector) {
            onToggleInspector();
        } else {
            setInternalInspectorOpen(false);
        }
    }, [onToggleInspector]);

    useEffect(() => {
        if (useFallbackModel) {
            setModelReady(true);
            onModelLoaded?.();
        } else if (progress >= 100 && !active) {
            const timer = setTimeout(() => {
                setModelReady(true);
                onModelLoaded?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [progress, active, useFallbackModel, onModelLoaded]);

    const isWhite = backgroundTheme === "white";
    const resolvedBgColor =
        backgroundColor ?? (isWhite ? "#ffffff" : "#050505");
    const showLoadingOverlay = !useFallbackModel && (!modelReady || active);

    return (
        <div
            className={`relative ${className} overflow-hidden transition-colors duration-500`}
            style={{ backgroundColor: resolvedBgColor }}
            data-testid="f1-3d-model-viewer"
        >
            {/* Top Left Overlay: Scene Tree / Inspector Toggle Button */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 font-mono">
                <button
                    type="button"
                    data-testid="toggle-scene-inspector"
                    onClick={() => {
                        if (onToggleInspector) {
                            onToggleInspector();
                        } else {
                            setInternalInspectorOpen((prev) => !prev);
                        }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg backdrop-blur-md border ${
                        isInspectorOpen
                            ? "bg-f1-red text-white border-f1-red shadow-f1-red/30"
                            : isWhite
                              ? "bg-white/85 hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-sm"
                              : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border-neutral-800"
                    }`}
                    title="Buka Scene Tree Inspector (Struktur Model 3D)"
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Scene Tree</span>
                    {activeSelectedNodeId && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                </button>
            </div>

            {/* Clean F1 DOM Loading Overlay */}
            <div
                className={`absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none select-none ${
                    showLoadingOverlay ? "opacity-100" : "opacity-0"
                } ${isWhite ? "bg-white/95" : "bg-[#050505]/95"}`}
            >
                <div
                    className={`flex flex-col items-center p-8 rounded-3xl shadow-2xl max-w-sm text-center border ${
                        isWhite
                            ? "bg-neutral-50 border-neutral-200"
                            : "bg-neutral-900/90 border-neutral-800"
                    }`}
                >
                    <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full border-4 border-f1-red/20 border-t-f1-red animate-spin" />
                        <Gauge className="w-7 h-7 text-f1-red absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <h2
                        className={`text-sm font-black uppercase tracking-wider ${
                            isWhite ? "text-neutral-900" : "text-white"
                        }`}
                    >
                        Loading Formula 1 Telemetry
                    </h2>
                    <p
                        className={`text-[11px] mt-1 ${
                            isWhite ? "text-neutral-500" : "text-neutral-400"
                        }`}
                    >
                        Downloading Aston Martin AMR23 (56.8 MB)
                    </p>

                    <div
                        className={`w-56 h-2 rounded-full mt-4 overflow-hidden p-0.5 border ${
                            isWhite
                                ? "bg-neutral-200 border-neutral-300"
                                : "bg-neutral-800 border-neutral-700/60"
                        }`}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-f1-darkred via-f1-red to-amber-500 rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.max(8, Math.round(progress))}%`,
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between w-56 mt-2 text-[11px] font-mono">
                        <span
                            className={
                                isWhite
                                    ? "text-neutral-500"
                                    : "text-neutral-400"
                            }
                        >
                            {progress < 100
                                ? "Streaming Geometry"
                                : "Ready to Render"}
                        </span>
                        <span className="text-f1-red font-bold">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 3D WebGL Canvas - Pure Model Showcase with Part Selection */}
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: 38,
                    near: 0.1,
                    far: 200,
                }}
                shadows={false}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 2]}
            >
                {/* Plain solid background color */}
                <color attach="background" args={[resolvedBgColor]} />

                {/* Studio Lighting */}
                <ambientLight intensity={isWhite ? 1.4 : 2.0} />
                <directionalLight
                    position={[7, 9, 7]}
                    intensity={isWhite ? 2.0 : 2.8}
                    color="#ffffff"
                />
                <directionalLight
                    position={[-7, 7, 7]}
                    intensity={isWhite ? 1.6 : 2.2}
                    color="#f0f9ff"
                />
                <directionalLight
                    position={[0, 8, -8]}
                    intensity={isWhite ? 1.8 : 2.6}
                    color="#ffffff"
                />
                <directionalLight
                    position={[0, 1.5, 6]}
                    intensity={isWhite ? 1.2 : 1.8}
                    color="#ffffff"
                />
                <directionalLight
                    position={[0, -3, 0]}
                    intensity={isWhite ? 0.4 : 0.8}
                    color="#ffffff"
                />

                {/* Smooth 360-degree OrbitControls */}
                <OrbitControls
                    ref={activeControlsRef}
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    autoRotate={autoRotate}
                    autoRotateSpeed={1.2}
                    minDistance={1.4}
                    maxDistance={25}
                />

                {/* 3D Car Model centered right at the origin */}
                <Suspense fallback={null}>
                    <Center
                        position={[0, 0, 0]}
                        onPointerDown={(e: any) => {
                            if (e.object) {
                                e.stopPropagation();
                                const clickedObj = e.object as THREE.Object3D;
                                // Find node in sceneTree
                                const findNode = (
                                    item: SceneNodeItem | null,
                                ): SceneNodeItem | null => {
                                    if (!item) return null;
                                    if (item.id === clickedObj.uuid)
                                        return item;
                                    for (const child of item.children) {
                                        const res = findNode(child);
                                        if (res) return res;
                                    }
                                    return null;
                                };
                                const found = findNode(sceneTree);
                                handleSelectNode(
                                    found || {
                                        id: clickedObj.uuid,
                                        name:
                                            clickedObj.name ||
                                            `Mesh_${clickedObj.id}`,
                                        type: "Mesh",
                                        children: [],
                                        visible: clickedObj.visible,
                                        objectRef: clickedObj,
                                    },
                                );
                                if (showSceneInspector === undefined) {
                                    setInternalInspectorOpen(true);
                                }
                            }
                        }}
                    >
                        {useFallbackModel ? (
                            <ProceduralF1Car
                                wireframe={wireframe}
                                onSceneReady={handleSceneReady}
                            />
                        ) : (
                            <SketchfabCarModel
                                url={modelUrl}
                                wireframe={wireframe}
                                onLoaded={onModelLoaded}
                                onSceneReady={handleSceneReady}
                            />
                        )}
                    </Center>

                    {/* Part Highlight & Isolation Shader/Material Controller */}
                    <ModelHighlightManager
                        sceneRoot={sceneRootObj}
                        selectedNodeId={activeSelectedNodeId}
                        isIsolatedMode={isIsolatedMode}
                    />
                </Suspense>
            </Canvas>

            {/* Scene Graph Tree Inspector Drawer */}
            <SceneTreeInspector
                sceneTree={sceneTree}
                selectedNodeId={activeSelectedNodeId}
                onSelectNode={handleSelectNode}
                onToggleVisibility={handleToggleVisibility}
                isOpen={isInspectorOpen}
                onClose={handleCloseInspector}
                isIsolatedMode={isIsolatedMode}
                onToggleIsolatedMode={setIsIsolatedMode}
                isWhiteTheme={isWhite}
            />
        </div>
    );
};
