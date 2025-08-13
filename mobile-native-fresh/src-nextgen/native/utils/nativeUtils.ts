import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { appConfig } from '../config/appConfig';

export interface DeviceInfo {
  platform: string;
  version: string;
  buildNumber: string;
  deviceName: string;
  deviceId: string;
  screenWidth: number;
  screenHeight: number;
  statusBarHeight: number;
  isTablet: boolean;
  isSimulator: boolean;
}

export class NativeUtils {
  static getDeviceInfo(): DeviceInfo {
    const { width, height } = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0;

    return {
      platform: Platform.OS,
      version: appConfig.version,
      buildNumber: appConfig.buildNumber,
      deviceName: Device.deviceName || 'Unknown',
      deviceId: Application.androidId || Device.osInternalBuildId || 'Unknown',
      screenWidth: width,
      screenHeight: height,
      statusBarHeight,
      isTablet: Device.deviceType === Device.DeviceType.TABLET,
      isSimulator: Device.isDevice === false,
    };
  }

  static isIOS(): boolean {
    return Platform.OS === 'ios';
  }

  static isAndroid(): boolean {
    return Platform.OS === 'android';
  }

  static isTablet(): boolean {
    return Device.deviceType === Device.DeviceType.TABLET;
  }

  static isSimulator(): boolean {
    return Device.isDevice === false;
  }

  static getAppVersion(): string {
    return `${appConfig.version} (${appConfig.buildNumber})`;
  }

  static getBundleIdentifier(): string {
    return appConfig.bundleIdentifier;
  }

  static getTeamId(): string {
    return appConfig.teamId;
  }

  static getDeploymentTarget(): string {
    return appConfig.deploymentTarget;
  }
}
