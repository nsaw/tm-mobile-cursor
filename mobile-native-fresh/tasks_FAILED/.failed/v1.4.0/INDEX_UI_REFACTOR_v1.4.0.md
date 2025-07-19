# INDEX — v1.4.0 UI Refactor Phases
- `1_v1.4.0_auto-roleview-mapping.cursor-instruction.json` — Tag all UI elements with semantic roles (Card, Tag, Info, etc.)
- `2_v1.4.0_theme-role-global-enforce.cursor-instruction.json` — Apply styling/spacing based on roles (spacing, casing, borders)
- `3_v1.4.0_glass-morphism-ui.cursor-instruction.json` — Safely inject morph overlays to eligible visual roles
- `4_v1.4.0_ui-refactor-preflight.cursor-instruction.json` — Normalize font sizing, gaps, casing, alignment globally
- `5_v1.4.0_clickable-validation.cursor-instruction.json` — Dry-run audit: clickable integrity & destination routing
- `6_v1.4.0_final-ui-validation.cursor-instruction.json` — Final visual boot test, dry-run validation pass