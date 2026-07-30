# Stabilize Account Creation Flows Plan

## Goal

Fix the in-scope bank-account and petty-cash UI defects by mapping country data
into the existing component contract, repairing bank-directory loading and
petty-cash validation, making account-type selection keyboard accessible, and
covering failure, reset, and unsupported-option behavior in browser tests.

The plan is implementation-ready. The generated API is the authoritative
contract and is intentionally out of scope; frontend code outside this feature
may be adjusted separately where necessary. Sub-account selection remains
UI-only in this delivery. Preserve unrelated staged and working-tree changes
during implementation.

## Context

The branch introduces account-type selection, specialized petty-cash and bank
dialogs, a bank-directory query, DTO mapping, and Playwright coverage. The
presentation/container boundary is mostly established: forms own Formik state,
dialogs own mutations and notifications, and mappers translate validated form
values into generated DTOs.

Review verification found that the focused Vitest and Playwright suites pass,
as do lint, structure, stories, and Playwright typechecking. The full build has
generated-contract consumer failures that are outside this plan, plus an
in-scope bank-location type mismatch. The browser journeys also report missing
dialog-description warnings. The current happy-path browser tests conceal the
default-jurisdiction bug by manually reselecting Nigeria before opening the bank
list.

## Confirmed Findings

1. **P1 — The bank-location contract does not compile.**
   [`BankSelection`](../../src/account/components/bank-account-form/parts/bank-selection.tsx)
   passes `{ code, name }[]` to `CountryComboBox`, whose public prop currently
   requires complete `IJurisdictionDto` objects.
2. **P2 — The asynchronously loaded default jurisdiction does not start the
   bank query.** `BankAccountFormContainer` captures the initial empty location
   in state. Formik later displays the resolved accounting-entity jurisdiction,
   but the query remains disabled until the user reselects a country.
3. **P2 — Petty cash accepts negative opening balances.** The refactor dropped
   the prior `.min(0, opening_balance_negative_text)` rule.
4. **P2 — Account-type radios do not implement the radio-group keyboard
   pattern.** Every custom radio is tabbable, and arrow-key navigation is not
   implemented.
5. **P2 — Virtual-account and credit-card choices are enabled dead ends.** The
   dashboard closes the selector for both but opens no subsequent workflow.
6. **P3 — Dialog failure and reset paths are uncovered.** The two Playwright
   specs cover successful mutations and empty dismissal only; they do not
   verify failed requests, retained input, statement retention, populated-form
   reset, automatic bank loading, or focus behavior.
7. **P3 — Creation dialogs have no accessible description.** The Playwright
   run emits Radix warnings for both the bank and petty-cash dialogs.

## Scope

### Expected Changes

- `src/account/lib/mappers/` — add an explicit country-config-to-jurisdiction
  mapper so the bank feature satisfies the existing `CountryComboBox` contract
  without changing component or form interfaces.
- `src/account/dialogs/bank-account-creation.tsx` — use the mapper to produce
  the `IJurisdictionDto[]` bank-location options expected by the form.
- `src/account/components/bank-account-form/` — fix late default-location query
  derivation and cover it at the container boundary.
- `src/account/components/petty-cash-account-form/validation.ts` and its test —
  restore non-negative opening-balance validation.
- `src/account/components/account-type-selection/` — use the shared radio-group
  primitive, represent unavailable options explicitly, and test keyboard and
  disabled behavior.
- `src/account/pages/account-dashboard.tsx` — dispatch only supported account
  types and avoid silent closure for unavailable types.
- `src/account/dialogs/bank-account-creation.tsx` and
  `src/account/dialogs/petty-cash-account-creation.tsx` — provide localized
  accessible descriptions while retaining orchestration behavior.
- `src/account/i18n/locales/en/ledger-accounts.json` — add or adjust localized
  unavailable-state, dialog-description, and restored validation copy.
- `playwright/tests/account/create-bank-account.spec.ts` and
  `playwright/tests/account/select-account-type.spec.ts` — add focused browser
  scenarios for loading, errors, retained state, reset, availability, keyboard,
  and focus.

### Out of Scope

- Changing `api-gen.config.js`, regenerating `src/shared/lib/api/Api.ts`, or
  reconciling unrelated frontend consumers with the generated contract.
- Changing the public interfaces of `CountryComboBox`, `BankAccountForm`, or the
  generated `IJurisdictionDto` contract.
- Mapping the sub-account checkbox into account creation payloads; it is UI-only
  in this delivery.
- Implementing virtual-account or credit-card creation dialogs.
- Uploading, parsing, or sending bank-statement files; selection remains local
  UI state for this delivery.
- Fixing unrelated build failures already present on `main`; distinguish those
  from failures introduced by this branch and track them separately if they
  remain after rebasing.

## Proposed Approach

### 1. Map country configuration into the existing jurisdiction contract

- Keep `CountryComboBoxProps`, `BankAccountFormProps`, and generated interfaces
  unchanged.
- Add a feature mapper under `src/account/lib/mappers/` that explicitly maps
  each country-config entry to `IJurisdictionDto`. Assign every destination
  field explicitly in accordance with the mapper rules; do not spread config
  objects or introduce an intermediate payload type.
- Map `code`, `name`, and `currencyCode` from the country config. Supply the
  UI-only defaults required by `IJurisdictionDto` for `maxFiscalMonths` and each
  `accountingStandards` array; document through the mapper name/tests that these
  fields only satisfy the existing selector contract and are not accounting
  policy data.
- Use the mapper in `BankAccountCreationDialog` when building `bankLocations`,
  and pass the mapped `IJurisdictionDto[]` through the unchanged form and
  `CountryComboBox` interfaces.
- Add mapper tests that assert the complete destination object and collection
  mapping without leaking `flag` or `locale` from the config.

### 2. Repair the bank-query state flow

- Replace the container's one-time `useState(initialLocation)` model with a
  derived location plus an optional user override. Before the user changes the
  country, the query should follow late `initialValues.bankLocation` or
  `initialBankLocation` changes; after a user selection, the explicit selection
  should win, including an intentional clear.
- Avoid a `useEffect` that mirrors props into state. Use an `undefined` override
  sentinel or an equivalent derived-state design.
- Pass bank-query pending state through to the form as today. If the query
  fails, preserve the selected country and expose a localized retry/error state
  rather than presenting the failure as an empty bank directory.

### 3. Restore petty-cash validation

- Add the existing localized negative-balance message to the petty-cash
  validation-message contract.
- Apply `.min(0, message)` to opening balances only when an opening balance is
  being created. Zero remains valid; negative numeric values fail; the empty,
  nonnumeric, and create-without-opening-balance branches retain their existing
  behavior.
- Add direct validation tests for negative, zero, and bypassed opening balances,
  plus a component test confirming a negative value does not submit.

### 4. Make account-type selection accessible and honest

- Replace the hand-authored `role="radiogroup"`/`role="radio"` implementation
  with the existing shared `RadioGroup` and `RadioGroupItem` primitives, styling
  each item as the current card. Preserve controlled and uncontrolled component
  contracts.
- Extend `IAccountTypeOption` with explicit availability metadata. Mark Bank and
  Petty Cash available; mark Virtual Account and Credit Card unavailable until
  their workflows exist.
- Render unavailable items disabled with a localized visible status such as
  “Coming soon.” Ensure they are exposed as disabled to assistive technology,
  skipped by keyboard selection, and cannot enable Continue.
- Let the radio primitive provide roving tabindex, arrow-key movement, focus,
  and checked semantics. Continue should submit only an available selected
  value.
- Keep the dashboard selector open unless it receives a supported selection;
  retain a defensive unsupported-value guard even though the UI disables those
  options.

### 5. Complete dialog accessibility and state semantics

- Add a concise localized `DialogDescription` to both creation dialogs, using
  `sr-only` styling if the design should not show additional visible copy.
- Verify initial focus lands on a useful control when each dialog opens and that
  Escape/cancel returns focus predictably to Add account or the prior workflow.
- Preserve form and statement state on mutation failure so the user can correct
  or retry without re-entry.
- Reset form identity and local statement state after explicit dismissal and
  successful creation so reopening starts clean. Prefer unmount/key-based reset
  behavior over state-mirroring effects.

### 6. Expand browser coverage around real regressions

- Split the current broad happy-path specs into focused, independently runnable
  outcomes where that improves failure diagnosis.
- For bank creation, open the dialog with an asynchronously fulfilled
  accounting entity and assert that `/banks` is requested with the default
  jurisdiction without manually reselecting the country. Then select a bank and
  complete the happy path.
- Add a bank-directory failure scenario with visible localized feedback and a
  working retry or recovery path.
- Add failed bank and petty-cash POST scenarios. Assert localized error feedback,
  dialog persistence, retained form values, and retained selected statement for
  bank creation.
- Add dismissal/reopening scenarios after entering values and selecting a file;
  assert that the reopened forms and statement panel are clean.
- Add account-type tests showing arrow-key navigation among available options,
  unavailable types cannot be selected, Continue cannot dispatch them, and
  focus remains/restores correctly across modal transitions.
- Keep first-party requests intercepted before navigation or the triggering
  interaction, and continue using accessible locators and web-first assertions.

## Test Plan

- **Validation and mappers:** cover negative/zero/no-opening petty-cash values,
  complete country-config-to-jurisdiction mapping, and existing bank and petty
  account DTO shapes without changing the UI-only sub-account behavior.
- **Components:** cover late default-jurisdiction propagation, bank query
  pending/error/success behavior, country option typing, accessible radio names,
  roving keyboard selection, disabled account types, and Continue semantics.
- **Browser integration:** cover automatic default-country bank loading, bank
  directory failure, both mutation failures with retained state, populated
  dismissal and clean reopening, statement reset, account-type availability,
  and modal focus behavior.
- **Regression:** retain same- and foreign-currency opening-balance payloads,
  create-without-opening-balance normalization, success toasts, query
  invalidation, Escape dismissal, and the local-only statement contract.

## Verification

Run focused tests first:

```bash
npm test -- --run src/account/components/account-type-selection src/account/components/bank-account-form src/account/components/petty-cash-account-form src/account/lib/mappers
npm run typecheck:integration
npm run test:integration -- playwright/tests/account/select-account-type.spec.ts playwright/tests/account/create-bank-account.spec.ts --project=chromium
```

Then run repository checks:

```bash
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

The Playwright command requires permission to bind the local integration server
to `127.0.0.1:4000`. The build may continue to report known generated-contract
consumer failures outside this plan; verify that no remaining failure originates
from the mapped bank-location data or another file changed by this work.

## Assumptions

- Bank and Petty Cash are the only account types intended to create accounts in
  this delivery; unavailable types may remain visible for discoverability if
  they are clearly disabled.
- The bank statement is deliberately local-only and should be retained after a
  failed mutation but cleared after dismissal or success.
- The sub-account checkbox and `isSubAccount` form value are deliberately
  UI-only; account payload mapping remains unchanged.
- A bank account's accounting-entity jurisdiction is the default directory
  country, while users may select another supported country.

## Open Decisions

- **Unavailable account-type presentation:** The plan assumes disabled cards
  with localized “Coming soon” text. Hiding them is a smaller alternative if
  future capability discovery is not desired.

## Risks

- **Synthetic mapper fields:** `IJurisdictionDto` requires accounting metadata
  that the country config does not own. Keep those explicit defaults isolated in
  the feature mapper, verify the selector never consumes them, and do not reuse
  the mapped values as accounting-domain data.
- **Async state regressions:** Fixing default-country synchronization with an
  effect can overwrite a user's later selection. Prefer derived state with an
  explicit override and test prop changes after mount.
- **Modal focus races:** Closing the selector while opening a creation dialog can
  let focus restoration compete with the new dialog's autofocus. Verify actual
  browser focus, not visibility alone.
- **Test interception overlap:** Broad `**/api/v1/ledger*` routes can mask missed
  endpoints. Keep method checks and use the narrowest practical route patterns.

## Completion Criteria

- Country configuration reaches `CountryComboBox` through an explicit mapper;
  existing component, form, and generated interfaces remain unchanged.
- The in-scope bank-location TypeScript failure is resolved; unrelated generated
  API consumer failures remain outside this plan and are reported separately.
- Opening bank creation automatically loads banks for the asynchronously
  resolved default jurisdiction without manual country reselection.
- The sub-account checkbox remains UI-only and its payload behavior is unchanged.
- Negative petty-cash opening balances are rejected with localized feedback;
  zero and create-without-balance remain valid.
- Account-type selection follows the standard radio keyboard pattern, exposes
  unavailable types as disabled, and never closes into a dead end.
- Both creation dialogs have accessible names and descriptions, predictable
  focus, retained state after API failure, and clean state after dismissal or
  success.
- Focused unit/component tests and both Playwright account specs pass, followed
  by structure, stories, lint, integration typecheck, and applicable production
  build verification.
- No statement data is sent to account APIs, and unrelated files and behavior
  remain unchanged.
