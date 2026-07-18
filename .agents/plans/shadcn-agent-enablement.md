# Shadcn Agent Enablement Plan

## Goal

Enable AI agents to add and update shadcn code without allowing the generation
tool to define the repository architecture.

`components.json` is a generation entry point. The rules and workflows are the
source of truth for final ownership and placement.

## Responsibility Model

Use three instruction layers with no duplicated architectural guidance:

1. **Rules** define permanent invariants and valid final states.
2. **Workflows** define the operational add and update procedures.
3. **Skill** detects relevant tasks and routes the agent to the rules and
   workflow.

Deterministic repository scripts should perform generation and validation.
Agents should retain the ownership decisions that require code understanding.

## Proposed Files

```text
.agents/
  rules/
    shadcn-rules.md
  workflow/
    adding-shadcn-ui.md
    updating-shadcn-ui.md
  skills/
    add-shadcn-ui/
      SKILL.md
```

Also update the root `AGENTS.md` to require the shadcn rule and route shadcn
tasks to the skill and workflows.

## `components.json`

Configure broad landing directories instead of trying to encode final module
ownership:

```json
{
  "aliases": {
    "components": "@/shared/components",
    "ui": "@/shared/components",
    "utils": "@/shared/lib",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

Also point `tailwind.css` at the actual app stylesheet:
`src/_app/index.css`.

Generated files may be temporarily invalid according to the final folder
rules. The selected workflow must normalize them before the task is complete.

## Shadcn Rules

Create `.agents/rules/shadcn-rules.md` with these invariants:

- Treat generated shadcn code as application-owned source code.
- Treat `components.json` aliases as landing directories only.
- Do not consider a shadcn command complete until generated files have been
  normalized.
- Place every file at the narrowest scope that owns all of its consumers.
- Put component-specific hooks, contexts, types, variants, validation, and
  utilities in the owning component directory.
- Put only genuinely shared logic in `shared/hooks` or `shared/lib`.
- Do not create `shared/components/ui` or `shared/components/lib` buckets.
- Do not leave component implementations directly under `shared/components`.
- Do not overwrite an owned component without reviewing the generated diff.
- Preserve the shared dependency boundary after generation.
- Use local, pinned project tooling rather than fetching an arbitrary latest
  CLI version.

Keep this rule concise because agents must load it for every shadcn task.

## Adding Workflow

Create `.agents/workflow/adding-shadcn-ui.md` with the following procedure.

### 1. Preflight

- Read the folder, dependency, file responsibility, and shadcn rules.
- Inspect `components.json` and the requested registry item.
- Inspect the working tree and preserve unrelated user changes.
- Identify whether the requested component already exists.

### 2. Generate

- Run the locally pinned shadcn CLI through the repository command.
- Generate all requested components and transitive dependencies.
- Inventory every generated or modified file before moving anything.

### 3. Determine Ownership

For each generated file:

- Component implementation: create or use `components/<name>/`.
- Component-only helper, hook, context, type, or utility: co-locate it with the
  component.
- Shared hook or utility: group it under `shared/hooks` or `shared/lib` by
  responsibility.
- Feature-specific or app-specific code: move it to the owning feature or
  `_app`; do not force it into shared.

Use imports and consumers to make this decision. Registry file types and
generation paths are hints, not authority.

### 4. Normalize

- Move generated files to their final owners.
- Rename files according to repository naming rules.
- Rewrite imports to final public paths.
- Create or update component `index.ts` files.
- Co-locate or add stories and focused tests where behavior warrants them.
- Remove all temporary flat generated files.

### 5. Verify

- Run the structural checker.
- Search for stale landing-path imports.
- Run formatting, focused tests, Storybook checks, lint, and build as required
  by the change's risk.
- Inspect the final diff for unintended theme, dependency, or global CSS
  changes.

## Updating Workflow

Create `.agents/workflow/updating-shadcn-ui.md` separately because updates have
different overwrite risks.

The workflow should:

1. Regenerate the requested item into the configured landing directory.
2. Compare every generated file with its canonical owned file.
3. Identify local customizations and upstream changes.
4. Apply changes deliberately instead of replacing the canonical file.
5. Review transitive dependency updates independently.
6. Normalize any newly introduced support files.
7. Remove generated comparison files.
8. Run the same structural and behavioral verification as the adding
   workflow.

An existing canonical component must remain untouched when the agent cannot
confidently reconcile the diff.

## Trigger Skill

Create a concise `.agents/skills/add-shadcn-ui/SKILL.md`.

Its description should trigger when an agent is asked to add, install,
reinstall, regenerate, diff, or update shadcn components or registry items.

The skill body should only instruct the agent to:

1. Read `.agents/rules/shadcn-rules.md`.
2. Select the adding or updating workflow.
3. Use the repository's pinned generation command.
4. Complete normalization and verification before reporting success.

Do not repeat folder rules or the full workflow in the skill. This keeps the
skill small and prevents instruction drift.

## Repository Tooling

Add deterministic commands for the fragile parts of the process:

```text
shadcn:stage     Invoke the pinned CLI and report all generated landing files.
check:structure  Reject invalid final placement and obsolete shared paths.
```

The staging command should:

- Snapshot relevant landing directories before generation.
- Run the local shadcn executable.
- Report requested and transitive generated files.
- Detect collisions with canonical owned modules.
- Avoid silently overwriting existing canonical code.

The structure command should reject:

- Flat component `.ts` or `.tsx` files under `shared/components`.
- Legacy shared directories after migration.
- Component-local support stranded in known global landing paths.
- Missing component public entry points.
- Imports from `shared/` into feature directories.

Ownership classification should remain in the workflow rather than being
guessed by a filename-only script.

## Validation Scenarios

Forward-test the completed workflow and skill with these cases:

1. Add a leaf component such as `button`.
2. Add a component with a transitive dependency such as `alert-dialog`.
3. Add an item that generates a hook or utility.
4. Add an item when one transitive component already exists and is customized.
5. Update an existing customized component with upstream changes.
6. Interrupt normalization and confirm `check:structure` catches the landing
   files.

## Completion Criteria

- Agents consistently invoke the project workflow for shadcn tasks.
- Direct generation cannot leave an apparently valid but architecturally
  incorrect result.
- New components follow the same structure as existing owned components.
- Component-specific support is co-located with its owner.
- Existing customized components are never silently overwritten.
- The skill, workflows, rules, and scripts each have one distinct
  responsibility.
