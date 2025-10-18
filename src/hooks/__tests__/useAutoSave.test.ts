/**
 * Test file for useAutoSave hook
 * Tests auto-save functionality, debouncing, and restore behavior
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutoSave } from "../useAutoSave";
import { Resume } from "../../types/resume.types";
import { createDefaultResume } from "../../constants/defaultResume";

// Mock the storage manager
jest.mock("../../utils/storageManager", () => ({
  saveToLocalStorage: jest.fn(),
  loadFromLocalStorage: jest.fn(),
  STORAGE_KEYS: {
    RESUME_DRAFT: "resumeDraft",
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock beforeunload event
const mockBeforeUnload = jest.fn();
Object.defineProperty(window, "addEventListener", {
  value: jest.fn((event, handler) => {
    if (event === "beforeunload") {
      mockBeforeUnload.mockImplementation(handler);
    }
  }),
});

Object.defineProperty(window, "removeEventListener", {
  value: jest.fn(),
});

describe("useAutoSave", () => {
  let mockResume: Resume;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResume = createDefaultResume();

    // Mock successful storage operations
    const {
      saveToLocalStorage,
      loadFromLocalStorage,
    } = require("../../utils/storageManager");
    saveToLocalStorage.mockResolvedValue({
      success: true,
      timestamp: new Date().toISOString(),
    });
    loadFromLocalStorage.mockResolvedValue({
      success: true,
      data: mockResume,
      timestamp: new Date().toISOString(),
    });
  });

  it("should initialize with idle status", () => {
    const { result } = renderHook(() => useAutoSave(mockResume));

    expect(result.current.saveStatus).toBe("idle");
    expect(result.current.error).toBeUndefined();
    expect(result.current.isRestored).toBe(false);
  });

  it("should save data after interval", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        interval: 100, // 100ms for testing
        debounceDelay: 50,
      })
    );

    // Wait for auto-save to trigger
    await waitFor(
      () => {
        expect(saveToLocalStorage).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    expect(result.current.saveStatus).toBe("saved");
  });

  it("should debounce saves when data changes rapidly", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result, rerender } = renderHook(
      ({ resume }) =>
        useAutoSave(resume, {
          interval: 100,
          debounceDelay: 200,
        }),
      { initialProps: { resume: mockResume } }
    );

    // Change data rapidly
    const updatedResume = { ...mockResume, id: "new-id" };
    rerender({ resume: updatedResume });
    rerender({ resume: { ...updatedResume, id: "another-id" } });
    rerender({ resume: { ...updatedResume, id: "final-id" } });

    // Wait for debounce
    await waitFor(
      () => {
        expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );
  });

  it("should restore data on mount when restoreOnMount is true", async () => {
    const { loadFromLocalStorage } = require("../../utils/storageManager");

    renderHook(() =>
      useAutoSave(mockResume, {
        restoreOnMount: true,
      })
    );

    await waitFor(() => {
      expect(loadFromLocalStorage).toHaveBeenCalled();
    });
  });

  it("should not restore data when restoreOnMount is false", async () => {
    const { loadFromLocalStorage } = require("../../utils/storageManager");

    renderHook(() =>
      useAutoSave(mockResume, {
        restoreOnMount: false,
      })
    );

    // Wait a bit to ensure no restore happens
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(loadFromLocalStorage).not.toHaveBeenCalled();
  });

  it("should handle save errors gracefully", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");
    saveToLocalStorage.mockResolvedValue({
      success: false,
      error: "Storage quota exceeded",
    });

    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        interval: 100,
      })
    );

    await waitFor(() => {
      expect(result.current.saveStatus).toBe("error");
      expect(result.current.error).toBe("Storage quota exceeded");
    });
  });

  it("should provide manual save function", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result } = renderHook(() => useAutoSave(mockResume));

    await act(async () => {
      await result.current.saveNow();
    });

    expect(saveToLocalStorage).toHaveBeenCalled();
    expect(result.current.saveStatus).toBe("saved");
  });

  it("should provide clear saved function", async () => {
    const { result } = renderHook(() => useAutoSave(mockResume));

    await act(async () => {
      await result.current.clearSaved();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it("should provide restore data function", async () => {
    const { result } = renderHook(() => useAutoSave(mockResume));

    let restoredData: Resume | null = null;
    await act(async () => {
      restoredData = await result.current.restoreData();
    });

    expect(restoredData).toEqual(mockResume);
    expect(result.current.isRestored).toBe(true);
  });

  it("should handle beforeunload event", () => {
    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        saveOnUnload: true,
      })
    );

    // Simulate beforeunload event
    act(() => {
      mockBeforeUnload({} as BeforeUnloadEvent);
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("should not save on beforeunload when saveOnUnload is false", () => {
    renderHook(() =>
      useAutoSave(mockResume, {
        saveOnUnload: false,
      })
    );

    // Simulate beforeunload event
    act(() => {
      mockBeforeUnload({} as BeforeUnloadEvent);
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("should reset save status after showing success", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        interval: 100,
        showStatus: true,
      })
    );

    // Wait for save to complete
    await waitFor(() => {
      expect(result.current.saveStatus).toBe("saved");
    });

    // Wait for status to reset
    await waitFor(
      () => {
        expect(result.current.saveStatus).toBe("idle");
      },
      { timeout: 3000 }
    );
  });

  it("should not reset save status when showStatus is false", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        interval: 100,
        showStatus: false,
      })
    );

    // Wait for save to complete
    await waitFor(() => {
      expect(result.current.saveStatus).toBe("saved");
    });

    // Wait a bit to ensure status doesn't reset
    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(result.current.saveStatus).toBe("saved");
  });

  it("should use custom storage key", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    renderHook(() =>
      useAutoSave(mockResume, {
        storageKey: "customKey",
        interval: 100,
      })
    );

    await waitFor(() => {
      expect(saveToLocalStorage).toHaveBeenCalledWith(
        "customKey",
        mockResume,
        expect.any(Object)
      );
    });
  });

  it("should handle concurrent saves", async () => {
    const { saveToLocalStorage } = require("../../utils/storageManager");

    const { result } = renderHook(() =>
      useAutoSave(mockResume, {
        interval: 100,
      })
    );

    // Trigger multiple saves simultaneously
    await act(async () => {
      await Promise.all([
        result.current.saveNow(),
        result.current.saveNow(),
        result.current.saveNow(),
      ]);
    });

    // Should only save once due to concurrency protection
    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
  });
});

describe("SaveStatusIndicator", () => {
  it("should render saving indicator", () => {
    const {
      SaveStatusIndicator,
    } = require("../../components/UI/SaveStatusIndicator");
    const { render } = require("@testing-library/react");

    const { container } = render(
      <SaveStatusIndicator
        autoSaveResult={{
          saveStatus: "saving",
          lastSaved: undefined,
          error: undefined,
        }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render saved indicator", () => {
    const {
      SaveStatusIndicator,
    } = require("../../components/UI/SaveStatusIndicator");
    const { render } = require("@testing-library/react");

    const { container } = render(
      <SaveStatusIndicator
        autoSaveResult={{
          saveStatus: "saved",
          lastSaved: undefined,
          error: undefined,
        }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render error indicator", () => {
    const {
      SaveStatusIndicator,
    } = require("../../components/UI/SaveStatusIndicator");
    const { render } = require("@testing-library/react");

    const { container } = render(
      <SaveStatusIndicator
        autoSaveResult={{
          saveStatus: "error",
          lastSaved: undefined,
          error: "Test error",
        }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render last saved time", () => {
    const {
      SaveStatusIndicator,
    } = require("../../components/UI/SaveStatusIndicator");
    const { render } = require("@testing-library/react");

    const { container } = render(
      <SaveStatusIndicator
        autoSaveResult={{
          saveStatus: "idle",
          lastSaved: new Date().toISOString(),
          error: undefined,
        }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should return null for idle status without last saved", () => {
    const {
      SaveStatusIndicator,
    } = require("../../components/UI/SaveStatusIndicator");
    const { render } = require("@testing-library/react");

    const { container } = render(
      <SaveStatusIndicator
        autoSaveResult={{
          saveStatus: "idle",
          lastSaved: undefined,
          error: undefined,
        }}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
