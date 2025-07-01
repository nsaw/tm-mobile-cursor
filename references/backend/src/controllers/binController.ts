import { Request, Response } from 'express';
import { db } from '../db';
import { bins } from '../db/schema';
import { eq } from 'drizzle-orm';

export const binController = {
  async getBins(req: Request, res: Response) {
    try {
      // In a real app, you'd get the user ID from the JWT token
      const userId = (req as any).user?.userId || 1;
      
      const userBins = await db.select().from(bins).where(eq(bins.userId, userId));
      
      res.json({
        success: true,
        data: userBins
      });
    } catch (error) {
      console.error('Get bins error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async createBin(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1;
      const { name, description, color, icon, parentBinId } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Bin name is required'
        });
      }

      const newBin = await db.insert(bins).values({
        name,
        description,
        color: color || '#C6D600',
        icon: icon || 'folder',
        userId,
        parentBinId,
        sortOrder: 0,
      }).returning();

      res.status(201).json({
        success: true,
        data: newBin[0]
      });
    } catch (error) {
      console.error('Create bin error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async getBin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;

      const bin = await db.select().from(bins)
        .where(eq(bins.id, parseInt(id)))
        .where(eq(bins.userId, userId))
        .limit(1);
      
      if (bin.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found'
        });
      }

      res.json({
        success: true,
        data: bin[0]
      });
    } catch (error) {
      console.error('Get bin error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async updateBin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;
      const updates = req.body;

      const updatedBin = await db.update(bins)
        .set(updates)
        .where(eq(bins.id, parseInt(id)))
        .where(eq(bins.userId, userId))
        .returning();

      if (updatedBin.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found'
        });
      }

      res.json({
        success: true,
        data: updatedBin[0]
      });
    } catch (error) {
      console.error('Update bin error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async deleteBin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || 1;

      const deletedBin = await db.delete(bins)
        .where(eq(bins.id, parseInt(id)))
        .returning();

      if (deletedBin.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found'
        });
      }

      res.json({
        success: true,
        message: 'Bin deleted successfully'
      });
    } catch (error) {
      console.error('Delete bin error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },
}; 