import { Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { appConfig } from '../config/appConfig';

export interface DeepLinkConfig {
  scheme: string;
  host: string;
  paths: string[];
}

export interface DeepLinkHandler {
  path: string;
  handler: (params: any) => void;
}

export class DeepLinkingService {
  private static instance: DeepLinkingService;
  private handlers: Map<string, DeepLinkHandler> = new Map();
  private initialURL: string | null = null;

  static getInstance(): DeepLinkingService {
    if (!DeepLinkingService.instance) {
      DeepLinkingService.instance = new DeepLinkingService();
    }
    return DeepLinkingService.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing deep linking service...');

      // Get initial URL if app was opened via deep link
      const url = await Linking.getInitialURL();
      if (url) {
        this.initialURL = url;
        console.log('App opened with deep link:', url);
        this.handleDeepLink(url);
      }

      // Listen for incoming deep links
      Linking.addEventListener('url', (event) => {
        console.log('Deep link received:', event.url);
        this.handleDeepLink(event.url);
      });

      console.log('Deep linking service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize deep linking service:', error);
      throw error;
    }
  }

  registerHandler(path: string, handler: (params: any) => void): void {
    this.handlers.set(path, { path, handler });
    console.log('Registered deep link handler for path:', path);
  }

  private handleDeepLink(url: string): void {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      const params = Object.fromEntries(parsedUrl.searchParams.entries());

      console.log('Parsed deep link:', { path, params });

      // Find matching handler
      const handler = this.handlers.get(path);
      if (handler) {
        handler.handler(params);
      } else {
        console.warn('No handler found for deep link path:', path);
      }
    } catch (error) {
      console.error('Failed to handle deep link:', error);
    }
  }

  async openURL(url: string): Promise<boolean> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      } else {
        console.warn('Cannot open URL:', url);
        return false;
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      return false;
    }
  }

  async openSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open settings:', error);
      throw error;
    }
  }

  getInitialURL(): string | null {
    return this.initialURL;
  }
}

export const deepLinkingService = DeepLinkingService.getInstance();
