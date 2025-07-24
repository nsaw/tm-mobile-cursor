v1.2.2 UI Polish— Liquid

STAGE 1

{
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  // 🏹 MISSION: LIQUID THEME v1 — Restoration Phase 1
  // 🎯 GOAL: Visually align mobile-native UI with the original webapp’s Liquid Theme aesthetic
  // ✅ TEXT PRESERVED: DO NOT CHANGE FONT SIZE VALUES
  // ✅ FOCUS ONLY: typography weight, casing, and opacity alignment
  // ✅ NON-DESTRUCTIVE: Apply glass morphism overlays without layout regression
  // ✅ STRUCTURAL ENFORCEMENT: Classify cards vs. sections for correct rule application
  // ✅ Run `{ { { { { { { { npm run lint:fix-all` continuously in background & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
  // ✅ PRE-CHECK PREP: Rollback Safety Tag
  📌 BEFORE ANY FILE CHANGES:
  git add .
  git commit -m "chore(rollback): full snapshot before [🎯 GOAL]"
  git tag v1.2.2_liquid-theme-rollback
  git push origin v1.2.2_liquid-theme-rollback
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  "branch": "feature/liquid-theme-v1-restoration",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",

  "phases": [
    {
      "section": "Element Role Classification",
      "actions": [
        "Scan all JSX layout trees to identify and label root-level containers as one of: 'card', 'section', 'input', 'button-wrapper', or 'page-wrapper'",
        "Insert or verify semantic classnames or data attributes per element type (e.g. `data-role='card'` or `styleRole='section'`)",
        "Report uncategorized layout containers for manual inspection"
      ],
      "commit": "chore: classified layout elements by role",
      "tag": "v1.2.2_element-roles"
    },
    {
      "section": "Typography Weight, Casing, and Opacity Adjustments",
      "actions": [
        "Ensure all `title`, `sectionTitle`, and `buttonText` follow prescribed weights from typography tokens (medium, semibold, bold)",
        "Apply consistent casing rules: uppercase for tags/titles where appropriate, sentence case for body text",
        "Apply opacity standards: titles (1), sectionTitles (0.7), secondaryText (0.6), meta or caption (0.4)"
      ],
      "commit": "fix: standardized typography casing, weight, and opacity",
      "tag": "v1.2.2_typography-corrections"
    },
    {
      "section": "Glass Morphism Overlay Application",
      "actions": [
        "Wrap all elements with `data-role='card'` or `styleRole='card'` in a new `GlassCardWrapper` component",
        "Use native-safe blur + translucent background via `expo-blur` (fallback gracefully if unavailable)",
        "Ensure borders, backgrounds, shadows, and elevation inside wrapper are masked by the glass layer",
        "Avoid morphism overlays on `section`, `SafeAreaView`, or `ScrollView`"
      ],
      "commit": "feat: applied native-compatible glass morphism overlays to card roles",
      "tag": "v1.2.2_glass-applied"
    },
    {
      "section": "Theme Token Authority Revalidation",
      "actions": [
        "Re-scan all JSX files to ensure `useTheme()` is used properly and no static colors remain",
        "Report any color overrides within card-like components that should defer to glass layer styling",
        "Inject glass-theme layer with z-index/priority override on: surface color, shadow, border, elevation"
      ],
      "commit": "chore: revalidated theming token compliance and overlay authority",
      "tag": "v1.2.2_theme-revalidated"
    }
  ],

  ////////////////////////////////////////////
  // 🔚 FINAL SNAPSHOT + CLOSEOUT
  ////////////////////////////////////////////
  "final": {
    "commit": "chore: liquid v1 restoration complete",
    "tag": "v1.2.2_liquid-theme-restored",
    "notes": "Restored visual hierarchy, native-safe morphisms, and text styling to match webapp aesthetic. Typography size untouched."
  }
}

STAGE 2

full implementation breakdown including the GlassCardWrapper, scripts/audit-style-roles.ts, and a Cursor-ready .cursor-instruction.json task file.

⸻

✅ 1. GlassCardWrapper.tsx — Native-Compatible Morphism

// src/components/wrappers/GlassCardWrapper.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/ThemeProvider';

interface Pro{ { { { ps { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark';
  borderRadius?: number;
  style?: any;
}

export const GlassCardWrapper: React.FC<Props> = ({
  children,
  intensity = 50,
  tint = 'dark',
  borderRadius = 16,
  style
}) => {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, style, { borderRadius }]}>
      {Platform.OS === 'ios' || Platform.OS === 'android' ? (
        <BlurView
          intensity={intensity}
          tint={tint}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: tokens.colors.backgroundGlassFallback,
              borderRadius,
            },
          ]}
        />
      )}
      <View style={[styles.content, { borderRadius }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    zIndex: 1,
    position: 'relative',
  },
});

export default GlassCardWrapper;


✅ 2. scripts/audit-style-roles.ts — JSX Role Classification Auditor

// scripts/audit-style-roles.ts
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const TAGS = ['View', 'ScrollView', 'TouchableOpacity', 'Pressable'];

const classify = (code: string): string[] => {
  const roles: string[] = [];

  if (/TouchableOpacity|Pressable/.test(code)) roles.push('button-wrapper');
  if (/ScrollView|FlatList/.test(code)) roles.push('section');
  if (/View/.test(code) && /shadow|elevation|borderRadius/.test(code)) roles.push('card');
  return roles;
};

const scan = () => {
  glob('src/**/*.tsx', {}, (err, files) => {
    const report: Record<string, string[]> = {};

    files.forEach((file) => {
      const code = fs.readFileSync(file, 'utf8');
      const roles = classify(code);
      if (roles.length) report[file] = roles;
    });

    console.log(`\n📊 Style Role Audit Report:\n`);
    for (const [file, roles] of Object.entries(report)) {
      console.log(`→ ${file}\n   • Detected roles: ${roles.join(', ')}\n`);
    }
  });
};

scan();

✅ 3. .cursor-instruction.json Task File (place in /tasks/)

{
  "name": "LIQUID THEME v1 RESTORATION",
  "filename": "liquid-theme-v1-restoration.cursor-instruction.json",
  "version": "v1.2.2",
  "path": "tasks/",
  "contents": "/* Paste the full Cursor block we generated earlier here */"
}

Just replace /* Paste the full Cursor block... */ with the entire instruction block I gave you earlier.

Git Add-on

If you’re tracking .cursor-instruction.json files, commit with:

git add tasks/liquid-theme-v1-restoration.cursor-instruction.json
git commit -m "chore(cursor): add LIQUID THEME v1 restoration instruction block"
git tag v1.2.2_liquid-theme-instructions




STAGE III
✅ styleRoleClassifier.ts — Runtime Element Role Classifier

// src/utils/styleRoleClassifier.ts

import { ViewStyle } from 'react-native';

export type StyleRole = 'card' | 'section' | 'input' | 'button-wrapper' | 'page-wrapper' | 'uncategorized';

export const classifyStyleRole = (style: ViewStyle = {}): StyleRole => {
  if (!style) return 'uncategorized';

  const flatten = (style as any) || {};

  const isCard =
    ('shadowColor' in flatten || 'elevation' in flatten || 'borderRadius' in flatten) &&
    !('flex' in flatten && flatten.flex === 1);

  const isButtonWrapper =
    'alignItems' in flatten && flatten.alignItems === 'center' && 'justifyContent' in flatten;

  const isSection =
    ('padding' in flatten || 'paddingHorizontal' in flatten || 'marginBottom' in flatten) &&
    ('flex' in flatten || 'flexGrow' in flatten);

  const isInput =
    'borderBottomWidth' in flatten || 'borderColor' in flatten || 'borderWidth' in flatten;

  const isPageWrapper =
    'paddingHorizontal' in flatten &&
    ('SafeAreaView' in flatten || 'backgroundColor' in flatten);

  if (isCard) return 'card';
  if (isSection) return 'section';
  if (isButtonWrapper) return 'button-wrapper';
  if (isInput) return 'input';
  if (isPageWrapper) return 'page-wrapper';

  return 'uncategorized';
};

🧪 Example Usage (for conditional theming or wrappers)

import { classifyStyleRole } from '@/utils/styleRoleClassifier';

const MyComponent = ({ style, children }) => {
  const role = classifyStyleRole(style);

  if (role === 'card') {
    return <GlassCardWrapper style={style}>{children}</GlassCardWrapper>;
  }

  return <View style={style}>{children}</View>;
};



Dynamic Style Role Integration instruction 
{
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  // 🧠 MISSION: Dynamic Style Role Integration
  // 🎯 GOAL: Automatically apply visual rules via runtime role classification
  // ✅ Non-destructive — no layout breaks or duplicate wrappers
  // ✅ Uses centralized `classifyStyleRole()` utility
  // ✅ Applies GlassCardWrapper, typography fixes, or spacing rules based on role
  // ✅ Refactors all layout components for live role awareness
  // ✅ Run `npm run lint:fix-all` continuously in background
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  "branch": "refactor/dynamic-style-role-integration",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",

  "phases": [
    {
      "section": "Refactor Layout Components to Use Role Classifier",
      "actions": [
        "Import `classifyStyleRole()` from `utils/styleRoleClassifier.ts` into all components in `src/components/ui/` and `src/components/layout/`",
        "Wrap layout containers in a runtime check: if role is 'card', apply `GlassCardWrapper`; otherwise, use default layout",
        "Pass down `styleRole` prop for downstream children if relevant",
        "Refactor `Card.tsx`, `PageWrapper.tsx`, `Section.tsx`, `InputWrapper.tsx` to call `classifyStyleRole()` on `style` or their props"
      ],
      "commit": "refactor: integrated style role classifier into core layout components",
      "tag": "v1.2.2_roles-integrated"
    },
    {
      "section": "Ensure GlassCardWrapper Used Correctly",
      "actions": [
        "Verify that `GlassCardWrapper` wra{ { { { ps card-role elements and is not duplicated on already-wrapped children", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        "Ensure `GlassCardWrapper` does not interfere with touchables, text input focus, or scroll views"
      ],
      "commit": "fix: non-destructive glass morphism application via role-based wrapping",
      "tag": "v1.2.2_glass-safe"
    },
    {
      "section": "Propagate Typography & Opacity Rules by Role",
      "actions": [
        "In `Section`, `Card`, and `InputWrapper` components — add runtime logic to apply opacity and weight rules to headers/text based on role",
        "Example: cards = full opacity, sections = 0.7, meta/secondary = 0.4"
      ],
      "commit": "feat: typography rule propagation based on role classification",
      "tag": "v1.2.2_typography-dynamic"
    }
  ],

  ////////////////////////////////////////////
  // 🔚 FINAL SNAPSHOT + CLOSEOUT
  ////////////////////////////////////////////
  "final": {
    "commit": "chore: role-based dynamic theming complete",
    "tag": "v1.2.2_roles-complete",
    "notes": "All layout components now dynamically adjust styling behavior based on visual role — enabling runtime morphism, typography, and spacing logic without hardcoded assumptions."
  }
}

STAGE 4
⸻
✅ Enhanced AutoRoleView.tsx (with spacing, accessibility, and token-compliant behavior)

// src/components/wrappers/AutoRoleView.tsx

import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, AccessibilityProps } from 'react-native';
import { classifyStyleRole, StyleRole } from '@/utils/styleRoleClassifier';
import GlassCardWrapper from './GlassCardWrapper';
import { useTheme } from '@/theme/ThemeProvider';

interface Pro{ { { { ps extends AccessibilityProps { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  forceRole?: StyleRole;
  accessible?: boolean;
  accessibilityLabel?: string;
}

const AutoRoleView: React.FC<Props> = ({
  children,
  style,
  forceRole,
  accessible = true,
  accessibilityLabel
}) => {
  const { tokens } = useTheme();
  const flattened = StyleSheet.flatten(style) || {};
  const role = forceRole || classifyStyleRole(flattened);

  const spacingStyles: ViewStyle = {
    ...(role === 'card' && {
      paddingVertical: tokens.spacing.cardPaddingVertical,
      paddingHorizontal: tokens.spacing.cardPaddingHorizontal,
    }),
    ...(role === 'section' && {
      marginBottom: tokens.spacing.sectionMarginBottom,
      paddingHorizontal: tokens.spacing.pagePaddingHorizontal,
    }),
  };

  const combined = [flattened, spacingStyles];

  const basePro{ { { { ps = { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    accessible,
    accessibilityLabel,
    accessibilityRole: role === 'button-wrapper' ? 'button' : undefined,
  };

  if (role === 'card') {
    return (
      <GlassCardWrapper style={combined} {...baseProps}>
        {children}
      </GlassCardWrapper>
    );
  }

  return (
    <View style={combined} {...baseProps}>
      {children}
    </View>
  );
};

export default AutoRoleView;


⸻

✅ Add to Component Registry

// src/components/index.ts

export { default as AutoRoleView } from './wrappers/AutoRoleView';
export { default as GlassCardWrapper } from './wrappers/GlassCardWrapper';


⸻

✅ Docs Addition (insert into docs/ui-guidelines.md)

### 🧠 Smart Layout: AutoRoleView

Use `<AutoRoleView>` as a default wrapper for any layout block. It automatically detects and applies:

- Card vs Section styling
- Native glass morphism for cards
- Spacing presets (padding, margins)
- Accessibility roles and labels
- Theming-safe behavior via `useTheme`

#### ✅ Usage

```tsx
<AutoRoleView style={styles.card}>
  <Text>Content</Text>
</AutoRoleView>

<AutoRoleView style={styles.section} accessibilityLabel="Recent Thoughtmarks">
  <Text>Section Content</Text>
</AutoRoleView>

<AutoRoleView style={styles.inputWrapper} forceRole="input">
  <TextInput />
</AutoRoleView>

🔒 Notes
    •    Does not apply font-size changes
    •    Fully mobile-native safe (Expo + Firebase compatible)
    •    Does not interfere with gestures, scroll, or modals

---

## ✅ Cursor Enforcement Block — Replace `<View>` with `<AutoRoleView>`

```json
{
  "branch": "refactor/auto-role-view-injection",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",

  "phases": [
    {
      "section": "Replace View with AutoRoleView in Eligible Components",
      "actions": [
        "Scan all .tsx files in `src/components/ui/`, `src/features/`, `src/screens/`",
        "Find all <View> elements with inline style pro{ { { { ps containing: shadow, borderRadius, elevation, flex, padding, margin", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        "Replace eligible <View> with <AutoRoleView>",
        "Preserve pro{ { { { ps and children — pass them unchanged", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        "Add `forceRole` where pattern is clearly a card, input, or section",
        "Ensure `AutoRoleView` is imported from `@/components/wrappers/AutoRoleView`"
      ],
      "commit": "refactor: auto-replaced eligible <View> with AutoRoleView",
      "tag": "v1.2.2_auto-role-viewed"
    },
    {
      "section": "Verify Runtime Safety and CI Compatibility",
      "actions": [
        "Run all Expo Metro bundler checks and lint hooks",
        "Run `{ { { { npm run lint:check-theme` and `npm run lint:fix-all`", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
        "Verify glass morphism fallback works without blur errors on Android or test devices"
      ],
      "commit": "chore: verified AutoRoleView migration CI-safe",
      "tag": "v1.2.2_roleview-ci-safe"
    }
  ],

  "final": {
    "commit": "chore: AutoRoleView enforced across layout system",
    "tag": "v1.2.2_roleview-rolledout",
    "notes": "All layout containers now use AutoRoleView for native-safe role-aware styling. Fully compatible with Firebase, Expo, and CI pipelines. No font-size or layout regressions."
  }
}





✅ Enhanced bin/convert-view-to-roleview.ts

// bin/convert-view-to-roleview.ts

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const VIEW_REGEX = /<View([\s\S]*?)>([\s\S]*?)<\/View>/gm;

const convertFile = (filePath: string, options: { dryRun?: boolean; forceRole?: string }) => {
  const contents = fs.readFileSync(filePath, 'utf8');

  if (!contents.includes('<View')) return;

  let updated = contents;

  let replacements = 0;

  updated = updated.replace(VIEW_REGEX, (_match, attrs, inner) => {
    replacements++;
    const roleAttr = options.forceRole ? ` forceRole="${options.forceRole}"` : '';
    return `<AutoRoleView${roleAttr}${attrs}>${inner}</AutoRoleView>`;
  });

  updated = updated
    // Add AutoRoleView to react-native import if already there
    .replace(
      /import\s+{\s+[^}]*?\s+}\s+from\s+['"]react-native['"]/,
      (match) =>
        match.includes('AutoRoleView')
          ? match
          : match.replace('}', `, AutoRoleView }`)
    )
    // Remove duplicate AutoRoleView imports
    .replace(
      /import\s+AutoRoleView\s+from\s+['"].*?['"];?/g,
      ''
    )
    // Add wrapper import if missing
    .replace(
      /((?:import\s+.*?\s+from\s+['"].*?['"];?\s*)+)/,
      (imports) =>
        imports.includes("@/components/wrappers/AutoRoleView")
          ? imports
          : `${imports}import AutoRoleView from '@/components/wrappers/AutoRoleView';\n`
    );

  if (options.dryRun) {
    if (replacements > 0) {
      console.log(`📄 [DryRun] Would convert: ${filePath} (${replacements} replacements)`);
    }
  } else {
    fs.writeFileSync(filePath, updated, 'utf8');
    if (replacements > 0) {
      console.log(`✅ Converted: ${filePath} (${replacements} replacements)`);
    }
  }
};

const run = () => {
  const args = process.argv.slice(2);
  const target = args.find((arg) => arg.endsWith('.tsx') || arg.includes('/')) || 'src/**/*.{tsx}';
  const dryRun = args.includes('--dryRun');
  const forceRoleArg = args.find((arg) => arg.startsWith('--forceRole='));
  const forceRole = forceRoleArg ? forceRoleArg.split('=')[1] : undefined;

  console.log(`🔍 Scanning: ${target}`);
  if (dryRun) console.log('🧪 Dry run enabled — no files will be written');
  if (forceRole) console.log(`🎯 Forcing role: ${forceRole}`);

  glob(target, {}, (err, files) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    files.forEach((file) => convertFile(file, { dryRun, forceRole }));
  });
};

run();


⸻

🧪 Example Usage:

Dry run, preview all eligible View replacements:

ts-{ { { { node bin/convert-view-to-roleview.ts --dryRun & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

Convert one file, force as card:

ts-{ { { { node bin/convert-view-to-roleview.ts src/components/ui/MyCard.tsx --forceRole=card & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

Convert all screens with forceRole=section:

ts-{ { { { node bin/convert-view-to-roleview.ts "src/features/**/*.tsx" --forceRole=section & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
