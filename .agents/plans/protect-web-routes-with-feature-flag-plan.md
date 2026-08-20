# Protect Web Routes With Feature Flags Plan

## Goal

Introduce a reusable feature-flag route wrapper that accepts a typed array of
required flag keys and renders its children only when every required flag is
enabled. Apply it to the authenticated application route element with Alpha 1,
while leaving the complete `/auth/*` route branch unwrapped.

Use one shared `FeatureNotAvailable` component for both client-side flag denial
and Core feature-flag API failures. Update the default application error
boundary so any thrown Core error whose `errorKey` starts with
`feature_flag_error_` renders this component instead of the generic unexpected
error fallback.

The plan is implementation-ready. In this iteration, **Request access** is
intentionally a presentational button with no handler. Its later endpoint-based
workflow is out of scope. Preserve all unrelated staged and working-tree
changes during implementation.

## Context

`src/_app/index.routes.tsx` currently has two top-level branches. Dashboard,
accounts, counterparties, and transaction routes share one authenticated route
element; `/auth/*` is its sibling. This allows Alpha 1 to be applied once around
the authenticated route element without introducing auth exceptions.

The web already exposes Alpha 1 as `featureFlagKeys.accessAlpha1` and evaluates
it with `useCanAccessAlpha1`. LaunchDarkly starts anonymously and is later
identified with the authenticated `/users/profile` response. Core intentionally
leaves the profile and auth endpoints outside feature protection, while the
accounting, ledger, account, counterparty, and journal endpoints used by the app
are protected.

Thrown Axios errors are normalized by `parseApiError`, and
`DefaultErrorBoundary` currently sends every error to the same delayed generic
fallback. The staged generated changes add
`feature_flag_error_forbidden`, establishing the API error-key prefix needed by
the specialized fallback.

## Confirmed Findings

1. **Route-element wrapping matches the existing route tree.** The common
   authenticated route element can be composed as authentication, feature
   access, then application UI. The sibling auth route object remains outside
   the wrapper by construction.
2. **The current authenticated layout issues protected requests before its
   children render.** `ProtectedAppLayout` starts the accounting-entities and
   active-entity queries. That bootstrap must move inside the allowed side of
   the new wrapper; otherwise a denied user can trigger Core 403 responses
   before the client-side guard decides access.
3. **An array wrapper needs an explicit hook-safe evaluation strategy.** Calling
   `useBoolVariation` in a loop over a variable-length array would violate the
   Rules of Hooks. The wrapper must evaluate keys through a stable registry or
   one keyed child component per flag.
4. **API errors already have one normalization boundary.**
   `src/shared/lib/api/errors.ts` extracts `kind`, status, and `errorKey` from
   unknown/Axios errors. Feature-flag classification belongs beside this parser
   rather than being reimplemented inside the error-boundary JSX.
5. **The specialized fallback must precede the generic fallback.** The existing
   `DefaultErrorFallback` does not inspect the API error key. It also accepts an
   optional custom fallback at the boundary level, so fallback resolution must
   explicitly guarantee that a `feature_flag_error_*` error uses
   `FeatureNotAvailable` before considering custom or generic fallbacks.
6. **The unavailable UI is a shared state.** It is consumed by both the route
   wrapper and the global error boundary, so it belongs in
   `src/shared/components` and its copy belongs in the existing `shared` i18n
   namespace.
7. **Integration tests need deterministic LaunchDarkly responses.** Once the
   wrapper is active, existing authenticated browser tests cannot depend on a
   developer `.env`, live LaunchDarkly state, or the hook's default `false`.

## Scope

### Expected Changes

- `src/shared/hooks/use-feature-flag.ts` and its test — expose a typed feature
  flag key contract and a generic single-key evaluation hook while preserving
  the Alpha 1 convenience hook if it remains useful.
- `src/shared/components/feature-not-available/` — add the pure shared
  unavailable component, public barrel, Storybook story, and focused component
  test.
- `src/shared/i18n/locales/en/shared.json` — add the unavailable heading,
  description, exact **Request access** label, and any accessible label to the
  existing namespace.
- `src/_app/containers/feature-flag-guard/` — add the route-element guard and
  focused container tests. It accepts a readonly array of typed flag keys and
  coordinates loading, failure, denial, and allowed children.
- `src/_app/containers/launchdarkly/` and `src/_app/index.tsx` — expose signed-in
  context synchronization status to the wrapper without blocking auth routes.
- `src/_app/index.routes.tsx` — wrap the authenticated application element with
  Alpha 1; keep `authRoutes` as an unwrapped sibling.
- `src/_app/layouts/protected-app-layout.tsx` and
  `src/_app/layouts/app-layout.tsx` — make the former responsible for
  authentication and move accounting bootstrap/loading into the latter so
  protected APIs mount only after the flag wrapper permits access.
- `src/shared/lib/api/errors.ts` and `errors.test.ts` — add and test one
  `feature_flag_error_*` classifier based on normalized API errors.
- `src/_app/containers/error-boundary/error-boundary.tsx` and its test — route
  matching Core feature-flag errors to `FeatureNotAvailable` while retaining
  the generic fallback for every other failure.
- `.env.integration`, `playwright/fixtures/test.ts`, and a focused
  `playwright/mocks/launchdarkly.ts` helper — provide an integration-only dummy
  client ID and locally intercepted allowed/denied flag responses.
- `playwright/tests/app/feature-flag-protection.spec.ts` — cover client denial,
  API-error fallback, allowed routes, and auth-route exclusion.

### Out of Scope

- Any change to `drimsheet-core`, its configuration, tests, or generated
  artifacts.
- Regenerating or manually editing the staged generated API client and
  API-error translation.
- Adding a new feature folder or i18n namespace for the unavailable state.
- Implementing the future access-request endpoint call, request state, success
  or failure feedback, or the admin-review workflow. A later iteration will
  submit the authenticated user's ID and requested feature-flag key for manual
  review and access granting.
- Removing Core's feature middleware. The web wrapper improves navigation and
  UX; Core remains the authoritative security boundary.
- Per-route flag metadata, OR/threshold flag policies, sidebar filtering, or a
  general entitlement framework beyond the typed all-required array contract.

## Proposed Approach

### 1. Add the shared unavailable component

- Create `FeatureNotAvailable` under `src/shared/components` using existing
  `Button`, design tokens, and the `shared` translation namespace.
- Keep it presentation-only. It should render a responsive `main` landmark,
  level-one heading, short description, and one semantic **Request access**
  button. For this iteration, render it as `type="button"` with no click handler,
  navigation, API access, notifications, or application configuration.
- Add a colocated story for the default and long-copy/responsive states and a
  component test for the accessible structure and inert button contract.
- Do not add or register a new translation namespace.

### 2. Implement a typed feature-flag route wrapper

- Define a `UFeatureFlagKey` contract from the values of `featureFlagKeys`, then
  expose a generic single-key `useFeatureFlag(flagKey)` hook that defaults to
  `false`. Existing named hooks may delegate to it.
- Add an `_app` route wrapper with this public shape:

  ```tsx
  <FeatureFlagGuard flagKeys={[featureFlagKeys.accessAlpha1]}>
    <AppLayout />
  </FeatureFlagGuard>
  ```

- Treat `flagKeys` as an all-required policy: an empty array renders children,
  every resolved `true` renders children, and the first resolved `false`
  renders `FeatureNotAvailable` without mounting the protected child tree.
- Evaluate a variable number of flags without calling hooks in a loop. Use a
  recursively keyed private checker (one hook per mounted checker) or an
  equivalent stable registry of all supported flags. Do not use the deprecated
  `useFlags` API merely to make the array convenient.
- Consume signed-in LaunchDarkly synchronization status in the wrapper. Show
  `FullPageLoader` while the authenticated context is being identified, throw a
  synchronization failure to the existing error boundary, and treat only a
  successfully resolved `false` value as access denial. This avoids flashing
  the denied component for allowed users during anonymous initialization.
- Keep LaunchDarkly synchronization non-blocking for the route tree as a whole;
  only `FeatureFlagGuard` consumes its status, so auth pages render regardless
  of flag initialization or denial.

### 3. Compose authentication, flags, and protected app bootstrap in order

- Update the shared authenticated route element to compose:

  ```text
  ProtectedAppLayout (authentication)
    -> FeatureFlagGuard ([accessAlpha1])
      -> AppLayout (accounting bootstrap and protected UI)
  ```

- Leave `authRoutes` unchanged as the sibling route object. No auth page or auth
  route element should import or render `FeatureFlagGuard`.
- Reduce `ProtectedAppLayout` to its authentication redirect and child render.
  Move its accounting-entities and active-entity query/loading orchestration to
  `AppLayout`. Because `AppLayout` is now mounted only after all required flags
  pass, denied users issue no protected accounting bootstrap requests.
- Apply Alpha 1 once to the current protected branch. Future routes requiring a
  different flag set can wrap their route element with another
  `FeatureFlagGuard` rather than adding conditionals to the global layout.

### 4. Specialize the error boundary for Core feature-flag errors

- Add `isFeatureFlagApiError(error: unknown)` beside `parseApiError`. It should
  return `true` only for a normalized server response whose non-empty
  `errorKey` starts with `feature_flag_error_`; non-Axios, network, client, and
  other Core failures return `false`.
- Change error-boundary fallback resolution to inspect the thrown error first:
  1. feature-flag API error → shared `FeatureNotAvailable`;
  2. caller-supplied fallback, when present;
  3. existing delayed generic fallback.
- Keep the existing Axios `onError` handling so unauthorized routing and API
  breadcrumbs continue to work, while avoiding duplicate manual reporting.
- Render the same shared component used by the client-side wrapper, including
  the intentionally inert **Request access** button, so client denial and a
  backend 403 converge on one user experience.
- Do not classify by HTTP 403 alone. Only the stable `feature_flag_error_*`
  prefix should trigger the unavailable component; unrelated authorization
  errors must continue through their existing handling.

### 5. Make LaunchDarkly deterministic in browser integration and test both paths

- Register LaunchDarkly evaluation/stream/event interception in the shared
  Playwright fixture before navigation. Default Alpha 1 to `true` so existing
  authenticated journeys preserve their behavior, and provide a per-spec
  option for `false`.
- Set an explicit non-secret client ID in `.env.integration` so CI and local
  runs never inherit a real developer environment or contact live LaunchDarkly.
- Test client-side denial at representative protected URLs across each current
  branch. Assert the URL is retained, `FeatureNotAvailable` is visible,
  protected content is absent, and protected accounting endpoints are not
  requested.
- With the client flag allowed, return a Core error such as
  `{ errorKey: 'feature_flag_error_forbidden' }` from the accounting bootstrap
  and assert the error boundary renders the same unavailable component instead
  of the generic fallback.
- Verify a non-feature API error still renders the generic boundary, allowed
  users reach the normal app, and `/auth/signin` plus another auth child remain
  usable when Alpha 1 is false.

## Test Plan

- **Component:** test `FeatureNotAvailable` through its public barrel for its
  landmark, heading, translated copy, exact action label, button type, and lack
  of navigation or callback behavior. Document it with a colocated Storybook
  story.
- **Wrapper/container:** cover no flags, one allowed flag, multiple allowed
  flags, any denied flag, synchronization loading/failure, and the guarantee
  that denied children never mount.
- **Hook/API utility:** test generic flag-key evaluation and feature-error
  classification for matching prefixes, unrelated 403s, missing keys,
  non-Axios errors, and network errors.
- **Error boundary:** verify `feature_flag_error_*` takes precedence over the
  generic and optional custom fallback, while all other errors retain existing
  behavior and Axios handling.
- **Browser integration:** cover the client wrapper, server-error fallback,
  allowed authenticated route, auth bypass, and absence of protected API calls
  on client denial.
- **Regression:** run all existing authenticated integration journeys with the
  default allowed flag mock and the complete Vitest suite.

## Verification

Run focused checks first, followed by the broad checks justified by changing
the root route, global error boundary, and Playwright fixture:

```bash
npm test -- --run src/shared/components/feature-not-available/feature-not-available.test.tsx
npm test -- --run src/_app/containers/feature-flag-guard/feature-flag-guard.container.test.tsx
npm test -- --run src/shared/lib/api/errors.test.ts src/_app/containers/error-boundary/error-boundary.test.tsx
npm test -- --run src/_app/containers/launchdarkly/launchdarkly-context-synchronizer.container.test.tsx src/shared/hooks/__tests__/use-feature-flag.test.ts
npm run typecheck:integration
npm run test:integration -- playwright/tests/app/feature-flag-protection.spec.ts --project=chromium
npm test -- --run
npm run test:integration
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

The Playwright commands require a local Chromium binary or CI's configured
Chrome channel. All first-party and LaunchDarkly outcomes must be intercepted;
the suite must not require Core, LaunchDarkly, or developer credentials.

## Assumptions

- Every key in `flagKeys` is required. An empty array permits the wrapped
  element, and the wrapper denies when any configured flag resolves to `false`.
  If future routes need OR logic, add an explicit policy prop rather than
  changing this default implicitly.

## Risks

- **Dynamic flag arrays can break hook ordering.** Mitigate with one hook per
  keyed child checker or a static supported-flag registry; never call hooks in
  `map`, `every`, or a variable loop.
- **Anonymous LaunchDarkly state can look like denial.** Mitigate by waiting for
  authenticated context synchronization before interpreting the fail-closed
  boolean value.
- **Protected queries can race the wrapper.** Mitigate by mounting accounting
  bootstrap only inside the allowed child tree. Core remains authoritative for
  stale client state and direct requests.
- **Prefix matching can hide unrelated failures if too broad.** Require a
  normalized server-response error and the exact `feature_flag_error_` prefix;
  do not specialize every 403.
- **Specialized fallback behavior can drift between client and server paths.**
  Reuse the same shared component in both paths.
- **Browser tests can accidentally use live LaunchDarkly.** Use a dummy
  integration client ID and fixture-level interception registered before every
  navigation.

## Completion Criteria

- The authenticated route element is wrapped with
  `flagKeys={[featureFlagKeys.accessAlpha1]}` and renders protected children only
  when Alpha 1 resolves to `true` for the synchronized signed-in context.
- The wrapper supports typed arrays, requires all supplied flags, permits an
  empty array, follows the Rules of Hooks, and never mounts denied children.
- `/auth/*` remains an unwrapped sibling and works when Alpha 1 is false or
  still initializing; logged-out protected URLs still redirect to sign-in.
- Denied users see the translated shared `FeatureNotAvailable` component with a
  visible, intentionally inert **Request access** button and issue no protected
  accounting bootstrap requests.
- No access-request network call, user/flag submission, notification, or admin
  workflow is introduced in this iteration.
- A thrown normalized API error with a `feature_flag_error_*` key renders the
  same shared component through `DefaultErrorBoundary`; unrelated 403s and
  other errors retain the generic/custom fallback behavior.
- The existing `shared` i18n namespace is used; no new namespace or feature
  folder is introduced.
- LaunchDarkly browser behavior is deterministic and no integration test
  contacts live LaunchDarkly or depends on a developer `.env`.
- Focused tests, full Vitest and Playwright suites, structure/story checks,
  lint, and build pass.
- `drimsheet-core`, staged generated changes, and unrelated files remain
  unchanged.
