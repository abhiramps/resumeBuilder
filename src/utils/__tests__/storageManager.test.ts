/**
 * Test file for storageManager utility
 * Tests localStorage operations, error handling, and quota management
 */

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  isStorageAvailable,
  getStorageQuota,
  getAllStorageKeys,
  getStorageSize,
  migrateStorageFormat,
  exportStorageData,
  importStorageData,
  STORAGE_KEYS,
  StorageQuotaError,
  StorageError,
} from "../storageManager";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  hasOwnProperty: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock navigator.storage
const mockStorageEstimate = jest.fn();
Object.defineProperty(navigator, "storage", {
  value: {
    estimate: mockStorageEstimate,
  },
  writable: true,
});

describe("storageManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
    localStorageMock.hasOwnProperty.mockReturnValue(true);
  });

  describe("isStorageAvailable", () => {
    it("should return true when localStorage is available", () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it("should return false when localStorage throws error", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Quota exceeded");
      });

      expect(isStorageAvailable()).toBe(false);
    });
  });

  describe("getStorageQuota", () => {
    it("should return quota information when available", async () => {
      mockStorageEstimate.mockResolvedValue({
        quota: 1000000,
        usage: 500000,
      });

      const result = await getStorageQuota();
      expect(result).toEqual({
        quota: 1000000,
        usage: 500000,
      });
    });

    it("should return null when storage API is not available", async () => {
      Object.defineProperty(navigator, "storage", {
        value: undefined,
        writable: true,
      });

      const result = await getStorageQuota();
      expect(result).toBeNull();
    });
  });

  describe("saveToLocalStorage", () => {
    it("should save data successfully", async () => {
      const testData = { name: "Test", value: 123 };

      const result = await saveToLocalStorage("testKey", testData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "testKey",
        expect.stringContaining('"data":')
      );
    });

    it("should handle storage quota exceeded error", async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

      const testData = { name: "Test", value: 123 };
      const result = await saveToLocalStorage("testKey", testData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("quota");
    });

    it("should retry on failure", async () => {
      let callCount = 0;
      localStorageMock.setItem.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error("Temporary error");
        }
      });

      const testData = { name: "Test", value: 123 };
      const result = await saveToLocalStorage("testKey", testData);

      expect(result.success).toBe(true);
      expect(callCount).toBe(2);
    });

    it("should create backup when requested", async () => {
      const testData = { name: "Test", value: 123 };

      await saveToLocalStorage("testKey", testData, { backup: true });

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "testKey",
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        expect.stringMatching(/testKey_backup_\d+/),
        expect.any(String)
      );
    });

    it("should return error when localStorage is not available", async () => {
      Object.defineProperty(window, "localStorage", {
        value: undefined,
      });

      const testData = { name: "Test", value: 123 };
      const result = await saveToLocalStorage("testKey", testData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("not available");
    });
  });

  describe("loadFromLocalStorage", () => {
    it("should load data successfully", async () => {
      const testData = { name: "Test", value: 123 };
      const storedData = {
        data: testData,
        timestamp: new Date().toISOString(),
        version: "1.0",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      const result = await loadFromLocalStorage("testKey");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it("should return default value when key does not exist", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const defaultValue = { name: "Default" };
      const result = await loadFromLocalStorage("testKey", defaultValue);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(defaultValue);
    });

    it("should handle legacy format", async () => {
      const testData = { name: "Test", value: 123 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      const result = await loadFromLocalStorage("testKey");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it("should handle JSON parsing errors", async () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = await loadFromLocalStorage("testKey");

      expect(result.success).toBe(false);
      expect(result.error).toContain("parsing");
    });
  });

  describe("clearLocalStorage", () => {
    it("should clear data successfully", async () => {
      const result = await clearLocalStorage("testKey");

      expect(result.success).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("testKey");
    });

    it("should clear backup files", async () => {
      // Mock Object.keys to return backup keys
      jest
        .spyOn(Object, "keys")
        .mockReturnValue([
          "testKey",
          "testKey_backup_123",
          "testKey_backup_456",
          "otherKey",
        ]);

      await clearLocalStorage("testKey");

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("testKey");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "testKey_backup_123"
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "testKey_backup_456"
      );
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith("otherKey");
    });
  });

  describe("getAllStorageKeys", () => {
    it("should return all storage keys", () => {
      jest.spyOn(Object, "keys").mockReturnValue(["key1", "key2", "key3"]);

      const keys = getAllStorageKeys();

      expect(keys).toEqual(["key1", "key2", "key3"]);
    });

    it("should return empty array when localStorage is not available", () => {
      Object.defineProperty(window, "localStorage", {
        value: undefined,
      });

      const keys = getAllStorageKeys();

      expect(keys).toEqual([]);
    });
  });

  describe("getStorageSize", () => {
    it("should calculate storage size", () => {
      jest.spyOn(Object, "keys").mockReturnValue(["key1", "key2"]);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "key1") return "data1";
        if (key === "key2") return "data2";
        return null;
      });

      const size = getStorageSize();

      expect(size.used).toBeGreaterThan(0);
      expect(size.total).toBe(5 * 1024 * 1024); // 5MB
      expect(size.available).toBeLessThan(size.total);
    });
  });

  describe("migrateStorageFormat", () => {
    it("should migrate legacy format to new format", async () => {
      const testData = { name: "Test", value: 123 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      const result = await migrateStorageFormat("testKey");

      expect(result.success).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("should not migrate if already in new format", async () => {
      const storedData = {
        data: { name: "Test", value: 123 },
        timestamp: new Date().toISOString(),
        version: "1.0",
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      const result = await migrateStorageFormat("testKey");

      expect(result.success).toBe(true);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("exportStorageData", () => {
    it("should export all data", async () => {
      jest.spyOn(Object, "keys").mockReturnValue(["key1", "key2"]);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "key1") return JSON.stringify({ data: "value1" });
        if (key === "key2") return JSON.stringify({ data: "value2" });
        return null;
      });

      const result = await exportStorageData();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("key1");
      expect(result.data).toHaveProperty("key2");
    });
  });

  describe("importStorageData", () => {
    it("should import data successfully", async () => {
      const importData = {
        key1: "value1",
        key2: "value2",
      };

      const result = await importStorageData(importData);

      expect(result.success).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });

    it("should handle import errors", async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Import failed");
      });

      const importData = { key1: "value1" };
      const result = await importStorageData(importData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("key1");
    });
  });

  describe("STORAGE_KEYS", () => {
    it("should have all required keys", () => {
      expect(STORAGE_KEYS.RESUME_DRAFT).toBe("resumeDraft");
      expect(STORAGE_KEYS.RESUME_BACKUP).toBe("resumeBackup");
      expect(STORAGE_KEYS.USER_PREFERENCES).toBe("userPreferences");
      expect(STORAGE_KEYS.TEMPLATE_SETTINGS).toBe("templateSettings");
      expect(STORAGE_KEYS.ATS_SETTINGS).toBe("atsSettings");
    });
  });

  describe("Error Classes", () => {
    it("should create StorageQuotaError", () => {
      const error = new StorageQuotaError("Quota exceeded");
      expect(error.name).toBe("StorageQuotaError");
      expect(error.message).toBe("Quota exceeded");
    });

    it("should create StorageError", () => {
      const error = new StorageError("Storage failed");
      expect(error.name).toBe("StorageError");
      expect(error.message).toBe("Storage failed");
    });
  });
});
