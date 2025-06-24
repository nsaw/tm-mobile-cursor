// Modern, fluid design theme for Thoughtmarks
// Softer, ambient sci-fi aesthetic while maintaining dark foundation

export const previewTheme = {
  typography: {
    heading: 'clamp(1.8rem, 2.5vw, 2.4rem)',
    subheading: 'clamp(1.4rem, 2vw, 1.6rem)', 
    body: 'clamp(1rem, 1.5vw, 1.2rem)',
    caption: 'clamp(0.85rem, 1.2vw, 0.95rem)',
    fontFamily: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em'
    }
  },
  colors: {
    // Base dark foundation
    background: '#0e0e11',
    backgroundSecondary: '#151518',
    surface: 'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    
    // Softened accent colors - ambient sci-fi
    accent: 'hsl(200, 80%, 60%)',      // Calm blue
    accentHover: 'hsl(200, 85%, 70%)',
    accentMuted: 'hsl(200, 40%, 40%)',
    
    // Secondary accents
    success: 'hsl(142, 70%, 55%)',     // Soft green
    warning: 'hsl(38, 85%, 65%)',      // Warm amber
    danger: 'hsl(0, 75%, 60%)',        // Subtle red
    
    // Text hierarchy
    text: '#f0f0f5',
    textSecondary: '#c0c0c8',
    textMuted: '#8a8a95',
    textDisabled: '#5a5a62',
    
    // Borders and dividers
    border: 'rgba(255,255,255,0.1)',
    borderHover: 'rgba(255,255,255,0.2)',
    divider: 'rgba(255,255,255,0.06)'
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px  
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    xxl: '2rem',      // 32px
    xxxl: '3rem'      // 48px
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
  },
  blur: {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  },
  iconSize: {
    xs: '14px',
    sm: '16px', 
    md: '20px',
    lg: '24px',
    xl: '32px'
  },
  animations: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  gradients: {
    subtle: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    accent: 'linear-gradient(135deg, hsl(200, 80%, 60%) 0%, hsl(200, 70%, 50%) 100%)',
    surface: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
  }
};

export type PreviewTheme = typeof previewTheme;