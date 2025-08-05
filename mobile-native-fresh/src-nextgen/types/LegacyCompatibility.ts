export interface LegacyCompatibilityLayer {
  transformLegacyData: (data: unknown) => unknown;
  validateLegacyData: (data: unknown) => boolean;
  migrateLegacyType: (legacyType: string) => string;
}

export interface LegacyTypeAdapter<TLegacy, TNextgen> {
  toNextgen: (legacy: TLegacy) => TNextgen;
  toLegacy: (nextgen: TNextgen) => TLegacy;
  validate: (data: unknown) => data is TLegacy;
}

export function createLegacyAdapter<TLegacy, TNextgen>(
  toNextgen: (legacy: TLegacy) => TNextgen,
  toLegacy: (nextgen: TNextgen) => TLegacy,
  validate: (data: unknown) => data is TLegacy
): LegacyTypeAdapter<TLegacy, TNextgen> {
  return {
    toNextgen,
    toLegacy,
    validate,
  };
}

interface LegacyUser {
  id: string;
  email: string;
  name: string;
  premium?: boolean;
  created_at: string;
  updated_at: string;
}

interface NextgenUser {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export const legacyAdapters = {
  // Example adapters for common legacy types
  user: createLegacyAdapter(
    (legacy: LegacyUser): NextgenUser => ({
      id: legacy.id,
      email: legacy.email,
      name: legacy.name,
      isPremium: legacy.premium || false,
      createdAt: legacy.created_at,
      updatedAt: legacy.updated_at,
    }),
    (nextgen: NextgenUser): LegacyUser => ({
      id: nextgen.id,
      email: nextgen.email,
      name: nextgen.name,
      premium: nextgen.isPremium,
      created_at: nextgen.createdAt,
      updated_at: nextgen.updatedAt,
    }),
    (data: unknown): data is LegacyUser => 
      typeof data === 'object' && data !== null && 'id' in data && 'email' in data
  ),
}; 