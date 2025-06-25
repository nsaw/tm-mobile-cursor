import express from 'express';

import { userController } from '../controllers/userController';

const router = express.Router();

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/by-firebase/:uid', userController.getByFirebase);

// User management routes
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// User preferences
router.patch('/:id/preferences', userController.updatePreferences);

export default router; 