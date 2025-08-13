# Cursor Rule Directory

This folder contains all `.mdc` rules for project-wide behavior enforcement in the Cursor environment.

## Purpose

- Enforce strict patch delivery, validation, and summary rules
- Ensure GPT honesty, agent discipline, and CLI consistency
- Monitor daemon, orchestrator, and Ghost state and structure
- Maintain structure for patching, recovery, and rollback safety

## Structure

Each `.mdc` file:
- Applies to paths via `globs`
- Includes a description of its purpose
- Defines mandatory behaviors for agents or systems

All rules are reusable, under 500 lines, and tuned for CYOPS and MAIN.

## Autogeneration

These files are monitored by `doc-daemon.sh` and will trigger `README.md` + `INDEX.md` updates on change.

> Location: `/Users/sawyer/gitSync/.cursor/rules` 