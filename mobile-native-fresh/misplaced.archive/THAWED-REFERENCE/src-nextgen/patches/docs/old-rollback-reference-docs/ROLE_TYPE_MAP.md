# ROLE TYPE MAP — v1.4.0

A standardized interface between component type and styling logic.

---

## 🔠 Core Types

| Type            | Style Driven By         | Interaction | Notes |
|-----------------|-------------------------|-------------|-------|
| `Card`          | `tokens.card.*`         | Optional    | Used for passive or actionable surfaces |
| `Section`       | `tokens.section.*`      | None        | Used for content grouping, not clickable |
| `Wrapper`       | None                    | None        | For layout/spacing only |
| `InfoBox`       | `tokens.info.*`         | No          | Read-only, non-interactive display |
| `FormSection`   | `tokens.form.*`         | Input-based | Labels, helpers, inputs |
| `QuickAction`   | `tokens.quick.*`        | Tap/Swipe   | Used for utility rows |
| `Button`        | `tokens.button.*`       | Tap         | Standard clickables |
| `Tag`           | `tokens.tag.*`          | Tap/Filter  | Must resolve style for pill, color, spacing |

---

## 🧪 Testing Strategy

Use automated snapshot + tap test to confirm:
- Role → Token Mapping
- Spacing and size bounds
- Clickable behavior when applied
