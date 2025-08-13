import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricConfig {
  allowDeviceCredentials: boolean;
  fallbackLabel?: string;
  cancelLabel?: string;
}

class BiometricService {
  private isAvailable: boolean | null = null;

  async isBiometricAvailable(): Promise<boolean> {
    if (this.isAvailable !== null) return this.isAvailable;

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    this.isAvailable = hasHardware && isEnrolled;
    return this.isAvailable;
  }

  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }

  async authenticate(config?: BiometricConfig): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Thoughtmarks',
        fallbackLabel: config?.fallbackLabel || 'Use passcode',
        cancelLabel: config?.cancelLabel || 'Cancel',
        disableDeviceFallback: !config?.allowDeviceCredentials,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async saveCredentials(credentials: { username: string; password: string }): Promise<void> {
    if (Platform.OS === 'ios') {
      await LocalAuthentication.saveCredentialsAsync(
        credentials.username,
        credentials.password
      );
    }
  }
}

export const biometricService = new BiometricService();
