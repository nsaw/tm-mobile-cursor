/**
 * useDesignTokens Hook
 * 
 * Provides access to the design tokens system with proper typing and validation.
 * This hook resolves the conflicting tokens declarations by providing a dedicated
 * interface for design tokens access.
 */

import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';
import { DesignTokens } from '../types/designTokens';

export interface UseDesignTokensReturn {
  designTokens: DesignTokens;
  colors: DesignTokens['colors'];
  typography: DesignTokens['typography'];
  spacing: DesignTokens['spacing'];
  borderRadius: DesignTokens['borderRadius'];
  shadows: DesignTokens['shadows'];
  animation: DesignTokens['animation'];
  breakpoints: DesignTokens['breakpoints'];
  zIndex: DesignTokens['zIndex'];
  getToken: (path: string) => unknown;
  setToken: (path: string, value: unknown) => void;
  validateTokens: () => { isValid: boolean; errors: string[]; warnings: string[] };
}

/**
 * Hook to access design tokens with proper typing
 * 
 * @returns Object containing design tokens and utility functions
 * @example
 * ```tsx
 * const { colors, spacing, getToken } = useDesignTokens();
 * const primaryColor = colors.primary[500];
 * const baseSpacing = spacing.base[4];
 * const customToken = getToken('colors.semantic.success.500');
 * ```
 */
export function useDesignTokens(): UseDesignTokensReturn {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useDesignTokens must be used within a ThemeProvider');
  }
  
  const { designTokens } = context;
  
  /**
   * Get a token value by path
   * @param path - Dot-separated path to the token (e.g., 'colors.primary.500')
   * @returns The token value or undefined if not found
   */
  const getToken = (path: string): unknown => {
    const keys = path.split('.');
    let current: unknown = designTokens;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  };
  
  /**
   * Set a token value by path (creates a new tokens object)
   * @param path - Dot-separated path to the token
   * @param value - New value for the token
   */
  const setToken = (_path: string, _value: unknown): void => {
    // This is a read-only implementation for now
    // In a real implementation, you might want to dispatch an action to update the theme
    console.warn('setToken is read-only in this implementation');
  };
  
  /**
   * Validate the current design tokens
   * @returns Validation result with errors and warnings
   */
  const validateTokens = (): { isValid: boolean; errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate required color tokens
    if (!designTokens.colors?.primary?.[500]) {
      errors.push('Missing primary color token');
    }
    
    if (!designTokens.colors?.surface?.background) {
      errors.push('Missing surface background color');
    }
    
    if (!designTokens.colors?.text?.primary) {
      errors.push('Missing text primary color');
    }
    
    // Validate typography tokens
    if (!designTokens.typography?.fontSize?.base) {
      errors.push('Missing base font size');
    }
    
    if (!designTokens.typography?.fontWeight?.normal) {
      errors.push('Missing normal font weight');
    }
    
    // Validate spacing tokens
    if (!designTokens.spacing?.base?.[4]) {
      errors.push('Missing base spacing token');
    }
    
    // Validate border radius tokens
    if (!designTokens.borderRadius?.base?.base) {
      errors.push('Missing base border radius');
    }
    
    // Validate shadow tokens
    if (!designTokens.shadows?.base?.base) {
      errors.push('Missing base shadow');
    }
    
    // Validate animation tokens
    if (!designTokens.animation?.duration?.normal) {
      errors.push('Missing normal animation duration');
    }
    
    // Validate breakpoint tokens
    if (!designTokens.breakpoints?.screen?.md) {
      errors.push('Missing medium screen breakpoint');
    }
    
    // Validate z-index tokens
    if (!designTokens.zIndex?.base?.[0]) {
      errors.push('Missing base z-index');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };
  
  return {
    designTokens,
    colors: designTokens.colors,
    typography: designTokens.typography,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    shadows: designTokens.shadows,
    animation: designTokens.animation,
    breakpoints: designTokens.breakpoints,
    zIndex: designTokens.zIndex,
    getToken,
    setToken,
    validateTokens,
  };
}

/**
 * Hook to access specific color tokens
 * @returns Object containing color tokens
 */
export function useColorTokens(): DesignTokens['colors'] {
  const { colors } = useDesignTokens();
  return colors;
}

/**
 * Hook to access specific typography tokens
 * @returns Object containing typography tokens
 */
export function useTypographyTokens(): DesignTokens['typography'] {
  const { typography } = useDesignTokens();
  return typography;
}

/**
 * Hook to access specific spacing tokens
 * @returns Object containing spacing tokens
 */
export function useSpacingTokens(): DesignTokens['spacing'] {
  const { spacing } = useDesignTokens();
  return spacing;
}

/**
 * Hook to access specific border radius tokens
 * @returns Object containing border radius tokens
 */
export function useBorderRadiusTokens(): DesignTokens['borderRadius'] {
  const { borderRadius } = useDesignTokens();
  return borderRadius;
}

/**
 * Hook to access specific shadow tokens
 * @returns Object containing shadow tokens
 */
export function useShadowTokens(): DesignTokens['shadows'] {
  const { shadows } = useDesignTokens();
  return shadows;
}

/**
 * Hook to access specific animation tokens
 * @returns Object containing animation tokens
 */
export function useAnimationTokens(): DesignTokens['animation'] {
  const { animation } = useDesignTokens();
  return animation;
}

/**
 * Hook to access specific breakpoint tokens
 * @returns Object containing breakpoint tokens
 */
export function useBreakpointTokens(): DesignTokens['breakpoints'] {
  const { breakpoints } = useDesignTokens();
  return breakpoints;
}

/**
 * Hook to access specific z-index tokens
 * @returns Object containing z-index tokens
 */
export function useZIndexTokens(): DesignTokens['zIndex'] {
  const { zIndex } = useDesignTokens();
  return zIndex;
}

export default useDesignTokens; 