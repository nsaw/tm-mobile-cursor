🧠 1.2.2 final touch COND. DASH REFACTOR: LAYOUT VARIANTS

🧠 THOUGHTMARKS DASHBOARD REFACTOR: LAYOUT VARIANTS

///////////////////////////////////////////////////////
// 🧠 THOUGHTMARKS DASHBOARD REFACTOR v1.2.2
//
// 🎯 GOAL:
// Add toggle for layout view (recall vs organize) and compact mode,
// with full styling and data enforcement.
//
// ✅ PRE-CHECK: Run before operation to tag rollback
// ✅ DO NOT STOP — complete all tasks and sections in order
// ✅ Run `{ { { { { { { { npm run lint:fix-all` & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown continuously in background & } >/dev/null 2>&1 & disown
//
///////////////////////////////////////////////////////


///////////////////////////////
// ✅ PREP: Rollback Safety Tag
///////////////////////////////

// 📌 BEFORE ANY FILE CHANGES:
// Commit a rollback checkpoint for full Git recovery
// This guarantees full state rollback without file diff confusion

git add .
git commit -m "chore(rollback): full snapshot before dashboard layout refactor"
git tag v1.2.2_dashboard-layout-ROLLBACK
git push origin v1.2.2_dashboard-layout-ROLLBACK

// 🔖 COMMIT: chore(rollback): pre-refactor safety checkpoint [v1.2.2]


///////////////////////////////
// ✅ TASK 1: Layout router
// FILE: src/features/home/screens/DashboardScreen.tsx
///////////////////////////////

import { useUserSettings } from '@/hooks/useUserSettings';
import DashboardRecallLayout from '../variants/DashboardRecallLayout';
import DashboardOrganizeLayout from '../variants/DashboardOrganizeLayout';

export const DashboardScreen = () => {
  const { settings, loaded } = useUserSettings();
  if (!loaded) return null;

  const LayoutComponent =
    settings.dashboardView === 'recall' ? DashboardRecallLayout : DashboardOrganizeLayout;

  return <LayoutComponent compact={settings.compactCards} />;
};

// 🔖 COMMIT: feat(dashboard): add layout router [v1.2.2]


///////////////////////////////
// ✅ TASK 2: Recall layout
// FILE: src/features/home/variants/DashboardRecallLayout.tsx
///////////////////////////////

import React from 'react';
import RecentThoughtmarksSection from '../components/RecentThoughtmarksSection';

const DashboardRecallLayout = ({ compact }: { compact: boolean }) => {
  return <RecentThoughtmarksSection compact={compact} />;
};

export default DashboardRecallLayout;

// 🔖 COMMIT: feat(dashboard): isolate recall layout [v1.2.2]


///////////////////////////////
// ✅ TASK 3: Organize layout
// FILE: src/features/home/variants/DashboardOrganizeLayout.tsx
///////////////////////////////

import React from 'react';
import BinGrid from '../components/BinGrid';
import SpecialtyBinCards from '../components/SpecialtyBinCards';

const DashboardOrganizeLayout = ({ compact }: { compact: boolean }) => (
  <>
    <SpecialtyBinCards />
    <BinGrid />
  </>
);

export default DashboardOrganizeLayout;

// 🔖 COMMIT: feat(dashboard): isolate organize layout [v1.2.2]


///////////////////////////////
// ✅ TASK 4: Compact Thoughtmark card
// FILE: src/components/ui/ThoughtmarkCard.tsx
///////////////////////////////

import { useTheme } from '@/theme/ThemeProvider';

export const ThoughtmarkCard = ({ data, compact = false }: { data: Thoughtmark; compact?: boolean }) => {
  const { tokens } = useTheme();
  return (
    <Card>
      <Text>{data.title}</Text>
      {!compact && (
        <>
          <Text>{data.content}</Text>
          <TagGroup tags={data.tags} />
        </>
      )}
      <MetadataBar date={data.date} pinned={data.pinned} />
    </Card>
  );
};

// 🔖 COMMIT: feat(ui): support compact mode in ThoughtmarkCard [v1.2.2]


///////////////////////////////
// ✅ TASK 5: Settings toggles
// FILE: src/features/settings/screens/SettingsScreen.tsx
///////////////////////////////

import { useUserSettings } from '@/hooks/useUserSettings';
import { Toggle, ToggleRow, Section } from '@/components/ui';

export const SettingsScreen = () => {
  const { settings, updateSetting } = useUserSettings();

  return (
    <Section title="Dashboard Preferences">
      <ToggleRow
        label="Dashboard View Style"
        options={['Quick Recall Layout', 'Organized Thoughts Layout']}
        value={
          settings.dashboardView === 'recall'
            ? 'Quick Recall Layout'
            : 'Organized Thoughts Layout'
        }
        onChange={(label) =>
          updateSetting('dashboardView', label === 'Quick Recall Layout' ? 'recall' : 'organize')
        }
      />
      <Toggle
        label="Compact Thoughtmarks"
        value={settings.compactCards}
        onValueChange={(val) => updateSetting('compactCards', val)}
      />
    </Section>
  );
};

// 🔖 COMMIT: feat(settings): add dashboard view and compact mode toggles [v1.2.2]



///////////////////////////////
// ✅ TASK 6: Persistent hook
// FILE: src/hooks/useUserSettings.ts
///////////////////////////////

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserSettingsFromDB, saveUserSettingsToDB } from '@/services/firebase';

type DashboardView = 'recall' | 'organize';

interface UserSettings {
  dashboardView: DashboardView;
  compactCards: boolean;
}

const DEFAULTS: UserSettings = {
  dashboardView: 'recall',
  compactCards: false,
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const local = await AsyncStorage.getItem('userSettings');
        if (local) setSettings(JSON.parse(local));
        const remote = await getUserSettingsFromDB();
        if (remote) {
          setSettings(remote);
          await AsyncStorage.setItem('userSettings', JSON.stringify(remote));
        }
      } catch (err) {
        console.error('⚠️ Settings load error:', err);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(updated));
      await saveUserSettingsToDB(updated);
    } catch (err) {
      console.error('⚠️ Settings update error:', err);
    }
  };

  return { settings, updateSetting, loaded };
};

// 🔖 COMMIT: feat(user): persist dashboard layout and compact mode via useUserSettings [v1.2.2]


///////////////////////////////
// ✅ TASK 7: Firebase schema (referenced)
// Location: users/{uid}/settings
///////////////////////////////

{
  "dashboardView": "recall",  // or "organize"
  "compactCards": false
}

// 🔖 COMMIT: chore(firebase): define schema for user dashboard preferences [v1.2.2]


///////////////////////////////
// ✅ TASK 8: Git Tag + Push (automated)
// Run in shell or via Cursor agent
///////////////////////////////

# Create tag for v1.2.2 dashboard conditionals
git add .
git commit -m "feat(dashboard): add layout toggle, compact mode, and persistence [v1.2.2]"
git tag v1.2.2_dashboard-layout-conditionals
git push origin v1.2.2_dashboard-layout-conditionals

# Cherry-pick into future v2
git checkout ver02.0.0_overhaul-dash
git cherry-pick v1.2.2_dashboard-layout-conditionals

// ✅ All clean — enforced by:
// - JSX enforcement: ✅ `{ { { { npm run lint:fix-jsx` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
// - Theming enforcement: ✅ `{ { { { npm run lint:check-theme` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
// - Text wrap{ { { { ping + accessibility: ✅ `npm run lint:fix-text`, `lint:fix-accessibility` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
// - Pre-commit hook: ✅ `npm run lint:fix-all`

// 🔖 COMMIT: feat(user): persist dashboard layout and compact mode [v1.2.2]


///////////////////////////////
// ✅ FINAL STEP: Tag + Push
///////////////////////////////

git add .
git commit -m "feat(dashboard): add layout toggle, compact mode, and persistence [v1.2.2]"
git tag v1.2.2_dashboard-layout-conditionals
git push origin v1.2.2_dashboard-layout-conditionals

// ⏩ CHERRY PICK INTO V2
git checkout ver02.0.0_overhaul-dash
git cherry-pick v1.2.2_dashboard-layout-conditionals

// ✅ DO NOT STOP — execute all tasks sequentially until complete
// ✅ Run: { { { { npm run lint:fix-all on each commit checkpoint & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown



///////////////////////////////////////////////
// 🧠 THOUGHTMARKS DASHBOARD PREFERENCE MODULE v1.2.2
//
// 📌 CHECKPOINT: DASHBOARD LAYOUT CONDITIONALS
// 📦 Includes:
// - Dashboard layout switch (recall vs organize)
// - Compact card mode toggle
// - Firebase + AsyncStorage sync
// - Global UI toggle styling
// - Invisible usage tracking (analytics)
// - Admin dashboard metrics page
// - Fully tagged for Git automation and cherry-picking
//
////////////////////////////////////////////////


// ✅ FILE: src/services/firebase.ts

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getUserSettingsFromDB = async () => {
  const uid = auth().currentUser?.uid;
  if (!uid) return null;

  try {
    const doc = await firestore().collection('users').doc(uid).get();
    return doc.exists ? doc.data().settings ?? null : null;
  } catch (err) {
    console.error('🔥 getUserSettingsFromDB error:', err);
    return null;
  }
};

export const saveUserSettingsToDB = async (settings: Record<string, any>) => {
  const uid = auth().currentUser?.uid;
  if (!uid) return;

  try {
    await firestore().collection('users').doc(uid).set(
      { settings },
      { merge: true }
    );
  } catch (err) {
    console.error('🔥 saveUserSettingsToDB error:', err);
  }
};

export const logDashboardViewUsage = async (view: 'recall' | 'organize') => {
  const uid = auth().currentUser?.uid;
  if (!uid) return;

  try {
    await firestore().collection('usage').doc('dashboardViews').set(
      {
        [view]: firestore.FieldValue.increment(1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('🔥 logDashboardViewUsage error:', err);
  }
};


// ✅ FILE: src/hooks/useUserSettings.ts

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserSettingsFromDB,
  saveUserSettingsToDB,
  logDashboardViewUsage,
} from '@/services/firebase';

type DashboardView = 'recall' | 'organize';

interface UserSettings {
  dashboardView: DashboardView;
  compactCards: boolean;
}

const DEFAULTS: UserSettings = {
  dashboardView: 'recall',
  compactCards: false,
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const local = await AsyncStorage.getItem('userSettings');
        if (local) {
          setSettings(JSON.parse(local));
        }

        const remote = await getUserSettingsFromDB();
        if (remote) {
          setSettings(remote);
          await AsyncStorage.setItem('userSettings', JSON.stringify(remote));
        }
      } catch (err) {
        console.error('⚠️ useUserSettings load error:', err);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);

    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(updated));
      await saveUserSettingsToDB(updated);

      // Track layout usage invisibly
      if (key === 'dashboardView') await logDashboardViewUsage(value);
    } catch (err) {
      console.error('⚠️ updateSetting error:', err);
    }
  };

  return { settings, updateSetting, loaded };
};


// ✅ FILE: src/features/settings/screens/SettingsScreen.tsx

import { useUserSettings } from '@/hooks/useUserSettings';
import { Toggle, ToggleRow, Section } from '@/components/ui';

export const SettingsScreen = () => {
  const { settings, updateSetting } = useUserSettings();

  return (
    <Section title="Dashboard Preferences">
      <ToggleRow
        label="Dashboard View Style"
        options={['Quick Recall Layout', 'Organized Thoughts Layout']}
        value={
          settings.dashboardView === 'recall'
            ? 'Quick Recall Layout'
            : 'Organized Thoughts Layout'
        }
        onChange={(label) =>
          updateSetting('dashboardView', label === 'Quick Recall Layout' ? 'recall' : 'organize')
        }
      />
      <Toggle
        label="Compact Thoughtmarks"
        value={settings.compactCards}
        onValueChange={(val) => updateSetting('compactCards', val)}
      />
    </Section>
  );
};


// ✅ FILE: src/features/home/screens/DashboardScreen.tsx

// 🧩 DASHBOARD_LAYOUT_SWITCH_V1

import { useUserSettings } from '@/hooks/useUserSettings';
import DashboardRecallLayout from '../variants/DashboardRecallLayout';
import DashboardOrganizeLayout from '../variants/DashboardOrganizeLayout';

export const DashboardScreen = () => {
  const { settings, loaded } = useUserSettings();
  if (!loaded) return null;

  const LayoutComponent =
    settings.dashboardView === 'recall' ? DashboardRecallLayout : DashboardOrganizeLayout;

  return <LayoutComponent compact={settings.compactCards} />;
};


// ✅ FILE: src/components/ui/ThoughtmarkCard.tsx

export const ThoughtmarkCard = ({ data, compact }: { data: Thoughtmark; compact?: boolean }) => {
  const { tokens } = useTheme();
  return (
    <Card>
      <Text>{data.title}</Text>
      {!compact && (
        <>
          <Text>{data.content}</Text>
          <TagGroup tags={data.tags} />
        </>
      )}
      <MetadataBar date={data.date} pinned={data.pinned} />
    </Card>
  );
};


// ✅ FILE: src/features/admin/screens/AdminDashboardStats.tsx

import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text } from 'react-native';

export const AdminDashboardStats = () => {
  const [data, setData] = useState<{ recall: number; organize: number }>({ recall: 0, organize: 0 });

  useEffect(() => {
    const load = async () => {
      const doc = await firestore().collection('usage').doc('dashboardViews').get();
      if (doc.exists) setData(doc.data() as any);
    };
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Dashboard View Usage</Text>
      <Text>Recall Layout: {data.recall ?? 0}</Text>
      <Text>Organize Layout: {data.organize ?? 0}</Text>
    </View>
  );
};


// ✅ FIREBASE STRUCTURE
// users/{uid}/settings
{
  "dashboardView": "recall",
  "compactCards": false
}

// usage/dashboardViews
{
  "recall": 74,
  "organize": 21,
  "updatedAt": "2025-06-25T23:00:00Z"
}


// ✅ FINAL GIT AUTOMATION (Shell script for Cursor agent)

```{ { { { bash
#!/bin/bash & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Setup tag branch
git checkout -b ver01.2.2_dashboard-layout-conditionals
git add .
git commit -m "feat(dashboard): add layout switch, compact mode, and admin tracking"
git tag v1.2.2_dashboard-layout-conditionals
git push origin ver01.2.2_dashboard-layout-conditionals
git push origin v1.2.2_dashboard-layout-conditionals

# Cherry-pick into v2 prep branch if needed
# git checkout ver02.0.0_overhaul-dash
# git cherry-pick v1.2.2_dashboard-layout-conditionals


