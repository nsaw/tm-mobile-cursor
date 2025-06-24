import type { ThoughtmarkWithBin } from "@shared/schema";

export interface NotificationSettings {
  dailySummary: boolean;
  onThisDay: boolean;
  recommendations: boolean;
  reminderTime: string; // Format: "HH:MM"
}

export interface DailyNotification {
  type: 'summary' | 'onThisDay' | 'recommendation';
  title: string;
  message: string;
  data?: any;
  scheduledFor: Date;
}

export class NotificationManager {
  private settings: NotificationSettings;
  private storageKey = 'thoughtmarks_notifications';

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load notification settings');
    }

    return {
      dailySummary: true,
      onThisDay: true,
      recommendations: true,
      reminderTime: "09:00"
    };
  }

  saveSettings(settings: NotificationSettings): void {
    this.settings = settings;
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
    this.scheduleNotifications();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  generateDailySummary(thoughtmarks: ThoughtmarkWithBin[]): DailyNotification | null {
    if (!this.settings.dailySummary) return null;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todaysThoughtmarks = thoughtmarks.filter(tm => 
      new Date(tm.createdAt) >= todayStart
    );

    if (todaysThoughtmarks.length === 0) return null;

    const binCounts = todaysThoughtmarks.reduce((acc, tm) => {
      const bin = tm.binName || 'Uncategorized';
      acc[bin] = (acc[bin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBin = Object.entries(binCounts).sort(([,a], [,b]) => b - a)[0];

    return {
      type: 'summary',
      title: 'Daily Thoughtmarks Summary',
      message: `You captured ${todaysThoughtmarks.length} thoughtmarks today. Most active: ${topBin[0]} (${topBin[1]} thoughts)`,
      data: { count: todaysThoughtmarks.length, topBin: topBin[0] },
      scheduledFor: this.getNextReminderTime()
    };
  }

  generateOnThisDayNotification(thoughtmarks: ThoughtmarkWithBin[]): DailyNotification | null {
    if (!this.settings.onThisDay) return null;

    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());

    const historicalThoughtmarks = thoughtmarks.filter(tm => {
      const tmDate = new Date(tm.createdAt);
      const isSameDay = tmDate.getMonth() === today.getMonth() && 
                       tmDate.getDate() === today.getDate();
      const isFromPastYear = tmDate.getFullYear() < today.getFullYear();
      return isSameDay && isFromPastYear;
    });

    if (historicalThoughtmarks.length === 0) return null;

    const mostRecent = historicalThoughtmarks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const yearsAgo = today.getFullYear() - new Date(mostRecent.createdAt).getFullYear();

    return {
      type: 'onThisDay',
      title: `On This Day ${yearsAgo} Year${yearsAgo > 1 ? 's' : ''} Ago`,
      message: `"${mostRecent.title}" - Tap to revisit this thoughtmark`,
      data: { thoughtmark: mostRecent, yearsAgo },
      scheduledFor: this.getNextReminderTime()
    };
  }

  generateRecommendationNotification(thoughtmarks: ThoughtmarkWithBin[]): DailyNotification | null {
    if (!this.settings.recommendations) return null;

    // Analyze recent patterns
    const recentThoughtmarks = thoughtmarks
      .filter(tm => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(tm.createdAt) >= weekAgo;
      })
      .slice(0, 10);

    if (recentThoughtmarks.length < 3) return null;

    // Extract common themes and tags
    const allTags = recentThoughtmarks.flatMap(tm => tm.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    if (topTags.length === 0) return null;

    const recommendations = this.generatePersonalizedRecommendations(topTags);
    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];

    return {
      type: 'recommendation',
      title: 'Personalized Recommendation',
      message: `Based on your recent thoughts about ${topTags.join(', ')}: ${randomRec.title}`,
      data: { recommendation: randomRec, themes: topTags },
      scheduledFor: this.getNextReminderTime()
    };
  }

  private generatePersonalizedRecommendations(themes: string[]) {
    const recommendations = [
      {
        title: "Consider creating a dedicated bin for your recurring themes",
        type: "organization",
        description: "Group related thoughts for better insights"
      },
      {
        title: "Review and connect related thoughtmarks",
        type: "reflection",
        description: "Look for patterns in your thinking"
      },
      {
        title: "Set aside time for deep thinking on these topics",
        type: "scheduling",
        description: "Dedicated focus time for important themes"
      },
      {
        title: "Export your thoughts and share with a trusted friend",
        type: "social",
        description: "External perspective can provide new insights"
      }
    ];

    return recommendations;
  }

  private getNextReminderTime(): Date {
    const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow;
  }

  scheduleNotifications(): void {
    // Clear existing scheduled notifications
    this.clearScheduledNotifications();

    if (!this.settings.dailySummary && !this.settings.onThisDay && !this.settings.recommendations) {
      return;
    }

    // Schedule daily check
    const nextReminder = this.getNextReminderTime();
    const timeUntilReminder = nextReminder.getTime() - Date.now();

    setTimeout(() => {
      this.triggerDailyNotifications();
      // Schedule recurring daily notifications
      setInterval(() => {
        this.triggerDailyNotifications();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilReminder);
  }

  private async triggerDailyNotifications(): Promise<void> {
    if (!(await this.requestPermission())) {
      return;
    }

    // This would typically fetch from your storage/API
    // For now, trigger an event that the app can listen to
    window.dispatchEvent(new CustomEvent('generateDailyNotifications'));
  }

  private clearScheduledNotifications(): void {
    // Clear any existing timeouts/intervals
    // Implementation depends on how notifications are scheduled
  }

  showNotification(notification: DailyNotification): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/generated-icon.png',
      badge: '/generated-icon.png',
      tag: notification.type,
      requireInteraction: true
    });

    browserNotification.onclick = () => {
      window.focus();
      this.handleNotificationClick(notification);
      browserNotification.close();
    };
  }

  private handleNotificationClick(notification: DailyNotification): void {
    switch (notification.type) {
      case 'summary':
        window.location.href = '/?filter=today';
        break;
      case 'onThisDay':
        if (notification.data?.thoughtmark) {
          window.location.href = `/thoughtmarks/${notification.data.thoughtmark.id}`;
        }
        break;
      case 'recommendation':
        window.location.href = '/ai-assistant';
        break;
    }
  }
}

export const notificationManager = new NotificationManager();