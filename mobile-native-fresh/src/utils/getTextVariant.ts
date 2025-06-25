import { textVariants } from '../theme/variants';

export function getTextVariant(variant: keyof typeof textVariants.variants.variant) {
  const base = textVariants.base || {};
  const variantStyle = textVariants.variants.variant[variant] || {};
  
  return {
    ...base,
    ...variantStyle
  };
}
