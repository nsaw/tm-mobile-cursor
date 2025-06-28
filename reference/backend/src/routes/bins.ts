import express from 'express';
import { binController } from '../controllers/binController';

const router = express.Router();

// Bin management routes
router.get('/', binController.getBins);
router.post('/', binController.createBin);
router.get('/:id', binController.getBin);
router.patch('/:id', binController.updateBin);
router.delete('/:id', binController.deleteBin);

export default router; 