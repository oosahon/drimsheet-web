# Forms, Stories, and Tests Rules

## Forms

Every form component must keep its types outside the component file:

```text
<form-name>/
  <form-name>.tsx
  <form-name>.container.tsx
  <form-name>.stories.tsx
  <form-name>.test.tsx
  parts/
    <part-name>.tsx
    <part-name>.stories.tsx
  types.ts
  validation.ts
  index.ts
```

- Put form values, component props, and types shared by form support files in
  `types.ts`.
- Import them with `import type` from `./types`.
- Re-export public form types from `index.ts` with `export type`.
- Put schemas, validation functions, and translation-aware validation hooks in
  `validation.ts`.
- Keep validation deterministic apart from translation lookup; do not fetch data
  or mutate state while validating.
- Pass option data, loading state, initial values, and submit callbacks into the
  pure form.
- Put fetching, mutations, toasts, navigation, and API error handling in the
  container.
- Let the form emit validated values through `onSubmit`; do not make the form own
  the application workflow.

## Stories

- Add one colocated story file for every UI `.tsx`; containers are exempt.
- Use `satisfies Meta<typeof Component>` and `StoryObj<typeof meta>`.
- Add `tags: ['autodocs']` unless the nearby Storybook convention requires
  otherwise.
- Import public components through their public alias. Import private
  `parts/` components directly from their implementation file because they are
  intentionally absent from the public barrel.
- Cover realistic visual and interaction states such as default, loading,
  disabled, empty, invalid, populated, and long-content states when relevant.
- Supply deterministic data and lightweight providers or decorators.
- Do not call live APIs or hide the component contract behind unnecessary setup.
- Use Storybook actions or inert callbacks instead of application side effects.

## Tests

- Follow `.agents/rules/testing-rules.md`.
- Use Vitest, Testing Library, and `userEvent` following nearby tests.
- Use real owned child components and hooks; do not use module mocks in
  component tests.
- Test user-visible contracts and outcomes, not hook calls or internal state.
- Keep one behavior or outcome per test.
- Prefer accessible queries by role, label, and visible text.
- Test callback payloads, important conditional states, keyboard or pointer
  interaction, and accessibility semantics when relevant.
- For forms, test required/invalid states and a successful submit payload.
- Test validation directly when rules have meaningful branches or edge cases.
- Test containers separately when their orchestration adds behavior worth
  protecting. Render the real presentational component and mock only necessary
  external boundaries.
- Test dialogs and pages under `playwright/tests/<feature>/`, not through
  component Testing Library tests. Use
  `$write-playwright-integration-tests` for that coverage.
