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
  
  const { colors, spacing, fontSize, fontWeight, borderRadius, typography: _typography, styles: _styles } = context;
  
  // Create designTokens object from context with proper structure
  const designTokens: DesignTokens = {
    colors: {
      primary: { 50: colors.primary, 100: colors.primary, 200: colors.primary, 300: colors.primary, 400: colors.primary, 500: colors.primary, 600: colors.primary, 700: colors.primary, 800: colors.primary, 900: colors.primary },
      secondary: { 50: colors.secondary, 100: colors.secondary, 200: colors.secondary, 300: colors.secondary, 400: colors.secondary, 500: colors.secondary, 600: colors.secondary, 700: colors.secondary, 800: colors.secondary, 900: colors.secondary },
      neutral: { 50: colors.text, 100: colors.text, 200: colors.text, 300: colors.text, 400: colors.text, 500: colors.text, 600: colors.text, 700: colors.text, 800: colors.text, 900: colors.text },
      semantic: {
        success: { 50: colors.success, 100: colors.success, 200: colors.success, 300: colors.success, 400: colors.success, 500: colors.success, 600: colors.success, 700: colors.success, 800: colors.success, 900: colors.success },
        warning: { 50: colors.warning, 100: colors.warning, 200: colors.warning, 300: colors.warning, 400: colors.warning, 500: colors.warning, 600: colors.warning, 700: colors.warning, 800: colors.warning, 900: colors.warning },
        error: { 50: colors.error, 100: colors.error, 200: colors.error, 300: colors.error, 400: colors.error, 500: colors.error, 600: colors.error, 700: colors.error, 800: colors.error, 900: colors.error },
        info: { 50: colors.primary, 100: colors.primary, 200: colors.primary, 300: colors.primary, 400: colors.primary, 500: colors.primary, 600: colors.primary, 700: colors.primary, 800: colors.primary, 900: colors.primary }
      },
      surface: {
        background: colors.background,
        surface: colors.surface,
        surfaceVariant: colors.surface,
        surfaceContainer: colors.surface,
        surfaceContainerHigh: colors.surface,
        surfaceContainerLow: colors.surface,
        surfaceContainerHighest: colors.surface,
        surfaceContainerLowest: colors.surface
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
        tertiary: colors.textSecondary,
        disabled: colors.textSecondary,
        inverse: colors.text,
        onPrimary: colors.onPrimary,
        onSecondary: colors.onPrimary,
        onSurface: colors.onSurface,
        onSurfaceVariant: colors.onSurfaceVariant,
        onBackground: colors.onBackground
      },
      border: {
        primary: colors.border,
        secondary: colors.border,
        disabled: colors.border,
        focus: colors.border,
        error: colors.error
      },
      shadow: {
        light: 'rgba(0,0,0,0.1)',
        medium: 'rgba(0,0,0,0.2)',
        dark: 'rgba(0,0,0,0.3)',
        colored: colors.primary
      }
    },
    typography: {
      fontFamily: { primary: 'System', secondary: 'System', monospace: 'Monaco', display: 'System' },
      fontSize: { xs: fontSize.xs, sm: fontSize.sm, base: fontSize.body, lg: fontSize.lg, xl: fontSize.xl, '2xl': fontSize.h1, '3xl': fontSize.h2, '4xl': fontSize.h3, '5xl': fontSize.h1, '6xl': fontSize.h1, '7xl': fontSize.h1, '8xl': fontSize.h1, '9xl': fontSize.h1 },
      fontWeight: { thin: fontWeight.light, extralight: fontWeight.light, light: fontWeight.light, normal: fontWeight.normal, medium: fontWeight.medium, semibold: fontWeight.semibold, bold: fontWeight.bold, extrabold: fontWeight.bold, black: fontWeight.bold },
      lineHeight: { none: 1, tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 },
      letterSpacing: { tighter: -0.05, tight: -0.025, normal: 0, wide: 0.025, wider: 0.05, widest: 0.1 },
      textStyles: {
        display: { large: { fontSize: fontSize.h1, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 }, medium: { fontSize: fontSize.h2, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 }, small: { fontSize: fontSize.h3, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 } },
        headline: { large: { fontSize: fontSize.h1, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 }, medium: { fontSize: fontSize.h2, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 }, small: { fontSize: fontSize.h3, fontWeight: fontWeight.bold, lineHeight: 1.2, letterSpacing: 0 } },
        title: { large: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, lineHeight: 1.4, letterSpacing: 0 }, medium: { fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: 1.4, letterSpacing: 0 }, small: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, lineHeight: 1.4, letterSpacing: 0 } },
        body: { large: { fontSize: fontSize.body, fontWeight: fontWeight.normal, lineHeight: 1.5, letterSpacing: 0 }, medium: { fontSize: fontSize.body, fontWeight: fontWeight.normal, lineHeight: 1.5, letterSpacing: 0 }, small: { fontSize: fontSize.sm, fontWeight: fontWeight.normal, lineHeight: 1.5, letterSpacing: 0 } },
        label: { large: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: 1.4, letterSpacing: 0 }, medium: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, lineHeight: 1.4, letterSpacing: 0 }, small: { fontSize: fontSize.xs, fontWeight: fontWeight.normal, lineHeight: 1.4, letterSpacing: 0 } }
      }
    },
    spacing: {
      base: { 0: 0, 1: spacing.xs, 2: spacing.sm, 3: spacing.md, 4: spacing.md, 5: spacing.lg, 6: spacing.lg, 7: spacing.xl, 8: spacing.xl, 9: spacing.xl, 10: spacing.xl, 11: spacing.xl, 12: spacing.xl, 14: spacing.xl, 16: spacing.xl, 20: spacing.xl, 24: spacing.xl, 28: spacing.xl, 32: spacing.xl, 36: spacing.xl, 40: spacing.xl, 44: spacing.xl, 48: spacing.xl, 52: spacing.xl, 56: spacing.xl, 60: spacing.xl, 64: spacing.xl, 72: spacing.xl, 80: spacing.xl, 96: spacing.xl },
      semantic: { xs: spacing.xs, sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl, '2xl': spacing.xl, '3xl': spacing.xl, '4xl': spacing.xl, '5xl': spacing.xl, '6xl': spacing.xl, '7xl': spacing.xl, '8xl': spacing.xl, '9xl': spacing.xl },
      component: { padding: { xs: spacing.xs, sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl }, margin: { xs: spacing.xs, sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl }, gap: { xs: spacing.xs, sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl } },
      layout: { container: { padding: spacing.md, maxWidth: 1200 }, section: { padding: spacing.md, margin: spacing.md }, screen: { padding: spacing.sm, margin: 0 } }
    },
    borderRadius: {
      base: { none: 0, sm: borderRadius.sm, base: borderRadius.md, md: borderRadius.md, lg: borderRadius.lg, xl: borderRadius.lg, '2xl': borderRadius.lg, '3xl': borderRadius.lg, full: 9999 },
      component: { button: { sm: borderRadius.sm, md: borderRadius.md, lg: borderRadius.lg }, card: { sm: borderRadius.sm, md: borderRadius.md, lg: borderRadius.lg }, input: { sm: borderRadius.sm, md: borderRadius.md, lg: borderRadius.lg }, modal: { sm: borderRadius.sm, md: borderRadius.md, lg: borderRadius.lg } }
    },
    shadows: {
      base: { sm: '0 1px 2px rgba(0,0,0,0.05)', base: '0 1px 3px rgba(0,0,0,0.1)', md: '0 4px 6px rgba(0,0,0,0.1)', lg: '0 10px 15px rgba(0,0,0,0.1)', xl: '0 20px 25px rgba(0,0,0,0.1)', '2xl': '0 25px 50px rgba(0,0,0,0.1)', inner: 'inset 0 2px 4px rgba(0,0,0,0.06)', none: 'none' },
      component: { button: { default: '0 1px 3px rgba(0,0,0,0.1)', hover: '0 4px 6px rgba(0,0,0,0.1)', active: '0 1px 2px rgba(0,0,0,0.05)', disabled: 'none' }, card: { default: '0 1px 3px rgba(0,0,0,0.1)', hover: '0 4px 6px rgba(0,0,0,0.1)', elevated: '0 10px 15px rgba(0,0,0,0.1)' }, modal: { backdrop: 'rgba(0,0,0,0.5)', content: '0 20px 25px rgba(0,0,0,0.1)' }, dropdown: { menu: '0 10px 15px rgba(0,0,0,0.1)', item: '0 1px 3px rgba(0,0,0,0.1)' } },
      elevation: { 0: 'none', 1: '0 1px 3px rgba(0,0,0,0.1)', 2: '0 4px 6px rgba(0,0,0,0.1)', 3: '0 10px 15px rgba(0,0,0,0.1)', 4: '0 20px 25px rgba(0,0,0,0.1)', 5: '0 25px 50px rgba(0,0,0,0.1)' }
    },
    animation: {
      duration: { fast: 150, normal: 300, slow: 500, verySlow: 1000 },
      easing: { linear: 'linear', ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out', bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
      delay: { none: 0, fast: 50, normal: 100, slow: 200 },
      component: { button: { press: 100, release: 200 }, card: { hover: 200, focus: 150 }, modal: { enter: 300, exit: 200 } }
    },
    breakpoints: {
      screen: { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
      container: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
    },
    zIndex: {
      base: { 0: 0, 10: 10, 20: 20, 30: 30, 40: 40, 50: 50, auto: 'auto' },
      component: { dropdown: 1000, sticky: 1020, fixed: 1030, modal: 1040, popover: 1050, tooltip: 1060, toast: 1070 }
    }
  };
  
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