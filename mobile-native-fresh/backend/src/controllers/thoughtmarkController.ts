import { Request, Response } from 'express';
import { db } from '../db';
import { thoughtmarks } from '../db/schema';
import { eq, and, like, or } from 'drizzle-orm';

export const thoughtmarkController = {
  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1;
      
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;

      const thoughtmark = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .where(eq(thoughtmarks.isDeleted, false))
        .limit(1);
      
      if (thoughtmark.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
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

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1;
      const { title, content, tags, binId, isTask, dueDate } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        });
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

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;
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
        return res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;

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
        return res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
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

  async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const userId = (req as any).user?.userId || 1;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
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

  async togglePin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;

      const thoughtmark = await db.select().from(thoughtmarks)
        .where(eq(thoughtmarks.id, parseInt(id)))
        .where(eq(thoughtmarks.userId, userId))
        .limit(1);

      if (thoughtmark.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Thoughtmark not found'
        });
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