export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  isSystem: boolean;
}

export interface CreateTagRequest {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
  description?: string;
}

export interface TagFilters {
  search?: string;
  includeSystem?: boolean;
  sortBy?: 'name' | 'usageCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
