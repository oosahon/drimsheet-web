# Wire Account Type Selection Plan

## Goal

Make Add account open the account-type selection dialog before any creation
form, give the current generic creation form a petty-cash-specific public
contract, and promote its reusable field sections to independently owned
account components.

This plan is implementation-ready. It interprets the requirement that
`account-creation-form` “should not be” `petty-cash-form` as “should now be”
`petty-cash-form`: that interpretation matches the stated goal of preventing
different account contracts from being combined in one generic form. Preserve
unrelated staged and working-tree changes during implementation.

## Context

`AccountsDashboardPage` currently passes an inline callback to
`LedgerAccountsTableContainer` that immediately opens `AccountCreationDialog`.
The new `AccountTypeSelectionDialog` already exposes `open`, `onClose`, and an
`onSubmit(ULedgerAccountBehavior)` contract, so the page can own the selection
step without changing the accounts table.

The current `AccountCreationForm` presents several account behaviors, but its
only production dialog always submits through `useCreatePettyCashAccount` and
the mapper emits `IPettyCashAccountCreationReq`. The form is therefore already
petty-cash-specific at its mutation boundary even though its name and values
contract are generic.

## Confirmed Findings

1. **The Add account flow bypasses the new selector.**
   `src/account/pages/account-dashboard.tsx` directly sets
   `showCreationForm` from the table's `onAddAccount` callback and renders
   `AccountCreationDialog` from that state.
2. **The selection dialog is ready to be page-orchestrated.**
   `src/account/dialogs/account-type-selection.tsx` reports the selected
   `ULedgerAccountBehavior` through `onSubmit` and reports dismissal through
   `onClose`.
3. **The generic form name hides a petty-cash submission contract.**
   `src/account/dialogs/account-creation.tsx` always calls
   `useCreatePettyCashAccount`; `src/account/lib/mappers/asset-account.mapper.ts`
   maps its values to `IPettyCashAccountCreationReq` and does not use the
   selected `accountType`.
4. **Both requested reusable sections are currently private parts.**
   `OpeningBalanceFields` and `AccountBehaviorNote` live under
   `account-creation-form/parts`, which repository dependency rules prohibit
   other forms from importing. Promotion to separate component directories is
   required before reuse.
5. **A different legacy petty-cash form already exists.**
   `src/account/components/petty-cash-account-form` has a smaller values shape,
   fetches currencies inside the UI component, and has no production consumer.
   It is not equivalent to the current creation form and should not be merged
   implicitly during this wiring change.

## Scope

### Expected Changes

- `src/account/pages/account-dashboard.tsx` — replace the inline Add account
  callback with named page handlers and make the account-type selector the
  first dialog in the flow.
- `src/account/components/account-creation-form/` →
  `src/account/components/petty-cash-form/` — rename the folder, files, public
  component, types, validation, stories, and tests so the contract has one
  behavior-specific owner.
- `src/account/dialogs/account-creation.tsx` — consume the renamed petty-cash
  form and remove form-level account-type option wiring.
- `src/account/hooks/use-create-petty-cash-account.ts` — accept the renamed
  petty-cash form values type.
- `src/account/lib/mappers/asset-account.mapper.ts` and its test — accept the
  renamed values type while preserving the explicit generated DTO mapping.
- `src/account/components/opening-balance-fields/` — promote the opening
  balance section, props, story, focused behavior test, and barrel into an
  independently reusable account component.
- `src/account/components/account-behavior-note/` — promote the behavior note,
  props, story, test, and barrel into an independently reusable account
  component.
- `playwright/tests/account/select-account-type.spec.ts` — cover the composed
  dashboard-to-selection-dialog interaction with controlled API responses.

### Out of Scope

- Dispatching Bank, Petty Cash, Virtual Account, or Credit Card selections to
  their eventual forms, dialogs, routes, or mutations. The selected-type
  handler will be the extension point, but this task will not implement its
  branches.
- Implementing new behavior-specific form contracts.
- Removing or consolidating the unused
  `src/account/components/petty-cash-account-form`; its different contract
  should be handled explicitly in a separate cleanup.
- Renaming `AccountCreationDialog`; it may be specialized in the follow-up that
  connects the petty-cash selection to its destination.

## Proposed Approach

### 1. Put the selector in front of account creation

- Replace `showCreationForm` with selector-specific page state such as
  `showAccountTypeSelection`.
- Add a named `handleAddAccount` that opens
  `AccountTypeSelectionDialog`, and pass it to
  `LedgerAccountsTableContainer.onAddAccount` instead of the inline setter.
- Add a named `handleAccountTypeSelected(accountType)` whose signature receives
  `ULedgerAccountBehavior`, closes the selector, and clearly marks the future
  type-based dispatch point. Do not add a switch, navigation, or form-opening
  branch in this change.
- Render `AccountTypeSelectionDialog` with the page-owned open, close, and
  submit handlers. Remove `AccountCreationDialog` from the immediate Add
  account path so selection is always the first step.

### 2. Give the current form a petty-cash-only contract

- Move `account-creation-form` to `petty-cash-form` and rename exported symbols
  consistently, including `PettyCashForm`, `PettyCashFormProps`,
  `IPettyCashFormValues`, and the validation factories/hooks.
- Remove `accountTypes`, `accountType`, the account-type Select, and
  account-type-required validation from the form. The workflow selection—not
  the form—will determine behavior.
- Keep existing petty-cash fields, normalization, loading/disabled behavior,
  and submission semantics intact. Render `AccountBehaviorNote` with the fixed
  Petty Cash behavior only if the note remains useful in the specialized form.
- Update the dialog, mutation hook, mapper, tests, stories, and public imports
  atomically so no generic form contract remains in production code.
- Keep the mapper explicit and validation-free; the rename must not alter the
  `IPettyCashAccountCreationReq` payload.

### 3. Promote reusable form sections

- Create `components/opening-balance-fields/` with its own implementation,
  `types.ts`, `index.ts`, story, and focused test. Move
  `OpeningBalanceFieldsProps` out of the form's `types.ts`, expose it from the
  new component barrel, and import the component through that public API.
- Create `components/account-behavior-note/` with its own implementation,
  `types.ts`, `index.ts`, existing test, and story. Export only the component
  and its public props contract.
- Update Storybook titles to reflect independent component ownership and
  remove the old `parts/` directory once all consumers and colocated artifacts
  have moved.

### 4. Protect the new wiring boundary

- Keep existing component tests for account-type selection and retarget the
  renamed form/validation tests to the petty-cash public API.
- Add a browser integration test that navigates through the public accounts
  route, clicks Add account, verifies the selection dialog and choices, closes
  and reopens it, and submits a choice. Since dispatch is intentionally not
  implemented, assert that the selector closes without asserting a destination
  form.
- Register deterministic first-party account API interception before
  navigation and use accessible roles/text for the dialog interactions.

## Test Plan

- **Unit or component:** retain selection callback coverage; verify the renamed
  petty-cash form's required fields, opening-balance normalization,
  same/foreign-currency behavior, and submit payload; test promoted opening
  balance callbacks/conditional exchange-rate rendering and all behavior-note
  descriptions through their new public owners.
- **Mapper and validation:** rename the validation suite and verify the same
  meaningful validation branches; run the mapper suite to confirm the complete
  petty-cash DTO remains unchanged after the source-type rename.
- **Browser integration:** verify Add account opens the type selector first,
  dismissal/reopening works, and submitting a selected behavior reaches the
  page handler and closes the selector without opening a form yet.
- **Regression:** confirm the accounts table still emits Add account, the
  existing petty-cash dialog/form compiles against the renamed contract, and
  no other feature imports private component parts.

## Verification

```bash
npm test -- --run src/account/components/petty-cash-form src/account/components/opening-balance-fields src/account/components/account-behavior-note src/account/components/account-type-selection src/account/lib/mappers/asset-account.mapper.test.ts
npm run typecheck:integration
npm run test:integration -- playwright/tests/account/select-account-type.spec.ts --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

The Playwright command depends on the configured Chromium binary; report an
environmental blocker rather than substituting a live backend.

## Assumptions

- “Should not be `petty-cash-form`” is a typographical error for “should now be
  `petty-cash-form`.” If the literal wording was intended, the form rename and
  specialization step must be revised before implementation.
- Selecting a type should close the selector during this wiring-only task. A
  later change will add exhaustive dispatch from the same handler to the
  appropriate behavior-specific destination.

## Risks

- Renaming the form without updating the hook and mapper type imports together
  can break the mutation path; mitigate with an atomic rename and focused
  mapper/build verification.
- Retaining an account-type field inside the renamed form would preserve the
  mixed-contract problem; remove it and let the upstream selection own that
  decision.
- The repository will temporarily contain both `petty-cash-form` and the older
  unused `petty-cash-account-form`; keep their contracts isolated and schedule
  explicit consolidation only after choosing which behavior should survive.
- Closing one modal before a future destination opens can affect focus
  restoration; the browser test establishes the current selector lifecycle so
  the later dispatch implementation can extend it safely.

## Completion Criteria

- Clicking Add account opens `AccountTypeSelectionDialog` and does not directly
  open the creation form.
- The page uses named Add and selected-type handlers, and the selected-type
  handler receives `ULedgerAccountBehavior` without implementing destination
  branches.
- The former generic form is publicly owned as `petty-cash-form`, no longer
  presents an account-type selector, and still produces the same validated
  petty-cash values needed by the mapper.
- `OpeningBalanceFields` and `AccountBehaviorNote` are independently reusable
  account components with public barrels, stories, and focused tests.
- All production imports, stories, tests, validation, hook, and mapper types use
  the new ownership paths and names; no consumer imports the old private parts.
- Focused component, mapper, browser integration, structure, story, lint, and
  build checks pass, and unrelated working-tree changes remain intact.
