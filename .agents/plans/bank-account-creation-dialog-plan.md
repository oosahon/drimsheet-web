# Bank Account Creation Dialog Plan

## Goal

Deliver a stable, accessible bank-account creation dialog that opens from the
Accounts dashboard after the user selects the bank-account behavior. The dialog
will compose a validated bank-account form with the existing shared drag-and-drop
document upload, use an info alert to explain bank-detail collection, and create
an account through the generated API contract.

The manual bank-account creation path is implementation-ready. The statement
panel is intentionally UI-only in this delivery: it may select and preview a
local file, but it does not upload, parse, or affect account creation.
Sub-account submission still needs the contract decision recorded below.
Preserve unrelated staged and working-tree changes during implementation.

## Context

The existing petty-cash flow establishes the relevant composition pattern:
[`petty-cash-account-form`](../../src/account/components/petty-cash-account-form)
owns local Formik state and validation,
[`petty-cash-account-creation.tsx`](../../src/account/dialogs/petty-cash-account-creation.tsx)
owns queries, mutation state, toasts, API errors, and closing, and
[`account-dashboard.tsx`](../../src/account/pages/account-dashboard.tsx) keeps
the selected account behavior in state. Its `OpeningBalanceFields` component
reserves height for the conditional exchange-rate row, which is the existing
anti-jump pattern.

The requested shared DnD primitive already exists as
[`DocumentUpload`](../../src/shared/components/document-upload/document-upload.tsx):
it supports native drop and file-picker input, accepted file types, single or
multiple files, previews, and inherited `div` props including `className` on the
wrapper. Reusing and completing coverage for this component avoids adding a
second public upload component with the same responsibility.

## Confirmed Findings

1. **The current dashboard does not handle bank selection.**
   `handleAccountTypeSelected` only retains `ELedgerAccountBehavior.PettyCash`,
   and the page renders only `PettyCashAccountCreationDialog`.
2. **The bank-create backend contract is JSON-only.**
   Generated `IBankAccountCreationReq` accepts `name`, `currencyCode`, optional
   `controlAccountCode`, `bankAccount` (`bankName`, `accountName`, and
   `accountNumber`), and an optional opening balance. There is no file or
   statement-upload field, while `accounts.createBankAccount` posts to
   `/accounts/asset/bank`. The generated `IBankAccountCreationReq` will be used
   directly as the mapper and service contract; no duplicate request type will
   be introduced.
3. **Bank-directory support is already present.**
   `useGetBankByCountry` calls the `/banks` directory endpoint for a selected
   country.
4. **The shared upload's current tests cover rendering only.**
   They do not yet protect file-picker selection, native dropping, type
   filtering, single/multiple normalization, wrapper class composition, file
   previews, or object-URL cleanup.
5. **Dialog and page behavior belongs in Playwright in this repository.**
   Repository rules explicitly prohibit Testing Library tests for dialogs and
   pages; component/form/validation/mapper behavior belongs in Vitest.
6. **All user-facing copy and errors must use i18n.**
   New form labels, upload text, validation messages, success feedback, empty
   bank-directory text, and the bank-details info alert belong in the
   `ledger-accounts` namespace. Generic upload file-type wording remains owned
   by `shared`.
7. **The revised wireframe defines the desktop field order and spans.**
   Account name spans the full form width. Currency sits beside the
   create-without-opening-balance checkbox; opening balance sits beside opening
   date; the conditional exchange-rate display occupies its own reserved row;
   bank location sits beside bank name; and bank account number sits beside
   bank account name. The bank-details info alert spans both form columns, with
   the sub-account checkbox below it. A vertical separator divides this form
   from the large statement DnD panel.

## Scope

### Expected Changes

- `src/shared/components/document-upload/` — retain `DocumentUpload` as the
  shared DnD/file-picker API, confirm wrapper `className` composition, and bring
  its interaction and branch coverage to 100% for the exercised component
  modules.
- `src/account/components/bank-account-form/` — add the pure form, a thin
  bank-directory container, the private `parts/bank-selection.tsx` component,
  public form-value/prop types, translation-aware validation, Storybook states,
  component tests, validation tests, and public `index.ts`.
- `src/account/dialogs/bank-account-creation.tsx` — compose the two-column
  dialog and own shared prerequisite loading, UI-only statement selection,
  mutation state, success/error feedback, dismissal, and reset behavior.
- `src/account/hooks/use-get-bank-by-country.ts` — reuse the corrected
  `useGetBankByCountry` hook from the bank-account form container.
- `src/account/hooks/use-create-bank-account.ts` — map validated form values,
  execute the mutation, and invalidate the ledger-account query.
- `src/account/lib/mappers/asset-account.mapper.ts` and its test — add an
  explicit, validation-free form-values-to-`IBankAccountCreationReq` mapping,
  including all opening-balance branches.
- `src/account/lib/services/asset-account.service.ts` — add the transport-only
  `createBankAccount` operation.
- `src/account/i18n/locales/en/ledger-accounts.json` — add all bank-form,
  dialog, upload-panel, info-alert, validation, empty/loading, and success copy.
- `src/account/pages/account-dashboard.tsx` — retain Bank selections in
  `handleAccountTypeSelected`, render the new dialog, and clear selected state
  on close.
- `playwright/tests/account/create-bank-account.spec.ts` — cover the complete
  dashboard-to-dialog browser outcome using intercepted APIs and the real
  composed UI.

### Conditional Changes

- A parent/control-account selector and its data source — required if “Create
  as a sub account” must populate `controlAccountCode`.
- Existing account integration mock extraction — only if both account specs
  would otherwise duplicate material route setup; otherwise keep setup local to
  the new spec.

### Out of Scope

- Regenerating or hand-editing `src/shared/lib/api/Api.ts` without a changed
  backend/OpenAPI contract.
- Uploading, parsing, or including the selected statement in
  `IBankAccountCreationReq`; the DnD panel is UI-only for now.
- Modifying `src/account/components/opening-balance-fields/`; the bank form will
  reuse the existing stable, accessible component unchanged.
- Calling a live backend from Playwright or adding a deployed-system E2E flow.
- Refactoring unrelated existing account components or the broader account
  creation architecture.

## Proposed Approach

### 1. Lock the contracts and stable layout

- Define `IBankAccountFormValues` in the form's `types.ts` with account name,
  currency/opening-balance fields, bank location, selected bank name, bank
  account number/name, and the resolved sub-account input once decided.
- Keep the pure form's option lists and status explicit in props: currencies,
  bank locations, directory banks, bank-loading state, accounting currency,
  disabled/loading state, and `onSubmit`. Keep country-change/query wiring
  private between the form and its container rather than exposing it to the
  dialog API.
- Match the screenshot at large breakpoints with a wide two-column dialog:
  form on the left, separator, upload panel on the right; collapse to one column
  with bounded vertical scrolling on narrow screens.
- Within the left pane, use a two-column grid with these explicit rows:
  full-width account name; currency plus create-without-opening-balance;
  opening balance plus opening date; a reserved full-width exchange-rate row;
  bank location plus bank name; bank account number plus bank account name; a
  full-width info alert; and a full-width sub-account checkbox row. On narrow
  screens, collapse paired fields to a single column without changing their
  reading or tab order.
- Keep the statement panel as a large, vertically centered DnD surface in the
  right pane. Use a vertical separator on desktop and a horizontal separator
  when the panes stack.
- Prevent layout jumps by keeping a consistent dialog/content width, reserving
  the existing exchange-rate row height, reserving bank-combobox feedback
  space, disabling controls while async prerequisites load instead of replacing
  the form, and giving both columns stable minimum heights. Reset the dialog by
  changing its form/upload identity when it closes rather than synchronizing
  mirrored state in an effect.

### 2. Complete the shared DnD upload contract

- Continue to expose `DocumentUpload` through its existing directory barrel and
  inherited `ComponentProps<'div'>` contract, so callers can customize the
  wrapper with `className` and other native attributes.
- Preserve accessible button/file-input behavior, accepted MIME/extension
  filtering, optional custom media, single-file replacement, multiple-file
  accumulation, native file dropping, and previews.
- Expand the stories to demonstrate the bank-statement single-file state and a
  customized wrapper alongside the existing generic states.
- Treat the selected file as local display state only. Do not add upload or
  parsing services, validation, request fields, or transport behavior.

### 3. Build the pure bank-account form

- Follow the petty-cash form's Formik structure and reuse `CurrencySelect` and
  `OpeningBalanceFields` rather than duplicating their logic.
- Add `parts/bank-selection.tsx` as an owner-private, prop-driven component for
  bank location and bank name. It receives the latest bank options, so it
  naturally re-renders when the country query returns new values. It clears the
  selected bank when location changes and displays deterministic loading,
  disabled, and empty states. It emits only the selected directory bank's name
  into form values because that is what `IBankAccountCreationReq` accepts.
- Add `bank-account-form.container.tsx` to own the selected country code and
  call `useGetBankByCountry`. Its location-change callback is an internal
  form/container orchestration contract; the dialog only consumes the
  container's public form-level API.
- Add labelled inputs for bank account number and bank account name, followed by
  an `InfoIcon` `Alert`/`AlertDescription` explaining why these details are
  collected. Do not reuse `AccountBehaviorNote`; this copy has a distinct
  purpose and belongs to the bank form.
- Keep all validation in `validation.ts`: account and currency rules consistent
  with petty cash; conditional opening-balance/date/exchange-rate rules; and
  required bank location, bank name, account number, and account name rules.
  Normalize hidden opening fields before emitting the validated submit payload.
- Add realistic stories for the form and private bank-selection part, covering
  default, populated foreign-currency, directory loading/empty, disabled, and
  submitting states.

### 4. Add mapping, mutation, and dialog orchestration

- Extend `assetAccountMapper` with an explicit mapping that returns the
  generated `IBankAccountCreationReq` directly; do not create an intermediate
  request/payload type and do not use object spreads in DTO output. Map a null
  opening balance when omitted, use shared money/currency mappers for same- and
  foreign-currency balances, and map the three bank-detail fields exactly.
- Add the asset-account service call and a `useCreateBankAccount` mutation that
  invalidates the same ledger-account query as petty cash.
- In `BankAccountCreationDialog`, load currencies and the accounting entity,
  use the entity's jurisdiction as the initial bank location where appropriate,
  and pass shared data/status into the bank-account form container. The
  container queries banks only when a location is selected.
- Keep the selected PDF statement in dialog-local state and configure
  `DocumentUpload` for a single PDF. The panel supports local selection and
  preview only and remains completely outside the form submission and DTO.
- On manual success, show the translated toast, invalidate account data through
  the mutation hook, close, and reset. On failure, retain entered values and the
  selected file and route the error through `useApiErrorHandler`.

### 5. Wire the dashboard behavior

- Update `handleAccountTypeSelected` so both Bank and Petty Cash set
  `selectedBehavior`; leave unsupported behaviors without a creation dialog.
- Render `BankAccountCreationDialog` when the selected behavior is Bank and
  clear `selectedBehavior` through its `onClose`, matching the petty-cash
  ownership pattern.

## Test Plan

- **Shared component (Vitest):** verify wrapper `className`/native prop
  forwarding, accessible picker activation, accepted file selection, rejection
  of invalid files, single-file truncation/replacement, multiple accumulation,
  native drop, default/custom media, accepted-type label mapping and
  deduplication, file/non-image previews, and image object-URL creation and
  cleanup. Run targeted V8 coverage and require 100% statements, branches,
  functions, and lines for the changed upload component modules.
- **Bank form (Vitest):** verify accessible controls and info alert, the real
  private bank-selection part's loading/empty/selection and prop-update
  behavior, location-change clearing, the container's country-to-bank query
  orchestration, all required and conditional validation branches, no-balance
  normalization, same/foreign-currency rendering, disabled/submitting state,
  and exact valid submit payload. Test deterministic validation directly and
  require 100% V8 coverage for all new form and part modules.
- **Form layout/story coverage:** document the desktop paired-row layout and the
  narrow single-column layout in Storybook. Assert stable semantic order and
  the full-width alert/sub-account placement through component-visible
  contracts rather than brittle pixel or Tailwind-class assertions.
- **Mapper/hook boundary (Vitest):** assert the complete generated bank DTO for
  no balance, same-currency balance, foreign-currency balance, and the resolved
  control-account branch. Test mutation/service orchestration only where it adds
  behavior not already covered by the mapper and Playwright flow.
- **Browser integration (Playwright):** intercept authentication, accounting
  entity, currencies, ledger accounts, country-bank directory, and bank-create
  requests before navigation. From `/accounts`, open Add account, choose Bank,
  verify the wide dialog composition and focus/dismissal, choose a location and
  bank, exercise local PDF selection through the browser file input, fill and
  submit the manual form, assert that the exact JSON POST body contains no file
  data, and verify the success toast/closure. Also cover a failed POST retaining
  form input and selected-file UI plus close/reopen reset behavior. Use
  accessible locators and no fixed sleeps.
- **Regression:** rerun the existing account-type/petty-cash integration spec
  to confirm its selection, dismissal, form submission, and payload remain
  intact.

## Verification

```bash
npm test -- --run src/shared/components/document-upload/document-upload.test.tsx src/account/components/bank-account-form/bank-account-form.test.tsx src/account/components/bank-account-form/validation.test.ts src/account/lib/mappers/asset-account.mapper.test.ts
npm test -- --run --coverage --coverage.include='src/shared/components/document-upload/**' --coverage.include='src/account/components/bank-account-form/**'
npm run typecheck:integration
npm run test:integration -- playwright/tests/account/create-bank-account.spec.ts --project=chromium
npm run test:integration -- playwright/tests/account/select-account-type.spec.ts --project=chromium
npm run test:integration:coverage
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

`npm run test:integration:coverage` requires an installed Chromium binary. Its
application-runtime report complements, but does not replace, the targeted
Vitest 100% coverage requirement for the new component modules.

## Assumptions

- “Bank location” means the country used to query `/banks`, and it is a
  form-only lookup value because `IBankAccountCreationReq` has no country or
  bank-code field. Validate this against the intended backend behavior before
  implementation.
- The accounting entity's jurisdiction is the appropriate initial bank
  location; the user may change it if the product permits cross-country bank
  accounts.
- Reusing `DocumentUpload` satisfies the requested shared DnD component because
  it already owns that exact feature-agnostic contract and accepts wrapper
  classes.

## Open Decisions

- **Sub-account behavior:** `IBankAccountCreationReq` accepts an optional
  `controlAccountCode`, but the screenshot supplies only a checkbox. Choose the
  parent/control-account source and selection UX, or remove the checkbox until
  a code can be provided. The implementation must not collect a boolean and
  silently discard it.

## Risks

- **UI-only upload expectations:** the visible statement panel could be
  mistaken for an active import workflow. Mitigate with copy that describes
  local selection without promising upload, parsing, or automatic creation.
- **Async layout movement:** late accounting-entity, currency, or bank-directory
  data can change controls after opening. Mitigate with stable option contracts,
  reserved row/feedback height, disabled-in-place loading states, and fixed
  responsive dialog geometry.
- **Cross-feature dependency drift:** the existing petty-cash dialog imports an
  accounting-owned hook even though current dependency rules restrict account
  dialogs to their own feature and shared code. Do not add further accounting
  dependencies casually; either consume already-available data through an
  approved shared boundary or document/refactor that boundary before extending
  it.

## Completion Criteria

- Selecting Bank from the account-type dialog opens the new bank creation
  dialog; closing and reopening produces clean state.
- The dialog responsively matches the supplied two-column composition and does
  not visibly resize or shift as conditional/async fields change. The desktop
  form uses the specified paired rows, while narrow layouts preserve the same
  reading and keyboard order in one column.
- The bank form is accessible, fully translated, validates all manual fields,
  uses an info alert for the bank-details explanation, and maps every submitted
  value supported by `IBankAccountCreationReq`.
- `DocumentUpload` remains feature-agnostic, accepts caller wrapper classes, and
  handles a local PDF through picker and DnD without sending it to an API.
- Manual success, failure with retained input, dismissal, and reopening are
  covered through the real `/accounts` browser composition with controlled API
  responses.
- New/changed shared-upload and bank-form modules reach 100% statements,
  branches, functions, and lines in targeted Vitest coverage; the focused
  Playwright spec and applicable repository checks pass.
- The create request is typed directly as `IBankAccountCreationReq`, contains no
  statement data, and is not bridged through a duplicate request type.
- No unsupported sub-account input is silently discarded, and unrelated
  working-tree files and existing account behavior remain unchanged.
