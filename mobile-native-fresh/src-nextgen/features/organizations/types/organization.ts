export interface Organization {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  website?: string;
  memberCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  avatar?: string;
}
