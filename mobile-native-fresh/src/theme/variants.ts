import { designTokens } from './tokens';
import { StyleSheet } from 'react-native';

// Utility function to create variant styles
function createVariantStyles<T extends Record<string, any>>(
  base: any,
  variants: T
) {
  return { base, variants };
}

// Button variants (matching web app's button system)
export const buttonVariants = createVariantStyles(
  {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 44, // Touch target minimum
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
        borderRadius: 8, // Match bin card
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
        minHeight: 36,
      },
      md: {
        borderRadius: 8, // Match bin card
        paddingHorizontal: designTokens.spacing.lg,
        paddingVertical: designTokens.spacing.md,
        minHeight: 44,
      },
      lg: {
        borderRadius: 8, // Match bin card
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

// Card variants (matching web app's card system)
export const cardVariants = createVariantStyles(
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

// Input variants
export const inputVariants = createVariantStyles(
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

// Text variants
export const textVariants = createVariantStyles(
  {
    color: designTokens.colors.text,
    fontFamily: designTokens.typography.fontFamily.body,
  },
  {
    variant: {
      body: {
        fontSize: designTokens.typography.fontSize.sm,
        fontWeight: designTokens.typography.fontWeight.normal,
        lineHeight: designTokens.typography.fontSize.sm * 1.6,
      },
      heading: {
        fontSize: designTokens.typography.fontSize.lg,
        fontWeight: designTokens.typography.fontWeight.bold,
        fontFamily: designTokens.typography.fontFamily.heading,
        lineHeight: designTokens.typography.fontSize.lg * 1.3,
      },
      heading2: {
        fontSize: designTokens.typography.fontSize['2xl'],
        fontWeight: designTokens.typography.fontWeight.bold,
        fontFamily: designTokens.typography.fontFamily.body,
        lineHeight: designTokens.typography.fontSize['2xl'] * 1.2,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      subheading: {
        fontSize: designTokens.typography.fontSize.body,
        fontWeight: designTokens.typography.fontWeight.normal,
        lineHeight: designTokens.typography.fontSize.body * 1.4,
      },
      caption: {
        fontSize: designTokens.typography.fontSize.xs,
        fontWeight: designTokens.typography.fontWeight.normal,
        color: designTokens.colors.textMuted,
        lineHeight: designTokens.typography.fontSize.xs * 1.5,
      },
      label: {
        fontSize: designTokens.typography.fontSize.xs,
        fontWeight: designTokens.typography.fontWeight.normal,
        color: designTokens.colors.textSecondary,
        lineHeight: designTokens.typography.fontSize.xs * 1.5,
      },
    },
    size: {
      xs: { 
        fontSize: designTokens.typography.fontSize.xs - 2,
        lineHeight: (designTokens.typography.fontSize.xs - 2) * 1.5,
      },
      sm: { 
        fontSize: designTokens.typography.fontSize.xs,
        lineHeight: designTokens.typography.fontSize.xs * 1.5,
      },
      md: { 
        fontSize: designTokens.typography.fontSize.sm,
        lineHeight: designTokens.typography.fontSize.sm * 1.6,
      },
      lg: { 
        fontSize: designTokens.typography.fontSize.body,
        lineHeight: designTokens.typography.fontSize.body * 1.4,
      },
      xl: { 
        fontSize: designTokens.typography.fontSize.lg,
        lineHeight: designTokens.typography.fontSize.lg * 1.3,
      },
      '2xl': { 
        fontSize: designTokens.typography.fontSize.xl,
        lineHeight: designTokens.typography.fontSize.xl * 1.3,
      },
      '3xl': { 
        fontSize: designTokens.typography.fontSize['2xl'],
        lineHeight: designTokens.typography.fontSize['2xl'] * 1.2,
      },
    },
  }
);

// Badge/Tag variants
export const badgeVariants = createVariantStyles(
  {
    borderRadius: designTokens.radius.full,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
      success: {
        backgroundColor: designTokens.colors.success,
        borderColor: designTokens.colors.success,
        borderWidth: 1,
      },
      warning: {
        backgroundColor: designTokens.colors.warning,
        borderColor: designTokens.colors.warning,
        borderWidth: 1,
      },
      danger: {
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
    size: {
      sm: {
        paddingHorizontal: designTokens.spacing.xs,
        paddingVertical: 2,
      },
      md: {
        paddingHorizontal: designTokens.spacing.sm,
        paddingVertical: designTokens.spacing.xs,
      },
      lg: {
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
      },
    },
  }
);

// Utility function to merge variant styles
export function mergeVariantStyles(
  base: any,
  variantProps: Record<string, any>
): any {
  let result = { ...base };
  
  Object.entries(variantProps).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      result = { ...result, ...value };
    }
  });
  
  return result;
} 