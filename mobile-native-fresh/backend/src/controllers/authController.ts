import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../db/schema';

interface JwtPayload {
  userId: number;
  email: string;
}

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Find user by email
      const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUsers.length === 0) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      const user = existingUsers[0];

      // For now, skip password verification for demo purposes
      // In production, you would verify the password:
      // const isValidPassword = await bcrypt.compare(password, user.password);
      // if (!isValidPassword) {
      //   return res.status(401).json({
      //     success: false,
      //     error: 'Invalid credentials'
      //   });
      // }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            isPremium: user.isPremium,
            isAdmin: user.isAdmin,
            subscriptionStatus: user.subscriptionStatus,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        res.status(409).json({
          success: false,
          error: 'User already exists'
        });
        return;
      }

      // Create new user
      const newUser = await db.insert(users).values({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        displayName: `${firstName || ''} ${lastName || ''}`.trim() || email,
        firebaseUid: `local-${Date.now()}`, // For local auth
        isPremium: false,
        isAdmin: false,
        subscriptionStatus: 'active',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser[0].id, email: newUser[0].email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: newUser[0].id,
            email: newUser[0].email,
            firstName: newUser[0].firstName,
            lastName: newUser[0].lastName,
            displayName: newUser[0].displayName,
            isPremium: newUser[0].isPremium,
            isAdmin: newUser[0].isAdmin,
            subscriptionStatus: newUser[0].subscriptionStatus,
            emailVerified: newUser[0].emailVerified,
            createdAt: newUser[0].createdAt,
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, just return success
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
        return;
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;

      // Generate new access token
      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token: newToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  },

  async demoLogin(req: Request, res: Response): Promise<void> {
    try {
      // Demo login - create a temporary user for testing
      const demoUser = await db.insert(users).values({
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        displayName: 'Demo User',
        firebaseUid: `demo-${Date.now()}`,
        isPremium: true,
        isAdmin: false,
        subscriptionStatus: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const token = jwt.sign(
        { userId: demoUser[0].id, email: demoUser[0].email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: demoUser[0].id,
            email: demoUser[0].email,
            firstName: demoUser[0].firstName,
            lastName: demoUser[0].lastName,
            displayName: demoUser[0].displayName,
            isPremium: demoUser[0].isPremium,
            isAdmin: demoUser[0].isAdmin,
            subscriptionStatus: demoUser[0].subscriptionStatus,
            emailVerified: demoUser[0].emailVerified,
            createdAt: demoUser[0].createdAt,
          },
          token
        }
      });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          error: 'Google ID token is required'
        });
        return;
      }

      // In a real implementation, verify the Google ID token
      // For now, just return a mock response
      res.json({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'google@example.com',
            firstName: 'Google',
            lastName: 'User',
            displayName: 'Google User',
            isPremium: false,
            isAdmin: false,
            subscriptionStatus: 'free',
            emailVerified: true,
            createdAt: new Date(),
          },
          token: 'mock-google-token'
        }
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async appleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { identityToken } = req.body;

      if (!identityToken) {
        res.status(400).json({
          success: false,
          error: 'Apple identity token is required'
        });
        return;
      }

      // In a real implementation, verify the Apple identity token
      // For now, just return a mock response
      res.json({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'apple@example.com',
            firstName: 'Apple',
            lastName: 'User',
            displayName: 'Apple User',
            isPremium: false,
            isAdmin: false,
            subscriptionStatus: 'free',
            emailVerified: true,
            createdAt: new Date(),
          },
          token: 'mock-apple-token'
        }
      });
    } catch (error) {
      console.error('Apple sign-in error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // In a real implementation, send password reset email
      // For now, just return success
      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
        return;
      }

      // In a real implementation, verify the reset token and update password
      // For now, just return success
      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async sendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // In a real implementation, send verification email
      // For now, just return success
      res.json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (error) {
      console.error('Send verification email error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Verification token is required'
        });
        return;
      }

      // In a real implementation, verify the email verification token
      // For now, just return success
      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Token is required'
        });
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;

      // Get user data
      const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

      if (user.length === 0) {
        res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user[0].id,
            email: user[0].email,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            displayName: user[0].displayName,
            isPremium: user[0].isPremium,
            isAdmin: user[0].isAdmin,
            subscriptionStatus: user[0].subscriptionStatus,
            emailVerified: user[0].emailVerified,
            createdAt: user[0].createdAt,
          }
        }
      });
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  }
}; 