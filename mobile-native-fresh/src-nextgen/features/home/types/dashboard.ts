export interface DashboardSection {
  id: string;
  type: 'recent' | 'pinned' | 'tasks' | 'insights' | 'quick-actions' | 'stats';
  title: string;
  visible: boolean;
  order: number;
  config: Record<string, any>;
}

export interface DashboardConfig {
  sections: DashboardSection[];
  layout: 'grid' | 'list' | 'compact';
  theme: 'light' | 'dark' | 'auto';
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface DashboardStats {
  totalThoughtmarks: number;
  completedTasks: number;
  pendingTasks: number;
  recentActivity: number;
  storageUsed: number;
  storageLimit: number;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: string;
  params?: Record<string, any>;
  requiresPremium?: boolean;
}
