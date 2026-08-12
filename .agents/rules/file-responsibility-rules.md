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
- Give a callback a `handle*` name when its body contains branching, lookup,
  transformation, or multiple statements. A short single-expression adapter
  may remain inline.
- Do not use nested ternaries. Prefer guard clauses, `if`/`else`, nullish
  coalescing when it preserves semantics, or a named resolver.

## `parts/`

- Use `parts/` only for UI subcomponents owned by and private to one component
  directory.
- Keep each part focused on one recognizable section of the owning UI.
- Do not use `parts/` as a general bucket for hooks, services, utilities, or
  reusable components.
- Do not add a `parts/index.ts` barrel or expose parts through the owner's public
  API.
- Promote a part when it gains a consumer outside its owner.

## Component `helpers/`

- Use a component's `helpers/` directory for deterministic non-UI logic owned
  exclusively by that component.
- Extract initial-value factories, value normalizers, serializers, error
  projections, and reusable predicates from the primary UI `.tsx` file.
- Use the `.helper.ts` suffix and keep one helper in each file. Add a matching
  `.helper.test.ts` that tests its deterministic contract directly.
- Include the owning component and operation in helper file and function names,
  such as `create-inflow-form-initial-values.helper.ts` and
  `createInflowFormInitialValues`. Do not use context-free names such as
  `create-initial-values.helper.ts` or `normalizeValues`.
- Do not add a helpers barrel or expose helpers through the component's public
  `index.ts`.
- Promote logic to the feature or shared `lib/` responsibility directory when
  it gains a consumer outside the component directory.
- Do not use component `helpers/` as a bucket for UI parts, hooks, services,
  validation, or reusable feature logic.

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

- Use `lib/` as a container for reusable non-UI logic.
- Put generated API clients and their transport configuration in `lib/api/`.
- Put static configuration data in `lib/configs/`.
- Put deterministic data transformations in `lib/mappers/`.
- Put reusable business operations and side-effect boundaries in
  `lib/services/`.
- Put cross-file contracts owned by the feature or shared layer in
  `lib/types/`.
- Put small, deterministic, general-purpose functions in `lib/utils/`.
- Do not place implementation files directly in `lib/`.
- Avoid a generic feature or shared `helpers/` directory; classify reusable
  logic precisely. Component-owned helpers are the scoped exception described
  above.
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
