import { getTextVariants } from '../theme/variants';
import type { DesignTokens } from '../theme/tokens';

export function getTextVariant(variant: string, tokens: DesignTokens) {
  const textVariants = getTextVariants(tokens);
  const base = textVariants.base || {};
  const variantStyle = textVariants.variants.variant[variant as keyof typeof textVariants.variants.variant] || {};
  
  return {
    ...base,
    ...variantStyle
  };
}
