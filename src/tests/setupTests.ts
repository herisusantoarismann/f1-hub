import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically cleanup DOM after each test run
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
