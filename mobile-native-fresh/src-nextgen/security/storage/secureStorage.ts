import * as SecureStore from 'expo-secure-store';
import { encryptionService } from '../encryption/encryptionService';

export interface StorageItem {
  key: string;
  value: any;
  encrypted?: boolean;
  expiresAt?: number;
}

class SecureStorageService {
  async setItem(key: string, value: any, options?: { encrypted?: boolean; expiresAt?: number }): Promise<void> {
    try {
      let dataToStore = value;

      if (options?.encrypted) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        dataToStore = await encryptionService.encrypt(stringValue);
      } else if (typeof value !== 'string') {
        dataToStore = JSON.stringify(value);
      }

      const item: StorageItem = {
        key,
        value: dataToStore,
        encrypted: options?.encrypted || false,
        expiresAt: options?.expiresAt,
      };

      await SecureStore.setItemAsync(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing item:', error);
      throw new Error('Failed to store item securely');
    }
  }

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const stored = await SecureStore.getItemAsync(key);
      if (!stored) return null;

      const item: StorageItem = JSON.parse(stored);

      // Check if item has expired
      if (item.expiresAt && Date.now() > item.expiresAt) {
        await this.removeItem(key);
        return null;
      }

      let value = item.value;

      if (item.encrypted) {
        const decrypted = await encryptionService.decrypt(item.value);
        try {
          value = JSON.parse(decrypted);
        } catch {
          value = decrypted;
        }
      } else {
        try {
          value = JSON.parse(item.value);
        } catch {
          value = item.value;
        }
      }

      return value as T;
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      // Note: SecureStore doesn't have a clear method, so we need to track keys
      const keys = await this.getAllKeys();
      for (const key of keys) {
        await this.removeItem(key);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    // Note: SecureStore doesn't provide getAllKeys, so we maintain our own list
    const keysList = await SecureStore.getItemAsync('_secure_storage_keys');
    return keysList ? JSON.parse(keysList) : [];
  }

  private async addKeyToList(key: string): Promise<void> {
    const keys = await this.getAllKeys();
    if (!keys.includes(key)) {
      keys.push(key);
      await SecureStore.setItemAsync('_secure_storage_keys', JSON.stringify(keys));
    }
  }
}

export const secureStorage = new SecureStorageService();
