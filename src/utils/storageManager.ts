/**
 * Storage Manager Utility
 *
 * Provides a unified interface for localStorage operations with error handling,
 * type safety, and quota management.
 */

/**
 * Storage operation result interface
 */
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

/**
 * Storage quota error type
 */
export class StorageQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageQuotaError";
  }
}

/**
 * Storage operation error type
 */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  RESUME_DRAFT: "resumeDraft",
  RESUME_BACKUP: "resumeBackup",
  USER_PREFERENCES: "userPreferences",
  TEMPLATE_SETTINGS: "templateSettings",
  ATS_SETTINGS: "atsSettings",
} as const;

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
  BACKUP_INTERVAL: 300000, // 5 minutes
  MAX_BACKUP_COUNT: 5,
} as const;

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage quota information
 */
export const getStorageQuota = (): Promise<{
  quota: number;
  usage: number;
} | null> => {
  return new Promise((resolve) => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage
        .estimate()
        .then((estimate) => {
          resolve({
            quota: estimate.quota || 0,
            usage: estimate.usage || 0,
          });
        })
        .catch(() => {
          resolve(null);
        });
    } else {
      resolve(null);
    }
  });
};

/**
 * Save data to localStorage with error handling and retry logic
 *
 * @param key - Storage key
 * @param data - Data to save
 * @param options - Save options
 * @returns Promise with save result
 */
export const saveToLocalStorage = async <T>(
  key: string,
  data: T,
  options: {
    retries?: number;
    backup?: boolean;
    compress?: boolean;
  } = {}
): Promise<StorageResult<T>> => {
  const {
    retries = STORAGE_CONFIG.MAX_RETRIES,
    backup = false,
    compress = false,
  } = options;

  if (!isStorageAvailable()) {
    return {
      success: false,
      error: "LocalStorage is not available",
    };
  }

  try {
    // Prepare data for storage
    let dataToStore = data;

    if (compress && typeof data === "object") {
      // Simple compression by removing whitespace from JSON
      dataToStore = JSON.stringify(data) as T;
    }

    const storageData = {
      data: dataToStore,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    const jsonString = JSON.stringify(storageData);

    // Check if data is too large
    if (jsonString.length > 5 * 1024 * 1024) {
      // 5MB limit
      throw new StorageQuotaError("Data exceeds storage quota limit");
    }

    // Save to localStorage
    localStorage.setItem(key, jsonString);

    // Create backup if requested
    if (backup) {
      const backupKey = `${key}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, jsonString);

      // Clean up old backups
      cleanupOldBackups(key);
    }

    return {
      success: true,
      data: data as T,
      timestamp: storageData.timestamp,
    };
  } catch (error) {
    if (error instanceof StorageQuotaError) {
      return {
        success: false,
        error: "Storage quota exceeded. Please reduce data size.",
      };
    }

    if (retries > 0) {
      // Wait before retry
      await new Promise((resolve) =>
        setTimeout(resolve, STORAGE_CONFIG.RETRY_DELAY)
      );

      // Retry with reduced options
      return saveToLocalStorage(key, data, {
        ...options,
        retries: retries - 1,
        backup: false, // Don't backup on retry
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown storage error",
    };
  }
};

/**
 * Load data from localStorage with error handling
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise with load result
 */
export const loadFromLocalStorage = async <T>(
  key: string,
  defaultValue?: T
): Promise<StorageResult<T>> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: "LocalStorage is not available",
      data: defaultValue,
    };
  }

  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return {
        success: true,
        data: defaultValue,
      };
    }

    const parsed = JSON.parse(stored);

    // Check if it's the new format with metadata
    if (parsed.data !== undefined) {
      return {
        success: true,
        data: parsed.data,
        timestamp: parsed.timestamp,
      };
    }

    // Legacy format - return as-is
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown parsing error",
      data: defaultValue,
    };
  }
};

/**
 * Clear data from localStorage
 *
 * @param key - Storage key
 * @returns Promise with clear result
 */
export const clearLocalStorage = async (
  key: string
): Promise<StorageResult> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: "LocalStorage is not available",
    };
  }

  try {
    localStorage.removeItem(key);

    // Also clear any backups
    const keys = Object.keys(localStorage);
    const backupKeys = keys.filter((k) => k.startsWith(`${key}_backup_`));
    backupKeys.forEach((backupKey) => localStorage.removeItem(backupKey));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get all storage keys
 *
 * @returns Array of storage keys
 */
export const getAllStorageKeys = (): string[] => {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch {
    return [];
  }
};

/**
 * Get storage size information
 *
 * @returns Storage size information
 */
export const getStorageSize = (): {
  used: number;
  available: number;
  total: number;
} => {
  if (!isStorageAvailable()) {
    return { used: 0, available: 0, total: 0 };
  }

  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate available space (most browsers have ~5-10MB limit)
    const estimatedTotal = 5 * 1024 * 1024; // 5MB
    const available = Math.max(0, estimatedTotal - used);

    return {
      used,
      available,
      total: estimatedTotal,
    };
  } catch {
    return { used: 0, available: 0, total: 0 };
  }
};

/**
 * Clean up old backup files
 *
 * @param baseKey - Base key for backups
 */
const cleanupOldBackups = (baseKey: string): void => {
  try {
    const keys = Object.keys(localStorage);
    const backupKeys = keys
      .filter((k) => k.startsWith(`${baseKey}_backup_`))
      .sort()
      .reverse(); // Newest first

    // Keep only the most recent backups
    const keysToRemove = backupKeys.slice(STORAGE_CONFIG.MAX_BACKUP_COUNT);
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore cleanup errors
  }
};

/**
 * Migrate old storage format to new format
 *
 * @param key - Storage key
 * @returns Promise with migration result
 */
export const migrateStorageFormat = async (
  key: string
): Promise<StorageResult> => {
  try {
    const result = await loadFromLocalStorage(key);

    if (!result.success || !result.data) {
      return { success: true }; // Nothing to migrate
    }

    // Check if already in new format
    if (result.timestamp) {
      return { success: true }; // Already migrated
    }

    // Migrate to new format
    const migrateResult = await saveToLocalStorage(key, result.data, {
      backup: true,
    });

    return migrateResult;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Migration failed",
    };
  }
};

/**
 * Export all data for backup
 *
 * @returns Promise with exported data
 */
export const exportStorageData = async (): Promise<
  StorageResult<Record<string, any>>
> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: "LocalStorage is not available",
    };
  }

  try {
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      if (!key.startsWith("_") && !key.includes("backup")) {
        const result = await loadFromLocalStorage(key);
        if (result.success && result.data) {
          data[key] = result.data;
        }
      }
    }

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Export failed",
    };
  }
};

/**
 * Import data from backup
 *
 * @param data - Data to import
 * @returns Promise with import result
 */
export const importStorageData = async (
  data: Record<string, any>
): Promise<StorageResult> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: "LocalStorage is not available",
    };
  }

  try {
    for (const [key, value] of Object.entries(data)) {
      const result = await saveToLocalStorage(key, value, { backup: true });
      if (!result.success) {
        return {
          success: false,
          error: `Failed to import key: ${key}`,
        };
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Import failed",
    };
  }
};
