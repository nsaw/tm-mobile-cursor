import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      // In a real app, you'd get the user ID from the JWT token
      const userId = (req as any).user?.userId || 1;
      
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1;
      const updates = req.body;

      const updatedUser = await db.update(users)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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

  async getByFirebase(req: Request, res: Response) {
    try {
      const { uid } = req.params;

      const user = await db.select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
      
      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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
      console.error('Get by Firebase error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
      
      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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

  async updateUser(req: Request, res: Response) {
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
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedUser = await db.delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (deletedUser.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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

  async updatePreferences(req: Request, res: Response) {
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
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
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
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },
}; 