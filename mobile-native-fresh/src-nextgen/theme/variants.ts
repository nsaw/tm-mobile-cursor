import { // TODO: Remove designTokens import, use useTheme() instead } from './designTokens';

export interface BadgeVariant {
  backgroundColor: string;
  color: string;
  borderColor?: string;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: string;
}

export const getBadgeVariants = (): Record<string, BadgeVariant> => ({
  primary: {
    backgroundColor: designTokens.colors.primary,
    color: designTokens.colors.background,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  secondary: {
    backgroundColor: designTokens.colors.surface,
    color: designTokens.colors.text.primary,
    borderColor: designTokens.colors.border,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.normal,
  },
  success: {
    backgroundColor: designTokens.colors.success,
    color: designTokens.colors.background,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  warning: {
    backgroundColor: designTokens.colors.warning,
    color: designTokens.colors.background,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  error: {
    backgroundColor: designTokens.colors.error,
    color: designTokens.colors.background,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
});

export const mergeVariantStyles = (
  baseVariant: BadgeVariant,
  overrides: Partial<BadgeVariant>
): BadgeVariant => ({
  ...baseVariant,
  ...overrides,
}); 