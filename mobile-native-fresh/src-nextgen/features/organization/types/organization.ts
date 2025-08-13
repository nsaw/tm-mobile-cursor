export interface Bin {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  parentBinId?: string;
  children?: Bin[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface OrganizationItem {
  id: string;
  type: 'thoughtmark' | 'task' | 'note';
  content: string;
  binId?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFilter {
  bins?: string[];
  tags?: string[];
  types?: string[];
  priority?: string[];
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface BulkOperation {
  itemIds: string[];
  operation: 'move' | 'tag' | 'archive' | 'delete';
  targetBinId?: string;
  tags?: string[];
  status?: string;
}

export interface OrganizationStats {
  totalItems: number;
  totalBins: number;
  totalTags: number;
  itemsByBin: Record<string, number>;
  itemsByTag: Record<string, number>;
  itemsByType: Record<string, number>;
  recentActivity: number;
}
