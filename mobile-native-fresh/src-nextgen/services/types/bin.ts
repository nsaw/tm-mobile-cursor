export interface Bin {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  thoughtmarkCount?: number;
}

export interface CreateBinRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBinRequest {
  name?: string;
  description?: string;
  color?: string;
}
