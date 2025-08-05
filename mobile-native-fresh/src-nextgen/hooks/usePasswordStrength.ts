import { useState, useCallback } from 'react';

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  meetsRequirements: boolean;
}

export function usePasswordStrength(): {
  passwordStrength: PasswordStrength;
  validatePassword: (password: string, requirements: PasswordRequirements) => PasswordStrength;
} {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    meetsRequirements: false,
  });

  const validatePassword = useCallback((password: string, requirements: PasswordRequirements): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= requirements.minLength) {
      score += 1;
    } else {
      feedback.push(`At least ${requirements.minLength} characters`);
    }

    // Uppercase check
    if (!requirements.requireUppercase || /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    // Lowercase check
    if (!requirements.requireLowercase || /[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    // Numbers check
    if (!requirements.requireNumbers || /\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    // Special characters check
    if (!requirements.requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character');
    }

    const strength: PasswordStrength = {
      score,
      feedback,
      meetsRequirements: score >= 3,
    };

    setPasswordStrength(strength);
    return strength;
  }, []);

  return {
    passwordStrength,
    validatePassword,
  };
} 
