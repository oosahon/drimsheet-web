# File Responsibility Rules

## Goal

Make each file easy to understand, safe to change, and obvious for an AI agent to place correctly.

## `*.tsx` Component Files

- Pure component files must contain presentation logic only.
- Pure component files must not fetch data, read local storage, trigger navigation, or mutate global state.
- Pure component files may accept props, render UI, and emit callbacks.
- Keep trivial render helpers inline, but move coherent UI sections with their
  own props, hooks, handlers, or meaningful conditional rendering into the
  owner's `parts/` directory.

## `parts/`

- Use `parts/` only for UI subcomponents owned by and private to one component
  directory.
- Keep each part focused on one recognizable section of the owning UI.
- Do not use `parts/` as a general bucket for hooks, services, utilities, or
  reusable components.
- Do not add a `parts/index.ts` barrel or expose parts through the owner's public
  API.
- Promote a part when it gains a consumer outside its owner.

## `*.container.tsx` Files

- Use container files when the UI needs side effects or orchestration.
- Containers may connect hooks, services, dialogs, loaders, and page-level state to a pure component.
- Containers should keep business logic thin and delegate reusable logic to hooks or `lib/`.

## `*.stories.tsx` Files

- Stories must document the component in realistic states.
- Stories should focus on visual variants and interaction states.
- Stories should not hide required props behind complex setup unless that setup is part of the story’s purpose.

## `*.test.tsx` Files

- Test pure components, containers, hooks, and validation logic when behavior matters.
- Keep tests focused on one behavior or one user outcome per test.
- Tests should verify the contract of the file, not implementation details.

## `types.ts`

- Put public component or feature types here when they are shared by more than one file in the same folder.
- Keep types small, explicit, and local to the owning folder.

## `validation.ts`

- Put field and form validation logic here.
- Keep validation code deterministic and side-effect free.
- Share validation only when multiple components need the exact same rules.

## `index.ts`

- Export only the folder’s public API.
- Barrel files should re-export the component, types, and validation entry points that are meant for consumption.
- Do not export private components from `parts/`.
- Avoid exporting internal helpers from the barrel.

## `lib/`

- Put services, adapters, mappers, helpers, and utility functions here.
- `lib/` should contain reusable logic that is not tied to a single UI component.
- Keep `lib/` free of page-specific orchestration.

## `hooks/`

- Put reusable UI and API hooks here.
- Hooks may coordinate state and side effects, but they should still remain reusable within the feature or shared scope.

## `pages/`

- Pages should orchestrate feature pieces and own page composition.
- Pages should not contain reusable business logic that belongs in `lib/` or hooks.

## `routes/`

- Route files should only map paths to pages.
- Routes should not contain UI implementation details.

## Documentation

- Use `__docs__/` for feature decisions, workflows, usage notes, and diagrams.
- Keep documentation close to the feature it describes.
