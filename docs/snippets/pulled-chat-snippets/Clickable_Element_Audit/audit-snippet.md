{ { { { npm run audit:clickables & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Verifies:
- All buttons, links, and touchables have:
  - `accessibilityLabel`
  - `accessible={true}`
  - `accessibilityRole`
