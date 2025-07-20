import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import thoughtmarkRoutes from './routes/thoughtmarks';
import binRoutes from './routes/bins';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/thoughtmarks', thoughtmarkRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Not all who wander are lost... but this page definitely is!`,
    actions: [
      { label: 'Go Back', action: 'back' },
      { label: 'Dashboard', action: 'dashboard' }
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
  });
}).on('error', (error) => {
  logger.error('Server failed to start:', error);
  process.exit(1);
});

export default app;