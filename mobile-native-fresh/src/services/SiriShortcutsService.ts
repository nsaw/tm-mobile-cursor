import { donateShortcut, clearAllShortcuts, SiriShortcutsEvent } from 'react-native-siri-shortcut';

export interface SiriShortcutData {
  activityType: string;
  title: string;
  userInfo?: Record<string, any>;
  keywords?: string[];
  persistentIdentifier: string;
  isEligibleForSearch: boolean;
  isEligibleForPrediction: boolean;
  suggestedInvocationPhrase: string;
}

export class SiriShortcutsService {
  private static instance: SiriShortcutsService;
  private listeners: Array<{ activityType: string; callback: (userInfo: any) => void }> = [];

  static getInstance(): SiriShortcutsService {
    if (!SiriShortcutsService.instance) {
      SiriShortcutsService.instance = new SiriShortcutsService();
    }
    return SiriShortcutsService.instance;
  }

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    SiriShortcutsEvent.addListener('SiriShortcutListener', (userInfo) => {
      const { activityType } = userInfo;
      const listener = this.listeners.find(l => l.activityType === activityType);
      if (listener) {
        listener.callback(userInfo);
      }
    });
  }

  // Donate a shortcut for creating a new thoughtmark
  async donateCreateThoughtmarkShortcut() {
    try {
      await donateShortcut({
        activityType: 'com.thoughtmarks.createThoughtmark',
        title: 'Add a new thoughtmark',
        userInfo: {
          action: 'createThoughtmark',
          timestamp: Date.now(),
        },
        keywords: ['thoughtmark', 'note', 'add', 'create', 'idea'],
        persistentIdentifier: 'create-thoughtmark',
        isEligibleForSearch: true,
        isEligibleForPrediction: true,
        suggestedInvocationPhrase: 'Add a new thoughtmark',
      });
      console.log('Siri Shortcut donated: Create Thoughtmark');
    } catch (error) {
      console.error('Error donating Siri shortcut:', error);
    }
  }

  // Donate a shortcut for voice recording
  async donateVoiceRecordShortcut() {
    try {
      await donateShortcut({
        activityType: 'com.thoughtmarks.voiceRecord',
        title: 'Record a voice note',
        userInfo: {
          action: 'voiceRecord',
          timestamp: Date.now(),
        },
        keywords: ['voice', 'record', 'note', 'audio', 'speak'],
        persistentIdentifier: 'voice-record',
        isEligibleForSearch: true,
        isEligibleForPrediction: true,
        suggestedInvocationPhrase: 'Record a voice note',
      });
      console.log('Siri Shortcut donated: Voice Record');
    } catch (error) {
      console.error('Error donating Siri shortcut:', error);
    }
  }

  // Donate a shortcut for viewing tasks
  async donateViewTasksShortcut() {
    try {
      await donateShortcut({
        activityType: 'com.thoughtmarks.viewTasks',
        title: 'View my tasks',
        userInfo: {
          action: 'viewTasks',
          timestamp: Date.now(),
        },
        keywords: ['tasks', 'todo', 'list', 'view', 'check'],
        persistentIdentifier: 'view-tasks',
        isEligibleForSearch: true,
        isEligibleForPrediction: true,
        suggestedInvocationPhrase: 'Show my tasks',
      });
      console.log('Siri Shortcut donated: View Tasks');
    } catch (error) {
      console.error('Error donating Siri shortcut:', error);
    }
  }

  // Donate a shortcut for searching thoughtmarks
  async donateSearchShortcut() {
    try {
      await donateShortcut({
        activityType: 'com.thoughtmarks.search',
        title: 'Search thoughtmarks',
        userInfo: {
          action: 'search',
          timestamp: Date.now(),
        },
        keywords: ['search', 'find', 'lookup', 'thoughtmark'],
        persistentIdentifier: 'search-thoughtmarks',
        isEligibleForSearch: true,
        isEligibleForPrediction: true,
        suggestedInvocationPhrase: 'Search my thoughtmarks',
      });
      console.log('Siri Shortcut donated: Search');
    } catch (error) {
      console.error('Error donating Siri shortcut:', error);
    }
  }

  // Add a listener for shortcut invocations
  addListener(activityType: string, callback: (userInfo: any) => void) {
    this.listeners.push({ activityType, callback });
  }

  // Remove a listener
  removeListener(activityType: string) {
    this.listeners = this.listeners.filter(l => l.activityType !== activityType);
  }

  // Clear all shortcuts
  async clearAllShortcuts() {
    try {
      await clearAllShortcuts();
      console.log('All Siri shortcuts cleared');
    } catch (error) {
      console.error('Error clearing Siri shortcuts:', error);
    }
  }

  // Donate all shortcuts
  async donateAllShortcuts() {
    await Promise.all([
      this.donateCreateThoughtmarkShortcut(),
      this.donateVoiceRecordShortcut(),
      this.donateViewTasksShortcut(),
      this.donateSearchShortcut(),
    ]);
  }
}

export default SiriShortcutsService.getInstance(); 