import { DesignTokens } from '../theme/tokens';

export function getRadiusForHeight(height: number, designTokens: DesignTokens): number {
  if (height <= 40) return designTokens.radius.sm;
  if (height <= 56) return designTokens.radius.md;
  return designTokens.radius.lg;
}
