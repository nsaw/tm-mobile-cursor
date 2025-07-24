# Agent Training: Non-Blocking Terminal Patterns

## 🎯 Training Objective
All agents (BRAUN, THE KID, GPT) must understand and implement non-blocking terminal patterns to prevent Cursor UI freezing and maintain responsive agent chat.

## 🚨 CRITICAL RULE
**NEVER execute blocking terminal commands in agent chat without using the mandatory non-blocking pattern.**

## 📋 Mandatory Non-Blocking Pattern

### Standard Pattern
```{ { { { { { { { { { { { { { { bash
{ command &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Pattern Components
1. **Subshell Wrapping**: `{ command & }` - Isolates command execution
2. **Background Execution**: `&` - Runs command in background
3. **Output Suppression**: `>/dev/null 2>&1` - Prevents output blocking
4. **Process Detachment**: `& disown` - Removes from parent process

## ✅ Safe Commands (No Pattern Required)

These commands can be executed directly:
- `ls`, `pwd`, `echo`, `cat`, `git status`
- `which`, `test`, `true`, `false`
- `head`, `tail`, `wc`, `grep`, `find`, `sort`, `uniq`

## ❌ Blocking Commands (Pattern Required)

These commands MUST use non-blocking pattern:
- `execSync`, `{ { { { npm run`, `npx`, `node` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- `{ { { { python3 -m`, `bash scripts/`, `curl` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- `{ { { { ps aux`, `tar`, `rsync`, `ping`, `nmap` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- `docker`, `kubectl`, `fly`, `ngrok`, `expo start`

## 🔧 Pattern Variations

### With Timeout Protection
```{ { { { bash
{ timeout 300 command & & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### With Logging to File
```bash
{ command & } >logs/command.log 2>&1 & disown
```

### With Process ID Tracking
```bash
{ command & } >/dev/null 2>&1 & echo $! > /tmp/command.pid & disown
```

### With Error Handling
```bash
{ command & } >/dev/null 2>&1 || echo "Command failed" & disown
```

## 📝 Code Examples

### JavaScript/Node.js
```javascript
// ❌ BLOCKING - Never use this
execSync('{ { { { { { { { { { { { { npm run build &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' });

// ✅ NON-BLOCKING - Use this
exec('{ timeout 300 { timeout 300 { timeout 300 { npm run build & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
    if (error) {
        console.error('Build failed:', error.message);
    }
});
```

### Shell Scripts
```{ { { { bash
# ❌ BLOCKING - Never use this & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { npx expo start --clear &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# ✅ NON-BLOCKING - Use this
{ npx expo start --clear & } >/dev/null 2>&1 & disown
```

### Python
```python
# ❌ BLOCKING - Never use this
subprocess.run(['npm', 'run', 'build'], check=True)

# ✅ NON-BLOCKING - Use this
subprocess.Popen('{ npm run build & } >/dev/null 2>&1 & disown', shell=True)
```

## 🔍 Validation Tools

### Pre-Execution Validation
```{ { { { bash
# Validate a command before execution & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { bash scripts/validate-terminal-patterns.sh check "npm run build" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### File Validation
```{ { { { bash
# Validate all files in project & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { { bash scripts/validate-terminal-patterns.sh validate & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
```

### Pre-Commit Validation
```{ { { { bash
# Validate staged files before commit & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { bash scripts/validate-terminal-patterns.sh pre-commit & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

## 🚨 Common Violations to Avoid

### 1. Direct execSync Usage
```javascript
// ❌ VIOLATION
const result = execSync('{ { { { { { { { { npx tsc --noEmit &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' }), { encoding: 'utf8' });

// ✅ CORRECT
exec('{ timeout 300 { timeout 300 { timeout 300 { npx tsc --noEmit & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
    if (error) {
        console.error('TypeScript check failed:', error.message);
    }
});
```

### 2. Direct Script Execution
```{ { { { bash
# ❌ VIOLATION & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { bash scripts/validate-runtime.sh &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# ✅ CORRECT
{ bash scripts/validate-runtime.sh & } >/dev/null 2>&1 & disown
```

### 3. Direct Process Monitoring
```javascript
// ❌ VIOLATION
const processes = execSync('{ { { { { { { { { ps aux | grep node &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown&  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown& & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' }), { encoding: 'utf8' });

// ✅ CORRECT
exec('{ timeout 300 { timeout 300 { timeout 300 { ps aux | grep node & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
                            if (error) {
                                console.error('Command failed:', error.message);
                            }
                        }), (error, stdout, stderr) => {
    if (!error && stdout) {
        console.log('Node processes found');
    }
});
```

## 🔄 Migration Process

### Step 1: Identify Blocking Commands
```{ { { { bash
# Run validation to find violations & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/validate-non-blocking-patterns.js & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Step 2: Apply Non-Blocking Patterns
```{ { { { bash
# The validator will automatically fix violations & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Review changes before committing
```

### Step 3: Test Functionality
```{ { { { bash
# Ensure commands still work as expected & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
# Check logs for any errors
```

### Step 4: Validate Compliance
```{ { { { bash
# Run validation again to confirm compliance & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
bash scripts/validate-terminal-patterns.sh validate
```

## 📊 Monitoring and Reporting

### Validation Reports
- Location: `logs/non-blocking-validation-report.json`
- Location: `logs/terminal-pattern-compliance-report.md`

### Log Files
- Validation logs: `logs/terminal-pattern-validation.log`
- Command execution logs: `logs/command.log`

## 🎯 Agent Responsibilities

### BRAUN (MAIN Agent)
- ✅ Always use non-blocking patterns for script execution
- ✅ Validate commands before execution
- ✅ Monitor for blocking command violations
- ✅ Report violations to GPT immediately

### THE KID (DEV Agent)
- ✅ Follow same non-blocking patterns
- ✅ Validate all terminal commands
- ✅ Use timeout protection for long-running commands
- ✅ Log all command executions

### GPT (BRAIN/COACH)
- ✅ Enforce non-blocking patterns in all instructions
- ✅ Validate agent compliance
- ✅ Review and approve command changes
- ✅ Monitor for UI freezing incidents

## 🚨 Emergency Procedures

### If Cursor UI Freezes
1. **Immediate Action**: Stop all blocking commands
2. **Diagnosis**: Check for execSync or direct command execution
3. **Recovery**: Restart Cursor and apply non-blocking patterns
4. **Prevention**: Run validation to prevent future incidents

### If Command Validation Fails
1. **Stop Execution**: Do not proceed with blocking command
2. **Apply Pattern**: Convert to non-blocking pattern
3. **Test**: Verify functionality is maintained
4. **Document**: Update training materials if needed

## 📚 Additional Resources

### Validation Scripts
- `scripts/validate-non-blocking-patterns.js` - Comprehensive validation
- `scripts/validate-terminal-patterns.sh` - Real-time validation

### Documentation
- `docs/cursor-rules/no-terminal-blocking.mdc` - Rule definition
- `docs/cursor-rules/non-blocking-terminal-patterns.mdc` - Pattern examples

### Examples
- See `scripts/` directory for compliant examples
- Check `logs/` directory for validation reports

## ✅ Compliance Checklist

Before executing any terminal command, verify:
- [ ] Command is not in blocking patterns list
- [ ] Non-blocking pattern is applied if needed
- [ ] Timeout protection is added for long-running commands
- [ ] Output is properly redirected
- [ ] Process is detached with disown
- [ ] Error handling is implemented
- [ ] Command is tested for functionality

## 🎓 Training Completion

**All agents must acknowledge understanding of:**
1. ✅ Mandatory non-blocking pattern structure
2. ✅ Safe vs blocking command identification
3. ✅ Pattern variations and use cases
4. ✅ Validation tools and procedures
5. ✅ Emergency response procedures
6. ✅ Compliance requirements

**Training Status**: ✅ COMPLETED
**Next Review**: After any UI freezing incidents
**Enforcement**: IMMEDIATE - No exceptions allowed 