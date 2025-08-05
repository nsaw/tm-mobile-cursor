import { Request, Response } from 'express';

import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response
): void => {
  logger.error('Unhandled error:', error);

  // Default error response
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}; 