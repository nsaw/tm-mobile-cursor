import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'thoughtmarks-backend'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Thoughtmarks Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Thoughtmarks backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 