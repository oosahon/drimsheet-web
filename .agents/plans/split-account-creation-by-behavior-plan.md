# Split Account Creation by Behavior Plan

## Goal

Create an account-creation workflow in which the user first chooses the kind of
account to add and is then handed off to a behavior-specific destination. Use a
dedicated dialog for compact workflows and a routed page for larger, branching,
or import-oriented workflows.

This architecture is implementation-ready for petty cash and bank accounts.
Virtual-wallet and fixed-asset forms should be added only after their API
contracts and product rules are defined. Preserve unrelated staged and
working-tree changes during implementation.

## Context

The existing `AccountCreationDialog` always submits through
`useCreatePettyCashAccount`, even though its account-type options now include
bank. The generated API distinguishes petty cash and bank creation with separate
request DTOs and endpoints. The existing generic form owns one value shape and
one validation schema centered on an optional opening balance.

Bank creation may also use a bank statement to prefill the account details,
which requires upload, parsing, and recovery states in addition to the editable
form. Repository rules require each form's values and validation to remain
colocated, explicit mappers to map form values directly to generated DTOs, and
dialogs, pages, or containers to own fetching, mutations, notifications, and
workflow state.

## Confirmed Findings

1. **Correctness risk — selecting Bank currently still invokes the petty-cash workflow.** `src/account/dialogs/account-creation.tsx` passes both Bank and Petty Cash options into `AccountCreationForm`, but `handleSubmit` always calls `useCreatePettyCashAccount`.
2. **Bank and petty cash have different source and destination contracts.** `IBankAccountCreationReq` requires nested bank details, while `IPettyCashAccountCreationReq` contains `isControlAccount`; they are sent to different API methods.
3. **The current form is not a neutral account form.** Its values and validation assume account behavior selection, currency, and an optional opening balance, so adding behavior-specific conditional branches would couple unrelated rules in one schema.
4. **The Add account action is already lifted above the table container.** `LedgerAccountsTableContainer` emits `onAddAccount`; `AccountsDashboardPage` owns dialog visibility. The table container therefore does not need to know which account behavior is selected.
5. **Account routes can support dedicated creation pages without changing the application shell.** `src/account/routes/ledger-account.tsx` already owns the `/accounts` route tree and can add static `new/...` children before the dynamic `:accountId` route.

## Scope

### Expected Changes

- `src/account/dialogs/account-creation.tsx` — become a lightweight chooser that emits or dispatches the selected account-creation destination.
- `src/account/dialogs/petty-cash-account-creation.tsx` — own the compact petty-cash creation workflow.
- `src/account/pages/bank-account-creation.tsx` — compose statement-assisted entry and the editable bank form in page-sized space.
- `src/account/routes/ledger-account.tsx` — add a stable bank creation route such as `/accounts/new/bank`.
- `src/account/components/account-type-selection/` — add a pure, accessible selection view for supported account behaviors.
- `src/account/components/petty-cash-account-creation-form/` — give the existing petty-cash contract, validation, stories, and tests an explicit owner.
- `src/account/components/bank-account-creation-form/` — add bank-specific values, fields, validation, stories, and tests.
- `src/account/lib/mappers/` — keep separate explicit mapper functions from each form contract to its generated request DTO.
- `src/account/hooks/` and `src/account/lib/services/` — add the bank mutation and retain bank-directory fetching outside the pure form.
- `src/account/i18n/` — add selection, navigation, field, validation, success, and error-facing copy.
- `playwright/tests/account/` — cover chooser handoff and the dialog/page creation journeys.

### Conditional Changes

- Promote genuinely shared field sections from the existing form's private `parts/` directory into dedicated account-owned components only after two forms require the exact same UI contract.
- Add virtual-wallet and fixed-asset destinations, form folders, mappers, and mutations when their generated API contracts and validation rules are available. Choose dialog versus page from workflow complexity, not merely account type.

### Out of Scope

- Defining backend contracts or accounting rules for virtual wallets and fixed assets.
- Changing `LedgerAccountsTableContainer` to own dialog or account-type state.

## Proposed Approach

### 1. Make account choice a launchpad

- Keep `AccountsDashboardPage` responsible only for opening and closing account creation.
- On Add account, open a small, size-stable chooser with supported account types and concise descriptions.
- After selection, close the chooser and hand off to the matching destination; do not replace the chooser body with substantially different form layouts.
- Open a dedicated petty-cash dialog for the compact workflow.
- Navigate bank creation to a stable page route because it combines an editable form with optional statement upload, parsing, preview, mapping, validation, and recovery states.
- Let direct entry points bypass the chooser and open or navigate to a known destination.

### 2. Give each behavior a typed form contract

- Rename or migrate the current generic form to a petty-cash-specific form.
- Create a bank form with bank-specific form values and validation, including the bank directory choice and account details required by `IBankAccountCreationReq`.
- Do not retain an account-type select inside a behavior-specific form; the workflow selection determines the form and submission path.
- Keep conditional rendering only for fields that are variants within one behavior's contract, such as exchange-rate fields for a foreign-currency opening balance.

### 3. Make statement import an optional form accelerator

- Render the statement drop zone and editable bank form together instead of
  asking the user to choose between manual and statement-based methods.
- Use a two-column desktop layout, with statement upload/status on the left and
  the canonical form on the right; stack the upload above the form on narrow
  screens.
- Treat the form state as the single source of truth. Successful parsing
  prefills recognized fields, and the user can review or edit every inferred
  value before submission.
- Keep the manual form usable while no file is present and after upload or parse
  failure, so statement handling never blocks account creation.
- Avoid silently overwriting fields the user has already edited. If a later
  upload conflicts with dirty values, preserve them or ask for explicit
  confirmation before replacement.
- Keep upload, parsing progress, preview, errors, and retry actions on the page
  so they do not compete with modal height and dismissal behavior.
- Return to the accounts dashboard or new account page after success according
  to the product's desired follow-up action.

### 4. Keep mapping and side effects behavior-specific

- Map petty-cash values directly to `IPettyCashAccountCreationReq` and bank values directly to `IBankAccountCreationReq` with separate explicit mapper functions.
- Keep bank lookup, creation mutations, cache invalidation, API error handling, and success toasts in hooks or dialog/container orchestration.
- Ensure the selected behavior dispatches to exactly one matching mutation; avoid a universal submit handler over a wide optional value type.

### 5. Reuse narrow pieces, not the whole form model

- Reuse currency selection and other established shared primitives.
- Extract common account-name or opening-balance sections only when their props and validation semantics are truly identical across forms.
- Keep behavior-specific values and schemas separate even when their visual layouts are similar.

## Test Plan

- **Unit or component:** test the type-selection component's accessible choices and callback; test each form's required, invalid, conditional, and successful-submit behavior; test each mapper's complete generated DTO.
- **Browser integration:** verify Add account opens selection, Petty Cash hands off to its dedicated dialog, and Bank navigates to its creation page. Verify the bank form works without a file, a statement prefills editable fields, parsing failure leaves manual entry usable, dirty values are not silently overwritten, browser refresh/back behavior is safe, and submission sends the matching endpoint payload.
- **Regression:** preserve current petty-cash opening-balance and foreign-exchange behavior, loading/disabled states, API error handling, success close, and ledger-account query invalidation.

## Verification

```bash
npm test -- --run src/account/components/petty-cash-account-creation-form src/account/components/bank-account-creation-form src/account/lib/mappers
npm run test:integration -- playwright/tests/account/account-creation.spec.ts
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Browser verification depends on the project's configured Playwright browser and
mock API setup.

## Assumptions

- Bank and petty cash are user-facing creation behaviors under the
  `cash_and_cash_equivalent` ledger subtype; the generated `behavior` values, not
  `ELedgerAccountSubType`, distinguish their creation flows.
- The bank-directory API supplies selectable institutions, while any additional
  bank-account verification rule will be confirmed from the backend/product
  contract before implementation.

## Open Decisions

- Decide whether bank selection should store only the bank name required by the
  current DTO or preserve a stable bank code once the backend contract supports
  it. This changes the form value shape and mapper, but not the proposed workflow.
- Decide whether users may create arbitrary generic ledger accounts in addition
  to supported behavior-specific accounts. If so, that should be a separate
  "Other account" workflow rather than a fallback branch in every specialized
  form.

## Risks

- A selection step can add friction when only one account behavior is enabled;
  hide the chooser and open that destination directly when the available choices
  are reduced to one.
- Copying shared fields across forms can drift; mitigate by extracting only
  stable, identical field contracts after reuse is demonstrated.
- Sequential chooser-to-dialog handoff can briefly flash or create awkward focus
  movement; close the chooser first, then open the selected dialog through one
  page-owned destination state, and verify focus restoration in Playwright.
- Static creation routes can be mistaken for `:accountId`; define `new/...`
  routes explicitly and verify matching before relying on the dynamic account
  route.

## Completion Criteria

- Add account opens a size-stable chooser with supported account choices.
- Petty Cash opens its dedicated compact dialog; Bank navigates to its dedicated
  creation page.
- The bank page presents statement import and manual entry together, and parsed
  values flow into the same editable form contract.
- Petty-cash and bank submissions call their matching endpoint with their
  generated DTO shape.
- Back, close, reopen, loading, success, and failure states behave predictably.
- Focused component, mapper, integration, structure, story, lint, and build
  checks pass.
- Unrelated staged files and behavior remain unchanged.
