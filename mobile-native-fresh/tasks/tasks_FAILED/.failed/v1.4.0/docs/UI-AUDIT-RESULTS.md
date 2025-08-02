# UI Audit Report

## Findings:
- Most Dashboard components follow visual consistency (Card, Tag, InfoBox)
- Settings screen uses hardcoded values, no tokens
- Global font weights and spacings vary inconsistently
- Glass morphism not applied; theme role system absent in 80% of components

## Suggestions:
- Promote Card, Tag, Form roles to global theme with spacing/glass presets
- Normalize font size/weight per role
- Wrap all clickable components in AutoRoleView for theming control

