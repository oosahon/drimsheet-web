# Structure and Public API Rules

## Ownership

- Put feature-owned UI in `src/<feature>/components/<component-name>/`.
- Put reusable, feature-agnostic UI in
  `src/shared/components/<component-name>/`.
- Use kebab-case for the component directory and colocated file names.
- Keep component-only helpers, hooks, contexts, types, variants, validation,
  stories, and tests in the component directory.
- Put extracted UI subcomponents that are private to one component in that
  component's `parts/` directory.
- Move logic to feature `lib` or `hooks` only when it has consumers outside the
  component directory.
- Never import a feature from `src/shared`.

## File set

Create only applicable files, using this shape:

```text
components/<component-name>/
  <component-name>.tsx
  <component-name>.container.tsx
  <component-name>.stories.tsx
  <component-name>.test.tsx
  parts/
    <part-name>.tsx
    <part-name>.stories.tsx
    <part-name>.test.tsx
  helpers/
    <descriptive-helper-name>.helper.ts
    <descriptive-helper-name>.helper.test.ts
  types.ts
  validation.ts
  index.ts
```

Requirements:

- `<component-name>.tsx`: required for rendered UI.
- `<component-name>.stories.tsx`: required for every UI `.tsx` file.
- `index.ts`: required and is the directory's only public entry point.
- `<component-name>.test.tsx`: required when behavior, interaction, validation,
  accessibility, or meaningful conditional rendering needs a contract.
- `types.ts`: required for forms; otherwise use it when types are shared by more
  than one file in the component directory.
- `validation.ts`: required when the component owns validation.
- `<component-name>.container.tsx`: required when the UI needs side effects or
  orchestration.
- `parts/`: optional and reserved for extracted UI subcomponents used only by
  the owning component.
- `helpers/`: required when the component owns deterministic non-UI helpers;
  keep one helper in each `.helper.ts` file with a matching
  `.helper.test.ts`.

## Private parts

Keep small render helpers and short, declarative fragments in the primary
`.tsx` file. Do not let that permission accumulate multiple substantial React
components in one file.

Extract a subcomponent into `parts/` when it represents a coherent UI section
and one or more of these signals apply:

- it has a meaningful props contract;
- it owns hooks, local state, or event handlers;
- it contains meaningful conditional rendering or repeated UI;
- it is a recognizable section whose implementation obscures the parent
  component's composition;
- it benefits from a focused story or behavior test.

Do not extract a trivial wrapper or a few lines of JSX merely to reduce a line
count. A part should make the parent's composition easier to scan and remain
cohesive on its own.

Private parts follow these ownership rules:

- Only files within the owning component directory may import them.
- Import them through explicit relative paths such as `./parts/header-actions`;
  do not create `parts/index.ts`.
- A part that needs an owner-level type imports it relatively, such as
  `../types`, rather than through the owner's public alias.
- Do not export parts from the owner's `index.ts`.
- Name parts for their UI role. Ordinal names are acceptable only when order is
  the actual role, such as steps in a fixed wizard.
- Promote a part to its own `components/<component-name>/` directory when it
  gains a consumer outside the owner.
- Apply the same purity, story, test, and accessibility rules to parts as to
  other UI component files.

## Imports and exports

- Import another component through its directory public API, for example
  `@/shared/components/button`.
- Use direct sibling imports from the component implementation and container.
  They must not import their own directory's `index.ts`.
- Use explicit relative imports for private parts and their owner-local support
  files.
- Import private helpers through explicit relative implementation paths. Do not
  add `helpers/index.ts`, import a helper outside its owner, or re-export one
  from the owner's public `index.ts`.
- Name each helper file and exported function for both its owning component and
  operation, such as `create-inflow-form-initial-values.helper.ts` exporting
  `createInflowFormInitialValues`.
- Import through the public alias in stories and consumer-facing tests so they
  also verify the barrel contract. Use a direct sibling import only when a test
  intentionally targets a non-public module such as validation or a private
  part.
- Prefer `import type` and `export type` for type-only contracts.
- Export only public components, containers, types, variants, and validation
  intended for consumers.
- Do not export tests, stories, private helpers, or implementation-only types.
- Avoid wildcard exports when they would leak an internal symbol; otherwise
  follow the nearest established barrel style.

## Component contract

- Keep the component's responsibility narrow and make required data explicit in
  props.
- Accept callbacks for user intent instead of owning application workflows.
- Use `Readonly<Props>` for component parameters.
- Preserve native element props when that improves composition, and omit or
  override conflicting fields explicitly.
