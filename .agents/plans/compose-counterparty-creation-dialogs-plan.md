# Compose Counterparty Creation Dialogs Plan

## Goal

Compose the counterparty role-selection and creation dialogs into the
counterparties page, connect each form to an explicit mapper/service/mutation
pipeline, and protect the complete browser workflow with Playwright integration
tests.

This plan is implementation-ready. Implementation must preserve and refine the
existing staged counterparty work and must not disturb unrelated staged or
working-tree changes.

## Context

The account feature establishes the intended composition: its dashboard owns
the dialog state, the selection dialog chooses a creation path, each creation
dialog coordinates a form and mutation hook, hooks map form values before
calling transport-only services, and Playwright exercises the real route with
intercepted APIs. The counterparty feature already has the corresponding pure
forms, role selector, generated request contracts, and partially implemented
mapper/service files, but the dialogs are empty and the page does not compose
them.

## Confirmed Findings

1. **The page workflow is not connected.**
   `src/counterparty/pages/counterparties.tsx` renders a temporary hard-coded
   creation button but owns no dialog state and imports none of the files under
   `src/counterparty/dialogs/`.
2. **All five counterparty dialog modules are empty.** The intended flow needs
   one role-selection dialog plus default, vendor, contractor, and employer
   creation dialogs.
3. **The presentation contracts already exist.** The four form barrels export
   their form-value types, and `CounterpartyRoleSelect` emits either `default`
   or one of the generated `UCounterpartyRole` values.
4. **The generated API exposes four distinct POST contracts and endpoints.**
   The client provides `createCounterparty`, `createVendor`,
   `createContractor`, and `createEmployer`; specialized address requirements
   differ, and only the employer DTO accepts `displayName`.
5. **The mapper/service work is partial.** The mapper currently redeclares form
   value interfaces instead of mapping directly from the established component
   contracts, while the service already wraps all four generated API methods.
   No counterparty mutation hooks exist yet.
6. **Existing infrastructure can be reused.** `useJurisdictions` supplies the
   country options needed by the specialized forms; `useApiErrorHandler`,
   Sonner, React Query, the shared dialog primitives, and the account dialogs
   establish error, loading, success, and dismissal conventions.
7. **The browser-test boundary is established.** Existing integration specs use
   the coverage-aware fixture, authenticate through deterministic intercepted
   routes, navigate through public routes, and capture generated DTO request
   bodies without contacting a live backend.

## Scope

### Expected Changes

- `src/counterparty/pages/counterparties.tsx` — replace the temporary trigger
  with translated page-owned state and compose the role-selection and four
  creation dialogs.
- `src/counterparty/dialogs/*.tsx` — implement the selection orchestrator and
  the default, vendor, contractor, and employer creation orchestrators.
- `src/counterparty/hooks/use-create-counterparty.ts` and the corresponding
  vendor, contractor, and employer hook files — add one mutation boundary per
  generated creation endpoint.
- `src/counterparty/lib/mappers/counterparty.mapper.ts` — import the public form
  contracts and explicitly map each form into its generated DTO without
  validation or source-object spreading.
- `src/counterparty/lib/mappers/counterparty.mapper.test.ts` — assert complete
  destination objects for all four request shapes, including optional address
  and display-name behavior.
- `src/counterparty/lib/services/counterparty.service.ts` — keep the four API
  calls as typed, transport-only operations with consistent return behavior.
- `src/counterparty/i18n/locales/en/counterparty.json` — add semantic keys for
  the page trigger, dialog titles/descriptions, and success notifications.
- `playwright/tests/counterparty/create-counterparty.spec.ts` — cover the
  composed selection and creation-dialog journeys through `/counterparties`.

### Conditional Changes

- Existing counterparty form/component files — change only if browser
  integration exposes a concrete accessibility, disabled-state, or reset
  contract that prevents the dialogs from working correctly; keep any such fix
  within the existing component ownership boundaries and update its colocated
  story/test as required.

### Out of Scope

- Building the counterparties list/table, fetching counterparties, or adding a
  list-query invalidation contract that the generated API does not currently
  expose.
- Editing, archiving, assigning additional roles to existing counterparties,
  or adding system E2E coverage against a real backend.
- Redesigning the staged counterparty forms beyond fixes required for the
  composed dialog workflow.

## Proposed Approach

### 1. Complete the data and mutation boundaries

- Replace mapper-owned duplicate form interfaces with type-only imports from
  each form's public barrel.
- Keep all destination fields explicit: assign active status, map required
  addresses field-by-field, include an optional vendor address only when any
  address input is present, map employer `displayName` to the generated nullable
  contract, and intentionally omit unsupported display-name inputs from vendor
  and contractor DTOs.
- Normalize `counterpartyService` so each method accepts only its generated DTO,
  performs the matching generated client request, and returns the response data.
- Add four `useMutation` hooks. Each hook accepts its owning form values, invokes
  the matching mapper, and passes the generated DTO to the service. Do not add
  speculative query invalidation until a counterparties query key exists.

### 2. Implement the dialog orchestrators

- Implement `CounterpartyRoleSelectionDialog` as a controlled shared dialog
  that wraps `CounterpartyRoleSelect`, closes only through its `onClose`
  contract, and returns the selected `default`/role value to the page.
- Implement each creation dialog around its existing pure form and matching
  mutation hook. Vendor, contractor, and employer dialogs will obtain
  jurisdictions with `useJurisdictions`; the default dialog will not fetch data
  it does not need.
- Pass query/mutation pending state into the forms, handle generated API errors
  through `useApiErrorHandler`, show an i18n success toast, and close only after
  a successful mutation. Preserve entered values when a mutation fails.
- Ensure dismissal and successful completion unmount/reset the active form so
  reopening begins with clean state. Use accessible translated dialog titles
  and descriptions and the existing responsive, scrollable dialog layout.

### 3. Compose the page-owned workflow

- Give `CounterpartiesPage` state for whether role selection is open and which
  creation variant is active.
- Open role selection from a translated creation button; after selection, close
  the selector and activate exactly one matching creation dialog.
- Clear the selected variant when a creation dialog closes, mirroring
  `AccountsDashboardPage` and keeping reusable workflow logic out of the page.
- Retain the existing page shell/breadcrumb and avoid introducing counterparty
  list behavior as part of this change.

### 4. Add browser integration coverage

- Add deterministic authenticated-app, jurisdiction, and counterparty POST
  intercepts before navigation or submission, then enter the workflow through
  the public `/counterparties` route. Reuse the existing authenticated-app mock
  and keep counterparty-specific route handlers and response data directly in
  the new spec; no new Playwright support directory is needed.
- Verify the selection dialog opens, dismisses accessibly, and routes each of
  `default`, vendor, contractor, and employer to the correct creation dialog.
- For each creation variant, fill the real form, submit it, assert the matching
  endpoint and complete JSON request body, observe the translated success
  feedback, and confirm the dialog closes.
- Add focused failure coverage proving that an API error leaves the active
  dialog open and retains user input, plus dismissal/reopening coverage proving
  draft state is reset. Keep lower-level validation assertions in the existing
  component tests rather than duplicating them in Playwright.

## Test Plan

- **Unit:** Extend
  `src/counterparty/lib/mappers/counterparty.mapper.test.ts` to cover the exact
  generated payload for default, vendor-without-address,
  vendor-with-address, contractor, and employer forms, including fields that
  must be intentionally omitted or normalized.
- **Existing component regression:** Run all staged counterparty component and
  validation tests to ensure dialog composition does not change their public
  form contracts.
- **Browser integration:** Add
  `playwright/tests/counterparty/create-counterparty.spec.ts` for selection,
  all four successful POST flows, failure/input retention, dismissal/reset, and
  accessible dialog interaction using controlled first-party routes.
- **Regression:** Confirm account creation integration tests still pass because
  the counterparty implementation follows but does not modify the account
  workflow.

## Verification

Run focused checks first, then the broader repository checks justified by the
new hooks, dialogs, translations, and browser workflow.

```bash
npm test -- --run src/counterparty
npm run typecheck:integration
npm run test:integration -- playwright/tests/counterparty/create-counterparty.spec.ts --project=chromium
npm run test:integration -- playwright/tests/account/create-bank-account.spec.ts --project=chromium
npx playwright test --list
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

The focused Playwright runs require the repository's Chromium binary; report a
missing browser binary as an environment limitation rather than falling back to
a live backend.

## Assumptions

- The existing temporary `Create counterparty` button represents the intended
  entry point for this workflow. This is supported by its placement on the
  counterparties page and by the analogous account-page trigger.
- Vendor and contractor `displayName` values remain UI-only because their
  generated DTOs do not contain that field; mapper tests will make the omission
  explicit. Employer `displayName` is sent because its generated DTO supports
  it.
- No React Query invalidation is required yet because the generated client and
  current page expose no counterparty list query. When such a query is added,
  its stable query key can be invalidated by all four hooks.

## Risks

- Four similar dialog implementations can drift. Mitigate this by keeping each
  orchestrator small and structurally consistent while preserving its distinct
  form, mapper, hook, endpoint, title, and success message; do not hide those
  differences behind an overly generic abstraction.
- The vendor's conditionally optional address can accidentally produce an
  invalid partial DTO. Mitigate this with form validation plus mapper tests for
  empty, partial, and populated address inputs.
- Portal state can persist unexpectedly when dialogs switch or reopen. Mitigate
  this through page-owned mutually exclusive state and explicit Playwright
  dismissal/reopening coverage.

## Completion Criteria

- The `/counterparties` page opens role selection and routes every supported
  selection to exactly one working creation dialog.
- Each form submission follows `FormValues -> counterpartyMapper -> generated
DTO -> counterpartyService`, exposes pending state, shows translated success
  feedback, handles API failures through the shared error boundary, and closes
  only on success or user dismissal.
- Default, vendor, contractor, and employer requests reach the correct generated
  endpoint with the complete expected payload.
- Dialog failure retention and dismissal/reopening reset behavior are verified
  in Playwright without live services or fixed sleeps.
- Focused unit/integration tests, structure/story checks, lint, and build pass,
  or any environment-only limitation is reported clearly.
- Existing staged counterparty work is preserved and refined; unrelated files
  and account behavior remain unchanged.
