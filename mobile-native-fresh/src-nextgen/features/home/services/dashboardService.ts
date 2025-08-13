import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardConfig, DashboardStats, QuickAction } from '../types/dashboard';
import { useAppStore } from '../../../state/store';

const DASHBOARD_CONFIG_KEY = '@thoughtmarks_dashboard_config';

class DashboardService {
  private defaultConfig: DashboardConfig = {
    sections: [
      {
        id: 'recent-thoughtmarks',
        type: 'recent',
        title: 'Recent Thoughtmarks',
        visible: true,
        order: 1,
        config: { limit: 5 },
      },
      {
        id: 'tasks',
        type: 'tasks',
        title: 'Tasks',
        visible: true,
        order: 2,
        config: { showCompleted: false, limit: 3 },
      },
      {
        id: 'quick-actions',
        type: 'quick-actions',
        title: 'Quick Actions',
        visible: true,
        order: 3,
        config: { columns: 2 },
      },
      {
        id: 'stats',
        type: 'stats',
        title: 'Statistics',
        visible: true,
        order: 4,
        config: { showCharts: true },
      },
      {
        id: 'insights',
        type: 'insights',
        title: 'AI Insights',
        visible: true,
        order: 5,
        config: { limit: 2 },
      },
    ],
    layout: 'list',
    theme: 'auto',
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  };

  async getDashboardConfig(): Promise<DashboardConfig> {
    try {
      const stored = await AsyncStorage.getItem(DASHBOARD_CONFIG_KEY);
      if (stored) {
        return { ...this.defaultConfig, ...JSON.parse(stored) };
      }
      return this.defaultConfig;
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
      return this.defaultConfig;
    }
  }

  async updateDashboardConfig(config: Partial<DashboardConfig>): Promise<DashboardConfig> {
    try {
      const currentConfig = await this.getDashboardConfig();
      const updatedConfig = { ...currentConfig, ...config };
      await AsyncStorage.setItem(DASHBOARD_CONFIG_KEY, JSON.stringify(updatedConfig));
      return updatedConfig;
    } catch (error) {
      console.error('Failed to update dashboard config:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const store = useAppStore.getState();
    const thoughtmarks = store.thoughtmarks;
    const tasks = store.tasks;

    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;

    // Calculate recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = thoughtmarks.filter(t => new Date(t.createdAt) > weekAgo).length;

    return {
      totalThoughtmarks: thoughtmarks.length,
      completedTasks,
      pendingTasks,
      recentActivity,
      storageUsed: 0, // Placeholder
      storageLimit: 1000000000, // 1GB placeholder
    };
  }

  async getQuickActions(): Promise<QuickAction[]> {
    return [
      {
        id: 'new-thoughtmark',
        title: 'New Thoughtmark',
        icon: 'add-circle',
        action: 'create-thoughtmark',
      },
      {
        id: 'new-task',
        title: 'New Task',
        icon: 'checkbox',
        action: 'create-task',
      },
      {
        id: 'voice-record',
        title: 'Voice Record',
        icon: 'mic',
        action: 'voice-record',
        requiresPremium: true,
      },
      {
        id: 'ai-insights',
        title: 'AI Insights',
        icon: 'bulb',
        action: 'ai-insights',
        requiresPremium: true,
      },
      {
        id: 'search',
        title: 'Search',
        icon: 'search',
        action: 'search',
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: 'settings',
        action: 'settings',
      },
    ];
  }

  async reorderSections(sectionIds: string[]): Promise<DashboardConfig> {
    try {
      const config = await this.getDashboardConfig();
      const updatedSections = config.sections.map(section => {
        const newOrder = sectionIds.indexOf(section.id);
        if (newOrder !== -1) {
          return { ...section, order: newOrder + 1 };
        }
        return section;
      });

      return this.updateDashboardConfig({ sections: updatedSections });
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      throw error;
    }
  }

  async toggleSectionVisibility(sectionId: string): Promise<DashboardConfig> {
    try {
      const config = await this.getDashboardConfig();
      const updatedSections = config.sections.map(section =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      );

      return this.updateDashboardConfig({ sections: updatedSections });
    } catch (error) {
      console.error('Failed to toggle section visibility:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
