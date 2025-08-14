export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  settings?: {
    allowPublicAccess?: boolean;
    requireApproval?: boolean;
    maxMembers?: number;
  };
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  isOwner?: boolean;
  isMember?: boolean;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  settings?: {
    allowPublicAccess?: boolean;
    requireApproval?: boolean;
    maxMembers?: number;
  };
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
