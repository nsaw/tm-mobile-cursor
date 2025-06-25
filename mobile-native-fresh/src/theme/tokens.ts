// Design tokens for Thoughtmarks Mobile App
// Based on the web app's sophisticated design system

export const designTokens = {
  colors: {
    // Base dark foundation (matching web app)
    background: '#181818',
    backgroundSecondary: '#1a1a1e', // Updated to match card color
    surface: 'rgba(255,255,255,.04)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    
    // Muted accent colors - refined palette
    accent: '#3B82F6', // blue-500 - more blue than the previous slate-blue
    accentHover: '#4B92F6', // slightly lighter blue
    accentMuted: '#2B72E6', // darker blue variant
    
    // Secondary accents - muted palette
    success: '#39675B', // deep teal
    warning: '#806F4C', // dark mustard
    danger: '#7A2C3B', // rich burgundy
    
    // Text hierarchy - improved contrast
    text: '#E0E0E0', // Updated to match request
    textSecondary: '#A0A0A0', // Updated to match request
    textMuted: '#808080', // Adjusted for better hierarchy
    textDisabled: '#606060', // Improved disabled text contrast
    
    // Borders and dividers
    border: '#2E2E2E', // Updated to match request
    borderHover: 'rgba(255,255,255,0.25)', // More visible hover borders
    divider: 'rgba(255,255,255,0.08)', // Better divider visibility
    
    // Brand colors (matching web app)
    brand: '#5C6A24', // olive green
    brandHover: '#6C7A34', // slightly lighter
    buttonText: '#fff',
  },
  
  spacing: {
    xs: 5,    // Updated to match requirements
    sm: 11,   // Updated to match requirements
    md: 16,   // Updated to match requirements
    lg: 21,   // Updated to match requirements
    xl: 32,   // Updated to match requirements
    xxl: 43,  // 32px * 1.34
    xxxl: 64, // 48px * 1.34
    page: 16, // Page-level horizontal padding
  },
  
  radius: {
    sm: 5,    // Updated to match requirements
    md: 10,   // Updated to match requirements
    lg: 14,   // Updated to match requirements
    xl: 24,
    full: 9999,
  },
  
  typography: {
    fontFamily: {
      heading: 'Oswald',
      body: 'Ubuntu',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      body: 16,
      lg: 18,
      xl: 20,
      heading: 24,
      '2xl': 28,
      '3xl': 32,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    // Heading 2 specific styles
    heading2: {
      fontFamily: 'Ubuntu',
      fontSize: 28,
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
    // Tagline variant
    tagline: {
      fontFamily: 'Ubuntu',
      fontSize: 12,
      fontWeight: '500',
      opacity: 0.8,
      letterSpacing: 0.5,
    },
  },
  
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.3,
      elevation: 1,
    },
    md: {
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      shadowOpacity: 0.4,
      elevation: 3,
    },
    lg: {
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 15,
      shadowOpacity: 0.5,
      elevation: 5,
    },
    inner: {
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.3,
      elevation: 2,
    },
  },
  
  // Animation durations (matching web app)
  animations: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Icon sizes
  iconSize: {
    xs: 19,  // 14 * 1.34
    sm: 21,  // 16 * 1.34
    md: 27,  // 20 * 1.34
    lg: 32,  // 24 * 1.34
    xl: 43,  // 32 * 1.34
  },
  
  // Z-index scale
  zIndex: {
    base: 1,
    card: 10,
    overlay: 100,
    modal: 200,
    tooltip: 300,
    toast: 400,
  },
} as const;

export type DesignTokens = typeof designTokens; 