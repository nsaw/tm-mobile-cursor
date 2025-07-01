import { DesignTokens } from '../theme/tokens';

export function getRadiusForHeight(height: number, tokens: DesignTokens): number {
  const { tokens } = useTheme();

if (height <= 40) return tokens.radius.sm;
  if (height <= 56) return tokens.radius.md;
  return tokens.radius.lg;
}
