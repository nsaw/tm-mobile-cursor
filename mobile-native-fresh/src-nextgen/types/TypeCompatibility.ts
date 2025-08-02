export interface CompatibilityCheck {
  typeName: string;
  isCompatible: boolean;
  conflicts: string[];
  suggestions: string[];
}

export interface LegacyTypeMapping {
  legacyType: string;
  nextgenType: string;
  transformer?: (value: unknown) => unknown;
  validator?: (value: unknown) => boolean;
}

export interface TypeMigration {
  from: string;
  to: string;
  steps: string[];
  breakingChanges: string[];
  migrationGuide: string;
}

export const legacyTypeMappings: LegacyTypeMapping[] = [
  {
    legacyType: 'LegacyUser',
    nextgenType: 'User',
    transformer: (value) => ({
      ...value,
      isPremium: value.premium || false,
    }),
  },
  {
    legacyType: 'LegacyThoughtmark',
    nextgenType: 'Thoughtmark',
    transformer: (value) => ({
      ...value,
      tags: value.tags || [],
      isArchived: value.archived || false,
      isPinned: value.pinned || false,
    }),
  },
];

export function checkTypeCompatibility(legacyType: string, nextgenType: string): CompatibilityCheck {
  const mapping = legacyTypeMappings.find(m => m.legacyType === legacyType && m.nextgenType === nextgenType);
  
  return {
    typeName: `${legacyType} -> ${nextgenType}`,
    isCompatible: !!mapping,
    conflicts: mapping ? [] : ['No direct mapping found'],
    suggestions: mapping ? ['Use provided transformer'] : ['Create custom transformer'],
  };
} 