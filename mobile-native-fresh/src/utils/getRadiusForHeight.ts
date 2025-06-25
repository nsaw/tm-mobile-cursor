import { useTheme } from '../theme/ThemeProvider';

export function getRadiusForHeight(height: number): number {
  const { tokens } = useTheme();
  
  if (height <= 40) return tokens.radius.sm;
  if (height <= 56) return tokens.radius.md;
  return tokens.radius.lg;
}
