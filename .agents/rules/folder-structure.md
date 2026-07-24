# Folder Structure Rules

## Goal

Keep the codebase feature-first, predictable, and easy for an AI agent to extend without introducing layout drift.

## Required Top-Level Shape

- `src/` contains all application source code.
- `src/_app/` contains app bootstrap, providers, global styles, and root route wiring.
- `src/<feature>/` contains one major business domain or product feature, such as `auth`, `accounting`, or `ledger-accounts`.
- `src/shared/` contains reusable code that is not owned by a single feature.

## Feature Folder Layout

Each feature should follow this structure when the concern exists:

```text
src/<feature>/
  __docs__/
  components/
  hooks/
  pages/
  layouts/
  dialogs/
  lib/
  routes/
```

- `__docs__/` contains feature-specific documentation, decisions, examples, and diagrams.
- `components/` contains pure presentation components with no external side effects.
- `hooks/` contains feature-scoped hooks for UI behavior, data access, and API integration.
- `pages/` contains page composition and orchestration only.
- `layouts/` contains reusable layout wrappers for that feature.
- `dialogs/` contains dialog orchestrators and dialog-specific composition.
- `lib/` contains feature services, mappers, helpers, utilities, and adapters.
- `routes/` contains route definitions that render pages only.

## Component Folder Layout

Every public or independently reusable component must live in its own directory.
Private UI subcomponents may live in the owning component's optional `parts/`
directory.

```text
components/<name>/
  <ui>.tsx
  <ui>.stories.tsx
  <ui>.test.tsx
  <ui>.container.tsx
  parts/
    <part>.tsx
    <part>.stories.tsx
    <part>.test.tsx
  types.ts
  validation.ts
  index.ts
```

- Use `<ui>.tsx` for the pure component.
- Use `<ui>.stories.tsx` for Storybook documentation.
- Use `<ui>.test.tsx` for Jest or Vitest UI tests.
- Use `<ui>.container.tsx` only when the component requires side effects or orchestration.
- Use `parts/` only for substantial UI subcomponents consumed exclusively by
  the owning component directory.
- Use `types.ts` for component-specific types.
- Use `validation.ts` for validation logic related to the component.
- Use `index.ts` as the public barrel for the component directory.
- Do not add a barrel to `parts/` or re-export parts from the owner's
  `index.ts`.
- Promote a part to its own component directory when another owner needs it.

## Shared Folder Layout

Shared code should stay generic and reusable.

```text
src/shared/
  assets/
  components/
  hooks/
  i18n/
  layouts/
  lib/
  configs/
```

- `components/` contains reusable presentational building blocks.
- `hooks/` contains reusable hooks shared across multiple features.
- `layouts/` contains reusable layout primitives.
- `lib/` contains shared services, helpers, mappers, and utilities.
- `configs/` contains shared configuration data such as currencies, country lists, and fiscal-year settings.
- `assets/` contains reusable static assets consumed by multiple independent owners.
- `i18n/` contains only genuinely shared locale resources. Feature locale resources belong in the owning feature, and i18n composition/initialization belongs in `_app/`.
- Component-specific support files, including hooks, contexts, types, variants, validation, helpers, stories, and tests, belong in the narrowest component directory that owns all of their consumers.

## Shared Component Layout

Shared components also live in dedicated directories.

```text
components/<name>/
  <ui>.tsx
  <ui>.stories.tsx
  <ui>.test.tsx
  parts/
    <part>.tsx
    <part>.stories.tsx
    <part>.test.tsx
  types.ts
  index.ts
```

- `icons/` is a shared exception for icon components.
- `icons.stories.tsx` documents the full icon set.
- Shared component parts remain private to their owning shared component and
  must not import feature code.

## Naming Rules

- Use feature names that match the business domain.
- Use directory names that are stable and descriptive.
- Keep file names consistent with the exported component or hook name.
- Prefer one responsibility per file and one public entry point per folder.
- Do not use redundant suffixes (like `.page.tsx`, `.dialog.tsx`, or `.route.tsx`) for files that already live in role-specific directories (e.g., `pages/`, `dialogs/`, `routes/`). Use suffixes only for cohabiting files like `.container.tsx`, `.stories.tsx`, or `.test.tsx`.
