export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class InputValidator {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!this.emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (!this.passwordRegex.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateThoughtmarkContent(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Content cannot be empty');
    } else if (content.length > 10000) {
      errors.push('Content cannot exceed 10,000 characters');
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(content)) {
        errors.push('Content contains potentially harmful code');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateInput(input: any, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      if (!rule.test(input)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const inputValidator = new InputValidator();
