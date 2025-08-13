import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

class EncryptionService {
  private readonly algorithm = 'AES-256-CBC';
  private readonly keySize = 256;
  private readonly iterations = 1000;

  private async getEncryptionKey(): Promise<string> {
    const deviceId = await this.getDeviceId();
    const userKey = await this.getUserKey();
    return CryptoJS.SHA256(deviceId + userKey).toString();
  }

  private async getDeviceId(): Promise<string> {
    const stored = await SecureStore.getItemAsync('device_id');
    if (stored) return stored;

    const deviceId = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync('device_id', deviceId);
    return deviceId;
  }

  private async getUserKey(): Promise<string> {
    const stored = await SecureStore.getItemAsync('user_encryption_key');
    if (stored) return stored;

    const userKey = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync('user_encryption_key', userKey);
    return userKey;
  }

  async encrypt(data: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const iv = CryptoJS.lib.WordArray.random(128/8);

    const derivedKey = CryptoJS.PBKDF2(key, salt, {
      keySize: this.keySize/32,
      iterations: this.iterations
    });

    const encrypted = CryptoJS.AES.encrypt(data, derivedKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    const result = salt.toString() + iv.toString() + encrypted.toString();
    return result;
  }

  async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
    const ciphertext = encryptedData.substring(64);

    const derivedKey = CryptoJS.PBKDF2(key, salt, {
      keySize: this.keySize/32,
      iterations: this.iterations
    });

    const decrypted = CryptoJS.AES.decrypt(ciphertext, derivedKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    return salt + ':' + hash.toString();
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');
    const computedHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    return storedHash === computedHash.toString();
  }
}

export const encryptionService = new EncryptionService();
