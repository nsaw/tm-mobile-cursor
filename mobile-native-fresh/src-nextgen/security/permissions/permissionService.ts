import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  permanentlyDenied: boolean;
}

export type PermissionType = 'camera' | 'microphone' | 'location' | 'mediaLibrary' | 'notifications';

class PermissionService {
  async requestCameraPermission(): Promise<PermissionStatus> {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
      permanentlyDenied: !canAskAgain && status === 'denied',
    };
  }

  async requestMicrophonePermission(): Promise<PermissionStatus> {
    const { status, canAskAgain } = await Camera.requestMicrophonePermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
      permanentlyDenied: !canAskAgain && status === 'denied',
    };
  }

  async requestLocationPermission(): Promise<PermissionStatus> {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
      permanentlyDenied: !canAskAgain && status === 'denied',
    };
  }

  async requestMediaLibraryPermission(): Promise<PermissionStatus> {
    const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
      permanentlyDenied: !canAskAgain && status === 'denied',
    };
  }

  async requestNotificationPermission(): Promise<PermissionStatus> {
    const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
      permanentlyDenied: !canAskAgain && status === 'denied',
    };
  }

  async checkPermission(type: PermissionType): Promise<PermissionStatus> {
    switch (type) {
      case 'camera':
        const cameraStatus = await Camera.getCameraPermissionsAsync();
        return {
          granted: cameraStatus.status === 'granted',
          canAskAgain: cameraStatus.canAskAgain,
          permanentlyDenied: !cameraStatus.canAskAgain && cameraStatus.status === 'denied',
        };
      case 'microphone':
        const micStatus = await Camera.getMicrophonePermissionsAsync();
        return {
          granted: micStatus.status === 'granted',
          canAskAgain: micStatus.canAskAgain,
          permanentlyDenied: !micStatus.canAskAgain && micStatus.status === 'denied',
        };
      case 'location':
        const locationStatus = await Location.getForegroundPermissionsAsync();
        return {
          granted: locationStatus.status === 'granted',
          canAskAgain: locationStatus.canAskAgain,
          permanentlyDenied: !locationStatus.canAskAgain && locationStatus.status === 'denied',
        };
      case 'mediaLibrary':
        const mediaStatus = await MediaLibrary.getPermissionsAsync();
        return {
          granted: mediaStatus.status === 'granted',
          canAskAgain: mediaStatus.canAskAgain,
          permanentlyDenied: !mediaStatus.canAskAgain && mediaStatus.status === 'denied',
        };
      case 'notifications':
        const notificationStatus = await Notifications.getPermissionsAsync();
        return {
          granted: notificationStatus.status === 'granted',
          canAskAgain: notificationStatus.canAskAgain,
          permanentlyDenied: !notificationStatus.canAskAgain && notificationStatus.status === 'denied',
        };
      default:
        throw new Error(`Unknown permission type: ${type}`);
    }
  }
}

export const permissionService = new PermissionService();
