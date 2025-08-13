export interface Thoughtmark {
  id: string;
  content: string;
  type: 'thought' | 'task' | 'note' | 'idea';
  tags: string[];
  binId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'archived';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  aiInsights?: AIInsight[];
  voiceNoteUrl?: string;
  attachments?: Attachment[];
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'analysis' | 'connection';
  content: string;
  confidence: number;
  createdAt: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  name: string;
  size: number;
}

export interface CreateThoughtmarkRequest {
  content: string;
  type: Thoughtmark['type'];
  tags?: string[];
  binId?: string;
  priority?: Thoughtmark['priority'];
  dueDate?: string;
}

export interface UpdateThoughtmarkRequest {
  content?: string;
  type?: Thoughtmark['type'];
  tags?: string[];
  binId?: string;
  priority?: Thoughtmark['priority'];
  status?: Thoughtmark['status'];
  dueDate?: string;
}
