# Account Creation Dialog Implementation Plan

## Goal

Create an account-owned dialog under `src/account/dialogs` that renders the
public `AccountCreationForm` from
`src/account/components/account-creation-form`, then replace the inline
petty-cash creation dialog in
`src/account/pages/petty-cash-accounts-dashboard.tsx`.

This plan intentionally does not modify application code. The existing staged
and unstaged working-tree changes must be preserved during implementation.

## Current State

- `PettyCashAccountsDashboardPage` owns `showCreationForm` and renders an inline
  shared `Dialog` containing `PettyCashAccountFormContainer`.
- `AccountCreationForm` is a pure feature component. Its required inputs are:
  `accountingCurrencyCode`, `accountTypes`, `currencies`, and `onSubmit`.
- `useCurrencies` can provide currency options.
- `useAccountingEntity` provides the active accounting entity, including its
  `functionalCurrencyCode`.
- `useCreatePettyCashAccount` and `assetAccountService` only support the
  generated `POST /ledger/accounts/asset/petty-cash` endpoint.
- The generated petty-cash request supports an optional opening balance with a
  date and exchange-rate metadata, but the current service does not map all of
  those fields.
- The existing dialog primitive is already installed at
  `src/shared/components/dialog`; no shadcn generation or primitive update is
  needed.

## Confirmed Scope and Assumptions

1. This ticket creates petty-cash accounts only. Generic account creation will
   be handled by a separate ticket.
2. Supply only `ELedgerAccountBehavior.PettyCash` to the form and preselect it.
   Do not submit any other account behavior to the petty-cash endpoint.
3. Use `useAccountingEntity` and pass the active entity's
   `functionalCurrencyCode` to the form as `accountingCurrencyCode`. Do not
   hard-code a currency or infer it from the returned currency list.
4. Leave the sub-account checkbox in the form UI, but ignore its submitted value
   in this ticket. Every API payload must use `isControlAccount: false` and omit
   `controlAccountCode`.
5. Map `createWithoutOpeningBalance: true` to `openingBalance: null`.
6. Add `src/shared/lib/currency.mapper.ts` for the reusable mapping from a
   user-entered foreign-currency rate to `IExchangeRateDto`. The mapper should
   set:
   - `baseCurrencyCode` to the petty-cash account currency;
   - `targetCurrencyCode` to the active entity's functional currency;
   - `rate` to the form's exchange rate;
   - `asOf` to the opening date;
   - the API-approved `type` and `source` values for a user-entered rate.
7. Same-currency opening balances must use `exchangeRate: null`. Foreign-currency
   opening balances must use the shared currency mapper. Do not silently discard
   the opening date.

## Proposed Architecture

### Dialog ownership

Add `src/account/dialogs/account-creation.tsx`.

The dialog should:

- Be a controlled feature dialog with `open` and `onOpenChange` props.
- Render `Dialog`, `DialogContent`, `DialogHeader`, and the required accessible
  `DialogTitle`.
- Render `AccountCreationForm` through its public barrel
  (`@/account/components/account-creation-form`).
- Use feature-owned translations from the `ledger-accounts` namespace for the
  title and any description.
- Use a responsive content width suitable for the form (up to the form's
  existing `max-w-2xl`) without changing the shared dialog primitive.
- Forward close requests through `onOpenChange`.
- Disable or otherwise protect closing only if the product decision requires
  preventing dismissal during an in-flight submit.

Keep the page responsible only for page composition and the boolean open state.
Place fetching, mutation, toast, API-error handling, and successful-close
behavior in the dialog orchestrator (or a narrowly owned account hook/service),
not in `AccountCreationForm`.

### Dialog contract

Start with the smallest controlled contract:

```ts
interface AccountCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

The dialog should obtain the active entity with `useAccountingEntity`, so the
page does not pass `accountingCurrencyCode`. Avoid exposing currencies, loading
state, or mutation details to the page when the dialog can own them.

### Submission workflow

1. Load currencies with `useCurrencies` and the active entity with
   `useAccountingEntity`.
2. Build a translated `AccountTypeOption[]` containing only
   `ELedgerAccountBehavior.PettyCash`.
3. Prefill `accountType` with `ELedgerAccountBehavior.PettyCash` and
   `currencyCode` with the active entity's `functionalCurrencyCode`.
4. Submit through an account-owned mutation hook.
5. Map `IAccountCreationFormValues` to `IPettyCashAccountCreationReq` in
   `src/account/lib/asset-account.mapper.ts`, keeping API shaping out of the
   dialog and service. The mapper assumes the form values have already passed
   form validation and must not perform validation:
   - always set `isControlAccount: false`;
   - omit `controlAccountCode`, regardless of the form's `isSubAccount` value;
   - map no opening balance to `openingBalance: null`;
   - map an opening balance's amount through the shared `moneyMapper`;
   - map the opening balance's currency and date;
   - use `currencyMapper` only when the account currency differs from the
     functional currency.
6. On success:
   - invalidate the ledger-accounts query;
   - show the feature success toast;
   - call `onOpenChange(false)`.
7. On failure:
   - use `useApiErrorHandler`;
   - keep the dialog open and preserve the user's form values.
8. Pass the mutation pending state to `AccountCreationForm.loading`, and disable
   submission until both the entity and currency data required by the form are
   ready.

Have `useCreatePettyCashAccount` accept `IAccountCreationFormValues`, map them
with `assetAccountMapper`, and pass the resulting
`IPettyCashAccountCreationReq` to `assetAccountService`. Do not introduce an
intermediate request type between the form values and generated DTO.

## File Changes

### Add

- `src/account/dialogs/account-creation.tsx`
  - Controlled dialog composition and account-creation orchestration.
- `src/account/dialogs/account-creation.test.tsx`
  - Focused dialog/workflow coverage.
- `src/shared/lib/currency.mapper.ts`
  - Map a user-entered rate, currency pair, and opening date to
    `IExchangeRateDto`.
- `src/shared/lib/currency.mapper.test.ts`
  - Cover the exchange-rate DTO mapping contract.
- `src/shared/lib/money.mapper.ts`
  - Serialize `number | string` amounts and map them to `IMoneyDto`.
- `src/shared/lib/money.mapper.test.ts`
  - Cover numeric/string serialization and major/minor-unit DTO mapping.
- `src/account/lib/asset-account.mapper.ts`
  - Map `IAccountCreationFormValues` directly to
    `IPettyCashAccountCreationReq`.
- `src/account/lib/asset-account.mapper.test.ts`
  - Cover the form-to-petty-cash DTO mapping.

### Update

- `src/account/pages/petty-cash-accounts-dashboard.tsx`
  - Remove the inline shared-dialog markup.
  - Remove `PettyCashAccountFormContainer` and direct dialog primitive imports.
  - Render `AccountCreationDialog`.
  - Keep `showCreationForm` and connect
    `open={showCreationForm}` / `onOpenChange={setShowCreationForm}`.
  - Keep the table's `onAddAccount` handler opening the dialog.
- `src/account/lib/asset-account.service.ts` and
  `src/account/hooks/use-create-petty-cash-account.ts`
  - Accept `IPettyCashAccountCreationReq` and `IAccountCreationFormValues`
    respectively, with mapping delegated to `assetAccountMapper`.
- `src/account/i18n/locales/en/ledger-accounts.json`
  - Add only missing flat `snake_case` dialog-title, dialog-description,
    account-type label, or success-message keys.

### Remove only if no consumers remain

- The old `PettyCashAccountFormContainer` import from the dashboard.
- Do not delete the legacy petty-cash form directory as part of this task unless
  a repository-wide consumer search confirms it is unused and deletion is
  explicitly included in the implementation scope.

## Tests

Add focused coverage for these outcomes:

1. The controlled dialog renders an accessible title and
   `AccountCreationForm` when open.
2. `onOpenChange` receives `false` when the user dismisses the dialog.
3. The dialog supplies currencies, the approved account-type options, the
   accounting currency from `useAccountingEntity`, and pending state to the
   form.
4. A successful submit sends the correctly mapped API payload, shows the
   success notification, invalidates ledger-account data, and closes the
   dialog.
5. A failed submit delegates to the API error handler and leaves the dialog
   open.
6. The dashboard's Add Account action opens the new dialog, using a page test if
   that interaction is not already covered elsewhere.
7. Mapper/service tests cover:
   - no opening balance -> `openingBalance: null`;
   - same-currency opening balance -> no exchange-rate object;
   - foreign-currency opening balance -> exchange-rate metadata from
     `currencyMapper`;
   - either `isSubAccount` form value -> `isControlAccount: false` with no
     `controlAccountCode`.

Mock external boundaries (query hooks, mutation hook, toast, and API error
handler), not internal React implementation details.

## Verification

Run focused checks first, followed by repository checks in proportion to the
final change:

```bash
npm test -- --run src/account/dialogs/account-creation.test.tsx
npm test -- --run src/shared/lib/currency.mapper.test.ts
npm test -- --run src/account/lib/asset-account.mapper.test.ts
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Also inspect the final diff and search for remaining inline account-creation
dialog markup in the dashboard. No shadcn staging command should be necessary
unless implementation reveals that the shared dialog primitive is missing a
required upstream capability.

## Completion Criteria

- The dashboard no longer constructs the account-creation modal inline.
- `src/account/dialogs/account-creation.tsx` renders the public
  `AccountCreationForm`.
- The dialog has an accessible translated title and a controlled open/close
  contract.
- Side effects remain outside the pure form.
- The dialog obtains the functional currency from `useAccountingEntity`; no
  accounting currency is hard-coded.
- Only petty-cash behavior can be submitted.
- All created accounts use `isControlAccount: false`, regardless of the visible
  sub-account checkbox.
- Foreign-currency opening balances are mapped through
  `src/shared/lib/currency.mapper.ts`.
- Success closes the dialog and refreshes account data; failure preserves the
  form and keeps the dialog open.
- Focused tests and required repository checks pass.
