import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../db/schema';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const userController = {
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // In a real app, you'd get the user ID from the JWT token
      const userId = req.user?.userId || 1;
      
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = user[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 1;
      const updates = req.body;

      const updatedUser = await db.update(users)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      if (updatedUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = updatedUser[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async getByFirebase(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.params;
      
      if (!uid) {
        res.status(400).json({
          success: false,
          error: 'Firebase UID is required'
        });
        return;
      }

      const user = await db.select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
      
      if (user.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = user[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Get user by Firebase UID error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
      
      if (user.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = user[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedUser = await db.update(users)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (updatedUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = updatedUser[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedUser = await db.delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (deletedUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const preferences = req.body;

      const updatedUser = await db.update(users)
        .set({
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (updatedUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully'
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },
}; 