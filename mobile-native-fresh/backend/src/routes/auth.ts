import express from 'express';

import { authController } from '../controllers/authController';

const router = express.Router();

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/demo', authController.demoLogin);

// OAuth routes
router.post('/google', authController.googleSignIn);
router.post('/apple', authController.appleSignIn);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Email verification
router.post('/send-verification', authController.sendVerificationEmail);
router.post('/verify-email', authController.verifyEmail);

// Token validation
router.post('/validate', authController.validateToken);

export default router; 