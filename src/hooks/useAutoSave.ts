import React, { useEffect, useRef, useCallback, useState } from "react";
import { Resume } from "../types/resume.types";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  STORAGE_KEYS,
  StorageResult,
} from "../utils/storageManager";

/**
 * Auto-save hook configuration
 */
export interface AutoSaveConfig {
  /** Auto-save interval in milliseconds (default: 30000) */
  interval?: number;
  /** Debounce delay in milliseconds (default: 1000) */
  debounceDelay?: number;
  /** Whether to save on window beforeunload (default: true) */
  saveOnUnload?: boolean;
  /** Whether to restore data on mount (default: true) */
  restoreOnMount?: boolean;
  /** Whether to show save status (default: true) */
  showStatus?: boolean;
  /** Storage key to use (default: RESUME_DRAFT) */
  storageKey?: string;
}

/**
 * Auto-save hook result
 */
export interface AutoSaveResult {
  /** Current save status */
  saveStatus: "idle" | "saving" | "saved" | "error";
  /** Last save timestamp */
  lastSaved?: string;
  /** Error message if save failed */
  error?: string;
  /** Manual save function */
  saveNow: () => Promise<void>;
  /** Clear saved data function */
  clearSaved: () => Promise<void>;
  /** Restore data function */
  restoreData: () => Promise<Resume | null>;
  /** Whether data has been restored */
  isRestored: boolean;
}

/**
 * Auto-save hook for resume data
 *
 * Features:
 * - Debounced auto-save every 30 seconds
 * - Save on window beforeunload
 * - Restore data on mount
 * - Error handling and retry logic
 * - Save status tracking
 *
 * @param resume - Resume data to save
 * @param config - Auto-save configuration
 * @returns Auto-save hook result
 *
 * @example
 * ```tsx
 * const { saveStatus, lastSaved, saveNow } = useAutoSave(resume, {
 *   interval: 30000,
 *   debounceDelay: 1000,
 *   showStatus: true
 * });
 * ```
 */
export const useAutoSave = (
  resume: Resume,
  config: AutoSaveConfig = {}
): AutoSaveResult => {
  const {
    interval = 30000, // 30 seconds
    debounceDelay = 1000, // 1 second
    saveOnUnload = true,
    restoreOnMount = true,
    showStatus = true,
    storageKey = STORAGE_KEYS.RESUME_DRAFT,
  } = config;

  // State
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [lastSaved, setLastSaved] = useState<string>();
  const [error, setError] = useState<string>();
  const [isRestored, setIsRestored] = useState(false);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>();
  const isSavingRef = useRef(false);

  /**
   * Save resume data to localStorage
   */
  const saveData = useCallback(async (): Promise<void> => {
    if (isSavingRef.current) {
      return; // Prevent concurrent saves
    }

    try {
      isSavingRef.current = true;
      setSaveStatus("saving");
      setError(undefined);

      const result = await saveToLocalStorage(storageKey, resume, {
        backup: true,
        compress: true,
      });

      if (result.success) {
        setSaveStatus("saved");
        setLastSaved(result.timestamp || new Date().toISOString());
        lastSavedDataRef.current = JSON.stringify(resume);
      } else {
        setSaveStatus("error");
        setError(result.error || "Save failed");
      }
    } catch (err) {
      setSaveStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      isSavingRef.current = false;
    }
  }, [resume, storageKey]);

  /**
   * Debounced save function
   */
  const debouncedSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveData();
    }, debounceDelay);
  }, [saveData, debounceDelay]);

  /**
   * Manual save function
   */
  const saveNow = useCallback(async (): Promise<void> => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  /**
   * Clear saved data
   */
  const clearSaved = useCallback(async (): Promise<void> => {
    try {
      const { clearLocalStorage } = await import("../utils/storageManager");
      await clearLocalStorage(storageKey);
      setLastSaved(undefined);
      setSaveStatus("idle");
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clear failed");
    }
  }, [storageKey]);

  /**
   * Restore data from localStorage
   */
  const restoreData = useCallback(async (): Promise<Resume | null> => {
    try {
      const result = await loadFromLocalStorage<Resume>(storageKey);

      if (result.success && result.data) {
        setIsRestored(true);
        return result.data;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed");
      return null;
    }
  }, [storageKey]);

  /**
   * Check if data has changed
   */
  const hasDataChanged = useCallback((): boolean => {
    const currentData = JSON.stringify(resume);
    return currentData !== lastSavedDataRef.current;
  }, [resume]);

  /**
   * Handle window beforeunload event
   */
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (hasDataChanged()) {
        // Perform synchronous save
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              data: resume,
              timestamp: new Date().toISOString(),
              version: "1.0",
            })
          );
        } catch (err) {
          console.error("Failed to save on unload:", err);
        }
      }
    },
    [resume, storageKey, hasDataChanged]
  );

  // Auto-save effect
  useEffect(() => {
    if (!hasDataChanged()) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resume, interval, debouncedSave, hasDataChanged]);

  // Restore data on mount
  useEffect(() => {
    if (restoreOnMount && !isRestored) {
      restoreData();
    }
  }, [restoreOnMount, isRestored, restoreData]);

  // Window beforeunload event
  useEffect(() => {
    if (!saveOnUnload) {
      return;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveOnUnload, handleBeforeUnload]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Reset save status after showing success
  useEffect(() => {
    if (saveStatus === "saved" && showStatus) {
      const timer = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000); // Show success for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [saveStatus, showStatus]);

  return {
    saveStatus,
    lastSaved,
    error,
    saveNow,
    clearSaved,
    restoreData,
    isRestored,
  };
};
