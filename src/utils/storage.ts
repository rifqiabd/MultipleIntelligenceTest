/**
 * Utilities for working with browser storage (localStorage and sessionStorage)
 * Provides type safety and consistent error handling
 */

import { STORAGE_KEYS } from './constants';
import { UserData } from '@/pages/TestEntryForm';
import { TestResult } from '@/data/testResultsTypes';

/**
 * Type definitions for storage data
 */
interface StorageData {
  [STORAGE_KEYS.userData]: UserData;
  [STORAGE_KEYS.testResult]: TestResult;
  [STORAGE_KEYS.resultSaved]: string;
}

// Type to ensure we only use string keys
type StringKeyOf<T> = Extract<keyof T, string>;

/**
 * Get data from session storage with type safety
 * @param key Storage key to retrieve
 * @returns Typed data or null if not found
 */
export function getFromSession<K extends StringKeyOf<StorageData>>(
  key: K
): StorageData[K] | null {
  try {
    const data = sessionStorage.getItem(key);
    if (!data) return null;
    
    return JSON.parse(data) as StorageData[K];
  } catch (error) {
    console.error(`Error retrieving ${key} from session storage:`, error);
    return null;
  }
}

/**
 * Save data to session storage with type safety
 * @param key Storage key to save under
 * @param data Data to save
 * @returns True if saved successfully
 */
export function saveToSession<K extends StringKeyOf<StorageData>>(
  key: K,
  data: StorageData[K]
): boolean {
  try {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to session storage:`, error);
    return false;
  }
}

/**
 * Remove item from session storage
 * @param key Storage key to remove
 */
export function removeFromSession(key: StringKeyOf<StorageData>): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from session storage:`, error);
  }
}

/**
 * Clear all session storage data
 */
export function clearSession(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}
