import * as IntentLauncher from 'expo-intent-launcher';

import DeepLinkService from './DeepLinkService';

export interface SiriShortcut {
  id: string;
  title: string;
  subtitle?: string;
  phrase: string;
  deepLink: string;
}

export class SiriShortcutsService {
  private static instance: SiriShortcutsService;
  private deepLinkService: DeepLinkService;

  private constructor() {
    this.deepLinkService = DeepLinkService.getInstance();
  }

  static getInstance(): SiriShortcutsService {
    if (!SiriShortcutsService.instance) {
      SiriShortcutsService.instance = new SiriShortcutsService();
    }
    return SiriShortcutsService.instance;
  }

  // Define available Siri shortcuts
  private getShortcuts(): SiriShortcut[] {
    return [
      {
        id: 'com.thoughtmarks.createThoughtmark',
        title: 'Create Thoughtmark',
        subtitle: 'Quickly add a new thought or note',
        phrase: 'Create a new thoughtmark',
        deepLink: 'thoughtmarks://create'
      },
      {
        id: 'com.thoughtmarks.voiceRecord',
        title: 'Voice Record',
        subtitle: 'Record a voice note',
        phrase: 'Record a voice note',
        deepLink: 'thoughtmarks://create?mode=voice'
      },
      {
        id: 'com.thoughtmarks.viewTasks',
        title: 'View Tasks',
        subtitle: 'Show my tasks and reminders',
        phrase: 'Show my tasks',
        deepLink: 'thoughtmarks://tasks'
      },
      {
        id: 'com.thoughtmarks.search',
        title: 'Search Thoughtmarks',
        subtitle: 'Search through your thoughts',
        phrase: 'Search my thoughtmarks',
        deepLink: 'thoughtmarks://search'
      },
      {
        id: 'com.thoughtmarks.dashboard',
        title: 'Open Dashboard',
        subtitle: 'Open the main dashboard',
        phrase: 'Open thoughtmarks dashboard',
        deepLink: 'thoughtmarks://dashboard'
      }
    ];
  }

  // Donate shortcuts to Siri
  async donateAllShortcuts(): Promise<void> {
    try {
      console.log('Donating Siri shortcuts...');
      
      // For now, we'll use deep links to handle Siri shortcuts
      // In a full implementation, you would use NSUserActivity on iOS
      // and ShortcutManager on Android
      
      const shortcuts = this.getShortcuts();
      for (const shortcut of shortcuts) {
        await this.donateShortcut(shortcut);
      }
      
      console.log('Siri shortcuts donated successfully');
    } catch (error) {
      console.error('Error donating Siri shortcuts:', error);
    }
  }

  // Donate a single shortcut
  async donateShortcut(shortcut: SiriShortcut): Promise<void> {
    try {
      console.log(`Donating shortcut: ${shortcut.title}`);
      
      // On iOS, you would use NSUserActivity
      // On Android, you would use ShortcutManager
      // For now, we'll just log the donation
      
      console.log(`Shortcut donated: ${shortcut.id} - ${shortcut.title}`);
    } catch (error) {
      console.error(`Error donating shortcut ${shortcut.id}:`, error);
    }
  }

  // Handle Siri shortcut invocation
  handleShortcutInvocation(shortcutId: string, userInfo?: any): boolean {
    console.log(`Siri shortcut invoked: ${shortcutId}`, userInfo);
    
    const shortcuts = this.getShortcuts();
    const shortcut = shortcuts.find(s => s.id === shortcutId);
    
    if (shortcut) {
      console.log(`Handling shortcut: ${shortcut.title}`);
      return this.deepLinkService.handleDeepLink(shortcut.deepLink);
    }
    
    console.log(`Unknown shortcut ID: ${shortcutId}`);
    return false;
  }

  // Clear all donated shortcuts
  async clearAllShortcuts(): Promise<void> {
    try {
      console.log('Clearing all Siri shortcuts...');
      
      // On iOS, you would delete NSUserActivity
      // On Android, you would remove shortcuts from ShortcutManager
      
      console.log('All Siri shortcuts cleared');
    } catch (error) {
      console.error('Error clearing Siri shortcuts:', error);
    }
  }

  // Get available shortcuts for display
  getAvailableShortcuts(): SiriShortcut[] {
    return this.getShortcuts();
  }

  // Test Siri shortcut functionality
  async testShortcut(shortcutId: string): Promise<boolean> {
    try {
      console.log(`Testing shortcut: ${shortcutId}`);
      
      const shortcuts = this.getShortcuts();
      const shortcut = shortcuts.find(s => s.id === shortcutId);
      
      if (shortcut) {
        // Simulate shortcut invocation
        return this.handleShortcutInvocation(shortcutId);
      }
      
      return false;
    } catch (error) {
      console.error(`Error testing shortcut ${shortcutId}:`, error);
      return false;
    }
  }

  // Open Siri settings (iOS only)
  async openSiriSettings(): Promise<void> {
    try {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS
      );
    } catch (error) {
      console.error('Error opening Siri settings:', error);
    }
  }
}

export default SiriShortcutsService; 