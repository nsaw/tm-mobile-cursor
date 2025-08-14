export interface Thoughtmark {
  id: string;
  content: string;
  type: 'note' | 'task' | 'reminder';
  tags?: string[];
  binId?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  aiInsights?: {
    summary?: string;
    confidence: number;
    suggestions?: string[];
  };
}

export interface CreateThoughtmarkRequest {
  content: string;
  type?: 'note' | 'task' | 'reminder';
  tags?: string[];
  binId?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateThoughtmarkRequest {
  content?: string;
  type?: 'note' | 'task' | 'reminder';
  tags?: string[];
  binId?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
