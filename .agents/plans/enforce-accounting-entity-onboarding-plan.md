# Enforce Accounting Entity Onboarding Plan

## Goal

Ensure an authenticated user without an accounting entity is shown an
accessible, reliable, and recoverable onboarding dialog, using an accounting API
query rather than local storage to decide whether onboarding is required.

This plan is implementation-ready. Preserve the existing modification to
`src/_app/layouts/app-layout.tsx` and all unrelated staged or working-tree changes
during implementation.

## Context

`AppLayout` mounts the sidebar, routed `Outlet`, and
`OnboardingManagerContainer` as siblings. For the MVP, this composition remains
unchanged: the controlled modal dialog cannot be dismissed while onboarding is
required. The manager currently uses `useAccountingEntities` to query the user's
accounting entities and opens `AccountingEntityCreationDialog` when the result is
empty. The dialog composes profile, currency, jurisdiction, and create-entity
queries with a three-step form.

Repository rules assign container and component contracts to colocated Vitest
tests, and composed dialog, focus, portal, routing, and controlled-network
behavior to Playwright specs under `playwright/tests/<feature>/`.

## Confirmed Findings

1. **P1 — Profile loading can produce an invalid accounting-entity name.**
   `src/accounting/dialogs/accounting-entity-creation.tsx` permits submission
   before `useProfile` resolves and interpolates optional profile fields. A fast
   submission can send `"undefined undefined"` as the entity name.
2. **P2 — Required configuration readiness is not represented by the form.**
   Currency and jurisdiction results default to empty arrays while the form
   starts with valid-looking NG/NGN defaults. The user can progress and submit
   before the lookups resolve, and a currency-query failure is not distinguished
   from an empty result.
3. **P2 — The accounting-entity selector is not associated with its visible
   label.** The label targets `individual-entity`, but the select trigger has no
   matching ID. Its error is also not connected through `aria-describedby` and
   `aria-invalid`.
4. **P2 — Wizard transitions do not preserve accessible context.** Replacing the
   step subtree removes the focused Next or Back button without moving focus to
   the new step or announcing the step change. The steps also lack a programmatic
   step heading/status.
5. **P2 — Existing tests do not protect the composed onboarding outcome.** The
   manager unit test replaces the dialog with a `data-testid` stub and never
   exercises `done`. There are no Playwright onboarding specs covering the real
   dialog portal, focus, request contracts, failure recovery, or successful
   refetch and closure.
6. **Eligibility must not be inferred from local storage.** Local storage can be
   empty, stale, or user-modified and is not an authoritative record of whether
   the authenticated user owns an accounting entity. `useAccountingEntities`
   already queries the user-entity list endpoint and is the appropriate source
   for the onboarding decision. `useAccountingEntity` is suitable only if the
   product changes the decision to depend on one active entity instead of the
   user's entity collection.

## Scope

### Expected Changes

- `src/onboarding/components/onboarding-manager/` — keep
  `useAccountingEntities` as the sole onboarding-eligibility source, avoid any
  local-storage eligibility check, and add focused tests for its query states and
  completion/refetch behavior.
- `src/accounting/dialogs/accounting-entity-creation.tsx` — gate the form on
  profile and lookup readiness, handle recoverable failures, and await successful
  completion/refetch behavior.
- `src/accounting/components/accounting-entity-creation-form/` — add readiness
  contracts, accessible step semantics and focus management, and expand component
  coverage.
- `src/accounting/components/accounting-entity-type-select/` — associate the
  visible label and error with the combobox and prevent unsupported choices from
  behaving as available options.
- `playwright/tests/onboarding/` — add frontend integration coverage for the
  eligibility decision and complete dialog journey.
- `playwright/mocks/` or `playwright/factories/` — add onboarding-specific
  network setup only if repeated response registration justifies extraction.

### Conditional Changes

- `src/shared/components/select/` or `src/shared/components/field/` — change only
  if their existing public contracts cannot express the required accessible-name
  and error relationships without a shared fix.
- Accounting i18n locale resources — update if new loading, error, retry, or step
  status copy is introduced; keep keys flat, semantic, and feature-owned.

### Out of Scope

- Backend authorization implementation and system E2E coverage against a real
  API or database.
- General redesign of the accounting setup wizard or support for the entity
  types currently marked as coming soon.
- Unrelated account, reporting, sidebar, or authentication refactors.
- Moving onboarding above the app shell or conditionally unmounting the sidebar
  and routed `Outlet`; the current non-dismissible modal composition is accepted
  for the MVP.
- Changing how the selected accounting-entity ID is transported for normal
  entity-scoped API requests. This plan removes local storage from the
  onboarding eligibility decision, not necessarily from active-entity selection.

## Proposed Approach

### 1. Keep onboarding eligibility query-backed

- Retain `useAccountingEntities` in `OnboardingManagerContainer` as the
  authoritative eligibility query because onboarding depends on whether the user
  has any entities and the list request does not require a preselected entity.
- Do not read the accounting-entity ID from local storage to decide whether to
  open or close onboarding.
- Keep the dialog closed while the eligibility query is pending, open it only
  for a successful empty result, and retain existing error-boundary behavior for
  query failures unless a dedicated retry state is added later.
- After creation, refetch the same entity-list query and close the controlled
  dialog only when the query returns a non-empty result.

### 2. Make dialog dependencies explicit and recoverable

- Model profile, currency, and jurisdiction pending/error states instead of
  defaulting unresolved results to usable empty arrays.
- Disable progression and submission until the authoritative profile and
  configuration data have loaded successfully.
- Construct the entity name only from a validated profile. Do not submit a
  fallback containing missing values.
- Preserve the current step and entered values after create failures, show the
  mapped API error, and permit a single retry after the mutation settles.
- Await the post-create refresh. Close the dialog only after the entity-list
  query confirms the newly created entity.

### 3. Repair the wizard's accessibility contract

- Give the entity select trigger a stable accessible-name relationship to its
  label and connect visible errors with `aria-invalid` and `aria-describedby`.
- Mark unsupported entity types disabled, or remove them from the interactive
  option list while retaining appropriate explanatory copy.
- Give each wizard step a programmatic heading and step indicator. After Next or
  Back, place focus on the new step heading or first relevant control.
- Ensure keyboard-only navigation works through selects, comboboxes, calendars,
  radio buttons, and navigation controls.
- Verify the required controlled dialog remains non-dismissible through Escape,
  outside click, and the absence of a close control.
- Respect reduced-motion preferences for step transitions if the existing
  animation utilities do not already do so.

### 4. Strengthen component and container coverage

- Extend the manager tests to cover pending, empty, non-empty, query failure, and
  successful `done` to refetch orchestration, with no local-storage dependency.
- Add dialog/container tests for profile and lookup readiness, creation success,
  creation rejection, retained state, duplicate-submit prevention, and the
  completion callback.
- Expand form tests for validation boundaries, country-derived currency,
  accounting standard and fiscal dates, retained values across navigation,
  warning states, focus movement, accessible errors, and valid submit payloads.
- Expand selector tests to assert its accessible name, error relationship, and
  disabled unsupported options.

### 5. Add onboarding browser integration coverage

- Create direct specs under `playwright/tests/onboarding/`, importing `test` and
  `expect` from `@integration/fixtures/test`.
- Intercept all first-party requests before navigation and use the real app,
  routes, providers, dialog portal, and form components.
- Keep one-off responses in the specs; extract onboarding mocks or factories
  only after repeated setup has a real consumer.

## Test Plan

- **Unit and component:** Verify manager state orchestration; dependency
  readiness and failure behavior; a single create request; retained form state;
  country-derived values; validation boundaries; accessible label/error
  relationships; step focus; disabled unsupported options; and the exact valid
  submit payload in colocated `*.test.tsx` files.
- **Browser integration:** Under `playwright/tests/onboarding/`, cover an existing
  entity bypassing onboarding; an empty list opening the required dialog;
  a delayed entity lookup not opening the dialog prematurely; initial focus,
  focus trapping, keyboard navigation, step focus, and non-dismissability;
  successful creation with POST payload, entity-list refetch, closure, and app
  availability; creation failure with retained input and successful retry;
  delayed or failed profile/configuration dependencies; direct `/accounts`
  navigation without an entity showing onboarding; and reload after successful
  onboarding.
- **Regression:** Existing authenticated users with an entity continue to reach
  `/dashboard` and `/accounts`; logout remains available and clears query state;
  existing authentication Playwright specs remain independently runnable.

## Verification

Run focused unit and browser checks first, then repository-wide structural and
static checks:

```bash
npm test -- --run src/onboarding/components/onboarding-manager src/accounting/components/accounting-entity-creation-form src/accounting/components/accounting-entity-type-select
npm run typecheck:integration
npm run test:integration -- playwright/tests/onboarding --project=chromium
npx playwright test --list
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Run `npm run test:integration:coverage` when Chromium coverage artifacts are
required. Browser verification depends on an installed Playwright Chromium
binary but must not depend on a live API, database, identity provider, or shared
account.

## Assumptions

- The user-entity list endpoint is the authoritative frontend signal for whether
  onboarding is required. This matches the current `useAccountingEntities`
  implementation and avoids relying on local storage.
- A successfully created entity is returned by the immediate entity-list
  refetch. If the backend is eventually consistent, the completion contract will
  need an explicit bounded retry or the create response must seed the query.

## Open Decisions

- **Dependency failure UX:** Choose inline retry within the dialog or a dedicated
  onboarding error screen. Both keep the app blocked; a dedicated state is
  clearer when profile or jurisdiction data cannot load at all.
- **Entity name authority:** Choose between deriving the name from a loaded
  profile in the client and having the API derive it from authenticated user
  data. Server derivation removes the client race and is the stronger integrity
  boundary but requires backend work.

## Risks

- Refetch failure after a successful create could leave the user blocked even
  though an entity now exists. Preserve the create result, provide retry, and
  define the authoritative completion rule explicitly.
- Focus management can conflict with Radix dialog auto-focus and portalled
  combobox/calendar content. Verify with real-browser keyboard tests rather than
  relying only on DOM unit tests.
- Local storage can still contain an active entity ID used by other API requests.
  Keep that concern separate from onboarding eligibility and verify tests do not
  accidentally make the dialog decision depend on stored state.

## Completion Criteria

- The current app-shell composition remains unchanged for the MVP.
- Onboarding eligibility is determined by `useAccountingEntities` and not by a
  local-storage accounting-entity ID.
- Users with a successful empty entity-list result receive a non-dismissible,
  keyboard-operable, accessibly named onboarding flow.
- Profile and configuration dependencies cannot produce an invalid or premature
  create request.
- Successful creation refreshes the authoritative entity-list state and closes
  the dialog; failure retains user input and supports a single safe retry.
- Labels, errors, wizard steps, focus transitions, and unsupported choices have
  correct accessible semantics.
- The specified colocated Vitest and `playwright/tests/onboarding/` scenarios
  pass, followed by integration typechecking, structure, stories, lint, and
  build checks.
- Existing authenticated-user, route, and logout behavior remains intact, and
  unrelated files remain unchanged.
