export interface Bin {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  thoughtCount: number;
  isDefault: boolean;
  isArchived: boolean;
}

export interface CreateBinRequest {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateBinRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface BinFilters {
  search?: string;
  includeArchived?: boolean;
  sortBy?: 'name' | 'createdAt' | 'thoughtCount';
  sortOrder?: 'asc' | 'desc';
}
