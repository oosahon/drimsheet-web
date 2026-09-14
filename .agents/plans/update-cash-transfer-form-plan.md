# Cash Transfer Form Amounts and API Integration Plan

## Goal

Update the journal-entry cash transfer flow so the form matches the supplied
single-entry and charge-itemized screenshots, models amount sent and amount
received independently, keeps amount sent authoritative, accepts itemized
categories through a dedicated `categories` prop, and submits the generated
`ITransferEntryReq` contract through `createTransfer`.

The screenshots are treated only as visual references for field order, grouping,
responsive layout, and the two charge-entry states. This plan is ready to
implement after the exchange-rate convention in **Open Decisions** is resolved.
Implementation must preserve the existing staged and working-tree changes.

## Context

The current staged transfer feature already has a pure form, container, helper,
validation, stories, tests, mapper, mutation hook, service, routed page, and a
Playwright journey. The update should retain that architecture and revise the
contracts and behavior in place:

```text
CashTransferForm values
  -> CashTransferFormContainer
  -> journalEntryMapper.toTransferEntryReq
  -> useCreateTransfer
  -> journalEntryService.createTransfer
  -> drimsheetApi.journalEntries.createTransfer
```

The relevant baseline is
[`cash-transfer-form.tsx`](../../src/journal-entries/components/cash-transfer-form/cash-transfer-form.tsx),
with the existing cash form and bookkeeping transfer form useful only as nearby
patterns. In particular, the bookkeeping form's bidirectional amount copying
must not be carried over because the requested transfer form must never update
amount sent from another field.

## Confirmed Findings

1. **The current form does not model the requested two amounts.**
   [`types.ts`](../../src/journal-entries/components/cash-transfer-form/types.ts)
   contains one `amount`, and the UI renders that field beside Date instead of
   rendering Amount Sent beside Amount Received.
2. **The charge category source is currently wrong for the requested contract.**
   `CashTransferForm` has no `categories` prop and passes `destinationAccounts`
   to `ItemizedFields`. The form contract and its stories/tests must supply a
   distinct category list even if the container initially derives both lists
   from one permitted-posting response.
3. **The supplied visual states require a different composition order.** The
   account selectors are followed by the sent/received amount row, then either
   “Add charges or fees” or “Back to single entry” plus item rows, then the
   exchange-rate/date row, description, receipt, and Create action.
4. **The generated transfer request has changed from the staged consumer code.**
   [`Api.ts`](../../src/shared/lib/api/Api.ts) defines one `sourceLine`, one
   `destinationLine`, and `chargeLines`; the staged mapper and integration test
   still construct/assert `destinationLines`. The API client already exposes
   `createTransfer(ITransferEntryReq)` at `POST /journal-entries/transfer`.
5. **The generated request makes the form-to-line mapping explicit.** Amount
   sent belongs to `sourceLine`, amount received belongs to `destinationLine`,
   and each itemized fee belongs to `chargeLines` with `counterparty: null`.
6. **The existing `ItemizedFields` component is reusable.** It already supports
   category selection, amount and description editing, add/save/delete actions,
   and edit-mode reporting. The transfer form can pass `categories` to its
   existing `accounts` option prop without changing the shared item editor.
7. **The existing exchange-rate input uses “1 base currency = rate target
   currency.”** Its base/target ordering must follow the chosen transfer-rate
   convention, and the transfer's official-rate query must use the selected
   source and destination currencies rather than assuming the destination is
   always the accounting entity's functional currency.
8. **The permitted-posting endpoint exposes only `source`, `destination`, and
   optional currency filters.** It does not expose a separate “charge category”
   query discriminator, so the container needs an explicit local category
   projection unless the backend provides an additional contract before
   implementation.
9. **API orchestration already exists but needs contract updates.** The container
   uploads an optional receipt, maps form values, calls `useCreateTransfer`, and
   reports translated success/API errors. The service and hook already forward
   `ITransferEntryReq` and should remain transport-only.

## Scope

### Expected Changes

- `src/journal-entries/components/cash-transfer-form/cash-transfer-form.tsx` —
  render the screenshot composition and implement one-way amount/rate updates.
- `src/journal-entries/components/cash-transfer-form/types.ts` — replace the
  ambiguous single amount with explicit sent/received money values and add the
  required `categories` prop and transfer currency context.
- `src/journal-entries/components/cash-transfer-form/cash-transfer-form.helper.ts`
  and `.helper.test.ts` — centralize deterministic money synchronization,
  currency changes, charge totals, rate calculation, rounding, initialization,
  and submission normalization.
- `src/journal-entries/components/cash-transfer-form/validation.ts` — enforce
  account, money, date, exchange-rate, charge, attachment, and balancing rules.
- `src/journal-entries/components/cash-transfer-form/cash-transfer-form.test.tsx`
  and `.stories.tsx` — cover and document the same-currency, foreign-currency,
  single-entry, itemized, loading, invalid, and narrow-screen states.
- `src/journal-entries/components/cash-transfer-form/cash-transfer-form-skeleton.tsx`
  and its story/test — mirror the new two-amount and rate/date layout.
- `src/journal-entries/components/cash-transfer-form/cash-transfer-form.container.tsx`
  and `.container.test.tsx` — provide categories, query the selected currency
  pair, upload the receipt, map the new values, and invoke the mutation.
- `src/journal-entries/components/cash-transfer-form/index.ts` — export the
  revised public types while keeping helpers private.
- `src/journal-entries/lib/mappers/journal-entry.mapper.ts` and `.test.ts` — map
  the revised form values explicitly to `sourceLine`, `destinationLine`, and
  `chargeLines` under the generated DTO.
- `src/journal-entries/hooks/use-create-transfer.test.tsx` — update its fixture
  to the current generated request shape; the hook itself should need no
  behavioral change.
- `src/journal-entries/i18n/locales/en/journal-entries.json` — add/revise labels
  and validation copy, including sent/received and unbalanced-transfer errors.
- `playwright/tests/journal-entries/create-transfer.spec.ts` — update the routed
  browser journey and intercepted request assertion for the new UI and API DTO.

### Conditional Changes

- `src/journal-entries/lib/services/journal-entry.service.ts` and
  `src/journal-entries/hooks/use-create-transfer.ts` — change only if the revised
  generated DTO exposes a transport mismatch; otherwise preserve their existing
  typed pass-through behavior.
- `src/journal-entries/components/itemized-fields/**` — change only if focused
  transfer tests expose a missing accessibility or controlled-value contract;
  no change is currently required to pass category options into it.
- `src/journal-entries/pages/transfer.tsx` and
  `src/journal-entries/routes/journal-entries.tsx` — change only if integration
  inspection reveals composition or navigation differences; the route and page
  are already wired in the staged baseline.

### Out of Scope

- Editing or hand-authoring the generated `src/shared/lib/api/Api.ts` contract.
- Refactoring the existing bookkeeping transfer form or cash transaction form.
- Introducing a new generic itemized-fields abstraction.
- Calling a live API, file store, database, or identity provider from tests.
- Inferring behavioral instructions from the screenshot contents beyond the
  layout and states explicitly requested by the user.

## Proposed Approach

### 1. Revise the form contract and visual composition

- Define explicit `amountSent` and `amountReceived` `IMoneyDto` values. Assign
  the selected source account currency to `amountSent`, the selected destination
  account currency to `amountReceived`, and the destination currency to charge
  items so values compared in the balancing rule share a unit.
- Add `categories: ILedgerAccountDto[]` to `CashTransferFormProps` and pass only
  that collection to `ItemizedFields`; keep destination account options limited
  to `destinationAccounts`.
- Expand the transfer currency context to contain source currency, destination
  currency, and date. Emit it when either account or Date changes so the
  container can query the direct transfer pair.
- Preserve the distinct-account filtering and opening-date constraints already
  owned by the form.
- Reorder the UI to match the screenshots: account fields; responsive
  sent/received row; charge action or expanded item rows; responsive
  exchange-rate/date row; description; receipt; right-aligned Create button.
- Show the exchange-rate control only when both currencies are known and differ.
  Keep Date available for both same-currency and forex transfers and ensure the
  layout collapses to one column on narrow screens.
- Keep `ItemizedFields` and the existing discard-confirmation behavior. Disable
  Create while an item row is being edited and while submission is pending.
- Update the skeleton and stories to make both screenshot states and the forex
  state visually reviewable without live data.

### 2. Implement authoritative sent-amount synchronization

- Keep all cross-field updates in named event handlers and deterministic helper
  functions; do not synchronize Formik values with `useEffect`.
- When amount sent changes in a same-currency transfer, copy its numeric value
  into amount received. A later edit to amount received must never change amount
  sent.
- For forex, calculate amount received from amount sent and the chosen rate, and
  recalculate the rate when the user edits amount received. Editing the rate may
  update amount received, but no destination, received, rate, or charge handler
  may write to amount sent.
- When account selection changes a currency, update the affected money currency,
  clear stale pair-specific rate state, and deterministically seed the new
  received/rate values only when enough valid inputs are present.
- Do not automatically add charges to amount sent. Charges remain explicit
  destination-side lines and the validation layer determines whether the
  entered sent/received/rate/charge values balance.
- Put rounding and equality tolerance in the private helper and apply it
  consistently to displayed derivations, validation, and mapper tests to avoid
  binary floating-point mismatches.

### 3. Add transfer-specific balance validation

- Require distinct source/destination accounts, positive finite sent and
  received amounts, a valid date, and a positive finite rate when the selected
  currencies differ.
- Preserve future-date, account-opening-date, item category/amount, and receipt
  type/size validation.
- In the same currency, require:

  ```text
  amount received + total charges = amount sent
  ```

- In forex, apply the equation selected in **Open Decisions**. Attach the
  translated imbalance error to the field that the user can correct without
  implying amount sent should be rewritten.
- Validate only committed item rows and continue blocking submission while a
  charge row is in edit mode.
- Keep every validation message in the `journal-entries` i18n namespace and
  test meaningful branches directly against the exported validation factory.

### 4. Map the form directly to the generated transfer DTO

- Update `journalEntryMapper.toTransferEntryReq` without introducing an
  intermediate payload type or validation inside the mapper.
- Map `amountSent` to `sourceLine.amount` and `amountReceived` to
  `destinationLine.amount`, preserving each selected account's currency and
  setting sequence orders 1 and 2.
- Map committed item rows to `chargeLines` starting at sequence order 3. Set
  `counterparty: null`, trim each optional description, and preserve the
  destination/charge currency convention chosen by the form.
- Map the resolved manual or official exchange-rate DTO only to lines for which
  its base/target pair is semantically valid; lock the exact line-level policy
  in complete mapper assertions after confirming the backend interpretation.
- Continue mapping attachment references, effective date, posted timestamp,
  memo, and nullable descriptions explicitly.
- Leave the mutation hook and service as generated-DTO pass-through boundaries,
  updating only stale fixtures and contract assertions.

### 5. Update container data and submission orchestration

- Continue querying transfer-permitted source and destination posting accounts
  and accounting-entity context. Pass a dedicated `categories` array to the
  form; derive it from the permitted destination-side response using the
  agreed cash-account/category projection until the backend offers a distinct
  category query.
- Query an official rate using the selected source/destination pair and date.
  Do not reuse the cash transaction's source-to-functional query when the
  destination currency differs from the functional currency.
- Preserve the existing optional receipt upload before mutation, duplicate
  submission guard, combined loading state, translated success toast, and
  `useApiErrorHandler` failure path.
- Update the container test to render the real form, mock only the posting,
  rate, upload, mutation, and notification boundaries, and assert the new form
  props and generated request shape.

### 6. Protect the behavior at each ownership layer

- Helper tests: initial currencies, same-currency sent-to-received tracking,
  forex sent/rate-to-received calculation, received-to-rate calculation,
  source immutability, currency-pair resets, charge totals, rounding, and
  normalized values.
- Validation tests: same-currency equality, charge-inclusive equality,
  mismatches, forex equation, zero/invalid rate, committed charge rows, account
  opening dates, and attachment limits.
- Component tests: both screenshot states, dedicated category options,
  one-way tracking, conditional exchange-rate UI, add/edit/delete/back flows,
  disabled/loading state, and successful callback payloads.
- Mapper/hook/container tests: exact `sourceLine`, `destinationLine`, and
  `chargeLines` contracts, currencies, exchange-rate placement, sequence order,
  attachment upload/reference forwarding, and failure propagation.
- Browser integration: intercept all first-party requests before navigation,
  use the real `/transactions/transfer` route, create a charge-inclusive
  transfer, verify visible success, and assert the complete
  `POST /journal-entries/transfer` body. Add a focused forex scenario when the
  selected rate convention changes browser-visible behavior not already
  protected by component/mapper tests.

## Test Plan

- **Unit/component:** update the colocated helper, validation, form, skeleton,
  container, mapper, and hook suites. Use real owned child components and
  accessible role/label queries in component tests.
- **Browser integration:** update
  `playwright/tests/journal-entries/create-transfer.spec.ts` to use controlled
  posting-account, accounting-entity, exchange-rate, upload, and transfer
  responses; assert both the composed UI outcome and current generated request
  contract without a live backend.
- **Regression:** keep inflow/outflow mapper, container, route, and browser
  behavior unchanged; ensure `ItemizedFields` still supports its existing cash
  transaction consumers.

## Verification

Run focused tests first, then integration and repository-wide structural checks:

```bash
npm test -- --run src/journal-entries/components/cash-transfer-form/cash-transfer-form.helper.test.ts src/journal-entries/components/cash-transfer-form/cash-transfer-form.test.tsx src/journal-entries/components/cash-transfer-form/cash-transfer-form-skeleton.test.tsx src/journal-entries/components/cash-transfer-form/cash-transfer-form.container.test.tsx src/journal-entries/lib/mappers/journal-entry.mapper.test.ts src/journal-entries/hooks/use-create-transfer.test.tsx
npm run typecheck:integration
npm run test:integration -- playwright/tests/journal-entries/create-transfer.spec.ts --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Run the full Vitest and browser integration suites after the focused checks pass
when the local browser binary is available:

```bash
npm test -- --run
npm run test:integration
```

## Assumptions

- Charge amounts use the destination/received currency because they are added to
  amount received in both supplied balancing descriptions and map to
  destination-side journal lines.
- Amount received remains editable. Amount sent updates it according to the
  selected currency/rate convention; editing amount received may update the
  rate, but never amount sent.
- The current destination-side permitted-posting response is the available
  source for both destination cash accounts and charge categories. The form
  still receives two explicit props, and the container owns any filtering.
- Receipt upload behavior, file limits, success toast, and page composition stay
  as implemented in the staged baseline unless the focused tests expose a
  regression.

## Open Decisions

- **Resolve the forex rate direction before implementation.** The requirements
  currently define the rate in two incompatible ways:
  - `exchange rate = amount received / amount sent` implies destination units
    per source unit and `amount received = amount sent * exchange rate`.
  - `(charges + amount received) * exchange rate = amount sent` implies source
    units per destination unit and, without charges,
    `exchange rate = amount sent / amount received`.

  The recommended interpretation is to prioritize the explicit balancing
  equation: display `1 destination currency = rate source currency`, derive
  `amount received = amount sent / rate`, and derive
  `rate = amount sent / amount received` when there are no charges. With charges,
  derive/validate the rate against `amount received + charges`. If the intended
  display is instead `1 source currency = rate destination currency`, the
  charge-inclusive validation and rate tracking must be rewritten together as
  one consistent equation; using `amountReceived / amountSent` unchanged while
  also adding charges does not preserve a balanced relationship.

- **Confirm the destination/category projection.** The generated posting-account
  query has no category discriminator. The likely projection is cash-equivalent
  accounts for `destinationAccounts` and non-cash permitted destination-side
  accounts for `categories`; confirm that this matches the backend rule before
  encoding it in the container.
- **Confirm line-level exchange-rate semantics.** The generated DTO allows a
  nullable exchange rate on source, destination, and charge lines but does not
  document whether each line's rate must convert to functional currency or may
  represent the direct source/destination pair. Mapper implementation and tests
  must follow the backend contract rather than copying one pair onto lines with
  a different amount currency.

## Risks

- Choosing the wrong rate direction would produce plausible-looking values but
  an unbalanced journal request. Centralized helper math plus validation,
  mapper, and Playwright request assertions mitigate this once the convention is
  confirmed.
- Source/destination account changes can leave stale money currencies or rates.
  Atomic Formik handlers and pair-specific helper tests should reset all
  dependent values without ever mutating amount sent from a dependent field.
- Floating-point comparisons can reject visually equal transfers. Apply one
  precision/tolerance policy across derivation and validation and test decimal
  edge cases.
- The worktree contains substantial staged user changes, including the existing
  transfer implementation and a staged-but-locally-deleted prior plan. Modify
  only the files required by this update and do not restore, unstage, or discard
  unrelated work.

## Completion Criteria

- The transfer form matches the supplied single-entry and charge-itemized field
  order and responsive grouping, including Amount Sent and Amount Received.
- `CashTransferForm` requires and uses a dedicated `categories` prop for charge
  rows.
- Same-currency and forex updates obey one documented equation, amount sent is
  never changed by another input, and charge-inclusive mismatches show
  translated validation feedback.
- The form submits explicit sent, received, and charge values with the correct
  currencies and normalized text.
- `journalEntryMapper.toTransferEntryReq` produces the generated `sourceLine`,
  `destinationLine`, and `chargeLines` contract and the service/hook call
  `createTransfer` without handwritten transport types.
- The container supplies accounts/categories/rate context, uploads an optional
  receipt, prevents duplicate submission, and presents translated success or
  failure feedback.
- Focused Vitest coverage, the routed Playwright journey, integration
  typechecking, structure/story checks, lint, build, and applicable regression
  suites pass.
- Existing generated API changes and unrelated staged/working-tree work remain
  intact.
