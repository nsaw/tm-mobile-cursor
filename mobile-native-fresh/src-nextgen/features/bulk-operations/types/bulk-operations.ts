export interface BulkOperation {
  id: string;
  type: 'move' | 'delete' | 'tag' | 'untag' | 'archive' | 'export' | 'merge' | 'duplicate';
  targetType: 'thoughtmarks' | 'tasks' | 'bins' | 'tags';
  itemIds: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  results: BulkOperationResult[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkOperationResult {
  itemId: string;
  success: boolean;
  error?: string;
  details?: any;
}

export interface BulkOperationTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  targetType: string;
  parameters: Record<string, any>;
  isSystem: boolean;
}

export interface BulkSelection {
  type: 'thoughtmarks' | 'tasks' | 'bins' | 'tags';
  itemIds: string[];
  filters?: Record<string, any>;
}
