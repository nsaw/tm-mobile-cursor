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
    borderRadius: designTokens.radius.md,
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
        backgroundColor: designTokens.colors.accent,
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
        backgroundColor: designTokens.colors.danger,
        borderColor: designTokens.colors.danger,
        borderWidth: 1,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: designTokens.colors.border,
        borderWidth: 1,
      },
      brand: {
        backgroundColor: designTokens.colors.brand,
        borderColor: designTokens.colors.brand,
        borderWidth: 1,
      },
    },
    size: {
      sm: {
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: designTokens.spacing.lg,
        paddingVertical: designTokens.spacing.md,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: designTokens.spacing.xl,
        paddingVertical: designTokens.spacing.lg,
        minHeight: 52,
      },
      icon: {
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.md,
        minHeight: 44,
        minWidth: 44,
        borderRadius: designTokens.radius.full,
      },
    },
  }
);

// Card variants (matching web app's card system)
export const cardVariants = createVariantStyles(
  {
    borderRadius: designTokens.radius.lg,
    backgroundColor: designTokens.colors.surface,
    borderColor: designTokens.colors.border,
    borderWidth: 1,
    padding: designTokens.spacing.lg,
  },
  {
    variant: {
      default: {},
      glass: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        // Note: backdrop-filter not available in React Native
        // We'll use opacity and blur effects where possible
      },
      elevated: {
        ...designTokens.shadows.md,
      },
      interactive: {
        backgroundColor: designTokens.colors.surface,
        borderColor: designTokens.colors.borderHover,
      },
    },
    size: {
      sm: {
        padding: designTokens.spacing.md,
      },
      md: {
        padding: designTokens.spacing.lg,
      },
      lg: {
        padding: designTokens.spacing.xl,
      },
    },
  }
);

// Input variants
export const inputVariants = createVariantStyles(
  {
    borderRadius: designTokens.radius.md,
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
        fontSize: designTokens.typography.fontSize.body,
        fontWeight: designTokens.typography.fontWeight.normal,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      heading: {
        fontSize: designTokens.typography.fontSize.heading,
        fontWeight: designTokens.typography.fontWeight.bold,
        fontFamily: designTokens.typography.fontFamily.heading,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      subheading: {
        fontSize: designTokens.typography.fontSize.lg,
        fontWeight: designTokens.typography.fontWeight.semibold,
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      caption: {
        fontSize: designTokens.typography.fontSize.sm,
        fontWeight: designTokens.typography.fontWeight.normal,
        color: designTokens.colors.textMuted,
      },
      label: {
        fontSize: designTokens.typography.fontSize.sm,
        fontWeight: designTokens.typography.fontWeight.medium,
        color: designTokens.colors.textSecondary,
      },
    },
    size: {
      xs: { fontSize: designTokens.typography.fontSize.xs },
      sm: { fontSize: designTokens.typography.fontSize.sm },
      md: { fontSize: designTokens.typography.fontSize.body },
      lg: { fontSize: designTokens.typography.fontSize.lg },
      xl: { fontSize: designTokens.typography.fontSize.xl },
      '2xl': { fontSize: designTokens.typography.fontSize['2xl'] },
      '3xl': { fontSize: designTokens.typography.fontSize['3xl'] },
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