# 🧩 AutoRoleView v3 Roles Cheatsheet

A reference for developers to understand, apply, and validate `AutoRoleView` roles consistently across the codebase.

---

## 🧱 Layout Roles (`UILayoutRole`)
| Role Name   | Description |
|------------|-------------|
| `card`     | Elevated content containers (shadows, radius) |
| `section`  | Logical content grou{ { { { ping areas | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `header`   | Top navigation bar or screen header |
| `footer`   | Bottom navigation, fixed elements |
| `navigation` | Tab bars, side drawers, link grou{ { { { ps | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `modal`    | Full-screen or pop-up overlay |
| `container` | Generic wrapper (use sparingly) |

---

## ✍️ Content Roles (`UIContentRole`)
| Role Name       | Description |
|----------------|-------------|
| `heading`       | Page or section title |
| `body`          | Main text content |
| `caption`       | Subtext or descriptive copy |
| `label`         | Form labels, field descriptors |
| `button-text`   | Label text inside buttons |
| `link-text`     | Text inside navigational links |

---

## 🎛️ Interactive Roles (`UIInteractiveRole`)
| Role Name           | Description |
|---------------------|-------------|
| `button-nav-primary`    | Primary navigation button |
| `button-nav-secondary`  | Secondary navigation button |
| `card-as-nav`           | Card acting as navigation (inherits button-nav-primary) |
| `link-nav`              | Navigation link |
| `button-action`         | Action button (submit, save, etc.) |
| `button-function`       | Functional button (dropdown, menu) |
| `input`                | Text input field |
| `toggle`               | Checkbox or toggle switch |
| `slider`               | Range/slider control |
| `chip`                 | Interactive badge/tag, selectable |
| `badge`                | Static or stateful status badge |
| `tag`                  | Non-interactive label element |

---

## 🧬 Role Inheritance
- `card-as-nav` **inherits** from `button-nav-primary` (gets nav button style)
- Inheritance is handled in utilities and style resolution

---

## 🌐 Role Group Utilities
Use `getRoleGroup(role)` to programmatically resolve high-level role families.  
Example groups:
- `"layout"` → `card`, `section`, `header`, etc.
- `"interactive"` → `button-action`, `toggle`, etc.
- `"content"` → `heading`, `label`, etc.

---

## 🛡️ Role Validation
- Only **one** role type per component (`layoutRole`, `contentRole`, or `interactiveRole`)
- All roles validated at runtime and compile-time
- Inheritance and group logic handled in utilities
- Use `validateRoleProps` and `getRoleDebugInfo` for validation/debugging
- Warnings for ambiguous or conflicting roles (e.g., `card` + `card-as-nav`)

---

## 🔍 Debugging & Visual Feedback
- Use the `RoleDebugger` or enable debug mode in `AutoRoleView` to visualize role state
- **Green** = valid, **Red** = invalid, **Orange** = warning/fallback
- Debug styles are dev-only and never shipped to production

---

## 📂 File Location
- Defined in: `src/types/roles.ts`
- Used by: `AutoRoleView`, `roleStyles`, `roleValidation`, `safeAreaRoles`, `RoleDebugger`

---

✅ This sheet is auto-generated. Edit `roles.ts` to update.