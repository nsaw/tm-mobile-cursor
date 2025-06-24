# Thoughtmarks Backend Deployment Guide

## Project Structure

```
src/
├── controllers/    # Request handlers and business logic
├── routes/         # API route definitions
├── middleware/     # Custom middleware functions
├── services/       # Business logic and data access
├── utils/          # Utility functions and helpers
├── types/          # TypeScript type definitions
└── index.ts        # Application entry point
```

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Setup database:
```bash
npm run migrate
```

4. Start development server:
```bash
npm run dev
```

## Production Build

1. Build TypeScript:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Database Management

Run migrations:
```bash
npm run migrate
```

View database in Drizzle Studio:
```bash
npm run db:studio
```

## Docker Deployment

Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY dist ./dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t thoughtmarks-api .
docker run -p 5000:5000 thoughtmarks-api
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Firebase service account key
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `OPENAI_API_KEY`: OpenAI API key
- `JWT_SECRET`: Random secret for JWT signing
- `NODE_ENV`: production/development
- `PORT`: Server port (default: 5000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Cloud Deployment Options

### Railway
```bash
railway login
railway link
railway up
```

### Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Vercel
```bash
vercel
```

### AWS ECS/Fargate
1. Build and push Docker image to ECR
2. Create ECS task definition
3. Deploy to Fargate service

## Monitoring and Logging

The application includes:
- Structured logging with Winston
- Health check endpoint at `/health`
- Request/response logging
- Error tracking and reporting

For production monitoring, consider:
- Application Performance Monitoring (APM)
- Log aggregation (e.g., ELK stack)
- Metrics collection (e.g., Prometheus)
- Alerting (e.g., PagerDuty)
