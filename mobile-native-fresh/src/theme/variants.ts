// Utility function to create variant styles
function createVariantStyles<T extends Record<string, any>>(
  base: any,
  variants: T
) {
  return { base, variants };
}

// Button variants (dynamic)
export function getButtonVariants(tokens: any) {
  return createVariantStyles(
    {
      paddingHorizontal: tokens?.spacing?.lg || 21,
      paddingVertical: tokens?.spacing?.md || 16,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 44,
    },
    {
      variant: {
        primary: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.accent || '#3B82F6',
          borderWidth: 1,
        },
        secondary: {
          backgroundColor: tokens?.colors?.surface || 'rgba(255,255,255,.04)',
          borderColor: tokens?.colors?.border || '#2E2E2E',
          borderWidth: 1,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        },
        destructive: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.danger || '#7A2C3B',
          borderWidth: 1,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.border || '#2E2E2E',
          borderWidth: 1,
        },
        brand: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.brand || '#5C6A24',
          borderWidth: 1,
        },
      },
      size: {
        sm: {
          borderRadius: 8,
          paddingHorizontal: tokens?.spacing?.md || 16,
          paddingVertical: tokens?.spacing?.sm || 11,
          minHeight: 36,
        },
        md: {
          borderRadius: 8,
          paddingHorizontal: tokens?.spacing?.lg || 21,
          paddingVertical: tokens?.spacing?.md || 16,
          minHeight: 44,
        },
        lg: {
          borderRadius: 8,
          paddingHorizontal: tokens?.spacing?.xl || 32,
          paddingVertical: tokens?.spacing?.lg || 21,
          minHeight: 52,
        },
        icon: {
          borderRadius: tokens?.radius?.full || 9999,
          paddingHorizontal: tokens?.spacing?.md || 16,
          paddingVertical: tokens?.spacing?.md || 16,
          minHeight: 44,
          minWidth: 44,
        },
      },
    }
  );
}

// Card variants (dynamic)
export function getCardVariants(tokens: any) {
  return createVariantStyles(
    {
      backgroundColor: tokens?.colors?.backgroundSecondary || '#1a1a1e',
      borderColor: tokens?.colors?.border || '#2E2E2E',
      borderWidth: 1,
      padding: tokens?.spacing?.lg || 21,
    },
    {
      variant: {
        default: {
          backgroundColor: tokens?.colors?.backgroundSecondary || '#1a1a1e',
        },
        glass: {
          backgroundColor: 'rgba(26, 26, 30, 0.9)',
          borderColor: 'rgba(255,255,255,0.25)',
        },
        elevated: {
          backgroundColor: tokens?.colors?.backgroundSecondary || '#1a1a1e',
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          shadowOpacity: 0.4,
          elevation: 3,
        },
        interactive: {
          backgroundColor: tokens?.colors?.backgroundSecondary || '#1a1a1e',
          borderColor: tokens?.colors?.borderHover || 'rgba(255,255,255,0.25)',
        },
      },
      size: {
        sm: {
          borderRadius: tokens?.radius?.sm || 5,
          padding: tokens?.spacing?.md || 16,
        },
        md: {
          borderRadius: tokens?.radius?.md || 10,
          padding: tokens?.spacing?.lg || 21,
        },
        lg: {
          borderRadius: tokens?.radius?.lg || 14,
          padding: tokens?.spacing?.xl || 32,
        },
      },
    }
  );
}

// Input variants (dynamic)
export function getInputVariants(tokens: any) {
  return createVariantStyles(
    {
      borderRadius: tokens?.radius?.lg || 14,
      borderWidth: 1,
      paddingHorizontal: tokens?.spacing?.md || 16,
      paddingVertical: tokens?.spacing?.sm || 11,
      fontSize: tokens?.typography?.fontSize?.body || 16,
      fontFamily: tokens?.typography?.fontFamily?.body || 'Ubuntu',
      color: tokens?.colors?.text || '#E0E0E0',
      backgroundColor: tokens?.colors?.surface || 'rgba(255,255,255,.04)',
      borderColor: tokens?.colors?.border || '#2E2E2E',
      minHeight: 44,
    },
    {
      variant: {
        default: {},
        filled: {
          backgroundColor: tokens?.colors?.backgroundSecondary || '#1a1a1e',
          borderColor: 'transparent',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.border || '#2E2E2E',
        },
      },
      size: {
        sm: {
          paddingHorizontal: tokens?.spacing?.sm || 11,
          paddingVertical: tokens?.spacing?.xs || 5,
          minHeight: 36,
          fontSize: tokens?.typography?.fontSize?.sm || 14,
        },
        md: {
          paddingHorizontal: tokens?.spacing?.md || 16,
          paddingVertical: tokens?.spacing?.sm || 11,
          minHeight: 44,
          fontSize: tokens?.typography?.fontSize?.body || 16,
        },
        lg: {
          paddingHorizontal: tokens?.spacing?.lg || 21,
          paddingVertical: tokens?.spacing?.md || 16,
          minHeight: 52,
          fontSize: tokens?.typography?.fontSize?.lg || 18,
        },
      },
    }
  );
}

// Text variants (dynamic)
export function getTextVariants(tokens: any) {
  return createVariantStyles(
    {
      color: tokens?.colors?.text || '#E0E0E0',
      fontFamily: tokens?.typography?.fontFamily?.body || 'Ubuntu',
      opacity: 0.7, // Apply opacity to all non-CTA text
    },
    {
      variant: {
        body: {
          fontSize: tokens?.typography?.fontSize?.sm || 14,
          fontWeight: tokens?.typography?.fontWeight?.normal || '400',
          lineHeight: (tokens?.typography?.fontSize?.sm || 14) * 1.6,
          opacity: 0.7,
        },
        heading: {
          fontSize: 18, // Lowered from xl (20) to 18px
          fontWeight: tokens?.typography?.fontWeight?.bold || '700',
          fontFamily: tokens?.typography?.fontFamily?.heading || 'Oswald',
          lineHeight: 18 * 1.3,
          opacity: 0.7,
        },
        title: {
          fontSize: tokens?.typography?.fontSize?.['3xl'] || 32,
          fontWeight: tokens?.typography?.fontWeight?.bold || '700',
          fontFamily: tokens?.typography?.fontFamily?.body || 'Ubuntu',
          lineHeight: (tokens?.typography?.fontSize?.['3xl'] || 32) * 1.2,
          opacity: 0.7,
        },
        subtitle: {
          fontSize: 16, // Lowered from lg (18) to 16px
          fontWeight: tokens?.typography?.fontWeight?.normal || '400',
          lineHeight: 16 * 1.4,
          opacity: 0.7,
        },
        caption: {
          fontSize: tokens?.typography?.fontSize?.xs || 12,
          fontWeight: tokens?.typography?.fontWeight?.normal || '400',
          color: tokens?.colors?.textMuted || '#808080',
          lineHeight: (tokens?.typography?.fontSize?.xs || 12) * 1.5,
          opacity: 0.7,
        },
        muted: {
          fontSize: tokens?.typography?.fontSize?.xs || 12,
          fontWeight: tokens?.typography?.fontWeight?.normal || '400',
          color: tokens?.colors?.textSecondary || '#A0A0A0',
          lineHeight: (tokens?.typography?.fontSize?.xs || 12) * 1.5,
          opacity: 0.7,
        },
        // 'tagline' is for secondary/subtitle text (onboarding descriptions, empty state subtitles, etc)
        tagline: {
          fontSize: tokens?.typography?.fontSize?.sm || 14,
          fontWeight: tokens?.typography?.fontWeight?.normal || '400',
          color: tokens?.colors?.textSecondary || '#A0A0A0',
          fontFamily: tokens?.typography?.fontFamily?.body || 'Ubuntu',
          letterSpacing: 0.2,
          lineHeight: (tokens?.typography?.fontSize?.sm || 14) * 1.6,
          opacity: 0.7,
        },
        // CTA variants with full opacity and bold Oswald font
        cta: {
          fontSize: 18, // h2 size for CTA
          fontWeight: tokens?.typography?.fontWeight?.bold || '700',
          fontFamily: tokens?.typography?.fontFamily?.heading || 'Oswald',
          lineHeight: 18 * 1.3,
          opacity: 1, // Full opacity for CTA
          color: tokens?.colors?.text || '#E0E0E0', // Max contrast
        },
        ctaSecondary: {
          fontSize: 16, // h3 size for secondary CTA
          fontWeight: tokens?.typography?.fontWeight?.bold || '700',
          fontFamily: tokens?.typography?.fontFamily?.heading || 'Oswald',
          lineHeight: 16 * 1.4,
          opacity: 1, // Full opacity for CTA
          color: tokens?.colors?.text || '#E0E0E0', // Max contrast
        },
      },
      size: {
        xs: {
          fontSize: (tokens?.typography?.fontSize?.xs || 12) - 2,
          lineHeight: ((tokens?.typography?.fontSize?.xs || 12) - 2) * 1.5,
          opacity: 0.7,
        },
        sm: {
          fontSize: tokens?.typography?.fontSize?.xs || 12,
          lineHeight: (tokens?.typography?.fontSize?.xs || 12) * 1.5,
          opacity: 0.7,
        },
        md: {
          fontSize: tokens?.typography?.fontSize?.sm || 14,
          lineHeight: (tokens?.typography?.fontSize?.sm || 14) * 1.6,
          opacity: 0.7,
        },
        lg: {
          fontSize: tokens?.typography?.fontSize?.body || 16,
          lineHeight: (tokens?.typography?.fontSize?.body || 16) * 1.4,
          opacity: 0.7,
        },
        xl: {
          fontSize: (tokens?.typography?.fontSize?.xl || 20) + 2,
          lineHeight: ((tokens?.typography?.fontSize?.xl || 20) + 2) * 1.3,
          opacity: 0.7,
        },
        '2xl': {
          fontSize: (tokens?.typography?.fontSize?.['2xl'] || 28) + 2,
          lineHeight: ((tokens?.typography?.fontSize?.['2xl'] || 28) + 2) * 1.3,
          opacity: 0.7,
        },
        '3xl': {
          fontSize: (tokens?.typography?.fontSize?.['3xl'] || 32) + 2,
          lineHeight: ((tokens?.typography?.fontSize?.['3xl'] || 32) + 2) * 1.2,
          opacity: 0.7,
        },
      },
    }
  );
}

// Badge variants (dynamic)
export function getBadgeVariants(tokens: any) {
  return createVariantStyles(
    {
      borderRadius: tokens?.radius?.full || 9999,
      paddingHorizontal: tokens?.spacing?.sm || 11,
      paddingVertical: tokens?.spacing?.xs || 5,
      fontSize: tokens?.typography?.fontSize?.xs || 12,
      fontWeight: tokens?.typography?.fontWeight?.medium || '500',
    },
    {
      variant: {
        default: {
          backgroundColor: tokens?.colors?.surface || 'rgba(255,255,255,.04)',
          borderColor: tokens?.colors?.border || '#2E2E2E',
          borderWidth: 1,
        },
        primary: {
          backgroundColor: tokens?.colors?.accent || '#3B82F6',
          borderColor: tokens?.colors?.accent || '#3B82F6',
          borderWidth: 1,
        },
        secondary: {
          backgroundColor: tokens?.colors?.surface || 'rgba(255,255,255,.04)',
          borderColor: tokens?.colors?.border || '#2E2E2E',
          borderWidth: 1,
        },
        destructive: {
          backgroundColor: tokens?.colors?.danger || '#7A2C3B',
          borderColor: tokens?.colors?.danger || '#7A2C3B',
          borderWidth: 1,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: tokens?.colors?.border || '#2E2E2E',
          borderWidth: 1,
        },
      },
    }
  );
}

// Utility to merge variant styles (unchanged)
export function mergeVariantStyles(
  base: any,
  variantProps: Record<string, any>
): any {
  let style = { ...base };
  for (const key in variantProps) {
    if (variantProps[key] && typeof variantProps[key] === 'object') {
      style = { ...style, ...variantProps[key] };
    }
  }
  return style;
} 