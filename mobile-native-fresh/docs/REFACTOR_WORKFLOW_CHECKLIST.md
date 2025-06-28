# Refactor Workflow Checklist

**⚠️ MANDATORY: Paste this checklist at the top of every large refactor ticket**

## PRE-REFRACTOR CHECKLIST

### Phase 1: Safety Preparation
- [ ] **Commit and tag current state** as rollback point
  ```bash
  git add .
  git commit -m "chore: pre-refactor safety checkpoint"
  git tag pre-refactor-$(date +%Y%m%d-%H%M%S)
  git push --tags
  ```
- [ ] **Create non-destructive branch** for mutations
  ```bash
  git checkout -b refactor/$(date +%Y%m%d)-$(description)
  ```
- [ ] **Verify clean working directory**
  ```bash
  git status
  # Should show "working tree clean"
  ```

### Phase 2: Pre-Refactor Validation
- [ ] **Run parse check** to ensure current state is valid
  ```bash
  npx tsc --noEmit --skipLibCheck
  npx eslint . --ext .ts,.tsx --max-warnings 0
  ```
- [ ] **Test build** in development mode
  ```bash
  npx expo start --clear
  # Verify app starts without errors
  ```
- [ ] **Document current working state** in checklist

## DURING REFACTOR

### Phase 3: Mutation Safety
- [ ] **Apply mutations incrementally** (not all at once)
- [ ] **Run parse check after each major change**
  ```bash
  npx tsc --noEmit --skipLibCheck
  ```
- [ ] **Block commit if any parse errors remain**
- [ ] **Alert user if files cannot be safely autofixed**
- [ ] **Use ESLint to catch accessibility prop issues**
  ```bash
  npx eslint . --ext .ts,.tsx --rule 'no-inline-accessibility-props-in-function: error'
  ```

### Phase 4: Error Recovery
- [ ] **If syntax errors occur:**
  1. Stop all automation immediately
  2. Revert to last known good state
  3. Document the problematic pattern
  4. Create targeted fix before continuing
- [ ] **If build fails:**
  1. Check for TypeScript compilation errors
  2. Verify all imports are correct
  3. Ensure no circular dependencies
  4. Test individual components if needed

## POST-REFRACTOR

### Phase 5: Validation & Testing
- [ ] **Test build in development mode**
  ```bash
  npx expo start --clear
  # Verify app starts and runs correctly
  ```
- [ ] **Test build in production mode**
  ```bash
  npx expo start --no-dev --minify
  # Verify production build works
  ```
- [ ] **Run comprehensive linting**
  ```bash
  npx eslint . --ext .ts,.tsx --max-warnings 0
  npx tsc --noEmit --skipLibCheck
  ```
- [ ] **Manual code review** of all changed files
- [ ] **Test critical user flows** in the app

### Phase 6: Final Commit & Push
- [ ] **Only then, commit changes**
  ```bash
  git add .
  git commit -m "refactor: [description] - [date]"
  ```
- [ ] **Tag successful completion**
  ```bash
  git tag refactor-complete-$(date +%Y%m%d-%H%M%S)
  ```
- [ ] **Push to remote**
  ```bash
  git push --set-upstream origin refactor/$(date +%Y%m%d)-$(description)
  git push --tags
  ```

## EMERGENCY ROLLBACK PROCEDURE

### If Refactor Goes Wrong:
1. **Immediate stop** all automation
2. **Revert to last known good state**
   ```bash
   git reset --hard pre-refactor-$(date)
   git clean -fd
   ```
3. **Verify rollback worked**
   ```bash
   npx expo start --clear
   ```
4. **Document what went wrong**
5. **Create new branch** for targeted fix

## SAFEGUARDS SUMMARY

### ESLint Rules in Place:
- ✅ `no-inline-accessibility-props-in-function`: Prevents accessibility props in functions
- ✅ `react/jsx-no-bind`: Prevents bad prop placement
- ✅ Custom accessibility rule: Catches inline accessibility issues

### Automation Protections:
- ✅ Parse check before commit
- ✅ TypeScript compilation validation
- ✅ ESLint error blocking
- ✅ Build testing in dev and production

### Workflow Enforcements:
- ✅ Non-destructive branch creation
- ✅ Incremental mutation application
- ✅ Error recovery procedures
- ✅ Manual validation requirements

---

**⚠️ REMEMBER: Never commit with parse errors. Always test builds. Always manual review.** 