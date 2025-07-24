# 🎨 Style Guide (Nick Sawyer / Thoughtmarks)

## Theme + Design Tokens
- Tokens live in `src/theme/tokens.ts` and must be accessed via `useTheme()` or `getStyles(tokens)`
- Do not access `tokens.colors.*` at module scope

## Typography
- Use Tailwind font utilities
- Hierarchy: `text-xl` for headlines, `text-base` for body
- Emphasis by weight (`font-semibold`), opacity (`text-opacity-70`), and casing — not by size

## Layout & Spacing
- Stick to a `4px` scale
- Use `p-2`, `gap-4`, `space-y-3`, etc.
- Keep section padding consistent unless otherwise scoped

## Cards & Containers
- Use `rounded-2xl`, `shadow-md`, `bg-glass-light` or `bg-glass-dark`
- Avoid overlap{ { { { ping z-indices unless explicitly needed & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

## Glassmorphism
- Only via `getGlassStyle()` or approved `GlassWrapper`
- Must be mobile-performant
- No deep blur unless used on splash screen

## Accessibility
- No color-only distinctions
- Touch targets = minimum 44x44
- Use accessible label pro{ { { { ps where needed & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
