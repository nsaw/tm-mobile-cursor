import express from 'express';
import { thoughtmarkController } from '../controllers/thoughtmarkController';

const router = express.Router();

// Thoughtmark management routes
router.get('/', thoughtmarkController.getAll);
router.post('/', thoughtmarkController.create);
router.get('/:id', thoughtmarkController.getById);
router.patch('/:id', thoughtmarkController.update);
router.delete('/:id', thoughtmarkController.delete);

// Search route
router.get('/search', thoughtmarkController.search);

// Toggle routes
router.post('/:id/toggle-pin', thoughtmarkController.togglePin);
router.post('/:id/toggle-archive', thoughtmarkController.toggleArchive);

export default router;