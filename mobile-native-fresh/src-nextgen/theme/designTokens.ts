/**
 * Design Tokens Implementation
 * 
 * Actual token values for the design system. This file provides the concrete
 * implementation of the design tokens type system.
 */

import { DesignTokens, ThemeModeTokens } from '../types/designTokens';

// ============================================================================
// LIGHT THEME DESIGN TOKENS
// ============================================================================

export const lightDesignTokens: DesignTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    semantic: {
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
    surface: {
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceVariant: '#f1f5f9',
      surfaceContainer: '#ffffff',
      surfaceContainerHigh: '#f8fafc',
      surfaceContainerLow: '#ffffff',
      surfaceContainerHighest: '#f1f5f9',
      surfaceContainerLowest: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      disabled: '#94a3b8',
      inverse: '#ffffff',
      onPrimary: '#ffffff',
      onSecondary: '#0f172a',
      onSurface: '#0f172a',
      onSurfaceVariant: '#475569',
      onBackground: '#0f172a',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#f1f5f9',
      disabled: '#f1f5f9',
      focus: '#3b82f6',
      error: '#ef4444',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.2)',
      colored: 'rgba(59, 130, 246, 0.1)',
    },
  },
  typography: {
    fontFamily: {
      primary: 'System',
      secondary: 'System',
      monospace: 'SF Mono',
      display: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
      '7xl': 72,
      '8xl': 96,
      '9xl': 128,
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
    textStyles: {
      display: {
        large: {
          fontSize: 57,
          fontWeight: '400',
          lineHeight: 64,
          letterSpacing: -0.25,
        },
        medium: {
          fontSize: 45,
          fontWeight: '400',
          lineHeight: 52,
          letterSpacing: 0,
        },
        small: {
          fontSize: 36,
          fontWeight: '400',
          lineHeight: 44,
          letterSpacing: 0,
        },
      },
      headline: {
        large: {
          fontSize: 32,
          fontWeight: '400',
          lineHeight: 40,
          letterSpacing: 0,
        },
        medium: {
          fontSize: 28,
          fontWeight: '400',
          lineHeight: 36,
          letterSpacing: 0,
        },
        small: {
          fontSize: 24,
          fontWeight: '400',
          lineHeight: 32,
          letterSpacing: 0,
        },
      },
      title: {
        large: {
          fontSize: 22,
          fontWeight: '400',
          lineHeight: 28,
          letterSpacing: 0,
        },
        medium: {
          fontSize: 16,
          fontWeight: '500',
          lineHeight: 24,
          letterSpacing: 0.15,
        },
        small: {
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 20,
          letterSpacing: 0.1,
        },
      },
      body: {
        large: {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 24,
          letterSpacing: 0.5,
        },
        medium: {
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
          letterSpacing: 0.25,
        },
        small: {
          fontSize: 12,
          fontWeight: '400',
          lineHeight: 16,
          letterSpacing: 0.4,
        },
      },
      label: {
        large: {
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 20,
          letterSpacing: 0.1,
        },
        medium: {
          fontSize: 12,
          fontWeight: '500',
          lineHeight: 16,
          letterSpacing: 0.5,
        },
        small: {
          fontSize: 11,
          fontWeight: '500',
          lineHeight: 16,
          letterSpacing: 0.5,
        },
      },
    },
  },
  spacing: {
    base: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 44,
      12: 48,
      14: 56,
      16: 64,
      20: 80,
      24: 96,
      28: 112,
      32: 128,
      36: 144,
      40: 160,
      44: 176,
      48: 192,
      52: 208,
      56: 224,
      60: 240,
      64: 256,
      72: 288,
      80: 320,
      96: 384,
    },
    semantic: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
      '4xl': 96,
      '5xl': 128,
      '6xl': 192,
      '7xl': 256,
      '8xl': 384,
      '9xl': 512,
    },
    component: {
      padding: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      margin: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      gap: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
    },
    layout: {
      container: {
        padding: 16,
        maxWidth: 1200,
      },
      section: {
        padding: 24,
        margin: 16,
      },
      screen: {
        padding: 16,
        margin: 0,
      },
    },
  },
  borderRadius: {
    base: {
      none: 0,
      sm: 2,
      base: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
    component: {
      button: {
        sm: 4,
        md: 8,
        lg: 12,
      },
      card: {
        sm: 8,
        md: 12,
        lg: 16,
      },
      input: {
        sm: 4,
        md: 8,
        lg: 12,
      },
      modal: {
        sm: 12,
        md: 16,
        lg: 24,
      },
    },
  },
  shadows: {
    base: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    component: {
      button: {
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        active: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        disabled: 'none',
      },
      card: {
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      modal: {
        backdrop: 'rgba(0, 0, 0, 0.5)',
        content: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      dropdown: {
        menu: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        item: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
    elevation: {
      0: 'none',
      1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      5: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    delay: {
      none: 0,
      fast: 50,
      normal: 100,
      slow: 200,
    },
    component: {
      button: {
        press: 100,
        release: 150,
      },
      card: {
        hover: 200,
        focus: 150,
      },
      modal: {
        enter: 300,
        exit: 200,
      },
    },
  },
  breakpoints: {
    screen: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  zIndex: {
    base: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      auto: 'auto',
    },
    component: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
      toast: 1070,
    },
  },
};

// ============================================================================
// DARK THEME DESIGN TOKENS
// ============================================================================

export const darkDesignTokens: DesignTokens = {
  ...lightDesignTokens,
  colors: {
    ...lightDesignTokens.colors,
    surface: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceVariant: '#334155',
      surfaceContainer: '#1e293b',
      surfaceContainerHigh: '#334155',
      surfaceContainerLow: '#0f172a',
      surfaceContainerHighest: '#475569',
      surfaceContainerLowest: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      disabled: '#64748b',
      inverse: '#0f172a',
      onPrimary: '#0f172a',
      onSecondary: '#f8fafc',
      onSurface: '#f8fafc',
      onSurfaceVariant: '#cbd5e1',
      onBackground: '#f8fafc',
    },
    border: {
      primary: '#334155',
      secondary: '#1e293b',
      disabled: '#1e293b',
      focus: '#60a5fa',
      error: '#f87171',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.2)',
      dark: 'rgba(0, 0, 0, 0.4)',
      colored: 'rgba(96, 165, 250, 0.2)',
    },
  },
};

// ============================================================================
// THEME MODE TOKENS
// ============================================================================

export const themeModeTokens: ThemeModeTokens = {
  light: lightDesignTokens,
  dark: darkDesignTokens,
};

// ============================================================================
// TOKEN ACCESS UTILITIES
// ============================================================================

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

// ============================================================================
// TOKEN VALIDATION
// ============================================================================

export function validateDesignTokens(tokens: DesignTokens): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate required color tokens
  if (!tokens.colors?.primary?.[500]) {
    errors.push('Missing primary color token');
  }
  
  if (!tokens.colors?.surface?.background) {
    errors.push('Missing surface background color');
  }
  
  if (!tokens.colors?.text?.primary) {
    errors.push('Missing text primary color');
  }
  
  // Validate typography tokens
  if (!tokens.typography?.fontSize?.base) {
    errors.push('Missing base font size');
  }
  
  if (!tokens.typography?.fontWeight?.normal) {
    errors.push('Missing normal font weight');
  }
  
  // Validate spacing tokens
  if (!tokens.spacing?.base?.[4]) {
    errors.push('Missing base spacing token');
  }
  
  // Validate border radius tokens
  if (!tokens.borderRadius?.base?.base) {
    errors.push('Missing base border radius');
  }
  
  // Validate shadow tokens
  if (!tokens.shadows?.base?.base) {
    errors.push('Missing base shadow');
  }
  
  // Validate animation tokens
  if (!tokens.animation?.duration?.normal) {
    errors.push('Missing normal animation duration');
  }
  
  // Validate breakpoint tokens
  if (!tokens.breakpoints?.screen?.md) {
    errors.push('Missing medium screen breakpoint');
  }
  
  // Validate z-index tokens
  if (!tokens.zIndex?.base?.[0]) {
    errors.push('Missing base z-index');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  light: lightDesignTokens,
  dark: darkDesignTokens,
  themeMode: themeModeTokens,
  getTokenValue,
  setTokenValue,
  validateDesignTokens,
}; 