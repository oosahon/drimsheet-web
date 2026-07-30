# Account Type Selection Dialog Plan

## Goal

Create a reusable `AccountTypeSelectionDialog` container and a separate, pure presentational `AccountTypeSelection` component for picking an account type (Bank account, Petty cash, Virtual account, Credit card) matching the provided design specs and repository rules.

This plan is implementation-ready.

## Context

The application needs an account type selection UI step when users initiate account creation workflows. Per repository rules:

- UI components must separate pure presentation from side effects / container dialogs.
- Presentational UI components live in `src/<feature>/components/<component-name>/`.
- Dialog containers live in `src/<feature>/dialogs/`.
- All text strings must be routed through i18n (`ledger-accounts` namespace).
- Every component must have colocated stories (`*.stories.tsx`) and tests (`*.test.tsx`).

## Confirmed Findings

1. **Strict Presentation / Container Separation**: The dialog container `AccountTypeSelectionDialog` will handle modal wrapper state (`Dialog`, `DialogContent`, `DialogHeader`), while `AccountTypeSelection` will remain a pure UI component rendering the options list, selection card state, icons, and action button.
2. **Component Folder Architecture**: New component belongs in `src/account/components/account-type-selection/` with `types.ts`, `account-type-selection.tsx`, `account-type-selection.stories.tsx`, `account-type-selection.test.tsx`, and `index.ts`.
3. **Dialog Container Architecture**: New dialog container belongs in `src/account/dialogs/account-type-selection.tsx` with colocated test file `account-type-selection.test.tsx`.
4. **Account Behaviors & Options**: Options correspond to standard account behaviors (`Bank`, `PettyCash`, `VirtualAccount`/`DefaultCash`, `CreditCard`) with localized title labels and descriptions matching the design mock.

## Scope

### Expected Changes

- `src/account/components/account-type-selection/types.ts` — Define component contract (`IAccountTypeOption`, `AccountTypeSelectionProps`).
- `src/account/components/account-type-selection/account-type-selection.tsx` — Build pure selection UI with card/radio options list, title, icon slots, descriptions, and Continue button.
- `src/account/components/account-type-selection/account-type-selection.stories.tsx` — Add Storybook stories covering default selection, pre-selected option, and disabled states.
- `src/account/components/account-type-selection/account-type-selection.test.tsx` — Component unit tests for selection clicks, keyboard navigation, and submit callbacks.
- `src/account/components/account-type-selection/index.ts` — Export public component API.
- `src/account/dialogs/account-type-selection.tsx` — Create container dialog that renders `AccountTypeSelection` inside standard `Dialog` component.
- `src/account/dialogs/account-type-selection.test.tsx` — Unit test for dialog open/close and submit pass-through.
- `src/account/i18n/locales/en/ledger-accounts.json` — Add missing translation strings for account type selection headers, options, and actions.

### Out of Scope

- Integrating account creation API form submission logic inside the selection component (selection only notifies container/parent on selection/continue).

## Proposed Approach

### Step 1: Add i18n Translations

- Add translation keys for:
  - `select_account_type_title`: "Select account type"
  - `continue_button`: "Continue"
  - Option labels and descriptions for Bank account, Petty cash, Virtual account, and Credit card.

### Step 2: Build Pure `AccountTypeSelection` Component

- Create `src/account/components/account-type-selection/types.ts` with contract:
  - `value`: selected account type option value.
  - `options`: array of `IAccountTypeOption` (icon, title, description, value).
  - `onChange`: selection change handler.
  - `onContinue`: continue action handler.
  - `disabled`: boolean.
- Implement presentational UI in `account-type-selection.tsx`:
  - Title header ("Select account type").
  - List of selectable cards/radio items with icon placeholder box, title, description, and hover/focus/selected states.
  - Accessible keyboard focus and ARIA selection attribute (`role="radiogroup"`, `role="radio"`).
  - Action row at bottom right with "Continue" button (disabled if no selection, or pre-selecting first option).
- Add Storybook stories in `account-type-selection.stories.tsx`.
- Add unit tests in `account-type-selection.test.tsx`.
- Export barrel in `index.ts`.

### Step 3: Create Container `AccountTypeSelectionDialog`

- Create `src/account/dialogs/account-type-selection.tsx`:
  - Receives `open`, `onOpenChange`, `onContinue` / `onSelectAccountType`.
  - Wraps `AccountTypeSelection` inside `@/shared/components/dialog`.
- Add dialog unit tests in `src/account/dialogs/account-type-selection.test.tsx`.

## Test Plan

- **Unit or component:**
  - Test option rendering, clicking options to select, aria-checked state updating, and calling `onContinue` with selected behavior.
  - Test dialog opening, rendering title, forwarding selection to handler on Continue click, and handling dialog dismissal.
- **Storybook:**
  - Verify stories render cleanly for `AccountTypeSelection`.

## Verification

```bash
npm test -- --run src/account/components/account-type-selection src/account/dialogs/account-type-selection
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

## Completion Criteria

- `AccountTypeSelection` component created under `src/account/components/account-type-selection/` with colocated tests, stories, types, and index.ts.
- `AccountTypeSelectionDialog` created under `src/account/dialogs/account-type-selection.tsx` with colocated test.
- Design matches mock (title, icon block, title, description, continue button).
- Structure check, stories check, unit tests, lint, and build pass cleanly.
