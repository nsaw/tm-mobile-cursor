import { Request, Response } from 'express';
import { eq, like, or } from 'drizzle-orm';

import { db } from '../db';
import { thoughtmarks } from '../db/schema';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const thoughtmarkController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 1;
      
      const userThoughtmarks = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false));
      
      res.json({
        success: true,
        data: userThoughtmarks
      });
    } catch (error) {
      console.error('Get thoughtmarks error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || 1;

      const thoughtmark = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false))
        .limit(1);
      
      if (thoughtmark.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
        return;
      }

      res.json({
        success: true,
        data: thoughtmark[0]
      });
    } catch (error) {
      console.error('Get thoughtmark error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 1;
      const { title, content, tags, binId, isTask, dueDate } = req.body;

      if (!title || !content) {
        res.status(400).json({
          success: false,
          error: 'Title and content are required'
        });
        return;
      }

      const newThoughtmark = await db.insert(thoughtmarks).values({
        title,
        content,
        tags: tags || [],
        binId,
        userId,
        isTask: isTask || false,
        isCompleted: false,
        isPinned: false,
        isDeleted: false,
        dueDate,
        sortOrder: 0,
      }).returning();

      res.status(201).json({
        success: true,
        data: newThoughtmark[0]
      });
    } catch (error) {
      console.error('Create thoughtmark error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || 1;
      const updates = req.body;

      const updatedThoughtmark = await db.update(thoughtmarks)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .returning();

      if (updatedThoughtmark.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedThoughtmark[0]
      });
    } catch (error) {
      console.error('Update thoughtmark error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || 1;

      const deletedThoughtmark = await db.update(thoughtmarks)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .returning();

      if (deletedThoughtmark.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Thoughtmark deleted successfully'
      });
    } catch (error) {
      console.error('Delete thoughtmark error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async search(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      const userId = req.user?.userId || 1;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
        return;
      }

      const results = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false))
        .where(
          or(
            like(thoughtmarks.title, `%${query}%`),
            like(thoughtmarks.content, `%${query}%`)
          )
        );

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Search thoughtmarks error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async togglePin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || 1;

      const thoughtmark = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .limit(1);

      if (thoughtmark.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
        return;
      }

      const updatedThoughtmark = await db.update(thoughtmarks)
        .set({
          isPinned: !thoughtmark[0].isPinned,
          updatedAt: new Date()
        })
        .where(eq(thoughtmarks.id, parseInt(id)))
        .returning();

      res.json({
        success: true,
        data: updatedThoughtmark[0]
      });
    } catch (error) {
      console.error('Toggle pin error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },
}; 