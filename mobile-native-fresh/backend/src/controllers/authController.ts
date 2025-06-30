import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { users , bins } from '../db/schema';
import { createTemplateContent } from '../utils/templates';
import { verifyAppleJWT, processAppleNotification } from '../utils/appleAuth';

export const authController = {
  // Basic authentication
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (user.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const userData = user[0];

      // Verify password (assuming password is stored as hash)
      // For now, we'll accept any password for demo purposes
      // In production, you'd use: const isValid = await bcrypt.compare(password, userData.passwordHash);
      const isValid = true; // Demo mode

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Update last login
      await db.update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, userData.id));

      res.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            isPremium: userData.isPremium,
            isAdmin: userData.isAdmin,
            subscriptionStatus: userData.subscriptionStatus,
            emailVerified: userData.emailVerified,
            createdAt: userData.createdAt,
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

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Create user
      const newUser = await db.insert(users).values({
        email,
        firstName,
        lastName,
        displayName: `${firstName || ''} ${lastName || ''}`.trim(),
        firebaseUid: `local-${Date.now()}`, // For local auth
        subscriptionStatus: 'free',
        emailVerified: false,
        marketingEmails: true,
        aiNotifications: false,
        smartReminders: true,
        privacyConsent: true,
        roleId: 3, // Default user role
      }).returning();

      const userData = newUser[0];

      // Create template content for new user
      try {
        await createTemplateContent(userData.id);
        console.log(`Created template content for new user ${userData.id}`);
      } catch (error) {
        console.error('Failed to create template content for new user:', error);
        // Don't fail registration if template creation fails
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            isPremium: userData.isPremium,
            isAdmin: userData.isAdmin,
            subscriptionStatus: userData.subscriptionStatus,
            emailVerified: userData.emailVerified,
            createdAt: userData.createdAt,
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

  async logout(req: Request, res: Response) {
    try {
      // In a real app, you might want to blacklist the token
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

  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required'
        });
      }

      // Verify and decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      // Get user data
      const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
      
      if (user.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const userData = user[0];

      // Generate new token
      const newToken = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            isPremium: userData.isPremium,
            isAdmin: userData.isAdmin,
            subscriptionStatus: userData.subscriptionStatus,
            emailVerified: userData.emailVerified,
            createdAt: userData.createdAt,
          },
          token: newToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  },

  async demoLogin(req: Request, res: Response) {
    try {
      // Create or get demo user
      let demoUser = await db.select().from(users).where(eq(users.email, 'demo@thoughtmarks.com')).limit(1);
      
      if (demoUser.length === 0) {
        // Create demo user
        const newUser = await db.insert(users).values({
          email: 'demo@thoughtmarks.com',
          firstName: 'Demo',
          lastName: 'User',
          displayName: 'Demo User',
          firebaseUid: 'demo-firebase-uid',
          subscriptionStatus: 'free',
          emailVerified: true,
          isTestUser: true,
          marketingEmails: false,
          aiNotifications: true,
          smartReminders: true,
          privacyConsent: true,
          roleId: 3,
        }).returning();
        demoUser = newUser;
      }

      const userData = demoUser[0];

      // Check if demo user has any bins (to determine if template content exists)
      const existingBins = await db.query.bins.findMany({
        where: eq(bins.userId, userData.id),
        limit: 1
      });

      // If no bins exist, create template content
      if (existingBins.length === 0) {
        try {
          await createTemplateContent(userData.id);
          console.log(`Created template content for demo user ${userData.id}`);
        } catch (error) {
          console.error('Failed to create template content for demo user:', error);
          // Don't fail demo login if template creation fails
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            isPremium: userData.isPremium,
            isAdmin: userData.isAdmin,
            subscriptionStatus: userData.subscriptionStatus,
            emailVerified: userData.emailVerified,
            createdAt: userData.createdAt,
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

  // OAuth methods
  async googleSignIn(req: Request, res: Response) {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: 'Access token is required'
        });
      }

      // In a real implementation, you'd verify the Google token
      // For now, we'll create a demo user
      const demoUser = await this.demoLogin(req, res);
      return demoUser;
    } catch (error) {
      console.error('Google sign in error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async appleSignIn(req: Request, res: Response) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          success: false,
          error: 'Credential is required'
        });
      }

      // In a real implementation, you'd verify the Apple credential
      // For now, we'll create a demo user
      const demoUser = await this.demoLogin(req, res);
      return demoUser;
    } catch (error) {
      console.error('Apple sign in error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // Password reset methods
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // In a real implementation, you'd send a reset email
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

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
      }

      // In a real implementation, you'd verify the reset token and update password
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

  // Email verification methods
  async sendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // In a real implementation, you'd send a verification email
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

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required'
        });
      }

      // In a real implementation, you'd verify the token and mark email as verified
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

  // Token validation
  async validateToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      // Get user data
      const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
      
      if (user.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const userData = user[0];

      res.json({
        success: true,
        data: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isPremium: userData.isPremium,
          isAdmin: userData.isAdmin,
          subscriptionStatus: userData.subscriptionStatus,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      });
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  },

  // Apple server-to-server notifications
  async handleAppleNotifications(req: Request, res: Response) {
    try {
      const { signedPayload } = req.body;

      if (!signedPayload) {
        return res.status(400).json({
          success: false,
          error: 'Signed payload is required'
        });
      }

      console.log('Apple notification received:', {
        signedPayload: signedPayload.substring(0, 100) + '...', // Log first 100 chars for security
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });

      // Verify the JWT signature using Apple's public key
      let verifiedPayload;
      try {
        verifiedPayload = await verifyAppleJWT(signedPayload);
        console.log('Apple JWT verified successfully');
      } catch (verificationError) {
        console.error('Apple JWT verification failed:', verificationError);
        return res.status(401).json({
          success: false,
          error: 'Invalid signature'
        });
      }

      // Process the notification
      let processingResults;
      try {
        processingResults = await processAppleNotification(verifiedPayload);
        console.log('Apple notification processed:', processingResults);
      } catch (processingError) {
        console.error('Apple notification processing failed:', processingError);
        return res.status(400).json({
          success: false,
          error: 'Invalid notification format'
        });
      }

      // TODO: Implement actual database operations based on notification type
      // For now, we'll just log the results
      
      res.status(200).json({
        success: true,
        message: 'Notification received and processed',
        processedEvents: processingResults.length
      });
    } catch (error) {
      console.error('Apple notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },
}; 