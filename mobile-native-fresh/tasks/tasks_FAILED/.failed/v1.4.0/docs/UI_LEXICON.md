# UI LEXICON — Thoughtmarks v1.4.0

A semantic role-based system for styling, theming, and component enforcement across the mobile app.

---

## 🔸 Purpose-Based Roles

| Role           | Description                                         | Visual Style Source        |
|----------------|-----------------------------------------------------|----------------------------|
| `Card`         | Flexible visual container, can hold action/info     | UnifiedThoughtmark         |
| `ActionCard`   | Card with tap handler, visually button-like         | Bin cards on Dashboard     |
| `Tag`          | Categorical marker, often styled like pill/button   | Tag strip under header     |
| `InfoBox`      | Passive content unit, not clickable                 | Settings InfoBoxes         |
| `FormSection`  | Grouped inputs with labels and helpers              | Settings Forms             |
| `QuickAction`  | Shortcut triggers, swipeable or tapable             | Dashboard AI row buttons   |
| `Section`      | Large page blocks (scroll area, grouping)           | Dashboard scroll bodies    |
| `Wrapper`      | Layout-only container, often unstyled               | View used for spacing only |

---

## 🔸 Interaction Roles

| Role        | Trigger     | Example                       |
|-------------|-------------|-------------------------------|
| `Button`    | `onPress`   | Save, Feedback, Submit        |
| `Toggle`    | `onChange`  | Theme switch, AI voice toggle |
| `Dropdown`  | `onSelect`  | Tag selector, Role choices    |

---

## 🔐 Reserved / System Roles (Do Not Override)

| Role              | Purpose                               |
|-------------------|----------------------------------------|
| `PersistentNav`   | Bottom nav, always visible             |
| `FAB`             | Floating Action Button (Add, Capture)  |
| `ModalFrame`      | Container for all modal content        |
| `SafeAreaFiller`  | Spacer behind persistent layers        |

---

## 🔧 Role Enforcement Guidelines

- **Roles must map directly to a themed style object via `useTheme().tokens` or `useTheme().designTokens`.**
- **Mixed-role components must be broken up into subcomponents.**
- All **layout-only containers** should be labeled `Wrapper` unless they provide scroll, press, or info functions.
- Avoid using ambiguous roles like “Card” without clarifying its interaction (e.g. `ActionCard` vs `InfoBox`).
