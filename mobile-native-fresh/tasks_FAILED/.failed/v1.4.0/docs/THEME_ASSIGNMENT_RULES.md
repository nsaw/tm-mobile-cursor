# THEME ASSIGNMENT RULES — v1.4.0

## Use `designTokens` for all theme-bound components

DO:
```ts
const { tokens, designTokens } = useTheme();
const style = {
  padding: designTokens.spacing.sm,
  color: designTokens.text.primary,
};
```

DO NOT:
```ts
import tokens from 'theme/tokens';
const style = { color: tokens.text.primary }; // ❌ not reactive
```

## Spacing & Radius Enforcement

| Type         | Spacing        | Radius      |
|--------------|----------------|-------------|
| Card         | `md` / `lg`    | `xl`        |
| Button       | `sm` / `md`    | `full`      |
| InfoBox      | `md`           | `md`        |
| Section      | `lg` / `xl`    | `none`      |

## Glass Morphism

Only apply morph effects to:
- `Card`
- `Section`
- `InfoBox`

Avoid applying to:
- `FAB`
- `BottomNav`
- `Header`
