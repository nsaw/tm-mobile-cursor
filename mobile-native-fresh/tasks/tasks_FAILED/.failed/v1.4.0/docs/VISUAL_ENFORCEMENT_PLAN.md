# Visual Enforcement Plan

## Strategy:
- Apply tokens by role, not individual component
- Use `useTheme()` only inside components
- All `tokens` calls scoped, no global leakage
- Enforce via ESLint and wrapper validation

## Morphism Target Roles:
- Card
- InfoBox
- Section

## Color Token Enforcement:
- Text: use `tokens.color.text.default`
- Backgrounds: use `tokens.color.surface`, not hardcoded hex

