export function getRadiusForHeight(height: number): number {
  if (height <= 40) return 5; // sm
  if (height <= 56) return 10; // md
  return 14; // lg
}
