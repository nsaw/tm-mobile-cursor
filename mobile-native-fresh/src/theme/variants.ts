import { StyleSheet } from 'react-native';
import { DesignTokens } from './tokens';

// Utility function to create variant styles
function createVariantStyles<T extends Record<string, any>>(
  base: any,
  variants: T
) {
  return { base, variants };
}

// Button variants (dynamic)
export function getButtonVariants(tokens: DesignTokens) {
  return createVariantStyles(
    {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 44,
    },
    {
      variant: {
        primary: {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.accent,
          borderWidth: 1,
        },
        secondary: {
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.border,
          borderWidth: 1,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        },
        destructive: {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.danger,
          borderWidth: 1,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.border,
          borderWidth: 1,
        },
        brand: {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.brand,
          borderWidth: 1,
        },
      },
      size: {
        sm: {
          borderRadius: 8,
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
          minHeight: 36,
        },
        md: {
          borderRadius: 8,
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.md,
          minHeight: 44,
        },
        lg: {
          borderRadius: 8,
          paddingHorizontal: tokens.spacing.xl,
          paddingVertical: tokens.spacing.lg,
          minHeight: 52,
        },
        icon: {
          borderRadius: tokens.radius.full,
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.md,
          minHeight: 44,
          minWidth: 44,
        },
      },
    }
  );
}

// Card variants (dynamic)
export function getCardVariants(tokens: DesignTokens) {
  return createVariantStyles(
    {
      backgroundColor: tokens.colors.backgroundSecondary,
      borderColor: tokens.colors.border,
      borderWidth: 1,
      padding: tokens.spacing.lg,
    },
    {
      variant: {
        default: {
          backgroundColor: tokens.colors.backgroundSecondary,
        },
        glass: {
          backgroundColor: 'rgba(26, 26, 30, 0.9)',
          borderColor: 'rgba(255,255,255,0.25)',
        },
        elevated: {
          backgroundColor: tokens.colors.backgroundSecondary,
          ...tokens.shadows.md,
        },
        interactive: {
          backgroundColor: tokens.colors.backgroundSecondary,
          borderColor: tokens.colors.borderHover,
        },
      },
      size: {
        sm: {
          borderRadius: tokens.radius.sm,
          padding: tokens.spacing.md,
        },
        md: {
          borderRadius: tokens.radius.md,
          padding: tokens.spacing.lg,
        },
        lg: {
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
        },
      },
    }
  );
}

// Input variants (dynamic)
export function getInputVariants(tokens: DesignTokens) {
  return createVariantStyles(
    {
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.text,
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.border,
      minHeight: 44,
    },
    {
      variant: {
        default: {},
        filled: {
          backgroundColor: tokens.colors.backgroundSecondary,
          borderColor: 'transparent',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.border,
        },
      },
      size: {
        sm: {
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
          minHeight: 36,
          fontSize: tokens.typography.fontSize.sm,
        },
        md: {
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
          minHeight: 44,
          fontSize: tokens.typography.fontSize.body,
        },
        lg: {
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.md,
          minHeight: 52,
          fontSize: tokens.typography.fontSize.lg,
        },
      },
    }
  );
}

// Text variants (dynamic)
export function getTextVariants(tokens: DesignTokens) {
  return createVariantStyles(
    {
      color: tokens.colors.text,
      fontFamily: tokens.typography.fontFamily.body,
    },
    {
      variant: {
        body: {
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.normal,
          lineHeight: tokens.typography.fontSize.sm * 1.6,
        },
        heading: {
          fontSize: tokens.typography.fontSize.xl,
          fontWeight: tokens.typography.fontWeight.bold,
          fontFamily: tokens.typography.fontFamily.heading,
          lineHeight: tokens.typography.fontSize.xl * 1.3,
        },
        heading2: {
          fontSize: tokens.typography.fontSize['3xl'],
          fontWeight: tokens.typography.fontWeight.bold,
          fontFamily: tokens.typography.fontFamily.body,
          lineHeight: tokens.typography.fontSize['3xl'] * 1.2,
        },
        subheading: {
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.normal,
          lineHeight: tokens.typography.fontSize.lg * 1.4,
        },
        caption: {
          fontSize: tokens.typography.fontSize.xs,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.textMuted,
          lineHeight: tokens.typography.fontSize.xs * 1.5,
        },
        label: {
          fontSize: tokens.typography.fontSize.xs,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.textSecondary,
          lineHeight: tokens.typography.fontSize.xs * 1.5,
        },
      },
      size: {
        xs: { 
          fontSize: tokens.typography.fontSize.xs - 2,
          lineHeight: (tokens.typography.fontSize.xs - 2) * 1.5,
        },
        sm: { 
          fontSize: tokens.typography.fontSize.xs,
          lineHeight: tokens.typography.fontSize.xs * 1.5,
        },
        md: { 
          fontSize: tokens.typography.fontSize.sm,
          lineHeight: tokens.typography.fontSize.sm * 1.6,
        },
        lg: { 
          fontSize: tokens.typography.fontSize.body,
          lineHeight: tokens.typography.fontSize.body * 1.4,
        },
        xl: { 
          fontSize: tokens.typography.fontSize.xl + 2,
          lineHeight: (tokens.typography.fontSize.xl + 2) * 1.3,
        },
        '2xl': { 
          fontSize: tokens.typography.fontSize['2xl'] + 2,
          lineHeight: (tokens.typography.fontSize['2xl'] + 2) * 1.3,
        },
        '3xl': { 
          fontSize: tokens.typography.fontSize['3xl'] + 2,
          lineHeight: (tokens.typography.fontSize['3xl'] + 2) * 1.2,
        },
      },
    }
  );
}

// Badge variants (dynamic)
export function getBadgeVariants(tokens: DesignTokens) {
  return createVariantStyles(
    {
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
    },
    {
      variant: {
        default: {
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.border,
        },
        accent: {
          backgroundColor: tokens.colors.accent,
          borderColor: tokens.colors.accent,
        },
        success: {
          backgroundColor: tokens.colors.success,
          borderColor: tokens.colors.success,
        },
        warning: {
          backgroundColor: tokens.colors.warning,
          borderColor: tokens.colors.warning,
        },
        danger: {
          backgroundColor: tokens.colors.danger,
          borderColor: tokens.colors.danger,
        },
        brand: {
          backgroundColor: tokens.colors.brand,
          borderColor: tokens.colors.brand,
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