import { Request, Response } from 'express';
import { eq, inArray, desc } from 'drizzle-orm';
import OpenAI from 'openai';

import { db } from '../db';
import { thoughtmarks } from '../db/schema';
import { config } from '../config';

console.log('AI CONTROLLER FILE LOADED');

const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Type definitions
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    userId: number;
  };
}

interface Insight {
  type: 'pattern' | 'recommendation' | 'trend' | 'connection';
  title: string;
  description: string;
  actionable: boolean;
  relatedThoughtmarks: number[];
}

interface AIResponse {
  insights: Insight[];
}

interface SmartSortItem {
  id: number;
  title: string;
  content: string;
  sortOrder: number;
}

interface SmartSortResponse {
  smartSort: SmartSortItem[];
}

interface Recommendation {
  title: string;
  description: string;
  relatedThoughtmarks: number[];
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

interface LearningResource {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book';
}

interface LearningResourcesResponse {
  resources: LearningResource[];
}

interface SearchResult {
  id: number;
  title: string;
  content: string;
  relevanceScore: number;
}

interface SearchResultsResponse {
  results: SearchResult[];
}

interface SearchSuggestion {
  query: string;
  reason: string;
}

interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

interface ThoughtmarkSuggestion {
  title: string;
  content: string;
  tags: string[];
}

interface ThoughtmarkSuggestionsResponse {
  suggestions: ThoughtmarkSuggestion[];
}

export const aiController = {
  async generateInsights(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] /api/ai/insights called', { userId: req.user?.id, thoughtmarkIds: req.body.thoughtmarkIds });
      const userId = req.user?.userId || 1;
      const userThoughtmarks = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false));

      console.log('[aiController] Fetched thoughtmarks:', userThoughtmarks);

      if (!userThoughtmarks || userThoughtmarks.length === 0) {
        res.status(200).json({ insights: [] });
        return;
      }

      // Prepare the data for the AI
      const thoughtmarkSummaries = userThoughtmarks.map(tm => `Title: ${tm.title}\nContent: ${tm.content}`).join('\n---\n');
      const prompt = `Analyze the following user thoughtmarks and return a JSON object with an 'insights' array of 3-5 key insights. Each insight must have: type (pattern, recommendation, trend, connection), title (short), description (1-2 sentences), actionable (true/false), relatedThoughtmarks (array of ids). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:

{
  "insights": [
    {
      "type": "pattern",
      "title": "Brief insight title",
      "description": "Detailed explanation.",
      "actionable": true,
      "relatedThoughtmarks": [1,2,3]
    }
  ]
}

User Thoughtmarks:
${thoughtmarkSummaries}`;

      console.log('[aiController] Prompt for OpenAI:', prompt);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert productivity and knowledge management AI. You must respond ONLY with a valid JSON object matching the provided schema. Do not include any commentary, markdown, or extra text.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1200,
        temperature: 0.4,
      });

      console.log('[aiController] Raw OpenAI response:', completion);

      // Parse the JSON response
      let insights: Insight[] = [];
      try {
        const content = completion.choices[0]?.message?.content || '{}';
        const json: AIResponse = JSON.parse(content);
        if (Array.isArray(json.insights)) {
          insights = json.insights;
        } else if (typeof (json as unknown as { summary: string }).summary === 'string') {
          // fallback: split summary into multiple insights by numbered or bulleted list
          const summary = (json as unknown as { summary: string }).summary;
          const parts = summary.split(/\n\d+\.\s|\n-\s|\n•\s/).map((s: string) => s.trim()).filter(Boolean);
          if (parts.length > 1) {
            insights = parts.map((desc: string, idx: number) => ({
              type: 'pattern' as const,
              title: `Insight ${idx + 1}`,
              description: desc,
              actionable: false,
              relatedThoughtmarks: []
            }));
          } else {
            insights = [{ 
              type: 'pattern' as const, 
              title: 'Summary', 
              description: summary, 
              actionable: false, 
              relatedThoughtmarks: [] 
            }];
          }
        }
      } catch (err) {
        // fallback: return empty array
        insights = [];
      }
      console.log('[aiController] Final insights array:', insights);
      res.status(200).json({ insights });
    } catch (error) {
      console.error('Error generating AI insights:', error);
      res.status(500).json({ error: 'Failed to generate AI insights.' });
    }
  },

  async smartSort(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] /api/ai/smart-sort called', { userId: req.user?.id, thoughtmarkIds: req.body.thoughtmarkIds });
      const userId = req.user?.userId || 1;
      const userThoughtmarks = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false));
      console.log('[aiController] Fetched thoughtmarks:', userThoughtmarks);
      if (!userThoughtmarks || userThoughtmarks.length === 0) {
        res.status(200).json({ smartSort: [] });
        return;
      }
      const thoughtmarkSummaries = userThoughtmarks.map(tm => `Title: ${tm.title}\nContent: ${tm.content}`).join('\n---\n');
      const prompt = `Analyze the following user thoughtmarks and return a JSON object with a 'smartSort' array of 3-5 groups. Each group must have: label (string), description (1-2 sentences, use 'you' language), thoughtmarkIds (array of ids). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:\n{\n  \"smartSort\": [\n    {\n      \"label\": \"Group label\",\n      \"description\": \"Description using 'you' language.\",\n      \"thoughtmarkIds\": [1,2,3]\n    }\n  ]\n}\nUser Thoughtmarks:\n${thoughtmarkSummaries}`;
      console.log('[aiController] Prompt for OpenAI (smartSort):', prompt);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert productivity and knowledge management AI. You must respond ONLY with a valid JSON object matching the provided schema. Do not include any commentary, markdown, or extra text.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1200,
        temperature: 0.4,
      });
      console.log('[aiController] Raw OpenAI response (smartSort):', completion);
      let smartSort: SmartSortItem[] = [];
      try {
        const content = completion.choices[0]?.message?.content || '{}';
        const json: SmartSortResponse = JSON.parse(content);
        if (Array.isArray(json.smartSort)) {
          smartSort = json.smartSort;
        }
      } catch (err) {
        smartSort = [];
      }
      console.log('[aiController] Final smartSort array:', smartSort);
      res.status(200).json({ smartSort });
    } catch (error) {
      console.error('Error generating AI smartSort:', error);
      res.status(500).json({ error: 'Failed to generate AI smartSort.' });
    }
  },

  async recommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] /api/ai/recommendations called', { userId: req.user?.id, thoughtmarkIds: req.body.thoughtmarkIds });
      const userId = req.user?.userId || 1;
      const userThoughtmarks = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false));
      console.log('[aiController] Fetched thoughtmarks:', userThoughtmarks);
      if (!userThoughtmarks || userThoughtmarks.length === 0) {
        res.status(200).json({ recommendations: [] });
        return;
      }
      const thoughtmarkSummaries = userThoughtmarks.map(tm => `Title: ${tm.title}\nContent: ${tm.content}`).join('\n---\n');
      const prompt = `Analyze the following user thoughtmarks and return a JSON object with a 'recommendations' array of 3-5 actionable recommendations. Each recommendation must have: title (string), description (1-2 sentences, use 'you' language), relatedThoughtmarks (array of ids). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:\n{\n  \"recommendations\": [\n    {\n      \"title\": \"Recommendation title\",\n      \"description\": \"Description using 'you' language.\",\n      \"relatedThoughtmarks\": [1,2,3]\n    }\n  ]\n}\nUser Thoughtmarks:\n${thoughtmarkSummaries}`;
      console.log('[aiController] Prompt for OpenAI (recommendations):', prompt);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert productivity and knowledge management AI. You must respond ONLY with a valid JSON object matching the provided schema. Do not include any commentary, markdown, or extra text.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1200,
        temperature: 0.4,
      });
      console.log('[aiController] Raw OpenAI response (recommendations):', completion);
      let recommendations: Recommendation[] = [];
      try {
        const content = completion.choices[0]?.message?.content || '{}';
        const json: RecommendationsResponse = JSON.parse(content);
        if (Array.isArray(json.recommendations)) {
          recommendations = json.recommendations;
        }
      } catch (err) {
        recommendations = [];
      }
      console.log('[aiController] Final recommendations array:', recommendations);
      res.status(200).json({ recommendations });
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      res.status(500).json({ error: 'Failed to generate AI recommendations.' });
    }
  },

  async learningResources(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] Learning resources request received');
      
      const thoughtmarkIds = req.body.thoughtmarkIds;
      console.log('[aiController] Thoughtmark IDs:', thoughtmarkIds);

      if (!thoughtmarkIds || !Array.isArray(thoughtmarkIds) || thoughtmarkIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Thoughtmark IDs array is required'
        });
        return;
      }

      // Get thoughtmarks from database
      const userThoughtmarks = await db.select().from(thoughtmarks)
        .where(inArray(thoughtmarks.id, thoughtmarkIds.map((id: string | number) => parseInt(String(id)))));

      if (userThoughtmarks.length === 0) {
        res.status(404).json({
          success: false,
          error: 'No thoughtmarks found'
        });
        return;
      }

      console.log('[aiController] Found thoughtmarks:', userThoughtmarks.length);

      // Format thoughtmarks for AI
      const formattedThoughtmarks = userThoughtmarks.map((t) => 
        `Title: ${t.title}\nContent: ${t.content}`
      ).join('\n---\n');

      const prompt = `Analyze the following user thoughtmarks and return a JSON object with a 'learningResources' array of 3-5 recommended resources. Each resource must have: title (string), url (string), description (1-2 sentences, use 'you' language), relatedThoughtmarks (array of ids). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:
{
  "learningResources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "description": "Description using 'you' language.",
      "relatedThoughtmarks": [1,2,3]
    }
  ]
}
User Thoughtmarks:
${formattedThoughtmarks}`;

      console.log('[aiController] Prompt for OpenAI (learningResources):', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that analyzes user thoughtmarks and provides relevant learning resources. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      console.log('[aiController] Raw OpenAI response (learningResources):', completion);

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      let learningResources: LearningResource[] = [];
      try {
        const json: LearningResourcesResponse = JSON.parse(responseText);
        if (Array.isArray(json.resources)) {
          learningResources = json.resources;
        }
      } catch (parseError) {
        console.error('[aiController] JSON parse error:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      console.log('[aiController] Final learningResources array:', learningResources);

      res.json({
        success: true,
        data: learningResources
      });

    } catch (error) {
      console.error('[aiController] Learning resources error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate learning resources'
      });
    }
  },

  async semanticSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] Semantic search request received');
      
      const { query } = req.body;
      console.log('[aiController] Search query:', query);

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      // Get all thoughtmarks for semantic search
      const allThoughtmarks = await db.select().from(thoughtmarks);

      if (allThoughtmarks.length === 0) {
        return res.json({
          success: true,
          data: { results: [] }
        });
      }

      console.log('[aiController] Found thoughtmarks for search:', allThoughtmarks.length);

      // Format thoughtmarks for AI
      const formattedThoughtmarks = allThoughtmarks.map((t) => 
        `ID: ${t.id}\nTitle: ${t.title}\nContent: ${t.content}`
      ).join('\n---\n');

      const prompt = `Given the search query "${query}", analyze the following thoughtmarks and return a JSON object with a 'results' array of the most semantically relevant thoughtmarks. Each result should have: id (number), title (string), content (string), relevanceScore (number 0-1). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:
{
  "results": [
    {
      "id": 1,
      "title": "Thoughtmark title",
      "content": "Thoughtmark content",
      "relevanceScore": 0.95
    }
  ]
}
Available Thoughtmarks:
${formattedThoughtmarks}`;

      console.log('[aiController] Prompt for OpenAI (semanticSearch):', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that performs semantic search on thoughtmarks. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      console.log('[aiController] Raw OpenAI response (semanticSearch):', completion);

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      let searchResults: SearchResult[] = [];
      try {
        const json: SearchResultsResponse = JSON.parse(responseText);
        if (Array.isArray(json.results)) {
          searchResults = json.results;
        }
      } catch (parseError) {
        console.error('[aiController] JSON parse error:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      console.log('[aiController] Final search results:', searchResults);

      res.json({
        success: true,
        data: searchResults
      });

    } catch (error) {
      console.error('[aiController] Semantic search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform semantic search'
      });
    }
  },

  async generateSearchSuggestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] Generate search suggestions request received');

      // Get recent thoughtmarks for context
      const recentThoughtmarks = await db.select().from(thoughtmarks)
        .orderBy(desc(thoughtmarks.createdAt))
        .limit(10);

      if (recentThoughtmarks.length === 0) {
        return res.json({
          success: true,
          data: { suggestions: [] }
        });
      }

      console.log('[aiController] Found recent thoughtmarks:', recentThoughtmarks.length);

      // Format thoughtmarks for AI
      const formattedThoughtmarks = recentThoughtmarks.map((t) => 
        `Title: ${t.title}\nContent: ${t.content}`
      ).join('\n---\n');

      const prompt = `Based on the following recent thoughtmarks, generate 3-5 search suggestions that would help the user find related content. Each suggestion should have: query (string), reason (string explaining why this search would be useful). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:
{
  "suggestions": [
    {
      "query": "search term",
      "reason": "This search would help find related content about..."
    }
  ]
}
Recent Thoughtmarks:
${formattedThoughtmarks}`;

      console.log('[aiController] Prompt for OpenAI (searchSuggestions):', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that generates search suggestions based on user content. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      console.log('[aiController] Raw OpenAI response (searchSuggestions):', completion);

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      let suggestions: SearchSuggestion[] = [];
      try {
        const json: SearchSuggestionsResponse = JSON.parse(responseText);
        if (Array.isArray(json.suggestions)) {
          suggestions = json.suggestions;
        }
      } catch (parseError) {
        console.error('[aiController] JSON parse error:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      console.log('[aiController] Final search suggestions:', suggestions);

      res.json({
        success: true,
        data: suggestions
      });

    } catch (error) {
      console.error('[aiController] Generate search suggestions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate search suggestions'
      });
    }
  },

  async generateThoughtmarkSuggestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('[aiController] Generate thoughtmark suggestions request received');
      
      const { content, title, tags } = req.body;
      console.log('[aiController] Content length:', content?.length);
      console.log('[aiController] Title:', title);
      console.log('[aiController] Tags:', tags);

      if (!content || typeof content !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      const prompt = `Analyze the following thoughtmark content and provide suggestions for improvement. Return a JSON object with: suggestedTitle (string), suggestedTags (array of 3-5 relevant tags), contentSuggestions (array of 2-3 ideas to expand the content). Respond ONLY with a valid JSON object in this format, with no extra text or markdown:
{
  "suggestedTitle": "A concise, descriptive title",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "contentSuggestions": [
    "Suggestion to expand the content...",
    "Another idea to consider..."
  ]
}
Content: ${content}
${title ? `Current Title: ${title}` : ''}
${tags && tags.length > 0 ? `Current Tags: ${tags.join(', ')}` : ''}`;

      console.log('[aiController] Prompt for OpenAI (thoughtmarkSuggestions):', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that provides suggestions for improving thoughtmarks. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      console.log('[aiController] Raw OpenAI response (thoughtmarkSuggestions):', completion);

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      let suggestions: ThoughtmarkSuggestion[] = [];
      try {
        const json: ThoughtmarkSuggestionsResponse = JSON.parse(responseText);
        if (Array.isArray(json.suggestions)) {
          suggestions = json.suggestions;
        }
      } catch (parseError) {
        console.error('[aiController] JSON parse error:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      console.log('[aiController] Final thoughtmark suggestions:', suggestions);

      res.json({
        success: true,
        data: suggestions
      });

    } catch (error) {
      console.error('[aiController] Generate thoughtmark suggestions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate thoughtmark suggestions'
      });
    }
  }
}; 