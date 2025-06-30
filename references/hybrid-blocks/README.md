# 🧱 Hybrid Cursor Blocks

This folder stores reusable and timestamped Cursor instruction blocks, each scoped to a discrete, testable task.

## File Naming
Use the format:
`[execution_order]_vX.Y.Z_[task-name].hybrid-block-v1.json`

## Sections inside each block
- ✅ Pre-check
- 🧠 Mission
- 🎯 Goal
- 📌 Context
- 💥 Bug (if any)
- 🔧 Fix Summary
- 🔐 Relevance (theme, auth, accessibility, etc.)

## Tips
- Don't mutate global structure mid-block.
- Always include a rollback checkpoint before mutation.
- Avoid `*` globs that match too broadly during automated runs.
