// Design tokens for Thoughtmarks Mobile App
// Based on the web app's sophisticated design system

export const designTokens = {
  colors: {
    // Base dark foundation (matching web app)
    background: '#0e0e11',
    backgroundSecondary: '#151518',
    surface: 'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    
    // Softened accent colors - ambient sci-fi
    accent: '#3399ff', // hsl(200, 80%, 60%)
    accentHover: '#4da6ff', // hsl(200, 85%, 70%)
    accentMuted: '#2d5a7a', // hsl(200, 40%, 40%)
    
    // Secondary accents
    success: '#22c55e', // hsl(142, 70%, 55%)
    warning: '#f59e0b', // hsl(38, 85%, 65%)
    danger: '#ef4444', // hsl(0, 75%, 60%)
    
    // Text hierarchy
    text: '#f0f0f5',
    textSecondary: '#c0c0c8',
    textMuted: '#8a8a95',
    textDisabled: '#5a5a62',
    
    // Borders and dividers
    border: 'rgba(255,255,255,0.1)',
    borderHover: 'rgba(255,255,255,0.2)',
    divider: 'rgba(255,255,255,0.06)',
    
    // Brand colors (matching web app)
    brand: '#C6D600',
    brandHover: '#9CB800',
  },
  
  spacing: {
    xs: 4,    // 4px
    sm: 8,    // 8px  
    md: 12,   // 12px
    lg: 16,   // 16px
    xl: 24,   // 24px
    xxl: 32,  // 32px
    xxxl: 48, // 48px
  },
  
  radius: {
    sm: 6,
    md: 12,
    lg: 16,
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
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
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