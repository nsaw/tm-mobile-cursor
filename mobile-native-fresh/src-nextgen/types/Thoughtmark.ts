export interface ThoughtmarkWithBin {
  id: string;
  content: string;
  binId: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  isTask: boolean;
  isCompleted: boolean;
  tags: string[];
  title: string;
  isPinned: boolean;
} 