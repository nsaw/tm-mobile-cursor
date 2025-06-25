import { useTheme } from '@/theme/ThemeProvider';

export function getTextVariant(variant: keyof ReturnType<typeof useTheme>['textVariants']) {
  const theme = useTheme();
  return theme.textVariants?.[variant] ?? {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Ubuntu'
  };
}
