import { DesignTokens } from './tokens';

// Utility function to create variant styles
function createVariantStyles<T extends Record<string, any>>(
  base: any,
  variants: T
) {
  return { base, variants };
}

// Button variants (dynamic)
export function getButtonVariants(designTokens: DesignTokens) {
  return createVariantStyles(
    {
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 44,
    },
    {
      variant: {
        primary: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.accent,
          borderWidth: 1,
        },
        secondary: {
          backgroundColor: designTokens.colors.surface,
          borderColor: designTokens.colors.border,
          borderWidth: 1,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        },
        destructive: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.danger,
          borderWidth: 1,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.border,
          borderWidth: 1,
        },
        brand: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.brand,
          borderWidth: 1,
        },
      },
      size: {
        sm: {
          borderRadius: 8,
          paddingHorizontal: designTokens.spacing.md,
          paddingVertical: designTokens.spacing.sm,
          minHeight: 36,
        },
        md: {
          borderRadius: 8,
          paddingHorizontal: designTokens.spacing.lg,
          paddingVertical: designTokens.spacing.md,
          minHeight: 44,
        },
        lg: {
          borderRadius: 8,
          paddingHorizontal: designTokens.spacing.xl,
          paddingVertical: designTokens.spacing.lg,
          minHeight: 52,
        },
        icon: {
          borderRadius: designTokens.radius.full,
          paddingHorizontal: designTokens.spacing.md,
          paddingVertical: designTokens.spacing.md,
          minHeight: 44,
          minWidth: 44,
        },
      },
    }
  );
}

// Card variants (dynamic)
export function getCardVariants(designTokens: DesignTokens) {
  return createVariantStyles(
    {
      backgroundColor: designTokens.colors.backgroundSecondary,
      borderColor: designTokens.colors.border,
      borderWidth: 1,
      padding: designTokens.spacing.lg,
    },
    {
      variant: {
        default: {
          backgroundColor: designTokens.colors.backgroundSecondary,
        },
        glass: {
          backgroundColor: 'rgba(26, 26, 30, 0.9)',
          borderColor: 'rgba(255,255,255,0.25)',
        },
        elevated: {
          backgroundColor: designTokens.colors.backgroundSecondary,
          ...designTokens.shadows.md,
        },
        interactive: {
          backgroundColor: designTokens.colors.backgroundSecondary,
          borderColor: designTokens.colors.borderHover,
        },
      },
      size: {
        sm: {
          borderRadius: designTokens.radius.sm,
          padding: designTokens.spacing.md,
        },
        md: {
          borderRadius: designTokens.radius.md,
          padding: designTokens.spacing.lg,
        },
        lg: {
          borderRadius: designTokens.radius.lg,
          padding: designTokens.spacing.xl,
        },
      },
    }
  );
}

// Input variants (dynamic)
export function getInputVariants(designTokens: DesignTokens) {
  return createVariantStyles(
    {
      borderRadius: designTokens.radius.lg,
      borderWidth: 1,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.text,
      backgroundColor: designTokens.colors.surface,
      borderColor: designTokens.colors.border,
      minHeight: 44,
    },
    {
      variant: {
        default: {},
        filled: {
          backgroundColor: designTokens.colors.backgroundSecondary,
          borderColor: 'transparent',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.border,
        },
      },
      size: {
        sm: {
          paddingHorizontal: designTokens.spacing.sm,
          paddingVertical: designTokens.spacing.xs,
          minHeight: 36,
          fontSize: designTokens.typography.fontSize.sm,
        },
        md: {
          paddingHorizontal: designTokens.spacing.md,
          paddingVertical: designTokens.spacing.sm,
          minHeight: 44,
          fontSize: designTokens.typography.fontSize.body,
        },
        lg: {
          paddingHorizontal: designTokens.spacing.lg,
          paddingVertical: designTokens.spacing.md,
          minHeight: 52,
          fontSize: designTokens.typography.fontSize.lg,
        },
      },
    }
  );
}

// Text variants (dynamic) - LIQUID theme principles
export function getTextVariants(designTokens: DesignTokens) {
  return createVariantStyles(
    {
      color: designTokens.colors.text,
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body, // Base size for all text
    },
    {
      variant: {
        // Primary text - normal weight, full opacity
        body: {
          fontWeight: designTokens.typography.fontWeight.normal,
          opacity: 1,
          lineHeight: designTokens.typography.fontSize.body * 1.6,
        },
        // Headings - bold weight, full opacity, uppercase
        heading: {
          fontWeight: designTokens.typography.fontWeight.bold,
          fontFamily: designTokens.typography.fontFamily.heading,
          opacity: 1,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.5,
          lineHeight: designTokens.typography.fontSize.body * 1.3,
        },
        // Titles - extra bold weight, full opacity, uppercase
        title: {
          fontWeight: '900' as const,
          opacity: 1,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.5,
          lineHeight: designTokens.typography.fontSize.body * 1.2,
        },
        // Subtitles - medium weight, high opacity
        subtitle: {
          fontWeight: designTokens.typography.fontWeight.medium,
          opacity: 0.9,
          lineHeight: designTokens.typography.fontSize.body * 1.4,
        },
        // Captions - normal weight, reduced opacity
        caption: {
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.textMuted,
          opacity: 0.8,
          lineHeight: designTokens.typography.fontSize.body * 1.5,
        },
        // Muted text - normal weight, low opacity
        muted: {
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.textSecondary,
          opacity: 0.7,
          lineHeight: designTokens.typography.fontSize.body * 1.5,
        },
        // Tagline - medium weight, reduced opacity, lowercase
        tagline: {
          fontWeight: designTokens.typography.fontWeight.medium,
          color: designTokens.colors.textSecondary,
          opacity: 0.8,
          textTransform: 'lowercase' as const,
          letterSpacing: 0.2,
          lineHeight: designTokens.typography.fontSize.body * 1.6,
        },
        // Button text - medium weight, high opacity
        button: {
          fontWeight: designTokens.typography.fontWeight.medium,
          opacity: 0.9,
          lineHeight: designTokens.typography.fontSize.body * 1.4,
        },
        // Section headers - semibold weight, high opacity, uppercase
        section: {
          fontWeight: designTokens.typography.fontWeight.semibold,
          opacity: 0.85,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.5,
          lineHeight: designTokens.typography.fontSize.body * 1.3,
        },
      },
      // Size variants are minimal - only for extreme cases
      size: {
        xs: {
          fontSize: designTokens.typography.fontSize.body - 2,
          lineHeight: (designTokens.typography.fontSize.body - 2) * 1.5,
        },
        sm: {
          fontSize: designTokens.typography.fontSize.body - 1,
          lineHeight: (designTokens.typography.fontSize.body - 1) * 1.5,
        },
        md: {
          fontSize: designTokens.typography.fontSize.body,
          lineHeight: designTokens.typography.fontSize.body * 1.5,
        },
        lg: {
          fontSize: designTokens.typography.fontSize.body + 1,
          lineHeight: (designTokens.typography.fontSize.body + 1) * 1.4,
        },
        xl: {
          fontSize: designTokens.typography.fontSize.body + 2,
          lineHeight: (designTokens.typography.fontSize.body + 2) * 1.3,
        },
        '2xl': {
          fontSize: designTokens.typography.fontSize.body + 4,
          lineHeight: (designTokens.typography.fontSize.body + 4) * 1.3,
        },
        '3xl': {
          fontSize: designTokens.typography.fontSize.body + 6,
          lineHeight: (designTokens.typography.fontSize.body + 6) * 1.2,
        },
      },
    }
  );
}

// Badge variants (dynamic)
export function getBadgeVariants(designTokens: DesignTokens) {
  return createVariantStyles(
    {
      borderRadius: designTokens.radius.full,
      paddingHorizontal: designTokens.spacing.sm,
      paddingVertical: designTokens.spacing.xs,
      fontSize: designTokens.typography.fontSize.xs,
      fontWeight: designTokens.typography.fontWeight.medium,
    },
    {
      variant: {
        default: {
          backgroundColor: designTokens.colors.surface,
          borderColor: designTokens.colors.border,
          borderWidth: 1,
        },
        primary: {
          backgroundColor: designTokens.colors.accent,
          borderColor: designTokens.colors.accent,
          borderWidth: 1,
        },
        secondary: {
          backgroundColor: designTokens.colors.surface,
          borderColor: designTokens.colors.border,
          borderWidth: 1,
        },
        destructive: {
          backgroundColor: designTokens.colors.danger,
          borderColor: designTokens.colors.danger,
          borderWidth: 1,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: designTokens.colors.border,
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