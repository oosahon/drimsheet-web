# Agent Guide

This repository uses `.agents/rules/` as the source of truth for AI task execution.

Before making changes, follow the rules in:

- `.agents/rules/folder-structure.md`
- `.agents/rules/dependency-rules.md`
- `.agents/rules/file-responsibility-rules.md`
- `.agents/rules/shadcn-rules.md` when working with shadcn-generated code

## Working Principles

- Keep changes aligned with the existing feature-first structure.
- Prefer the smallest file and folder change that satisfies the task.
- Preserve dependency direction and file responsibility boundaries.
- If a task appears to conflict with the rules, update the rules first or call out the conflict before proceeding.
- For shadcn tasks, use `.agents/skills/add-shadcn-ui/SKILL.md` and `.agents/workflow/shadcn-ui.md`.
