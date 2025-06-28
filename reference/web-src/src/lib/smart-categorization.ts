import type { BinWithCount } from "@shared/schema";

export interface ContentAnalysis {
  suggestedTags: string[];
  suggestedBin: BinWithCount | null;
  confidence: number;
  keywords: string[];
}

export class SmartCategorizationEngine {
  private tagKeywords = {
    meeting: ['meeting', 'call', 'discuss', 'agenda', 'conference', 'zoom', 'teams'],
    idea: ['idea', 'concept', 'thought', 'innovation', 'brainstorm', 'creative'],
    task: ['task', 'todo', 'complete', 'finish', 'deadline', 'urgent', 'priority'],
    project: ['project', 'work', 'development', 'build', 'launch', 'milestone'],
    personal: ['personal', 'life', 'home', 'family', 'health', 'hobby'],
    urgent: ['urgent', 'important', 'asap', 'critical', 'emergency', 'now'],
    learning: ['learn', 'study', 'course', 'book', 'tutorial', 'skill', 'knowledge'],
    finance: ['money', 'budget', 'cost', 'price', 'expense', 'investment', 'salary'],
    health: ['health', 'exercise', 'diet', 'medical', 'doctor', 'fitness', 'wellness'],
    travel: ['travel', 'trip', 'vacation', 'flight', 'hotel', 'destination'],
    food: ['food', 'recipe', 'cook', 'restaurant', 'eat', 'meal', 'dinner'],
    tech: ['technology', 'software', 'app', 'code', 'programming', 'digital', 'ai']
  };

  private binKeywords = {
    'idea': ['idea', 'concept', 'thought', 'innovation', 'creative', 'brainstorm'],
    'work': ['work', 'job', 'career', 'office', 'business', 'professional'],
    'personal': ['personal', 'life', 'home', 'family', 'private'],
    'project': ['project', 'build', 'create', 'develop', 'launch'],
    'learning': ['learn', 'study', 'education', 'course', 'skill'],
    'task': ['task', 'todo', 'complete', 'finish', 'action'],
    'goal': ['goal', 'objective', 'target', 'aim', 'achieve'],
    'note': ['note', 'reminder', 'memo', 'record', 'document']
  };

  analyzeContent(content: string, bins: BinWithCount[] = []): ContentAnalysis {
    const cleanContent = content.toLowerCase().trim();
    const words = cleanContent.split(/\s+/);
    
    // Extract keywords
    const keywords = this.extractKeywords(cleanContent);
    
    // Generate tag suggestions
    const suggestedTags = this.generateTagSuggestions(cleanContent, keywords);
    
    // Find best matching bin
    const suggestedBin = this.findBestBin(cleanContent, keywords, bins);
    
    // Calculate confidence based on keyword matches
    const confidence = this.calculateConfidence(cleanContent, keywords, suggestedTags, suggestedBin);
    
    return {
      suggestedTags: suggestedTags.slice(0, 3), // Limit to 3 suggestions
      suggestedBin,
      confidence,
      keywords
    };
  }

  private extractKeywords(content: string): string[] {
    const words = content.split(/\s+/);
    const keywords: string[] = [];
    
    // Find meaningful keywords (longer than 3 characters, not common words)
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'say', 'she', 'use', 'way', 'what', 'with'];
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !commonWords.includes(cleanWord)) {
        keywords.push(cleanWord);
      }
    });
    
    return keywords;
  }

  private generateTagSuggestions(content: string, keywords: string[]): string[] {
    const suggestions: { tag: string; score: number }[] = [];
    
    Object.entries(this.tagKeywords).forEach(([tag, tagWords]) => {
      let score = 0;
      
      tagWords.forEach(tagWord => {
        if (content.includes(tagWord)) {
          score += 2; // Direct match
        }
        
        keywords.forEach(keyword => {
          if (keyword.includes(tagWord) || tagWord.includes(keyword)) {
            score += 1; // Partial match
          }
        });
      });
      
      if (score > 0) {
        suggestions.push({ tag, score });
      }
    });
    
    // Sort by score and return top suggestions
    return suggestions
      .sort((a, b) => b.score - a.score)
      .map(s => s.tag);
  }

  private findBestBin(content: string, keywords: string[], bins: BinWithCount[]): BinWithCount | null {
    if (bins.length === 0) return null;
    
    const binScores: { bin: BinWithCount; score: number }[] = [];
    
    bins.forEach(bin => {
      let score = 0;
      const binName = bin.name.toLowerCase();
      const binDesc = bin.description?.toLowerCase() || '';
      
      // Direct content matches with bin name/description
      if (content.includes(binName.replace(/[^\w\s]/g, ''))) {
        score += 5;
      }
      
      if (binDesc && content.includes(binDesc)) {
        score += 3;
      }
      
      // Keyword-based matching
      Object.entries(this.binKeywords).forEach(([category, categoryWords]) => {
        if (binName.includes(category) || binDesc.includes(category)) {
          categoryWords.forEach(word => {
            if (content.includes(word)) {
              score += 2;
            }
          });
        }
      });
      
      // Semantic similarity with keywords
      keywords.forEach(keyword => {
        if (binName.includes(keyword) || binDesc.includes(keyword)) {
          score += 1;
        }
      });
      
      if (score > 0) {
        binScores.push({ bin, score });
      }
    });
    
    // Return the highest scoring bin if above threshold
    const bestMatch = binScores.sort((a, b) => b.score - a.score)[0];
    return bestMatch && bestMatch.score >= 2 ? bestMatch.bin : null;
  }

  private calculateConfidence(
    content: string, 
    keywords: string[], 
    suggestedTags: string[], 
    suggestedBin: BinWithCount | null
  ): number {
    let confidence = 0;
    
    // Base confidence from content length and quality
    if (content.length > 10) confidence += 0.2;
    if (keywords.length > 2) confidence += 0.2;
    
    // Confidence from tag suggestions
    confidence += Math.min(suggestedTags.length * 0.15, 0.3);
    
    // Confidence from bin suggestion
    if (suggestedBin) confidence += 0.3;
    
    return Math.min(confidence, 1.0);
  }

  // Generate contextual suggestions based on user patterns
  generateContextualSuggestions(recentThoughtmarks: any[] = []): {
    frequentTags: string[];
    frequentBins: string[];
    timeBasedSuggestions: string[];
  } {
    const tagFrequency: Record<string, number> = {};
    const binFrequency: Record<string, number> = {};
    
    // Analyze recent patterns
    recentThoughtmarks.slice(0, 20).forEach(tm => {
      tm.tags?.forEach((tag: string) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
      
      if (tm.binName) {
        binFrequency[tm.binName] = (binFrequency[tm.binName] || 0) + 1;
      }
    });
    
    // Time-based suggestions
    const hour = new Date().getHours();
    const timeBasedSuggestions: string[] = [];
    
    if (hour >= 9 && hour <= 17) {
      timeBasedSuggestions.push('work', 'meeting', 'task');
    } else if (hour >= 18 && hour <= 22) {
      timeBasedSuggestions.push('personal', 'idea', 'learning');
    } else {
      timeBasedSuggestions.push('idea', 'note', 'personal');
    }
    
    return {
      frequentTags: Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag),
      frequentBins: Object.entries(binFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([bin]) => bin),
      timeBasedSuggestions
    };
  }
}

export const smartCategorizationEngine = new SmartCategorizationEngine();