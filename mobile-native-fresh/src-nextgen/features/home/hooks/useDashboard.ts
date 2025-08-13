import { useState, useEffect, useCallback } from 'react';
import { DashboardConfig, DashboardStats, QuickAction } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';
import { useAppStore } from '../../../state/store';

export const useDashboard = () => {
  const { user } = useAppStore();
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDashboard();
    }
  }, [user?.id]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [configData, statsData, actionsData] = await Promise.all([
        dashboardService.getDashboardConfig(),
        dashboardService.getDashboardStats(),
        dashboardService.getQuickActions(),
      ]);

      setConfig(configData);
      setStats(statsData);
      setQuickActions(actionsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      setRefreshing(true);
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  const updateConfig = async (updates: Partial<DashboardConfig>) => {
    try {
      const updatedConfig = await dashboardService.updateDashboardConfig(updates);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dashboard config');
      throw err;
    }
  };

  const reorderSections = async (sectionIds: string[]) => {
    try {
      const updatedConfig = await dashboardService.reorderSections(sectionIds);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder sections');
      throw err;
    }
  };

  const toggleSectionVisibility = async (sectionId: string) => {
    try {
      const updatedConfig = await dashboardService.toggleSectionVisibility(sectionId);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle section visibility');
      throw err;
    }
  };

  return {
    config,
    stats,
    quickActions,
    loading,
    error,
    refreshing,
    refreshDashboard,
    updateConfig,
    reorderSections,
    toggleSectionVisibility,
  };
};
