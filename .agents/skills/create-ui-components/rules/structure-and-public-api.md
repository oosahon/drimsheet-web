# Structure and Public API Rules

## Ownership

- Put feature-owned UI in `src/<feature>/components/<component-name>/`.
- Put reusable, feature-agnostic UI in
  `src/shared/components/<component-name>/`.
- Use kebab-case for the component directory and colocated file names.
- Keep component-only helpers, hooks, contexts, types, variants, validation,
  stories, and tests in the component directory.
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

Tightly coupled subcomponents may share the primary `.tsx` file. Split them when
they gain an independent contract, story, or owner.

## Imports and exports

- Import another component through its directory public API, for example
  `@/shared/components/button`.
- Use direct sibling imports from the component implementation and container.
  They must not import their own directory's `index.ts`.
- Import through the public alias in stories and consumer-facing tests so they
  also verify the barrel contract. Use a direct sibling import only when a test
  intentionally targets a non-public module such as validation.
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
