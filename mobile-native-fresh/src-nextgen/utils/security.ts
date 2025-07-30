/**
 * Security utility functions for logging security events and handling security operations
 */

export interface SecurityEvent {
  type: string;
  event: string;
  timestamp: string;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export interface SecurityLogEntry {
  id: string;
  event: SecurityEvent;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  createdAt: string;
}

/**
 * Security event types
 */
export const SecurityEventTypes = {
  AUTHENTICATION: {
    LOGIN_ATTEMPT: 'login_attempt',
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILED: 'login_failed',
    LOGOUT: 'logout',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
    PASSWORD_RESET_COMPLETED: 'password_reset_completed',
    PASSWORD_CHANGED: 'password_changed',
    ACCOUNT_LOCKED: 'account_locked',
    ACCOUNT_UNLOCKED: 'account_unlocked',
  },
  AUTHORIZATION: {
    ACCESS_DENIED: 'access_denied',
    PERMISSION_GRANTED: 'permission_granted',
    PERMISSION_REVOKED: 'permission_revoked',
    ROLE_CHANGED: 'role_changed',
  },
  DATA: {
    DATA_ACCESSED: 'data_accessed',
    DATA_MODIFIED: 'data_modified',
    DATA_DELETED: 'data_deleted',
    DATA_EXPORTED: 'data_exported',
    DATA_IMPORTED: 'data_imported',
  },
  SYSTEM: {
    CONFIGURATION_CHANGED: 'configuration_changed',
    SYSTEM_STARTUP: 'system_startup',
    SYSTEM_SHUTDOWN: 'system_shutdown',
    BACKUP_CREATED: 'backup_created',
    BACKUP_RESTORED: 'backup_restored',
  },
  NETWORK: {
    CONNECTION_ATTEMPT: 'connection_attempt',
    CONNECTION_ESTABLISHED: 'connection_established',
    CONNECTION_FAILED: 'connection_failed',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  },
} as const;

/**
 * Security severity levels
 */
export const SecuritySeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Get current timestamp in ISO format
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Generate unique event ID
 */
const generateEventId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get client information (simplified for mobile)
 */
const getClientInfo = () => {
  return {
    platform: 'mobile',
    userAgent: 'React Native App',
    // In a real implementation, you would get actual device info
    deviceId: 'mobile-device',
  };
};

/**
 * Log security event
 */
export const logSecurityEvent = (
  type: string,
  event: string,
  details?: Record<string, any>,
  severity: keyof typeof SecuritySeverity = 'MEDIUM'
): void => {
  try {
    const securityEvent: SecurityEvent = {
      type,
      event,
      timestamp: getTimestamp(),
      ...getClientInfo(),
      details,
    };

    const logEntry: SecurityLogEntry = {
      id: generateEventId(),
      event: securityEvent,
      severity: SecuritySeverity[severity],
      source: 'mobile-app',
      createdAt: getTimestamp(),
    };

    // In a real implementation, this would be sent to a security logging service
    console.log('Security Event:', JSON.stringify(logEntry, null, 2));

    // You could also store locally for offline logging
    storeSecurityEventLocally(logEntry);

  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

/**
 * Store security event locally for offline logging
 */
const storeSecurityEventLocally = (logEntry: SecurityLogEntry): void => {
  try {
    // In a real implementation, you would store this in AsyncStorage or similar
    // For now, we'll just log it
    console.log('Storing security event locally:', logEntry.id);
  } catch (error) {
    console.error('Failed to store security event locally:', error);
  }
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if an action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if max attempts reached
    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    // Increment attempt count
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts
   */
  clear(): void {
    this.attempts.clear();
  }
}

/**
 * Password strength checker
 */
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one number');
  }

  // Special character check
  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one special character (@$!%*?&)');
  }

  // Common password check (simplified)
  const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
  if (commonPasswords.includes(password.toLowerCase())) {
    score = Math.max(0, score - 2);
    feedback.push('Password is too common');
  }

  return {
    score,
    feedback,
    isStrong: score >= 4,
  };
};

/**
 * Token validation utility
 */
export const validateToken = (token: string, expectedLength = 6): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  if (token.length !== expectedLength) {
    return false;
  }

  // Check if token contains only alphanumeric characters
  if (!/^[A-Za-z0-9]+$/.test(token)) {
    return false;
  }

  return true;
};

/**
 * Sanitize sensitive data for logging
 */
export const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = ['password', 'token', 'secret', 'key', 'pin'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
};

/**
 * Security constants
 */
export const SecurityConstants = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_RESET_TOKEN_LENGTH: 6,
  PASSWORD_RESET_TOKEN_EXPIRY: 30 * 60 * 1000, // 30 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_PASSWORD_AGE: 90 * 24 * 60 * 60 * 1000, // 90 days
} as const; 