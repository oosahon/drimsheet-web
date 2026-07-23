# Shadcn UI Workflow

## Goal

Generate shadcn registry code, then normalize it into the repository's owned architecture.

## 1. Preflight

- Read `.agents/rules/folder-structure.md`, `.agents/rules/dependency-rules.md`, `.agents/rules/file-responsibility-rules.md`, and `.agents/rules/shadcn-rules.md`.
- Read `.agents/skills/shadcn/SKILL.md` and any official shadcn rule file it points to that is relevant to the requested component or usage.
- Inspect `components.json`.
- Inspect the requested registry item with the shadcn CLI before installing when the item is not already understood.
- Inspect the working tree and preserve unrelated user changes.
- Identify whether the requested component or any transitive component already exists in its canonical owned directory.

## 2. Generate Or Compare

- For new items, run the locally pinned shadcn CLI through `npm run shadcn:stage -- <item...>`.
- For existing owned items, preview or stage generated output only as a comparison source.
- Generate all requested components and transitive dependencies in one pass when practical.
- Inventory every generated or modified landing file before moving anything.
- Never use shadcn overwrite behavior without explicit user approval.
- If an owned component already exists, compare generated output with the canonical file and preserve local customizations.

## 3. Determine Ownership

For each generated file:

- Component implementation: create or use `components/<name>/`.
- Component-only helper, hook, context, type, variant, validation, or utility: co-locate it with the component.
- Shared hook or utility: group it under `src/shared/hooks` or `src/shared/lib` by responsibility only when multiple independent owners consume it.
- Feature-specific or app-specific code: move it to the owning feature or `src/_app`.

Use imports and consumers to make this decision. Registry file types and generation paths are hints, not authority.

## 4. Normalize

- Move generated files to their final owners.
- Rename files according to repository naming rules.
- Rewrite imports to final public paths.
- Create or update component `index.ts` files.
- Apply upstream changes deliberately to canonical files instead of replacing them wholesale.
- Co-locate or add stories and focused tests when behavior, variants, or interaction risk warrants them.
- Remove all temporary flat generated files, comparison files, and obsolete landing buckets.

## 5. Verify

- Run `npm run check:structure`.
- Search for stale landing-path imports such as `@/components/ui`, `@/lib/utils`, `@/hooks`, `@/shared/components/ui`, and `@/shared/components/lib`.
- Run formatting, focused tests, Storybook checks, lint, and build as required by the change's risk.
- Inspect the final diff for unintended theme, dependency, or global CSS changes.

An existing canonical component must remain untouched when the agent cannot confidently reconcile the generated diff.
