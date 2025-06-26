import express from 'express';

import { thoughtmarkController } from '../controllers/thoughtmarkController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Thoughtmark management routes
router.use(authMiddleware);
router.get('/', thoughtmarkController.getAll);
router.post('/', thoughtmarkController.create);
router.get('/:id', thoughtmarkController.getById);
router.patch('/:id', thoughtmarkController.update);
router.delete('/:id', thoughtmarkController.delete);

// Search route
router.get('/search', thoughtmarkController.search);

// Toggle routes
router.post('/:id/toggle-pin', thoughtmarkController.togglePin);

export default router;