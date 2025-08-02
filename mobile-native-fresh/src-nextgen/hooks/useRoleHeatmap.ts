import { useState, useEffect, useCallback } from 'react';

interface RoleHeatmapState {
  enabled: boolean;
  roleStats: Record<string, number>;
  totalElements: number;
  roleCoverage: number;
}

interface UseRoleHeatmapOptions {
  initialEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const useRoleHeatmap = (options: UseRoleHeatmapOptions = {}) => {
  const { initialEnabled = false, onToggle } = options;
  
  const [state, setState] = useState<RoleHeatmapState>({
    enabled: initialEnabled,
    roleStats: {},
    totalElements: 0,
    roleCoverage: 0
  });

  const analyzeRoleDistribution = useCallback(() => {
    // In a real implementation, this would traverse the component tree
    // and analyze role assignments. For now, we'll use mock data.
    const mockStats = {
      'button': 12,
      'text': 45,
      'image': 8,
      'input': 6,
      'container': 23,
      'navigation': 4,
      'list': 15,
      'card': 9,
      'modal': 2,
      'default': 18
    };

    const totalElements = Object.values(mockStats).reduce((sum, count) => sum + count, 0);
    const roleCoverage = Object.keys(mockStats).filter(key => mockStats[key] > 0).length;

    setState(prev => ({
      ...prev,
      roleStats: mockStats,
      totalElements,
      roleCoverage
    }));
  }, []);

  const toggleHeatmap = useCallback(() => {
    const newEnabled = !state.enabled;
    setState(prev => ({ ...prev, enabled: newEnabled }));
    onToggle?.(newEnabled);
  }, [state.enabled, onToggle]);

  const enableHeatmap = useCallback(() => {
    setState(prev => ({ ...prev, enabled: true }));
    onToggle?.(true);
  }, [onToggle]);

  const disableHeatmap = useCallback(() => {
    setState(prev => ({ ...prev, enabled: false }));
    onToggle?.(false);
  }, [onToggle]);

  useEffect(() => {
    if (state.enabled) {
      analyzeRoleDistribution();
    }
  }, [state.enabled, analyzeRoleDistribution]);

  // Development-only: Log role statistics when enabled
  useEffect(() => {
    if (state.enabled && __DEV__) {
      console.log('🔍 Role Heatmap Analysis:', {
        totalElements: state.totalElements,
        roleCoverage: state.roleCoverage,
        roleStats: state.roleStats
      });
    }
  }, [state.enabled, state.totalElements, state.roleCoverage, state.roleStats]);

  return {
    ...state,
    toggleHeatmap,
    enableHeatmap,
    disableHeatmap,
    analyzeRoleDistribution
  };
};

export default useRoleHeatmap; 