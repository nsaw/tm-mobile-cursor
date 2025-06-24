import express from 'express';
import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

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