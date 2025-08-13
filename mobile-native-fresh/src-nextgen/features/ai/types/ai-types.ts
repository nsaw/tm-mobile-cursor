export interface AIInsight {
  id: string;
  type: 'productivity' | 'organization' | 'learning' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  expiresAt?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'content' | 'organization' | 'productivity' | 'learning';
  title: string;
  description: string;
  confidence: number;
  relatedItems: string[];
  tags: string[];
  createdAt: string;
}

export interface AISortingRule {
  id: string;
  name: string;
  criteria: Record<string, any>;
  priority: number;
  enabled: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tutorial' | 'guide';
  url?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
}
