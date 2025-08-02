# VISUAL VALIDATION PLAN — v1.4.0

## Goals
- Confirm all role assignments match visual behavior
- Ensure no duplicate theme applications
- Prevent visual regressions (alignment, morphism, etc.)

## Methods
- Role Snapshot Tests (role → token → visual)
- Tap target highlighting
- Spacing boundary inspection
- Glass morphism overlay preview

## Tools
- `highlight-roles.debug()` overlay util
- `validateSpacing()` helper script
- `expo start --dev-client` for test builds
