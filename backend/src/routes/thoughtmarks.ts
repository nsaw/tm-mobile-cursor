import { Router } from 'express';
import { thoughtmarkController } from '../controllers/thoughtmarkController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { thoughtmarkSchema } from '../types/schemas';

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

// GET /api/thoughtmarks
router.get('/', thoughtmarkController.getAll);

// GET /api/thoughtmarks/:id
router.get('/:id', thoughtmarkController.getById);

// POST /api/thoughtmarks
router.post('/', validateRequest(thoughtmarkSchema), thoughtmarkController.create);

// PUT /api/thoughtmarks/:id
router.put('/:id', validateRequest(thoughtmarkSchema), thoughtmarkController.update);

// DELETE /api/thoughtmarks/:id
router.delete('/:id', thoughtmarkController.delete);

// POST /api/thoughtmarks/search
router.post('/search', thoughtmarkController.search);

export default router;