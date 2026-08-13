# Migrate Nav User to Account Management Plan

## Goal

Replace the sidebar `NavUser` dropdown with an accounting-entity avatar on the
right side of every protected-page `AppHeader`. Clicking the avatar opens the
account-management panel shown in the supplied reference: active entity
summary, user email, entity type, account actions, other accounting entities,
and an add-account action.

The plan is implementation-ready. It reuses `useAccountingEntities()` and the
existing `localStorageService` as the accounting-entity source of truth; it does
not add an `_app` account-management container, a selection hook, or another
accounting service. Preserve unrelated staged and working-tree changes during
implementation.

## Context

`NavUserContainer` currently loads the authenticated profile and sidebar state,
then renders a sidebar-specific dropdown. The replacement will move that
responsibility into `AccountingEntityAvatarContainer`: load the user's
accounting entities, read the current accounting-entity ID from local storage,
resolve the current entity, and compose the avatar with the user-owned
`AccountManagementDialog`.

The existing accounting service already writes accounting-entity IDs through
`localStorageService`, and the API interceptor already reads that value for the
`x-accounting-entity-id` request header. The migration will use those existing
contracts directly.

## Confirmed Findings

1. **The existing control is tied to the sidebar.**
   [`src/user/components/nav-user/nav-user.container.tsx`](../../src/user/components/nav-user/nav-user.container.tsx)
   consumes `useSidebar`, while
   [`src/user/components/nav-user/nav-user.tsx`](../../src/user/components/nav-user/nav-user.tsx)
   renders `SidebarMenu` primitives and a side-aligned dropdown.
2. **The current avatar represents the person rather than the accounting
   entity.** It derives initials from `firstName` and `lastName`; the target
   avatar needs the active accounting entity's name, while the panel continues
   to show the authenticated user's email.
3. **`useAccountingEntities()` is the required entity source.** It returns the
   user's accounting entities through `accountingService.getAccountingEntities()`.
   The service already stores the first returned entity ID through
   `localStorageService.setAccountingEntityId()`.
4. **The current entity ID is already available locally.**
   `localStorageService.getAccountingEntityId()` reads `accounting-entity-id`,
   and `setAccountingEntityId()` is the existing write path used by entity
   listing and creation.
5. **The request layer already consumes the selected ID.** The shared API
   interceptor reads `localStorageService.getAccountingEntityId()` and sends
   the result in `x-accounting-entity-id`; no new backend selection contract is
   required.
6. **The header is page-owned.** `AppHeader` appears in account, counterparty,
   and journal-entry pages, while the dashboard currently omits it. A shared
   header-action slot can place the avatar consistently without duplicating the
   user component across feature pages.
7. **The screenshot shows an anchored, non-modal panel.** An end-aligned Radix
   `Popover` matches the reference more closely than the centered shared
   `Dialog` primitive, despite the product-facing `AccountManagementDialog`
   name.
8. **Notifications, feedback, and profile settings have no destination in the
   repository.** Logout, theme switching, accounting-entity listing, and
   accounting-entity creation already exist.
9. **The logout browser tests open the current sidebar dropdown.** Their entry
   sequence and locators must migrate to the header avatar while retaining the
   existing confirmation behavior assertions.
10. **The shared avatar primitive already provides the required presentation
    building blocks.** `src/shared/components/avatar` exports `Avatar` and
    `AvatarFallback`, so this migration does not need a separate pure entity
    avatar component.
11. **The requested container is the deliberate composition point.** Per review
    direction, `AccountingEntityAvatarContainer` will consume the accounting
    hook from the user-owned control instead of introducing an `_app`
    orchestration container.

## Scope

### Expected Changes

- `src/user/components/accounting-entity-avatar/` — add the pure entity avatar,
  its test and Storybook states, the side-effect container, its focused test,
  and `index.ts`.
- `src/user/components/account-management/` — add the pure account-management
  panel, its explicit prop contract, component tests, Storybook states, and
  public `index.ts`.
- `src/user/dialogs/account-management.tsx` — orchestrate the anchored popover,
  data loading, entity selection, and accounting-entity creation while
  rendering the user-owned account-management component.
- `src/user/i18n/locales/en/user.json` — add labels, accessible names,
  loading/empty states, and accounting-entity type copy using flat
  `snake_case` keys.
- `src/_app/i18n/config.ts` and `src/_app/i18n/i18next.d.ts` — register and type
  the new `user` namespace.
- `src/shared/components/app/app.tsx`, its tests, and stories — add an optional
  header-action provider/slot and align that slot at the far inline end.
- `src/_app/layouts/app-layout.tsx` — provide
  `AccountingEntityAvatarContainer` to the shared header-action slot, retain the
  existing logout-dialog render function, and remove the sidebar footer
  injection.
- `src/_app/components/app-sidebar/app-sidebar.tsx` and affected tests/stories —
  remove the now-unused footer contract if no other consumer remains.
- `src/reporting/pages/dashboard.tsx` — add `AppHeader` so the header action is
  also displayed on the dashboard.
- `src/user/components/nav-user/` — remove the obsolete sidebar dropdown,
  container, story, and barrel after imports migrate.
- `playwright/mocks/authenticated-app.ts`,
  `playwright/tests/user/account-management.spec.ts`, and
  `playwright/tests/auth/logout-confirmation.spec.ts` — add multi-entity data
  and cover the new browser composition and logout entry point.

### Conditional Changes

- `src/accounting/dialogs/accounting-entity-creation.tsx` — support an optional
  close callback for the dismissible add-account flow while preserving the
  non-dismissible onboarding flow.
- Other protected pages — add `AppHeader` only where implementation-time route
  inspection finds another page that currently omits it.

### Out of Scope

- Creating an `_app/containers/account-management` orchestration layer.
- Adding a new accounting-entity selection hook or service.
- Rewriting `accountingService.getAccountingEntities()` or replacing its
  existing local-storage behavior.
- Building notification, feedback, or profile-settings screens/services.
- Changing the backend API or generated contracts.
- Redesigning the accounting-entity creation form.

## Proposed Approach

### 1. Create the accounting-entity avatar and container

- Add the pure `AccountingEntityAvatar` and its side-effect container in the
  new directory. The container will:
  1. call `useAccountingEntities()`;
  2. read the current ID with
     `localStorageService.getAccountingEntityId()`;
  3. find the matching entity in the returned list, falling back to the first
     returned entity when local storage has not yet been populated;
  4. render `AccountingEntityAvatar` inside an accessible button and use that
     button as the `AccountManagementDialog` trigger.
- Let the pure `AccountingEntityAvatar` derive uppercase fallback initials from
  its `name` prop. Reuse it in the header trigger and account-management panel,
  and cover multi-word, whitespace, single-word, and empty-name behavior in its
  focused component test.
- Render an equal-size circular skeleton while entity data is loading and a
  disabled, accessibly labelled trigger when no entity can be resolved.
- Accept a plain `onLogoutClick` callback from `AppLayout`; do not pass auth UI
  through the avatar or account-management presentation contracts.
- Pass the resolved entity and trigger to `AccountManagementDialog`; keep
  account switching, profile loading, and account-creation orchestration out of
  the component container.

### 2. Build the user-owned account-management panel

- Implement `AccountManagementDialog` under `src/user/dialogs` using
  `Popover`, `PopoverTrigger`, and end-aligned `PopoverContent`. Constrain its
  width and maximum height, make the account list scrollable, and preserve
  Escape, outside-click, focus return, and keyboard behavior.
- Keep the dialog as an orchestrator: load the profile and entity list, own
  popover/account-creation state, persist account selection through the
  existing local-storage service, and render the pure `AccountManagement`
  component inside `PopoverContent`.
- Implement `AccountManagement` under `src/user/components` to display the
  active entity avatar, name, profile email, translated entity type, actions,
  other accounts, and add-account control. It accepts data, callbacks, and
  composed theme/logout actions without reading external systems itself.
- Reuse the shared theme toggler from the dialog. Close the popover before
  account creation or logout, then notify `AppLayout` to open the separately
  controlled logout confirmation dialog.
- Render feedback and profile settings with disabled semantics until
  destinations are supplied; do not invent routes or no-op handlers.

### 3. Place the control in every app header

- Extend the shared app component with an optional header-actions
  context/provider. `AppHeader` renders the provided React node with
  `margin-inline-start: auto`; without a provider, it retains current behavior.
- In `AppLayout`, provide a compact action group containing the disabled
  notifications affordance and `AccountingEntityAvatarContainer`. Own the
  controlled logout-confirmation state there and pass a plain logout callback
  into the container.
- Remove `NavUserContainer` from `AppSidebar.footer`, remove the unused sidebar
  footer prop, and delete `src/user/components/nav-user` after imports migrate.
- Add `AppHeader` to the dashboard and verify every protected route renders
  exactly one header/account-management trigger.

### 4. Migrate browser behavior and regression coverage

- Add a user-owned Playwright spec with controlled profile and multiple-entity
  responses. Assert that the container resolves the entity whose ID is stored
  by `localStorageService`, the avatar displays its initials, and the panel
  displays its summary and the remaining entities.
- Cover opening, Escape dismissal, outside dismissal, focus return, entity
  selection, local-storage update, reload under the selected
  `x-accounting-entity-id`, and add-account dialog handoff.
- Update the existing logout spec to open account management from the header
  avatar while retaining its cancel, pending, success/history, and failure
  assertions.

## Test Plan

- **Unit/component:** test `AccountingEntityAvatarContainer` with mocked
  external hooks/local-storage service and the real shared avatar: matching
  stored ID, initials, first-entity fallback, loading, missing entities, and
  accessible trigger state. Test `AccountManagement` data rendering and
  callback delegation, and test `AccountingEntityAvatar` initials rendering.
  Extend `AppHeader` tests for action-slot placement and provider absence.
- **Browser integration:** test the real popover composition, active account,
  other-account list, local-storage selection and reload, focus behavior,
  add-account handoff, and migrated logout flow.
- **Regression:** verify breadcrumbs and page-owned header children still
  render, sidebar collapse/mobile behavior works after footer removal,
  onboarding still uses `useAccountingEntities()`, entity creation still stores
  its returned ID, theme switching persists, and protected routes render one
  avatar trigger.

## Verification

Run focused tests first, then structural and broader checks:

```bash
npm test -- --run src/user/components/account-management/account-management.test.tsx src/user/components/accounting-entity-avatar/accounting-entity-avatar.test.tsx src/user/components/accounting-entity-avatar/accounting-entity-avatar.container.test.tsx src/shared/components/app/app-header.test.tsx
npm run typecheck:integration
npm run test:integration -- playwright/tests/user/account-management.spec.ts playwright/tests/auth/logout-confirmation.spec.ts --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Run `npm run test:integration:coverage` when Chromium and the local Vite
integration environment are available. First-party API responses remain
intercepted; no live backend or shared account is required.

## Assumptions

- `AccountManagementDialog` is the product/component name, while its intended
  interaction is the anchored non-modal panel shown in the screenshot.
- “Add a new account” launches the existing accounting-entity creation flow.
- Selecting another entity writes its ID through `localStorageService` and then
  reloads the app so the existing request interceptor and query lifecycle load
  the selected entity's data.
- Unsupported notification, feedback, and profile-settings actions remain
  visible but disabled.

## Risks

- **Local-storage timing:** the entity-list service may populate the ID during
  the query. Resolve the ID on each container render and fall back to the first
  returned entity until the stored value is available.
- **Cross-feature ownership:** the requested user-owned container consumes
  `useAccountingEntities()` directly. Treat this as the explicit composition
  boundary for resolving the header avatar; the user-owned dialog orchestrates
  the related panel data and workflows without adding an `_app` layer.
- **Overlay sequencing:** account management can open logout and
  account-creation dialogs. Complete the popover close lifecycle before opening
  either modal and verify in Playwright that only one overlay remains visible.
- **Header consistency:** headers are page-owned. Audit protected routes, add
  the missing dashboard header, and ensure the provided action renders once.
- **Long names/account lists:** truncate long text, constrain panel height, and
  scroll the entity list.

## Completion Criteria

- `AccountingEntityAvatarContainer` loads entities with
  `useAccountingEntities()`, reads the active ID through
  `localStorageService.getAccountingEntityId()`, and renders the matching
  entity avatar.
- Every protected page displays that avatar at the far right of `AppHeader`.
- Clicking the avatar opens the end-aligned account-management panel and
  displays active entity name, profile email, translated entity type, action
  rows, other accounts, and add-account action.
- Selecting another entity writes its ID through the existing local-storage
  service and reloads under the selected request header; no new selection hook,
  accounting service, or `_app` account-management container is introduced.
- Add account uses the existing creation dialog/service; theme and logout
  retain their existing behavior; unsupported actions are accessibly disabled.
- `NavUser` and the sidebar footer integration are removed with no remaining
  imports; the pure accounting-entity avatar is documented in Storybook and
  reused across the header and account-management panel.
- Focused component and Playwright tests pass, followed by structure, stories,
  lint, and build checks.
- Unrelated files and behavior remain unchanged.
