export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  binId: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThoughtmarkWithBin extends Thoughtmark {
  binName?: string;
}

export interface Bin {
  id: string;
  name: string;
  owner: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
} 