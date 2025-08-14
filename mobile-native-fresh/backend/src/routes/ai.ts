import express from 'express';
import rateLimit from 'express-rate-limit';

import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

// Extend Request type to include user property
interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: number;
    email: string;
  };
}

const router = express.Router();

// AI-specific rate limiting - more restrictive than general API
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 AI requests per 15 minutes
  message: {
    error: 'AI rate limit exceeded',
    message: 'Too many AI requests. Please wait before making more AI requests.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthenticatedRequest) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.userId?.toString() || req.ip || 'unknown';
  }
});

// Apply AI rate limiting to all AI routes
router.use(aiRateLimiter);

// Apply auth middleware to all AI routes
router.use(authMiddleware);

// POST /api/ai/insights
router.post('/insights', aiController.generateInsights);

// POST /api/ai/smart-sort
router.post('/smart-sort', aiController.smartSort);

// POST /api/ai/recommendations
router.post('/recommendations', aiController.recommendations);

// POST /api/ai/learning-resources
router.post('/learning-resources', aiController.learningResources);

// POST /api/ai/semantic-search
router.post('/semantic-search', aiController.semanticSearch);

// POST /api/ai/search-suggestions
router.post('/search-suggestions', aiController.generateSearchSuggestions);

// POST /api/ai/thoughtmark-suggestions
router.post('/thoughtmark-suggestions', aiController.generateThoughtmarkSuggestions);

// GET /api/ai/test
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'AI route is working.' });
});

export default router; 