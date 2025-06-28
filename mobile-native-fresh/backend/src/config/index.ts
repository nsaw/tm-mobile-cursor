import dotenv from 'dotenv';

import { getDatabaseConfig } from './database';

dotenv.config();

export const config = {
  // Database
  database: getDatabaseConfig(),

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'thoughtmarks-mobile-app-super-secret-jwt-key-2024',
    expiresIn: '7d',
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:8082'],
  },

  // Firebase (for later)
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },

  // OpenAI (for later)
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  // OAuth (for later)
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
    },
  },
}; 