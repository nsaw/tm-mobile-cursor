import { useTheme } from '../theme/ThemeProvider';

export function getTextVariant(variant: keyof ReturnType<typeof useTheme>['variants']['textVariants']['variants']) {
  const theme = useTheme();
  const textVariants = theme.variants?.textVariants;
  
  if (!textVariants) {
    return {
      fontSize: 15,
      fontWeight: '400',
      fontFamily: 'Ubuntu',
      color: '#E0E0E0'
    };
  }
  
  const base = textVariants.base || {};
  const variantStyle = textVariants.variants?.[variant] || {};
  
  return {
    ...base,
    ...variantStyle
  };
}
