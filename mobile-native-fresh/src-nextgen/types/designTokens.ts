/**
 * Design Tokens Type System
 * 
 * Comprehensive type definitions for design tokens including colors, typography, spacing,
 * and other design system elements. This system provides type safety and consistency
 * across the entire application.
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export interface ColorTokens {
  // Primary Colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Secondary Colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Neutral Colors
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Semantic Colors
  semantic: {
    success: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    warning: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    error: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    info: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  
  // Surface Colors
  surface: {
    background: string;
    surface: string;
    surfaceVariant: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerLow: string;
    surfaceContainerHighest: string;
    surfaceContainerLowest: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    onPrimary: string;
    onSecondary: string;
    onSurface: string;
    onSurfaceVariant: string;
    onBackground: string;
  };
  
  // Border Colors
  border: {
    primary: string;
    secondary: string;
    disabled: string;
    focus: string;
    error: string;
  };
  
  // Shadow Colors
  shadow: {
    light: string;
    medium: string;
    dark: string;
    colored: string;
  };
}

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export interface TypographyTokens {
  // Font Families
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
    display: string;
  };
  
  // Font Sizes
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
    '8xl': number;
    '9xl': number;
  };
  
  // Font Weights
  fontWeight: {
    thin: string;
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
  
  // Line Heights
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  
  // Letter Spacing
  letterSpacing: {
    tighter: number;
    tight: number;
    normal: number;
    wide: number;
    wider: number;
    widest: number;
  };
  
  // Text Styles
  textStyles: {
    display: {
      large: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      medium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      small: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
    };
    headline: {
      large: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      medium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      small: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
    };
    title: {
      large: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      medium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      small: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
    };
    body: {
      large: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      medium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      small: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
    };
    label: {
      large: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      medium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
      small: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
      };
    };
  };
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

export interface SpacingTokens {
  // Base Spacing Scale
  base: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
    14: number;
    16: number;
    20: number;
    24: number;
    28: number;
    32: number;
    36: number;
    40: number;
    44: number;
    48: number;
    52: number;
    56: number;
    60: number;
    64: number;
    72: number;
    80: number;
    96: number;
  };
  
  // Semantic Spacing
  semantic: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
    '8xl': number;
    '9xl': number;
  };
  
  // Component Spacing
  component: {
    padding: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    margin: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    gap: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  
  // Layout Spacing
  layout: {
    container: {
      padding: number;
      maxWidth: number;
    };
    section: {
      padding: number;
      margin: number;
    };
    screen: {
      padding: number;
      margin: number;
    };
  };
}

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export interface BorderRadiusTokens {
  // Base Border Radius
  base: {
    none: number;
    sm: number;
    base: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    full: number;
  };
  
  // Component Border Radius
  component: {
    button: {
      sm: number;
      md: number;
      lg: number;
    };
    card: {
      sm: number;
      md: number;
      lg: number;
    };
    input: {
      sm: number;
      md: number;
      lg: number;
    };
    modal: {
      sm: number;
      md: number;
      lg: number;
    };
  };
}

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export interface ShadowTokens {
  // Base Shadows
  base: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  
  // Component Shadows
  component: {
    button: {
      default: string;
      hover: string;
      active: string;
      disabled: string;
    };
    card: {
      default: string;
      hover: string;
      elevated: string;
    };
    modal: {
      backdrop: string;
      content: string;
    };
    dropdown: {
      menu: string;
      item: string;
    };
  };
  
  // Elevation Shadows
  elevation: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export interface AnimationTokens {
  // Duration
  duration: {
    fast: number;
    normal: number;
    slow: number;
    verySlow: number;
  };
  
  // Easing
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
  };
  
  // Delays
  delay: {
    none: number;
    fast: number;
    normal: number;
    slow: number;
  };
  
  // Component Animations
  component: {
    button: {
      press: number;
      release: number;
    };
    card: {
      hover: number;
      focus: number;
    };
    modal: {
      enter: number;
      exit: number;
    };
  };
}

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

export interface BreakpointTokens {
  // Screen Breakpoints
  screen: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  
  // Container Breakpoints
  container: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export interface ZIndexTokens {
  // Base Z-Index Scale
  base: {
    0: number;
    10: number;
    20: number;
    30: number;
    40: number;
    50: number;
    auto: string;
  };
  
  // Component Z-Index
  component: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
}

// ============================================================================
// MAIN DESIGN TOKENS INTERFACE
// ============================================================================

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
  breakpoints: BreakpointTokens;
  zIndex: ZIndexTokens;
}

// ============================================================================
// THEME MODE TOKENS
// ============================================================================

export interface ThemeModeTokens {
  light: DesignTokens;
  dark: DesignTokens;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ColorToken = keyof ColorTokens;
export type TypographyToken = keyof TypographyTokens;
export type SpacingToken = keyof SpacingTokens;
export type BorderRadiusToken = keyof BorderRadiusTokens;
export type ShadowToken = keyof ShadowTokens;
export type AnimationToken = keyof AnimationTokens;
export type BreakpointToken = keyof BreakpointTokens;
export type ZIndexToken = keyof ZIndexTokens;

// ============================================================================
// TOKEN ACCESS UTILITIES
// ============================================================================

export type TokenPath<T> = T extends Record<string, unknown>
  ? {
              [K in keyof T]: T[K] extends Record<string, unknown>
        ? `${string & K}.${string & keyof T[K]}`
        : string & K;
    }[keyof T]
  : never;

export type DesignTokenPath = TokenPath<DesignTokens>;

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface TokenValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingTokens: string[];
  invalidTokens: string[];
}

export interface TokenValidationOptions {
  strict?: boolean;
  allowMissing?: boolean;
  _allowMissing?: boolean;
  validateColors?: boolean;
  validateTypography?: boolean;
  validateSpacing?: boolean;
} 