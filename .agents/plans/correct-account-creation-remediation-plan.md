# Correct Account Creation Remediation Plan

## Goal

Correct the four overreaching changes introduced while implementing the earlier
review recommendations, without modifying the previous plan or discarding valid
accessibility, validation, dialog, and browser-test improvements.

This plan is implementation-ready. It removes bank-query recovery from the
presentation tree, removes temporary availability metadata, fixes late
jurisdiction initialization without reinitializing Formik on user selection,
and normalizes the bank-location mapper to repository convention. Preserve
unrelated staged and working-tree changes.

## Context

The staged remediation adds query-error/retry props through
`BankAccountFormContainer` → `BankAccountForm` → `BankSelection`, adds
`isAvailable` to account-type options, derives Formik initial values from mutable
country state, and exports two standalone jurisdiction mapper functions plus a
public source type.

Valid staged changes should remain: the shared `RadioGroup`, non-negative
petty-cash validation, dialog descriptions, automatic default-country browser
coverage, mutation-failure retention, and dismissal/reopening coverage.

## Confirmed Findings

1. `BankSelection` now renders bank-query recovery and exposes
   `isBanksError`/`onRetryBanks`, expanding a focused input part with an
   orchestration concern that was not in its original contract.
2. `isAvailable` converts temporary work-in-progress status into durable product
   state across the component, translations, dashboard, and tests.
3. `effectiveLocation` is passed into a Formik form's `initialValues`. Because
   the form uses `enableReinitialize`, changing country can reset other entered
   fields.
4. `jurisdiction.mapper.ts` exports two functions and `ICountryConfig`, unlike
   nearby multi-method DTO/value mappers that expose private functions through a
   frozen mapper object. Its collection method is unnecessary.
5. The remediation also changed the original minimal `{ code, name }[]`
   bank-location interfaces to `IJurisdictionDto[]`, despite the requirement to
   adapt between existing contracts rather than alter them.

## Scope

### Expected Changes

- `src/account/components/bank-account-form/` — remove query recovery from the
  form tree, restore minimal location props, and fix container initialization.
- `src/account/dialogs/bank-account-creation.tsx` — apply the resolved default
  jurisdiction through component identity rather than mutable initial values.
- `src/account/components/account-type-selection/` — remove availability state
  while retaining the shared radio primitive.
- `src/account/pages/account-dashboard.tsx` — remove the availability-driven
  routing change.
- `src/account/lib/mappers/jurisdiction.mapper.ts` and its test — replace the
  standalone exports with one convention-aligned mapper object; rename the file
  if needed to reflect bank-location adaptation.
- Affected stories, Vitest tests, Playwright specs, and locale keys — remove only
  rejected retry/availability behavior and preserve unrelated coverage.

### Out of Scope

- Modifying `.agents/plans/stabilize-account-creation-flows-plan.md`.
- Updating or regenerating the generated API client.
- Mapping the UI-only sub-account checkbox into request payloads.
- Implementing Virtual Account or Credit Card creation.
- Adding a bank-directory retry experience elsewhere.
- Reverting petty-cash validation, dialog descriptions, create-failure
  retention, dismissal reset, or successful creation coverage.

## Proposed Approach

### 1. Remove bank error and retry behavior from presentation

- Remove `isBanksError` and `onRetryBanks` from `BankSelectionProps`,
  `BankAccountFormProps`, the form, and the container-to-form props.
- Remove the retry/error branch, `Button` import, and related translations from
  `BankSelection`.
- Keep only location selection, bank selection, loading/disabled state, field
  errors, filtering, and user-change callbacks in the private part.
- Remove `load_banks_error_text` and `retry_text` when they have no consumer.
- Delete tests that exist solely for the rejected directory retry UI. Retain
  creation-mutation failure tests because those exercise dialog orchestration.

### 2. Remove availability metadata but retain accessible radios

- Remove `isAvailable` from `IAccountTypeOption` and every option.
- Remove availability checks, option-specific disabled state, “Coming soon” UI,
  and `coming_soon_text`.
- Keep `RadioGroup` and `RadioGroupItem` so the shared primitive owns roving
  tabindex, checked state, and arrow-key behavior.
- Treat every listed option consistently. The component-level `disabled` prop
  still disables the group; Continue requires any selected value.
- Restore the dashboard handler behavior that existed before availability was
  introduced. Do not add a product policy to compensate for WIP routing.
- Rewrite tests around all four visible options, pointer selection,
  controlled/uncontrolled submission, whole-component disabled state, and
  arrow-key navigation. Remove availability-specific Playwright coverage.

### 3. Initialize the jurisdiction at the dialog boundary

- Restore the container's single `selectedLocation` state initialized from
  `initialValues?.bankLocation ?? initialBankLocation`.
- Query from `selectedLocation`; `handleLocationChange` updates only that query
  state.
- Pass the original initial location to `BankAccountForm`. Never replace Formik
  initial values with mutable user-selected query state. The form already sets
  its own `bankLocation` before notifying the container.
- Key `BankAccountFormContainer` in `BankAccountCreationDialog` by the resolved
  initial jurisdiction. When the accounting entity changes from unresolved to
  resolved, the container remounts once with the correct initial country.
- After mounting, user country changes update the bank query without changing
  component identity or resetting other Formik fields.
- Replace the late-prop container test with a regression test proving that a
  country change updates the query while a previously entered account name is
  retained. Keep the browser assertion that the default jurisdiction triggers
  the initial bank request automatically.

### 4. Normalize the mapper without changing interfaces

- Restore `BankAccountFormProps.bankLocations` and
  `BankSelectionProps.bankLocations` to `Array<{ code: string; name: string }>`.
  Keep `CountryComboBoxProps.jurisdictions: IJurisdictionDto[]` unchanged.
- Prefer renaming `jurisdiction.mapper.ts` to `bank-location.mapper.ts` so its
  UI-adaptation responsibility is explicit.
- Implement one private scalar function, `toJurisdictionDto`, accepting the
  minimal bank-location shape and assigning every `IJurisdictionDto` field
  explicitly.
- Export only a frozen mapper object:

  ```ts
  export const bankLocationMapper = Object.freeze({
    toJurisdictionDto,
  });
  ```

- Do not export `ICountryConfig`, a collection method, or the scalar function.
  `BankSelection` can derive the array with
  `bankLocations.map(bankLocationMapper.toJurisdictionDto)` and memoize it for
  referential stability.
- Keep required synthetic jurisdiction fields isolated at this UI boundary;
  never treat them as accounting-domain data.
- Update the mapper test to import the object and assert the complete scalar
  destination. Restore stories and component fixtures to minimal
  `{ code, name }[]` data without mapper imports.

### 5. Preserve valid remediation work

- Retain petty-cash `.min(0, localizedMessage)` validation and negative/zero
  tests.
- Retain localized `DialogDescription` in both creation dialogs.
- Retain create-mutation failure tests, populated dismissal/reopening coverage,
  the automatic default-country bank request, and request-payload assertions.
- Retain local-only bank-statement behavior and UI-only sub-account behavior.

## Test Plan

- **Mapper:** verify the mapper object's scalar method returns the complete DTO
  and does not leak source fields.
- **Account-type component:** verify all options remain selectable, whole-group
  disabled state, submission, and arrow-key behavior.
- **Bank form/part:** verify minimal location props, loading, filtering,
  selection, validation errors, and absence of retry contracts.
- **Container:** verify initial query country, user-selected query country, and
  retention of previously entered form fields.
- **Browser integration:** retain default-country loading, creation
  success/failure retention, dismissal reset, dialog focus, and petty-cash
  validation; remove only retry and availability scenarios.

## Verification

```bash
npm test -- --run src/account/components/account-type-selection/account-type-selection.test.tsx src/account/components/bank-account-form src/account/components/petty-cash-account-form/validation.test.ts src/account/lib/mappers
npm run typecheck:integration
npm run test:integration -- playwright/tests/account/select-account-type.spec.ts playwright/tests/account/create-bank-account.spec.ts --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Playwright requires permission to bind `127.0.0.1:4000`. The build may still
report generated-API consumer failures outside this plan; confirm no remaining
error originates from a corrected file.

## Assumptions

- The generated API and its generator configuration remain unchanged.
- Virtual Account and Credit Card are visible WIP options, not unavailable
  capabilities requiring metadata.
- Sub-account remains UI-only.
- The accounting entity jurisdiction is the initial bank country; later user
  selections must not reinitialize the form.

## Risks

- **Formik reset:** deriving `initialValues` from mutable query state can erase
  input. Protect this with container and browser assertions.
- **Synthetic jurisdiction fields:** keep mapper output at the selector boundary
  so it cannot be mistaken for accounting data.
- **Over-reverting:** broad reverts could remove valid validation,
  accessibility, and failure-path work. Make targeted edits and inspect the
  final diff by file.
- **WIP routing:** unfinished selections may still close without opening a
  workflow. That is accepted WIP behavior and is not addressed with metadata.

## Completion Criteria

- No bank-query error/retry contract remains in `BankSelection` or the form.
- No `isAvailable` or “Coming soon” behavior remains; accessible radios remain.
- Country changes update the bank query without resetting other form fields,
  and the late default jurisdiction triggers the initial request.
- Pre-remediation form, private-part, and `CountryComboBox` interfaces are
  restored unchanged.
- One frozen bank-location mapper object exposes one scalar method and no public
  source type or standalone functions.
- Valid validation, dialog, mutation-failure, reset, and payload coverage stays
  intact.
- Focused tests, Playwright specs, structure, stories, lint, and integration
  typechecking pass; any build failure is confirmed out of scope.
- The previous plan, generated API, sub-account behavior, and unrelated changes
  remain untouched.
