# 📘 AutoRoleView v4.0 Roadmap

## 🔁 Context & Transition

AutoRoleView v3.0 introduced:
- Strong semantic roles
- ESLint enforcement
- Validation layers
- Debug overlays

It failed at scale due to:
- Cascade complexity
- Ambiguous role contexts
- Performance degradation
- Mass replacement risks
- Debug system overload

---

## ✅ v4.0 Goals

- ✅ Incremental rollout only
- ✅ Debug layers opt-in, not default
- ✅ Role assignment preceded by analysis
- ✅ Performance-safe rendering
- ✅ Single-role enforcement with escape hatches
- ✅ Rollbackable at each step
- ✅ No mutation of event handling
- ✅ Visual audit after each component

---

## 🚦 Phase Structure (v1.4.1a onward)

### 📍 Phase 1.1a: Core UI Components
- [x] Button.tsx → `interactiveRole="button-action"`
- [x] Text.tsx → `contentRole="body"`
- [ ] TagChip.tsx → `interactiveRole="chip"`
- [ ] ModernHeader.tsx → `layoutRole="header"`
- [ ] BottomNav.tsx → `layoutRole="navigation"`
- [ ] FloatingActionButton.tsx → `interactiveRole="button-action"`
- [ ] GlassmorphicContainer.tsx → `cardRole="card"`
- [ ] LoadingScreen.tsx → `containerRole="fullscreen-loading"`
- [ ] ActionSheet.tsx → `modalRole="action-sheet"`

🛠️ All changes verified via: `tsc --noEmit`, `{ { { { { { { { npm run lint` & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown, and runtime visual diff. & } >/dev/null 2>&1 & disown

---

### 📍 Phase 1.1b: High Traffic Screens
- [ ] DashboardScreen.tsx
- [ ] HomeScreen.tsx
- [ ] ThoughtmarkDetailScreen.tsx
- [ ] SearchScreen.tsx
- [ ] AllBinsScreen.tsx

Incremental `<View>` → `<AutoRoleView>` replacement with visual audit and safe tag checkpoint after each screen.

---

### 📍 Phase 1.2: Authentication + Input Screens
- [ ] SignIn.tsx
- [ ] SignUp.tsx
- [ ] PINEntryScreen.tsx
- [ ] CreateBinScreen.tsx
- [ ] AIToolsScreen.tsx

---

### 📍 Phase 1.3: Settings + Misc
- [ ] ProfileScreen.tsx
- [ ] ContentScreen.tsx
- [ ] ExportScreen.tsx
- [ ] AllSettings

---

## 🔐 Enforcement Stack

- `ESLint` validation (no View w/o role)
- `RoleValidationTest.tsx`
- `AutoRoleView.debug = false` in production
- `ThemeProvider` integration strict
- `skipSacred` flag honored for protected views

---

## 🔄 Rollback Policy

- Every file change = parse-checked
- Every subphase = git tag + backup
- Failure recovery = automatic full revert

---

## 📏 Success Criteria

- ✅ 100% parse + lint clean
- ✅ No runtime whitebar or crash
- ✅ No duplicate JSX role usage
- ✅ Theme inheritance preserved
- ✅ Accessibility pro{ { { { ps surfaced where needed & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- ✅ Visual regression stable across simulators

---

## 📅 Timeline (Effort Estimate)

| Phase        | Est. Time |
|--------------|-----------|
| Phase 1.1a   | 3-4 hrs   |
| Phase 1.1b   | 6-8 hrs   |
| Phase 1.2    | 3 hrs     |
| Phase 1.3    | 2 hrs     |
| Validation   | Ongoing   |

---

## 🧠 Cursor Postmortem Disagreements & Agreements

✅ AGREED:
- v3.0 failed due to non-incremental strategy
- Debug layer bloat contributed to layout noise
- Role conflict resolution was missing
- Role inheritance was overly rigid

❌ DISAGREED:
- "Performance degradation" wasn't a primary failure—it was visibility bloat
- Role validation wasn't inherently too strict—only lacked escape hatches
- Most critical failures stemmed from debug overlays and premature View replacement

---

## 🔁 What’s New in v4.0

| Feature                  | v3.0           | v4.0                  |
|--------------------------|----------------|------------------------|
| Debug Overlays           | Always on      | Opt-in only            |
| Role Enforcement         | Hard fail      | Soft fallback enabled  |
| Migration Strategy       | Global sweep   | Phase + subphase       |
| Role Conflict Resolution | Absent         | Precedence rules + skipSacred |
| Tagging & Rollbacks      | Sparse         | Tag per subphase       |



# CURSOR POSTMORTEM

# 🚨 **Postmortem Analysis: AutoRoleView v3.0 Implementation Failure**

## 📊 **Timeline of Events**

### **Phase 1: Foundation (Successful)**
- ✅ **Role type system** implemented correctly
- ✅ **Role style engine** functional with inheritance
- ✅ **Validation system** working properly
- ✅ **Debug tools** operational
- ✅ **ESLint rules** configured

### **Phase 2: Core Implementation (Successful)**
- ✅ **AutoRoleView component** fully functional
- ✅ **Convenience components** (Card, Section, etc.) working
- ✅ **Role validation** passing tests
- ✅ **Debug visualization** working in dev

### **Phase 3: Mass Migration (Failure Point)**
- ❌ **Systematic View replacement** caused cascading failures
- ❌ **Role assignment conflicts** emerged
- ❌ **Performance degradation** occurred
- ❌ **Visual regressions** appeared
- ❌ **Compilation errors** surfaced

---

## 🔍 **Root Cause Analysis**

### **1. Complexity Explosion**
```
Problem: The migration from <View> to <AutoRoleView> created exponential complexity
- Each View replacement required role analysis
- Role conflicts emerged between layout and interactive roles
- Inheritance chains became unpredictable
- Debug overhead overwhelmed the system
```

### **2. Role Ambiguity**
```
Problem: Many View instances had unclear semantic purposes
- Layout containers vs. interactive elements
- Content wrappers vs. structural elements
- Mixed responsibilities within single components
- Context-dependent role requirements
```

### **3. Performance Cascade**
```
Problem: AutoRoleView overhead multiplied across hundreds of instances
- Runtime validation on every render
- Debug styling calculations
- Style inheritance resolution
- Accessibility prop generation
```

### **4. Testing Gap**
```
Problem: No incremental testing strategy during migration
- All changes made simultaneously
- No rollback points between phases
- Visual regression detection too late
- Performance impact not measured incrementally
```

---

## �� **Critical Failure Points**

### **Point 1: Mass Replacement Strategy**
```
What Went Wrong:
- Attempted to replace all <View> instances simultaneously
- No incremental validation between replacements
- Role assignment became guesswork for complex layouts
- Debug visualization overwhelmed the UI

What Should Have Happened:
- Systematic, component-by-component migration
- Role analysis before replacement
- Testing after each component
- Performance monitoring throughout
```

### **Point 2: Role Conflict Resolution**
```
What Went Wrong:
- Multiple roles assigned to single components
- Inheritance conflicts between layout and interactive roles
- Debug system couldn't handle complex role combinations
- ESLint rules became too restrictive

What Should Have Happened:
- Clear role hierarchy and precedence rules
- Conflict resolution strategy defined upfront
- Gradual role refinement based on usage patterns
- Flexible role assignment for edge cases
```

### **Point 3: Performance Degradation**
```
What Went Wrong:
- AutoRoleView overhead multiplied across entire codebase
- Debug calculations running in production
- Style inheritance chains became too deep
- Memory usage increased significantly

What Should Have Happened:
- Performance benchmarking before migration
- Debug mode disabled in production
- Style caching and memoization
- Incremental performance monitoring
```

---

## ��️ **Why We Couldn't Fix Them**

### **1. Cascading Dependencies**
```
Issue: Changes in one component affected others
- Role inheritance created unexpected side effects
- Style overrides conflicted across components
- Debug visualization interfered with layout
- ESLint rules became too aggressive

Solution Gap: No isolation strategy for testing changes
```

### **2. Debug System Overload**
```
Issue: Debug visualization overwhelmed the UI
- Color-coded overlays covered entire screens
- Performance impact of debug calculations
- Debug information cluttered the interface
- No way to disable debug in problematic areas

Solution Gap: No selective debug control or performance optimization
```

### **3. Role Validation Complexity**
```
Issue: Role validation became too strict
- Edge cases not covered by role definitions
- Complex layouts couldn't be categorized
- Accessibility requirements conflicted with roles
- No fallback strategy for invalid roles

Solution Gap: No flexible role system for edge cases
```

---

## 🎯 **How to Approach This Differently**

### **Strategy 1: Incremental Migration**
```
✅ DO:
- Migrate one component at a time
- Test thoroughly after each component
- Create rollback points between phases
- Monitor performance incrementally
- Validate visual regression after each change

❌ DON'T:
- Replace all View instances simultaneously
- Skip testing between phases
- Ignore performance metrics
- Assume all components need the same role treatment
```

### **Strategy 2: Role Analysis First**
```
✅ DO:
- Analyze each component's purpose before migration
- Create role map{ { { { ping documentation & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Identify edge cases and conflicts upfront
- Define role hierarchy and precedence rules
- Plan for flexible role assignment

❌ DON'T:
- Assign roles based on guesswork
- Ignore component context and usage patterns
- Assume one role fits all similar components
- Skip role conflict resolution planning
```

### **Strategy 3: Performance-First Approach**
```
✅ DO:
- Benchmark performance before migration
- Implement performance monitoring throughout
- Use memoization and caching for expensive operations
- Disable debug features in production
- Test performance impact of each change

❌ DON'T:
- Ignore performance implications
- Enable debug features in production
- Skip performance testing
- Assume AutoRoleView overhead is negligible
```

### **Strategy 4: Flexible Role System**
```
✅ DO:
- Allow multiple roles per component when needed
- Create fallback strategies for edge cases
- Implement role inheritance with conflict resolution
- Provide escape hatches for complex layouts
- Support gradual role refinement

❌ DON'T:
- Enforce strict single-role policy
- Ignore edge cases and complex layouts
- Create rigid role hierarchies
- Fail to provide fallback options
```

---

## 🚀 **Recommended New Approach**

### **Phase 1: Foundation + Testing (1-2 days)**
```
1. Implement performance benchmarking tools
2. Create role analysis documentation
3. Set up incremental testing framework
4. Define rollback strategies
5. Establish performance baselines
```

### **Phase 2: Pilot Migration (1 day)**
```
1. Select 3-5 simple components for pilot
2. Migrate each component individually
3. Test thoroughly after each migration
4. Document lessons learned
5. Refine approach based on pilot results
```

### **Phase 3: Systematic Migration (3-5 days)**
```
1. Migrate components in priority order
2. Test after each component
3. Monitor performance continuously
4. Create rollback points frequently
5. Document all changes and decisions
```

### **Phase 4: Optimization + Validation (1-2 days)**
```
1. Optimize performance bottlenecks
2. Refine role assignments based on usage
3. Validate accessibility compliance
4. Test visual regression thoroughly
5. Document final implementation
```

---

## 🎯 **Key Lessons Learned**

### **1. Complexity Management**
- **Don't underestimate** the complexity of role-based systems
- **Plan for edge cases** and complex layouts
- **Test incrementally** to catch issues early
- **Monitor performance** throughout the process

### **2. Role System Design**
- **Flexibility is key** - not all components fit clean roles
- **Inheritance can be dangerous** - plan conflict resolution
- **Debug systems need controls** - don't overwhelm the UI
- **Validation should be helpful** - not just restrictive

### **3. Migration Strategy**
- **Incremental is better** than big-bang
- **Testing is critical** at every step
- **Rollback plans** are essential
- **Performance monitoring** is non-negotiable

### **4. Team Communication**
- **Document decisions** and rationale
- **Share lessons learned** throughout the process
- **Create clear success criteria** for each phase
- **Plan for failure** and recovery

---

## �� **Next Steps**

1. **Implement the new incremental approach**
2. **Start with a small pilot migration**
3. **Establish performance baselines**
4. **Create comprehensive testing strategy**
5. **Document everything for future reference**

The key insight is that **AutoRoleView v3.0 is a powerful system, but it requires careful, incremental implementation rather than mass migration**. The foundation is solid - we just need to build on it more methodically.


# GPT RESPONSE TO CURSOR POSTMORTEM

Here's the finalized roadmap file for AutoRoleView v4.0 as requested:

👉 [Download auto\_role\_view\_v4\_roadmap.md](sandbox:/mnt/data/auto_role_view_v4_roadmap.md)

---

### 🧠 My Postmortem Analysis (Compared to Cursor’s)

#### ✅ AGREEMENTS

1. **Mass Migration Was the Root Failure**
   Cursor correctly identified that trying to globally replace `<View>` instances without role map{ { { { ping or incremental validation caused chaos. & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

2. **Debug Layer Overload**
   The overlay was visually informative but caused both perceptual and performance clutter—especially when on by default.

3. **Ambiguous Role Assignments**
   Cursor was right to highlight that roles like `section`, `card`, and `form` were applied based on guesswork.

4. **Missing Rollbacks Between Phases**
   Cursor nailed this. Lack of granular checkpoints meant we couldn’t safely backtrack.

---

#### ❌ DISAGREEMENTS

1. **Performance Degradation Was Overstated**
   It wasn’t actual render perf degradation—it was visual noise and recursive `<Text>` failures that made it feel sluggish.

2. **Validation Strictness Wasn’t the Real Problem**
   The validation engine worked as designed—it just lacked graceful fallback when unknown or composite roles were encountered. That’s different from “being too strict.”

3. **Inheritance Wasn’t the Enemy**
   Inheritance problems only arose because base `<View>` wasn’t annotated with any semantics. When used intentionally, it worked great.

---

### 💡 Root Lessons

* **We moved too fast on replacement, not analysis.**
* **Debug tools, when enabled globally, should be considered production hazards.**
* **Any runtime validator must degrade gracefully.**
* **AutoRoleView is too powerful to be used indiscriminately.**

Let’s apply these hard-won lessons in v4.0—methodical, measured, and reversible. Ready to move into Phase 1.1a whenever you are.



CURSOR SUGGESTIONS:
# �� **AutoRoleView v4.0 Roadmap Review & Recommendations**

## ✅ **Excellent Analysis & Strategy**

The v4.0 roadmap is **significantly improved** and addresses the core failure points from v3.0. The incremental approach with subphases and rollback points is exactly what was missing.

---

## 🔍 **Critical Oversights & Recommendations**

### **1. Versioning Strategy Issue**
```
❌ CURRENT: v1.4.1a, v1.4.1b, etc.
✅ RECOMMENDED: v1.4.1-phase1a, v1.4.1-phase1b, etc.

REASON: The 'a', 'b' naming is unclear. Phase-based tagging is more explicit.
```

### **2. Missing Performance Baseline**
```
❌ MISSING: Performance benchmarking before migration
✅ ADD: "Phase 0: Performance Baseline"
- Benchmark render times for key screens
- Measure memory usage patterns
- Establish performance thresholds
- Create performance regression tests
```

### **3. Debug System Controls**
```
❌ MISSING: Granular debug controls
✅ ADD: Debug configuration system
- Per-component debug enable/disable
- Debug level controls (basic/verbose/off)
- Production debug strip{ { { { ping
- Debug performance impact measurement & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### **4. Role Conflict Resolution Strategy**
```
❌ MISSING: Specific conflict resolution rules
✅ ADD: Role precedence hierarchy
- layoutRole > interactiveRole > contentRole
- skipSacred flag for protected components
- Role inheritance conflict resolution
- Fallback role assignment strategy
```

### **5. Testing Strategy Gap**
```
❌ MISSING: Comprehensive testing approach
✅ ADD: Testing phases
- Unit tests for each migrated component
- Visual regression testing
- Accessibility compliance testing
- Performance regression testing
- Integration testing for screen flows
```

---

## 🎯 **Recommended Additions to Roadmap**

### **Phase 0: Foundation & Baseline (1 day)**
```
- [ ] Performance benchmarking tools setup
- [ ] Visual regression baseline capture
- [ ] Accessibility compliance audit
- [ ] Role analysis documentation
- [ ] Testing framework setup
- [ ] Rollback strategy validation
```

### **Enhanced Phase 1.1a: Core UI Components**
```
- [ ] Button.tsx → interactiveRole="button-action"
- [ ] Text.tsx → contentRole="body"
- [ ] TagChip.tsx → interactiveRole="chip"
- [ ] ModernHeader.tsx → layoutRole="header"
- [ ] BottomNav.tsx → layoutRole="navigation"
- [ ] FloatingActionButton.tsx → interactiveRole="button-action"
- [ ] GlassmorphicContainer.tsx → layoutRole="card"
- [ ] LoadingScreen.tsx → layoutRole="container"
- [ ] ActionSheet.tsx → layoutRole="modal"

TESTING AFTER EACH:
- [ ] Visual regression test
- [ ] Performance impact measurement
- [ ] Accessibility compliance check
- [ ] ESLint validation
```

### **New Phase: Validation & Optimization**
```
- [ ] Performance optimization for migrated components
- [ ] Debug system refinement
- [ ] Role conflict resolution testing
- [ ] Accessibility compliance validation
- [ ] Visual regression final validation
- [ ] Documentation updates
```

---

## 🚨 **Critical Oversights to Address**

### **1. Production Safety**
```
❌ MISSING: Production deployment safety
✅ ADD: Production safeguards
- Debug mode disabled in production builds
- Performance monitoring in production
- Rollback procedures for production issues
- Gradual rollout strategy
```

### **2. Team Communication**
```
❌ MISSING: Team coordination strategy
✅ ADD: Communication plan
- Daily progress updates
- Issue escalation procedures
- Knowledge sharing sessions
- Documentation standards
```

### **3. Monitoring & Alerting**
```
❌ MISSING: Real-time monitoring
✅ ADD: Monitoring strategy
- Performance monitoring during migration
- Error tracking and alerting
- Visual regression detection
- User feedback collection
```

---

## 📊 **Versioning Strategy Recommendation**

### **Current (Problematic):**
```
v1.4.1a → v1.4.1b → v1.4.1c
```

### **Recommended (Clear & Descriptive):**
```
v1.4.1-phase1a-core-components
v1.4.1-phase1b-high-traffic-screens
v1.4.1-phase1c-auth-screens
v1.4.1-phase1d-settings-screens
v1.4.1-phase2-validation-optimization
v1.4.1-final-stable
```

---

## �� **Success Criteria Enhancement**

### **Add These Metrics:**
```
✅ PERFORMANCE:
- No more than 5% render time increase
- No more than 10% memory usage increase
- No performance regressions in critical paths

✅ QUALITY:
- 100% accessibility compliance
- Zero visual regressions
- All ESLint rules passing
- No runtime errors

✅ PROCESS:
- Each phase completed within estimated time
- Rollback capability tested and working
- Documentation updated for each phase
- Team knowledge transfer completed
```

---

## 🚀 **Final Recommendations**

### **1. Add Phase 0 (Foundation)**
- Performance benchmarking
- Testing framework setup
- Documentation standards

### **2. Enhance Testing Strategy**
- Visual regression testing
- Performance regression testing
- Accessibility compliance testing

### **3. Improve Versioning**
- Use descriptive phase-based tags
- Include rollback points in naming

### **4. Add Production Safety**
- Debug mode controls
- Performance monitoring
- Gradual rollout strategy

### **5. Enhance Communication**
- Daily progress updates
- Issue escalation procedures
- Knowledge sharing sessions

---

## ✅ **Overall Assessment**

The v4.0 roadmap is **excellent** and addresses the core issues from v3.0. With these additions, it will be a **robust, safe, and successful implementation strategy**.

**Ready to proceed with Phase 0 (Foundation) when you are!** 🚀


---


# ✅ Roadmap created: **Auto Role View V4 Roadmap**
You can now reference it at any time during implementation.

---

### 🔍 Analysis of Cursor Suggestions

#### ✅ **Where I agree:**

1. **Incremental approach & tagging per phase**
   Fully aligned. Prevents cascading regressions and supports reverts cleanly.

2. **Phase 0 benchmarking**
   Absolutely essential. We overlooked pre-migration visual, accessibility, and performance snapshots in v3.

3. **Debug controls**
   Crucial for DX + runtime safety. Role overlays and debug styling must be toggleable per environment and component.

4. **Explicit role conflict strategy**
   Yes. Conflicts like `layoutRole + interactiveRole` need a documented resolution order and fallback role.

5. **Expanded testing coverage**
   Agreed. Lint, type, visual, accessibility, and perf tests should all be part of validation gates.

6. **Production safety & monitoring**
   Especially important as the system scales. We should ensure debug logic is stripped from production and runtime impact is measurable.

---

#### ❌ **Where I slightly diverge:**

1. **Strict “only one role” per component always**
   While that is enforced by `enforceMaxOneRolePerComponent`, in **multi-function layout containers**, we may need an override mechanism. This is noted under `"screenContext": "line-by-line patching with developer review"` but may require flag-based opt-outs.

2. **Rollback automation**
   While beneficial, our current backup strategy (checkpoint tag + manual `.tar.gz` on confirmed pass) offers better assurance. Cursor favors automated backups, which risks snapshotting broken states.

---

### 📌 Summary

You're already enforcing the right architectural and safety constraints. Cursor's additions (debug controls, perf benchmarks, expanded validation, versioning clarity) are excellent and fully integrated into the updated roadmap above.

The revised hybrid instruction block is next.


✅ Both the **roadmap** and **cursor hybrid instruction block** have been generated and saved:

* 📘 [AutoRoleView v4.0 Roadmap](canmore://auto_role_view_v4_roadmap)
* 🧩 [AutoRoleView v4 Cursor Instruction Block](canmore://auto_roleview_v4_cursor_instruction)

---

### 🧠 Summary of Coverage

| Area                     | Status      | Detail                                |
| ------------------------ | ----------- | ------------------------------------- |
| Performance Baseline     | ✅ Included  | Phase 0                               |
| Debug Controls           | ✅ Included  | Overlay toggle + screenshot capture   |
| Visual Validation        | ✅ Included  | Snapshots after every phase/component |
| Accessibility Guardrails | ✅ Enforced  | sacred skip + validation              |
| Role Conflict Strategy   | ✅ Enforced  | precedence + fallback                 |
| Versioning Clarity       | ✅ Applied   | Descriptive semantic phase tagging    |
| Production Safety        | ✅ Handled   | Debug strip{ { { { ping required              | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| Testing Strategy         | ✅ Covered   | Type, Lint, Accessibility, Snapshots  |
| Commit Safety            | ✅ Required  | All criteria must pass to proceed     |
| Snapshot Workflow        | ✅ Automated | `snapshots/{TAG_NAME}` per block      |

---

# **full revised AutoRoleView v4.0 Roadmap** and the **corrected hybrid Cursor instruction block**, **inline and unabridged**.

---

## ✅ **AutoRoleView v4.0 Roadmap – Full Strategy**

### 🔖 Phase Tags Convention

* Use clear phase-based tags:
  `v1.4.1-phase0-baseline`, `v1.4.1-phase1a-core-components`, etc.
* Snapshot folders will be created per tag:
  `/Users/sawyer/gitSync/tm-mobile-cursor/snapshots/{TAG_NAME}`

---

### 🚧 Phase 0: Foundation & Baseline

**Objective:** Establish benchmarks and rollback safety.

* [ ] Capture render time + memory usage for:

  * Dashboard
  * HomeScreen
  * PINEntryScreen
* [ ] Snapshot UI for baseline:

  * Use debug overlay
  * Save to `snapshots/v1.4.1-phase0-baseline`
* [ ] Validate:

  * `{ { { { npx tsc --noEmit` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  * `npm run lint`
* [ ] Static audit for sacred View blocks
* [ ] Prepare rollback script & verify backu{ { { { ps
* [ ] Confirm debug overlay toggle & dev-only config & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
* [ ] Validate `RoleDebugger` and `RoleValidationTest.tsx` visibility

---

### 🧩 Phase 1: Priority Component Migration

#### 🔸 Phase 1a: Core UI Components

Target: `src/components/ui/`

| Component                   | Role                              |
| --------------------------- | --------------------------------- |
| `Button.tsx`                | `interactiveRole="button-action"` |
| `Text.tsx`                  | `contentRole="body"`              |
| `TagChip.tsx`               | `interactiveRole="chip"`          |
| `ModernHeader.tsx`          | `layoutRole="header"`             |
| `BottomNav.tsx`             | `layoutRole="navigation"`         |
| `FloatingActionButton.tsx`  | `interactiveRole="button-action"` |
| `GlassmorphicContainer.tsx` | `layoutRole="card"`               |
| `LoadingScreen.tsx`         | `layoutRole="container"`          |
| `ActionSheet.tsx`           | `layoutRole="modal"`              |

Post-migration checklist (for each file):

* [ ] Role applied via AutoRoleView
* [ ] Snapshot captured
* [ ] Lint + typecheck clean
* [ ] Debug overlay confirmed
* [ ] Accessibility pro{ { { { ps validated & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
* [ ] No sacred components violated

---

#### 🔸 Phase 1b: High-Traffic Screens

Target: `src/features/home/screens/`, `src/features/thoughtmarks/screens/`

Screens (View count estimates):

| Screen                  | Est. Views | Notes                    |
| ----------------------- | ---------- | ------------------------ |
| `HomeScreen.tsx`        | 50+        | Most complex             |
| `DashboardScreen.tsx`   | 30+        | Critical path            |
| `SearchScreen.tsx`      | 15+        | Includes filters         |
| `ThoughtmarkDetail.tsx` | 25+        | Includes dynamic content |
| `AllBinsScreen.tsx`     | 20+        | Reusable bin cards       |

Apply:

* AutoRoleView with correct `layoutRole`
* Use context map{ { { { ping from prior audits & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

---

#### 🔸 Phase 1c: Authentication Screens

Target: `src/features/auth/screens/`

| Screen                | Role Types            |
| --------------------- | --------------------- |
| `SignIn.tsx`          | Form, section         |
| `SignUp.tsx`          | Form, section         |
| `PINEntryScreen.tsx`  | Form, keyboard, modal |
| `CreateBinScreen.tsx` | Form, section         |
| `AIToolsScreen.tsx`   | Section, card-action  |

---

#### 🔸 Phase 1d: Settings & Secondary Screens

Target: `src/features/settings/screens/`, `src/features/content/screens/`

| Screen                     | Role Types          |
| -------------------------- | ------------------- |
| `ProfileScreen.tsx`        | Section, ava{ { { { tar     | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `AdminDashboardScreen.tsx` | Navigation, modal   |
| `ContentScreen.tsx`        | Card, button-action |
| `ExportScreen.tsx`         | Modal, interactive  |

---

### 🔁 Phase 2: Validation & Optimization

**Checklist (for all migrated components):**

* [ ] Role inheritance tested
* [ ] ESLint role rules satisfied
* [ ] RoleDebugger + overlay reviewed
* [ ] All snapshots visually match prior layout
* [ ] Accessibility attributes rendered in UI tree
* [ ] Memory & render benchmarks compared to Phase 0
* [ ] Performance delta ≤5%, Memory delta ≤10%
* [ ] Sacred roles untouched
* [ ] Visual regressions = 0

---

## 🧩 **AutoRoleView v4 Cursor Instruction Block**

```json
{
  "notes": [
    "🧠 MISSION: Safely and incrementally apply AutoRoleView v4.0 with full visibility, rollback, and validation.",
    "🎯 GOAL: Replace View with AutoRoleView + semantic roles across critical screens, without regression.",
    "🚨 SAFETY ENFORCEMENT 🚨",
    "✅ Obey sacred component protections",
    "✅ No backup (.tar.gz) unless app visually confirmed working",
    "✅ Create /snapshots/{TAG_NAME} after every layout-affecting change",
    "✅ All diffs validated by lint, typecheck, and debug overlay",
    "✅ Do not call a tag complete/final unless it compiles AND visually matches baseline"
  ],
  "auditMode": true,
  "onlySuggestRoles": true,
  "skipSacred": true,
  "useReference": [
    "roles-cheatsheet.md",
    "static role audit",
    "SACRED_COWS_PROTECTION.md"
  ],
  "enforceMaxOneRolePerComponent": true,
  "deferToAutoRoleView": true,
  "screenContext": "line-by-line patching with developer review",
  "parseCheck": true,
  "onParseFail": "revert-and-alert",
  "postMutationBuild": "{ { { { npx tsc --noEmit && npm run lint", & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  "blockCommitOnError": true,
  "alertUserOnParseFail": true,
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",
  "preCommit": {
    "before": [
      "git add .",
      "git commit -m \"chore(backup): tag before phase {PHASE} begins\"",
      "git tag v1.4.1-phase{PHASE}-start_$(date -u +%y%m%d_%H%MUTC)"
    ]
  },
  "snapshotPath": "/Users/sawyer/gitSync/tm-mobile-cursor/snapshots/{TAG_NAME}",
  "phases": [
    {
      "section": "Phase 0: Performance & Visual Baseline",
      "actions": [
        "Run perf + memory benchmarks on key screens",
        "Capture screenshots to /snapshots/v1.4.1-phase0-baseline",
        "Run RoleDebugger and validate debug overlay visibility",
        "Run `{ { { { { { { { npx tsc --noEmit && npm run lint`" & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
      ],
      "commit": "chore: capture performance and visual baselines",
      "tag": "v1.4.1-phase0-baseline_$(date -u +%y%m%d_%H%MUTC)"
    },
    {
      "section": "Phase 1a: Core UI Components Migration",
      "actions": [
        "Replace View with AutoRoleView in all UI components (non-sacred)",
        "Apply role per component (Text, Button, Chip, etc.)",
        "Run RoleDebugger and confirm debug overlay correctness",
        "Capture visual snapshot in /snapshots/v1.4.1-phase1a-core-components",
        "Run `npx tsc --noEmit && npm run lint`"
      ],
      "commit": "feat: migrate core UI components to AutoRoleView",
      "tag": "v1.4.1-phase1a-core-components_$(date -u +%y%m%d_%H%MUTC)"
    }
  ],
  "final": {
    "commit": "chore: confirm AutoRoleView v4 core role system validated",
    "tag": "v1.4.1-final-stable_$(date -u +%y%m%d_%H%MUTC)",
    "notes": "All core UI, auth, and settings screens migrated to AutoRoleView v4. Snapshots verified. No sacred violations. Role inheritance and debug validation passed."
  }
}
```

---

Let me know if you'd like to:

* Begin with `Phase 0: Baseline`
* Prepare snapshot automation scripts
* Begin pilot migration with Button or TagChip

Or all of the above.

