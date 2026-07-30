# Open Petty Cash Account Dialog Plan

## Goal

After a user chooses Petty Cash in the account-type selector, close the
selector and open a dedicated petty-cash account dialog that renders the public
component at `src/account/components/petty-cash-account-form`. Preserve the
existing functional account-creation mutation, feedback, and ledger-list
refresh behavior, and cover the composed browser flow with Playwright.

This plan is implementation-ready. It treats
`petty-cash-account-form` as the requested canonical public name and location
for the complete production petty-cash form. Preserve the currently staged
`behavior` parameter change in `account-dashboard.tsx` and all unrelated user
changes during implementation.

## Context

`AccountsDashboardPage` currently opens `AccountTypeSelectionDialog` and
closes it after any selection, but it does not dispatch the selected behavior
to a destination. An existing `AccountCreationDialog` performs the complete
petty-cash mutation flow, but it renders `petty-cash-form`, not the specifically
requested `petty-cash-account-form`.

The repository currently has both form directories. The requested
`petty-cash-account-form` is an older, simplified three-field component; the
production `petty-cash-form` includes the opening date, optional no-balance
state, foreign-currency exchange rate, and sub-account state required by the
current mapper and generated API contract. The implementation should converge
these into one canonical form rather than maintain two incompatible petty-cash
contracts.

## Confirmed Findings

1. **The selected behavior currently has no destination.**
   `src/account/pages/account-dashboard.tsx` receives a
   `ULedgerAccountBehavior` and only closes the selection dialog.
2. **The requested enum comparison is supported by the generated contract.**
   `ELedgerAccountBehavior.PettyCash` is the stable generated value used by the
   type-selection component and account behavior note.
3. **A functional petty-cash dialog already exists under a generic name.**
   `src/account/dialogs/account-creation.tsx` owns loading dependencies, calls
   `useCreatePettyCashAccount`, displays localized success/error feedback, and
   closes after a successful mutation.
4. **The two petty-cash forms are not interchangeable.**
   `petty-cash-account-form` emits only `name`, `currencyCode`, and
   `openingBalance`; `IPettyCashAccountCreationReq` requires a complete
   `IOpeningBalanceDto` when a balance is present. The production
   `petty-cash-form` supplies the date and conditional exchange-rate data used
   by `asset-account.mapper.ts`.
5. **Current browser coverage stops after selection.**
   `playwright/tests/account/select-account-type.spec.ts` verifies that Petty
   Cash can be selected and that the selector closes, but it does not expect a
   petty-cash dialog or exercise its form/mutation boundary.
6. **There is a staged user change in the dashboard.** The selected parameter
   was changed from `_behavior` to `behavior`; implementation must build on it
   rather than overwrite or unstage it.

## Scope

### Expected Changes

- `src/account/components/petty-cash-account-form/` — make this the canonical
  complete petty-cash form owner, with component-specific types, validation,
  stories, and tests aligned to the production submission contract.
- `src/account/components/petty-cash-form/` — remove after all public imports
  and tests have moved to the requested canonical directory.
- `src/account/dialogs/account-creation.tsx` →
  `src/account/dialogs/petty-cash-account.tsx` — specialize the dialog name and
  render `PettyCashAccountForm` while retaining mutation orchestration.
- `src/account/hooks/use-create-petty-cash-account.ts` — consume the canonical
  form values type.
- `src/account/lib/mappers/asset-account.mapper.ts` and its test — consume the
  canonical values type without changing the generated DTO output.
- `src/account/pages/account-dashboard.tsx` — dispatch the selected Petty Cash
  behavior to the dedicated dialog and own the two-dialog lifecycle.
- `playwright/tests/account/select-account-type.spec.ts` — extend the public
  Add account journey through the petty-cash dialog and controlled creation
  request.

### Conditional Changes

- `src/account/i18n/locales/en/ledger-accounts.json` — update only if the
  canonical dialog/form needs missing or renamed user-facing copy; reuse the
  existing localized title, labels, validation, success, and error paths where
  possible.
- Playwright account mocks/factories — extract repeated account creation route
  data only if the expanded spec creates material duplication; otherwise keep
  the one-off response and request capture in the owning spec.

### Out of Scope

- Implementing dialogs or navigation for Bank, Default Cash/Virtual Account,
  Credit Card, or any other account behavior.
- Changing the generated API client or backend petty-cash contract.
- Redesigning the account-type selector or the accounts dashboard.

## Proposed Approach

### 1. Establish one canonical petty-cash form contract

- Move the complete production form behavior currently owned by
  `petty-cash-form` into `petty-cash-account-form`, using the public names
  `PettyCashAccountForm`, `PettyCashAccountFormProps`, and
  `IPettyCashAccountFormValues`.
- Put public props/value types in `types.ts`, keep validation in
  `validation.ts`, and expose only the intended public API from `index.ts` in
  accordance with the component and type-naming rules.
- Preserve the production fields and semantics needed by the mapper: account
  name, currency, create-without-opening-balance state, opening amount/date,
  conditional exchange rate, and sub-account choice.
- Move/retarget the stronger production stories, component tests, and
  validation tests to the canonical directory. Remove the obsolete simplified
  tests and implementation once no consumer remains.

### 2. Specialize the dialog without regressing creation behavior

- Rename `AccountCreationDialog` and its file to
  `PettyCashAccountCreationDialog`/`petty-cash-account.tsx` so the dialog owner matches
  the behavior it creates.
- Render `PettyCashAccountForm` from its barrel and retain the existing
  currency/accounting-entity loading, initial functional currency, mutation
  loading state, API error handling, localized success toast, query
  invalidation, and close-on-success behavior.
- Update the mutation hook and explicit DTO mapper to import
  `IPettyCashAccountFormValues` from the canonical form. Do not add validation
  to the mapper or change the generated request shape.

### 3. Dispatch Petty Cash from the dashboard

- Add page-owned state for the selected creation behavior, initially unset.
- In `handleAccountTypeSelected`, close the account-type selector and retain
  the selected behavior. Render/open `PettyCashAccountCreationDialog` only when
  `behavior === ELedgerAccountBehavior.PettyCash`.
- When the petty-cash dialog closes, clear the selected behavior so reopening
  Add account always starts from the selector. Keep other behaviors as explicit
  non-dispatched branches for future dialogs rather than accidentally opening
  Petty Cash for every selection.
- Ensure only one modal is open at a time so Radix focus restoration and Escape
  dismissal remain predictable.

### 4. Extend browser coverage through creation

- Update the existing account selection spec to assert that choosing Petty
  Cash replaces the selector with a dialog headed “Create petty cash account”
  and exposes the real petty-cash form.
- Register the petty-cash POST interception before the interaction that can
  submit it. Fill a deterministic same-functional-currency account, submit,
  and assert the generated request payload, success feedback, and dialog
  closure; keep all first-party API calls controlled.
- Retain selector dismissal/reopening coverage, and add a check that dismissing
  the petty-cash dialog returns the page to a clean state from which Add
  account starts at type selection again.
- Keep accessible role/label/text locators and web-first assertions; do not
  mock the owned form or use fixed waits.

## Test Plan

- **Component and validation:** run the canonical
  `petty-cash-account-form` tests for accessible controls, required fields,
  same- and foreign-currency behavior, opening-balance normalization,
  sub-account state, disabled/loading states, and valid submit values.
- **Mapper:** verify the renamed source values still map to
  `IPettyCashAccountCreationReq` for no opening balance, same-currency opening
  balance, and foreign-currency exchange rate cases.
- **Browser integration:** cover Add account → select Petty Cash → open the
  petty-cash dialog → submit a controlled request → show success and close;
  also preserve Escape dismissal and clean reopening behavior.
- **Regression:** verify selecting a non-Petty-Cash behavior does not open the
  petty-cash dialog, and the accounts route/table continues to render against
  controlled API responses.

## Verification

```bash
npm test -- --run src/account/components/petty-cash-account-form src/account/lib/mappers/asset-account.mapper.test.ts
npm run typecheck:integration
npm run test:integration -- playwright/tests/account/select-account-type.spec.ts --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

The Playwright command depends on the configured Chromium binary. If it is not
available, report that environment limitation without substituting a live
backend.

## Assumptions

- “Petty cash account dialog” includes the existing functional save flow, not
  only a visual wrapper. This avoids shipping an enabled Save action that does
  not persist an account.
- The complete current production form behavior should survive under the
  explicitly requested `petty-cash-account-form` path; the simplified legacy
  three-field contract is not sufficient for the current generated API.
- After a non-Petty-Cash choice, the selector closes and no creation dialog
  opens until that behavior's own flow is implemented.

## Risks

- Moving form ownership touches the dialog, hook, mapper, stories, and tests;
  perform the rename atomically and use focused tests plus structure/build
  checks to catch stale imports.
- Switching between two controlled dialogs can cause overlapping portals or
  incorrect focus restoration; derive each dialog's open state explicitly and
  verify dismissal/reopening in Chromium.
- A broad `**/api/v1/ledger*` Playwright route can swallow the more specific
  creation request; register or branch route handlers so the POST assertion is
  deterministic.

## Completion Criteria

- Choosing Petty Cash from Add account closes the selector and opens exactly
  one dedicated petty-cash account dialog.
- The dialog renders `PettyCashAccountForm` from
  `src/account/components/petty-cash-account-form` and retains a working,
  localized creation mutation with pending, success, error, and close behavior.
- `account-dashboard.tsx` opens that dialog only for
  `ELedgerAccountBehavior.PettyCash`; other behavior selections never open it.
- There is one canonical petty-cash form contract, and the hook/mapper consume
  it without changing the generated API request contract.
- The focused component, mapper, Playwright, structure, story, lint, and build
  checks pass, and unrelated staged or working-tree changes remain intact.
