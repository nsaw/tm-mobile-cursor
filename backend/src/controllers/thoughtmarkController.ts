import { Request, Response, NextFunction } from 'express';
import { thoughtmarkService } from '../services/thoughtmarkService';
import { logger } from '../utils/logger';

export const thoughtmarkController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const thoughtmarks = await thoughtmarkService.getAllByUserId(userId);
      res.json(thoughtmarks);
    } catch (error) {
      logger.error('Error fetching thoughtmarks:', error);
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const thoughtmark = await thoughtmarkService.getById(parseInt(id), userId);
      
      if (!thoughtmark) {
        return res.status(404).json({ error: 'Thoughtmark not found' });
      }

      res.json(thoughtmark);
    } catch (error) {
      logger.error('Error fetching thoughtmark:', error);
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const thoughtmark = await thoughtmarkService.create({
        ...req.body,
        userId,
      });

      logger.info('Thoughtmark created:', { id: thoughtmark.id, userId });
      res.status(201).json(thoughtmark);
    } catch (error) {
      logger.error('Error creating thoughtmark:', error);
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const thoughtmark = await thoughtmarkService.update(
        parseInt(id),
        userId,
        req.body
      );

      if (!thoughtmark) {
        return res.status(404).json({ error: 'Thoughtmark not found' });
      }

      logger.info('Thoughtmark updated:', { id: thoughtmark.id, userId });
      res.json(thoughtmark);
    } catch (error) {
      logger.error('Error updating thoughtmark:', error);
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const success = await thoughtmarkService.delete(parseInt(id), userId);

      if (!success) {
        return res.status(404).json({ error: 'Thoughtmark not found' });
      }

      logger.info('Thoughtmark deleted:', { id, userId });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting thoughtmark:', error);
      next(error);
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const results = await thoughtmarkService.search(query, userId);
      res.json(results);
    } catch (error) {
      logger.error('Error searching thoughtmarks:', error);
      next(error);
    }
  },
};