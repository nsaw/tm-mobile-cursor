# 🧩 Enhanced AutoRoleView Reference Guide

**Version**: v4.0 (Enhanced)  
**Based on**: Old rollback reference docs + new patches  
**Status**: Ready for Phase 0 implementation

---

## 🔄 **Evolution from v3.0 to v4.0**

### **What We Learned from v3.0 Failure**
- ❌ **Mass migration** caused cascading failures
- ❌ **Debug overlays** overwhelmed the UI when always-on
- ❌ **Role conflicts** emerged without resolution strategy
- ❌ **Performance degradation** from unchecked overhead
- ❌ **No incremental testing** strategy

### **v4.0 Improvements**
- ✅ **Incremental migration** with phase-based approach
- ✅ **Opt-in debug controls** instead of always-on
- ✅ **Role conflict resolution** with precedence rules
- ✅ **Performance monitoring** throughout migration
- ✅ **Comprehensive testing** at each step

---

## 🧱 **Role System Reference**

### **Layout Roles (`UILayoutRole`)**
| Role Name   | Description | Usage Guidelines |
|------------|-------------|------------------|
| `card`     | Elevated content containers (shadows, radius) | Use for content cards, elevated sections |
| `section`  | Logical content grouping areas | Use for content grouping, not interactive |
| `header`   | Top navigation bar or screen header | Use for page headers, navigation bars |
| `footer`   | Bottom navigation, fixed elements | Use for bottom nav, fixed footers |
| `navigation` | Tab bars, side drawers, link groups | Use for navigation components |
| `modal`    | Full-screen or pop-up overlay | Use for modals, overlays |
| `container` | Generic wrapper (use sparingly) | Use only when no other role fits |

### **Content Roles (`UIContentRole`)**
| Role Name       | Description | Usage Guidelines |
|----------------|-------------|------------------|
| `heading`       | Page or section title | Use for titles, headings |
| `body`          | Main text content | Use for main text content |
| `caption`       | Subtext or descriptive copy | Use for captions, descriptions |
| `label`         | Form labels, field descriptors | Use for form labels |
| `button-text`   | Label text inside buttons | Use for button text |
| `link-text`     | Text inside navigational links | Use for link text |

### **Interactive Roles (`UIInteractiveRole`)**
| Role Name           | Description | Usage Guidelines |
|---------------------|-------------|------------------|
| `button-nav-primary`    | Primary navigation button | Use for main navigation |
| `button-nav-secondary`  | Secondary navigation button | Use for secondary navigation |
| `card-as-nav`           | Card acting as navigation | Use for clickable cards |
| `link-nav`              | Navigation link | Use for navigation links |
| `button-action`         | Action button (submit, save, etc.) | Use for action buttons |
| `button-function`       | Functional button (dropdown, menu) | Use for functional buttons |
| `input`                | Text input field | Use for text inputs |
| `toggle`               | Checkbox or toggle switch | Use for toggles, checkboxes |
| `slider`               | Range/slider control | Use for sliders |
| `chip`                 | Interactive badge/tag, selectable | Use for interactive chips |
| `badge`                | Static or stateful status badge | Use for status badges |
| `tag`                  | Non-interactive label element | Use for non-interactive tags |

---

## 🛡️ **Sacred Components Protection**

### **DO NOT MODIFY During Migration**
Based on `SACRED_COWS_PROTECTION.md`:

- **Onboarding Modal** - Critical user flow
- **Bottom Nav Bar** - Core navigation
- **FAB (Floating Action Button)** - Primary action
- **Modal Wrappers** - Non-dismiss logic
- **Dashboard Header** - Title + icon + tagline
- **Unified Thoughtmark Page** - Core functionality
- **SafeArea Fillers** - Behind FAB/Nav

### **Protection Strategy**
- Use `skipSacred` flag for protected components
- Map surrounding roles without touching sacred components
- Validate sacred components remain untouched after each phase

---

## 🔧 **Enhanced Developer Tools**

### **Environment Toggle Visual Debug** (P0.5.4)
- **Purpose**: Visual indicator for active environment (legacy/nextgen)
- **Implementation**: Subtle header overlay or splash indicator
- **Features**: Dev-only, toggleable, non-intrusive
- **Validation**: No interference with UI testing

### **Form Restore Sentinel** (P2.4.3)
- **Purpose**: Preserve form state across environment switches
- **Implementation**: State persistence mechanism
- **Features**: Works for onboarding and authentication flows
- **Validation**: No data loss during environment transitions

### **Role Heatmap Devtool** (P2.4.4)
- **Purpose**: Visual QA tool for role assignments
- **Implementation**: Color-coded overlay based on role types
- **Features**: Dev-only, toggleable, accurate role visualization
- **Validation**: Helpful for role validation and QA

---

## 🧬 **Role Inheritance & Conflict Resolution**

### **Inheritance Rules**
- `card-as-nav` **inherits** from `button-nav-primary`
- Inheritance handled in utilities and style resolution
- Use `getRoleGroup(role)` for high-level role families

### **Conflict Resolution Strategy**
1. **Precedence Order**: `layoutRole` > `interactiveRole` > `contentRole`
2. **Single Role Enforcement**: Only one role type per component
3. **Fallback Strategy**: Use `container` role for ambiguous cases
4. **Sacred Protection**: Use `skipSacred` flag for protected components

### **Role Group Utilities**
```typescript
// Example role groups
"layout" → card, section, header, footer, navigation, modal, container
"interactive" → button-action, toggle, input, chip, badge, tag
"content" → heading, body, caption, label, button-text, link-text
```

---

## 🔍 **Debugging & Validation**

### **Debug Tools**
- **RoleDebugger**: Visual role state debugging
- **RoleHeatmapDevtool**: Color-coded role visualization
- **EnvironmentIndicator**: Active environment display
- **FormRestoreSentinel**: Form state monitoring

### **Validation Rules**
- Only **one** role type per component
- All roles validated at runtime and compile-time
- Use `validateRoleProps` and `getRoleDebugInfo`
- Warnings for ambiguous or conflicting roles

### **Debug Visual Feedback**
- **Green** = valid role assignment
- **Red** = invalid role assignment
- **Orange** = warning/fallback role
- Debug styles are dev-only and never shipped to production

---

## 📋 **Migration Best Practices**

### **Phase-Based Approach**
1. **Phase 0**: Foundation & baseline establishment
2. **Phase 1**: Core UI components migration
3. **Phase 2**: High-traffic screens migration
4. **Phase 3**: Validation & optimization

### **Testing Strategy**
- **Visual regression testing** after each component
- **Performance monitoring** throughout migration
- **Accessibility compliance** validation
- **Role conflict resolution** testing

### **Rollback Strategy**
- Git tags for each phase
- Manual `.tar.gz` backups on confirmed passes
- Quick rollback capability for each phase
- Comprehensive testing before proceeding

---

## 🚨 **Critical Success Factors**

### **Safety First**
- ✅ Complete legacy backup before any changes
- ✅ Test dual-mount toggle thoroughly
- ✅ Establish performance and visual baselines
- ✅ Protect sacred components and layouts
- ✅ Maintain accessibility compliance

### **Quality Assurance**
- ✅ 100% parse + lint clean
- ✅ No runtime errors or crashes
- ✅ No duplicate JSX role usage
- ✅ Theme inheritance preserved
- ✅ Accessibility props surfaced where needed

### **Performance Standards**
- ✅ No more than 5% render time increase
- ✅ No more than 10% memory usage increase
- ✅ No performance regressions in critical paths
- ✅ Debug mode disabled in production

---

## 📂 **File Locations**

- **Role Definitions**: `src/types/roles.ts`
- **AutoRoleView Component**: `src/components/AutoRoleView.tsx`
- **Role Styles**: `src/theme/roleStyles.ts`
- **Role Validation**: `src/utils/roleValidation.ts`
- **Debug Tools**: `src/components/debug/`
- **Sacred Protection**: `src/utils/sacredProtection.ts`

---

## ✅ **Ready for Implementation**

This enhanced reference guide incorporates:
- ✅ **Old reference docs** for historical context
- ✅ **New patches** for enhanced functionality
- ✅ **Lessons learned** from v3.0 failure
- ✅ **Best practices** for v4.0 implementation
- ✅ **Comprehensive testing** strategy
- ✅ **Safety mechanisms** for enterprise deployment

**Status**: Ready to proceed with Phase 0 implementation 