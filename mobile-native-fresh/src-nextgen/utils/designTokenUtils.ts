/**
 * Design Token Utilities
 * 
 * Utility functions for working with design tokens, including token access,
 * validation, conversion, and helper functions for common design token operations.
 */

import { DesignTokens, TokenValidationResult, TokenValidationOptions } from '../types/designTokens';

// ============================================================================
// TOKEN ACCESS UTILITIES
// ============================================================================

/**
 * Get a token value by dot-separated path
 * @param tokens - Design tokens object
 * @param path - Dot-separated path to the token (e.g., 'colors.primary.500')
 * @returns The token value or undefined if not found
 */
export function getTokenValue(tokens: DesignTokens, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = tokens;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Set a token value by dot-separated path (creates a new tokens object)
 * @param tokens - Design tokens object
 * @param path - Dot-separated path to the token
 * @param value - New value for the token
 * @returns New design tokens object with the updated value
 */
export function setTokenValue(tokens: DesignTokens, path: string, value: unknown): DesignTokens {
  const keys = path.split('.');
  const newTokens = { ...tokens };
  let current: unknown = newTokens;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(typeof current === 'object' && current !== null && key in (current as Record<string, unknown>)) || typeof (current as Record<string, unknown>)[key] !== 'object') {
      (current as Record<string, unknown>)[key] = {};
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  (current as Record<string, unknown>)[keys[keys.length - 1]] = value;
  return newTokens;
}

/**
 * Check if a token path exists
 * @param tokens - Design tokens object
 * @param path - Dot-separated path to check
 * @returns True if the path exists, false otherwise
 */
export function hasToken(tokens: DesignTokens, path: string): boolean {
  return getTokenValue(tokens, path) !== undefined;
}

// ============================================================================
// TOKEN VALIDATION UTILITIES
// ============================================================================

/**
 * Validate design tokens with comprehensive checks
 * @param tokens - Design tokens object to validate
 * @param options - Validation options
 * @returns Validation result with errors and warnings
 */
export function validateDesignTokens(
  tokens: DesignTokens,
  options: TokenValidationOptions = {}
): TokenValidationResult {
  const {
    strict = true,
    _allowMissing = false,
    validateColors = true,
    validateTypography = true,
    validateSpacing = true,
  } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingTokens: string[] = [];
  const invalidTokens: string[] = [];
  
  // Validate color tokens
  if (validateColors) {
    validateColorTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  }
  
  // Validate typography tokens
  if (validateTypography) {
    validateTypographyTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  }
  
  // Validate spacing tokens
  if (validateSpacing) {
    validateSpacingTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  }
  
  // Validate other token categories
  validateBorderRadiusTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  validateShadowTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  validateAnimationTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  validateBreakpointTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  validateZIndexTokens(tokens, errors, warnings, missingTokens, invalidTokens, strict);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingTokens,
    invalidTokens,
  };
}

function validateColorTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredColorPaths = [
    'colors.primary.500',
    'colors.surface.background',
    'colors.text.primary',
    'colors.border.primary',
  ];
  
  for (const path of requiredColorPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required color token: ${path}`);
      } else {
        warnings.push(`Missing color token: ${path}`);
      }
    } else if (typeof value !== 'string' || !isValidColor(value)) {
      invalidTokens.push(path);
      errors.push(`Invalid color value for ${path}: ${value}`);
    }
  }
}

function validateTypographyTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredTypographyPaths = [
    'typography.fontSize.base',
    'typography.fontWeight.normal',
    'typography.fontFamily.primary',
  ];
  
  for (const path of requiredTypographyPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required typography token: ${path}`);
      } else {
        warnings.push(`Missing typography token: ${path}`);
      }
    }
  }
}

function validateSpacingTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredSpacingPaths = [
    'spacing.base.4',
    'spacing.semantic.md',
  ];
  
  for (const path of requiredSpacingPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required spacing token: ${path}`);
      } else {
        warnings.push(`Missing spacing token: ${path}`);
      }
    } else if (typeof value !== 'number' || value < 0) {
      invalidTokens.push(path);
      errors.push(`Invalid spacing value for ${path}: ${value}`);
    }
  }
}

function validateBorderRadiusTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredBorderRadiusPaths = [
    'borderRadius.base.base',
    'borderRadius.component.button.md',
  ];
  
  for (const path of requiredBorderRadiusPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required border radius token: ${path}`);
      } else {
        warnings.push(`Missing border radius token: ${path}`);
      }
    } else if (typeof value !== 'number' || value < 0) {
      invalidTokens.push(path);
      errors.push(`Invalid border radius value for ${path}: ${value}`);
    }
  }
}

function validateShadowTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredShadowPaths = [
    'shadows.base.base',
    'shadows.component.card.default',
  ];
  
  for (const path of requiredShadowPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required shadow token: ${path}`);
      } else {
        warnings.push(`Missing shadow token: ${path}`);
      }
    } else if (typeof value !== 'string') {
      invalidTokens.push(path);
      errors.push(`Invalid shadow value for ${path}: ${value}`);
    }
  }
}

function validateAnimationTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredAnimationPaths = [
    'animation.duration.normal',
    'animation.easing.ease',
  ];
  
  for (const path of requiredAnimationPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required animation token: ${path}`);
      } else {
        warnings.push(`Missing animation token: ${path}`);
      }
    }
  }
}

function validateBreakpointTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredBreakpointPaths = [
    'breakpoints.screen.md',
    'breakpoints.screen.lg',
  ];
  
  for (const path of requiredBreakpointPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required breakpoint token: ${path}`);
      } else {
        warnings.push(`Missing breakpoint token: ${path}`);
      }
    } else if (typeof value !== 'number' || value < 0) {
      invalidTokens.push(path);
      errors.push(`Invalid breakpoint value for ${path}: ${value}`);
    }
  }
}

function validateZIndexTokens(
  tokens: DesignTokens,
  errors: string[],
  warnings: string[],
  missingTokens: string[],
  invalidTokens: string[],
  strict: boolean
): void {
  const requiredZIndexPaths = [
    'zIndex.base.0',
    'zIndex.component.modal',
  ];
  
  for (const path of requiredZIndexPaths) {
    const value = getTokenValue(tokens, path);
    if (value === undefined) {
      missingTokens.push(path);
      if (strict) {
        errors.push(`Missing required z-index token: ${path}`);
      } else {
        warnings.push(`Missing z-index token: ${path}`);
      }
    } else if (typeof value !== 'number') {
      invalidTokens.push(path);
      errors.push(`Invalid z-index value for ${path}: ${value}`);
    }
  }
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Check if a string is a valid color value
 * @param color - Color string to validate
 * @returns True if the color is valid, false otherwise
 */
export function isValidColor(color: string): boolean {
  // Check for hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true;
  }
  
  // Check for rgb/rgba colors
  if (/^rgba?\([^)]+\)$/.test(color)) {
    return true;
  }
  
  // Check for hsl/hsla colors
  if (/^hsla?\([^)]+\)$/.test(color)) {
    return true;
  }
  
  // Check for named colors (basic check)
  const namedColors = [
    'transparent', 'currentColor', 'inherit', 'initial', 'unset',
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
    'gray', 'grey', 'orange', 'purple', 'pink', 'brown', 'lime', 'navy',
    'teal', 'olive', 'maroon', 'fuchsia', 'aqua', 'silver'
  ];
  
  return namedColors.includes(color.toLowerCase());
}

/**
 * Convert hex color to RGB
 * @param hex - Hex color string
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ============================================================================
// TOKEN CONVERSION UTILITIES
// ============================================================================

/**
 * Convert design tokens to CSS custom properties
 * @param tokens - Design tokens object
 * @param prefix - CSS custom property prefix (default: '--token')
 * @returns Object with CSS custom property key-value pairs
 */
export function tokensToCssCustomProperties(
  tokens: DesignTokens,
  prefix = '--token'
): Record<string, string> {
  const cssProps: Record<string, string> = {};
  
  function flattenTokens(obj: unknown, path = ''): void {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const currentPath = path ? `${path}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenTokens(value, currentPath);
      } else {
        const cssKey = `${prefix}-${currentPath}`;
        cssProps[cssKey] = String(value);
      }
    }
  }
  
  flattenTokens(tokens);
  return cssProps;
}

/**
 * Convert design tokens to React Native StyleSheet
 * @param tokens - Design tokens object
 * @returns Object with React Native style properties
 */
export function tokensToReactNativeStyles(tokens: DesignTokens): Record<string, unknown> {
  return {
    colors: tokens.colors,
    spacing: tokens.spacing,
    typography: tokens.typography,
    borderRadius: tokens.borderRadius,
    shadows: tokens.shadows,
    animation: tokens.animation,
    breakpoints: tokens.breakpoints,
    zIndex: tokens.zIndex,
  };
}

// ============================================================================
// TOKEN MERGE UTILITIES
// ============================================================================

/**
 * Merge two design tokens objects
 * @param base - Base tokens object
 * @param override - Override tokens object
 * @returns Merged tokens object
 */
export function mergeDesignTokens(base: DesignTokens, override: Partial<DesignTokens>): DesignTokens {
  return {
    ...base,
    ...override,
    colors: {
      ...base.colors,
      ...override.colors,
    },
    typography: {
      ...base.typography,
      ...override.typography,
    },
    spacing: {
      ...base.spacing,
      ...override.spacing,
    },
    borderRadius: {
      ...base.borderRadius,
      ...override.borderRadius,
    },
    shadows: {
      ...base.shadows,
      ...override.shadows,
    },
    animation: {
      ...base.animation,
      ...override.animation,
    },
    breakpoints: {
      ...base.breakpoints,
      ...override.breakpoints,
    },
    zIndex: {
      ...base.zIndex,
      ...override.zIndex,
    },
  };
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  getTokenValue,
  setTokenValue,
  hasToken,
  validateDesignTokens,
  isValidColor,
  hexToRgb,
  rgbToHex,
  tokensToCssCustomProperties,
  tokensToReactNativeStyles,
  mergeDesignTokens,
}; 