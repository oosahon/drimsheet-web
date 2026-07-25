# Logout Confirmation Reliability and Test Remediation Plan

## Goal

Fix the confirmed logout reliability and coverage gaps around
`src/auth/dialogs/logout-confirmation.tsx`. Ensure a successful logout removes
authenticated client state, cannot restore protected cached UI through browser
history, and is protected by focused browser-integration coverage.

This plan does not implement the fixes. Preserve unrelated staged and
working-tree changes while implementing it.

## Confirmed Issues

1. **P1 - Successful logout leaves authenticated React Query data available to
   protected routes.** `LogoutConfirmationDialog` awaits `logout()`, closes the
   alert dialog, and navigates to `/auth/signin`, but it does not clear or
   remove authenticated query data before leaving the protected app shell. The
   profile query uses `staleTime: 5 * 60 * 1000`, and the app route tree wraps
   protected routes in `AppLayout` without a local auth guard. A user who logs
   out after the profile query is cached can use browser history or a direct
   route entry to briefly see stale authenticated UI, including the cached nav
   user, even though `authService.removeToken()` has run.
2. **P2 - Logout navigation preserves the protected route in browser history.**
   The dialog calls `navigate('/auth/signin')` after logout. Because this is a
   push navigation, the previous protected route remains the immediate Back
   target. Combined with cached authenticated queries and the unguarded app
   route tree, Back can reopen protected UI after logout instead of keeping the
   user on an unauthenticated route.
3. **P2 - The logout dialog has no browser-integration coverage.** The auth
   Playwright suite covers sign-in, sign-up, password reset, and OAuth flows,
   but there is no spec for opening the logout confirmation dialog from the user
   menu, its alert-dialog accessible name and description, cancel behavior,
   pending/disabled state, successful logout request, post-logout navigation,
   failed logout error handling, or stale-cache/history protection.

## Scope

Expected implementation files:

- `src/auth/dialogs/logout-confirmation.tsx`
- `playwright/tests/auth/logout-confirmation.spec.ts`
- `playwright/mocks/authenticated-app.ts`

Conditional files:

- `src/auth/hooks/use-logout.ts` if the cache-clearing contract belongs in the
  mutation hook rather than the dialog.
- `src/_app/index.routes.tsx` or a new auth-guard component if route-level
  protection is needed to prevent direct access to protected routes after logout.
- `src/user/hooks/use-profile.ts` only if profile queries should be disabled
  when `authService.isLoggedIn()` is false.
- `src/shared/hooks/use-api-error-handler.ts` only if logout failure toasts
  require a new or adjusted API error key.

Avoid changing shared `AlertDialog`, `DropdownMenu`, or `Button` primitives
unless the composed logout interaction cannot express the required semantics
through their existing props.

## Implementation Order

### Phase 1: Clear authenticated client state on logout success

- Add access to the React Query client at the logout orchestration boundary.
- After `logout()` resolves and before navigating away, remove or clear
  authenticated queries that can expose user/accounting data, including
  `['userService.getProfile']`.
- Prefer a narrow helper or hook-owned mutation side effect if the same
  post-logout cleanup will be reused outside this dialog.
- Keep the dialog open and delegate errors to `useApiErrorHandler(error, {
showToast: true })` when the logout request rejects.

### Phase 2: Prevent protected history restoration

- Change the success navigation to replace the current entry with the sign-in
  route.
- Add or update protected-route guarding if a direct visit to `/dashboard` or
  another app route remains possible after `authService.isLoggedIn()` becomes
  false.
- Ensure the guard does not redirect authenticated users away from valid app
  routes during normal token initialization.

### Phase 3: Add Playwright integration coverage

- Create `playwright/tests/auth/logout-confirmation.spec.ts` using
  `@integration/fixtures/test`.
- Extend `registerAuthenticatedAppRoutes` with a mocked
  `**/api/v1/auth/logout` route or provide a focused helper that each logout
  spec can configure.
- Cover opening the user menu and launching the alert dialog by accessible role
  and name.
- Assert the alert dialog exposes the translated title and description, Cancel
  closes it without calling the logout endpoint, and keyboard dismissal/focus
  behavior remains usable.
- Cover pending logout by delaying the route fulfillment and asserting the
  action label changes to "Logging out...", Cancel and Log out are disabled,
  and only one logout request is made.
- Cover successful logout by asserting the request is sent, the app navigates to
  `/auth/signin` with history replacement, and browser Back or direct navigation
  does not restore cached authenticated UI.
- Cover failed logout by fulfilling the endpoint with an API error, asserting
  the toast is shown, the dialog remains open or the user remains authenticated
  as designed, and the route does not change to sign-in.

### Phase 4: Focused verification

- Run the new logout Playwright spec:

```bash
npm run test:integration -- playwright/tests/auth/logout-confirmation.spec.ts
```

- Run the integration type check:

```bash
npm run typecheck:integration
```

- Run the app build once unrelated existing TypeScript fixture/API errors are
  cleared:

```bash
npm run build
```

## Acceptance Criteria

- Successful logout removes local auth state and authenticated query data before
  navigation.
- Sign-in navigation after logout uses history replacement.
- Browser Back and direct protected-route entry after logout do not expose
  cached authenticated user UI.
- Logout failure keeps the user in the authenticated context and reports the
  API error through the existing toast path.
- The logout confirmation dialog is covered by Playwright tests for accessible
  dialog semantics, cancel, pending, success, failure, and stale-cache/history
  behavior.
