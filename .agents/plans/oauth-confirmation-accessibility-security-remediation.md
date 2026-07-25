# OAuth Confirmation Accessibility, Security, and Test Remediation Plan

## Goal

Fix the confirmed callback-state, credential-handling, browser-history, and
accessibility issues in `src/auth/pages/oauth-confirmation.tsx` and the
components that compose its route. Replace the bearer-token URL contract with a
server-verified completion flow and add focused Playwright browser-integration
coverage at the page boundary defined by the repository testing rules.

This plan does not implement the fixes. Preserve the existing staged and
working-tree changes while implementing it, including the current
`FullPageLoader` accessibility work.

## Confirmed Issues

1. A missing or empty `access_token`, or an OAuth denial/error callback, leaves
   the user on the full-page loader forever with no explanation or recovery
   action.
2. The page accepts any non-empty `access_token` query value, immediately marks
   the browser as logged in, and navigates to the dashboard without a
   server-verified completion step. A crafted callback URL can therefore create
   false authenticated UI state even though protected API requests should later
   fail.
3. The OAuth bearer token is delivered in the URL. It is present in the initial
   browser request and can be retained by browser history, infrastructure logs,
   copied URLs, diagnostics, and same-origin referrer data.
4. Success navigation uses a push rather than a replacement. Pressing Back can
   restore the token-bearing callback URL and execute the completion effect
   again; React Strict Mode can also run the unguarded effect more than once
   before the route unmounts.
5. The route renders a loader status but no `main` landmark or page-owned busy
   state, so assistive-technology users cannot identify the status as the
   primary page operation.
6. There is no browser-integration coverage for the OAuth confirmation route,
   including pending, success, failure, malformed input, history cleanup,
   one-call behavior, or accessibility semantics.

## Scope

Expected frontend implementation files:

- `src/auth/pages/oauth-confirmation.tsx`
- `src/auth/i18n/locales/en/auth.json`
- `src/auth/lib/services/auth.service.ts` if a named OAuth-completion operation
  is added
- `playwright/tests/auth/oauth-confirmation.spec.ts`

Conditional frontend files:

- `src/auth/hooks/use-complete-google-oauth.ts` if the completion request is
  exposed through React Query rather than orchestrated directly by the page
- A colocated service or hook test if either owner gains new branching behavior
- Generated API client files only through the repository API-generation
  workflow when the approved backend contract adds a dedicated exchange
  endpoint
- `playwright/mocks/authenticated-app.ts` only if the existing authenticated
  route mocks need a small reusable extension

The current staged changes already give `FullPageLoader` a localized status,
decorative logo, and reduced-motion behavior. Do not redesign that component or
duplicate its existing component tests unless its public contract changes
again.

Do not add a Testing Library test for `OAuthConfirmationPage`; routing,
history, browser storage, initial network requests, and composed status
semantics belong in Playwright.

## Selected Backend Contract

The frontend and backend will use the refresh-cookie contract. After Google
verification, the backend sets the existing secure, HTTP-only refresh cookie
and redirects to the clean client URL `/auth/oauth-confirmation`. The page calls
the existing refresh-access-token endpoint to obtain an in-memory access token.

Do not replace `access_token` with another reusable bearer credential in the
query string or fragment.

The backend remains responsible for Google state/nonce validation, authorization
code and PKCE handling where applicable, secure refresh-cookie attributes,
token signature and audience validation, replay resistance, and safe redirect
allowlisting. Frontend URL cleanup is not a substitute for those controls.

## Implementation Order

### Phase 1: Replace query-token trust with server-verified completion

Refactor `OAuthConfirmationPage` so it never calls
`authService.setToken(searchParams.get('access_token'))`.

- For the selected cookie contract, invoke the existing
  `authService.getAccessToken` operation, which obtains the access token from
  `/auth/refresh-access-token` using the HTTP-only cookie.
- Keep network transport and token persistence in the auth service. Let the
  page own pending state, error handling, toasts, and navigation.
- Treat a legacy `access_token` parameter as untrusted input: do not store,
  decode, display, log, or forward it.
- Do not use client-side JWT decoding as proof that a callback succeeded; only
  the server-verified completion response can establish authenticated state.
- Preserve the existing access-token design: access tokens remain in memory and
  the existing login marker is set only after verified completion succeeds.

If a temporary compatibility window is unavoidable, the backend must support
both redirect contracts while the frontend accepts only the new contract.
Never add a client fallback that trusts the legacy URL token.

### Phase 2: Make every callback state terminate predictably

Give the effect explicit success and failure outcomes and guard it against
duplicate execution.

- Add a one-call guard following the established complete-sign-up page pattern
  so React Strict Mode cannot start completion twice.
- On successful verified completion, navigate to `/dashboard` with
  `{ replace: true }`.
- On a failed refresh, route to `/auth/signin` with `{ replace: true }` and show
  one localized, actionable error.
- Reject any callback query parameters, including provider errors and legacy
  access tokens, without attempting completion. Replace the callback with
  `/auth/signin` and show the same safe failure feedback.
- Never render provider-supplied `error_description`, tokens, codes, or other
  query values in a toast or page. Use an owned generic translation.
- Route all server failures through `useApiErrorHandler` only when its messages
  are appropriate for authentication completion. Otherwise map the outcome to
  the owned generic OAuth failure message.

Keep error handling deterministic: the page must not remain busy after any
terminal result, even if navigation is delayed or rejected during a test.

### Phase 3: Remove callback credentials and stale state from history

- Use replacement navigation for every success and failure outcome.
- Ensure the approved backend redirect contains no bearer token.
- Confirm that Back returns to the page visited before the OAuth callback and
  cannot replay completion.
- Confirm that a crafted legacy `?access_token=` URL neither sets
  `localStorage.isLoggedIn` nor reaches the dashboard.
- Do not put callback parameters in application logs, observability context,
  toast messages, test report titles, screenshots, or committed fixtures.

Use non-secret sentinel values in tests. Infrastructure log retention and
redaction for the legacy endpoint require a separate operational check because
the frontend cannot remove credentials already received by a server.

### Phase 4: Give the pending route page semantics

Compose the existing `FullPageLoader` as the page's primary status:

- Wrap it in one `main` landmark.
- Set `aria-busy="true"` while verified completion is pending.
- Continue to pass the localized "Completing sign in" label to
  `FullPageLoader`.
- Keep the loader's polite `status`, decorative image, and reduced-motion
  behavior.
- Do not add an assertive live region; the automatic callback operation does
  not warrant interrupting the current screen-reader announcement.

If the final design renders an in-page failure instead of redirecting, remove
the busy state, provide an `h1`, describe the failure in plain language, and
offer a keyboard-operable link to sign in. Do not leave a status role active
after completion has failed.

## Test Plan

### OAuth confirmation Playwright integration tests

Create `playwright/tests/auth/oauth-confirmation.spec.ts` and import `test` and
`expect` from `@integration/fixtures/test`.

Register the completion/refresh interception before navigation because the
request starts on page mount. Keep one-off callback values, responses, and
locators in the spec unless reuse later justifies shared auth test support.

Cover these independent scenarios:

1. **Pending completion**
   - Hold the server-verified completion response open.
   - Navigate to the approved clean callback URL.
   - Assert one `main` landmark is visible and has `aria-busy="true"`.
   - Assert a polite status announces "Completing sign in".
   - Assert the completion request is issued exactly once under the
     application's React Strict Mode composition.
   - Release the pending response in test cleanup.

2. **Successful completion**
   - Fulfill the refresh or exchange endpoint with a deterministic test access
     token.
   - Register the existing authenticated-app routes before the dashboard
     navigation.
   - Assert the selected request method and contract without logging a real
     credential.
   - Assert the final `/dashboard` URL and the expected frontend authenticated
     state.
   - Start from a known route, go Back, and assert the callback is not restored
     or executed again.

3. **Completion rejection**
   - Return a representative authentication error.
   - Assert the localized safe error feedback and final `/auth/signin` URL.
   - Assert `localStorage.isLoggedIn` is absent and no dashboard request is
     made.
   - Use Back and assert the callback is not restored and the completion request
     count remains one.

4. **Provider denial/error**
   - Navigate with the approved non-secret provider-error indicator.
   - Assert no completion request occurs.
   - Assert generic localized feedback and replacement navigation to sign in.
   - Assert raw provider error details are not rendered.

5. **Invalid callback inputs**
   - Cover a missing refresh cookie by rejecting the intercepted refresh
     request and asserting the normal failure outcome.
   - Assert unexpected query parameters make no refresh request and route
     safely to sign in.

6. **Legacy bearer-token injection**
   - Navigate to
     `/auth/oauth-confirmation?access_token=integration-untrusted-token`.
   - Assert the query value is never used as an Authorization header or
     persisted authentication state.
   - Assert the user cannot reach the dashboard solely from that parameter and
     the resulting URL no longer contains it.

7. **Reduced motion**
   - Emulate `reducedMotion: 'reduce'`, hold completion pending, and assert the
     accessible status remains present while the logo has no active
     scale/pulse animation.
   - Keep this only if the existing complete-sign-up test is not considered
     sufficient shared-loader coverage; do not duplicate an identical
     shared-component assertion without a route-composition reason.

Use accessible role and text locators, awaited web-first assertions, and no
fixed sleeps. Never call Google, a live first-party API, a real account, or a
shared identity-provider session from this suite.

### Lower-level tests

- Add a focused auth-service test if implementation adds an OAuth completion
  method. Assert the complete response contract and that authenticated state is
  set only after a successful server response.
- Add a focused hook test only if a new hook owns meaningful mutation behavior
  beyond a thin React Query adapter.
- Retain the existing `FullPageLoader` component tests. Extend them only if its
  public props or semantics change.
- No new unit test is required for `AuthLayout` solely because the OAuth page
  renders through it.

## Verification

Run focused checks first:

```bash
npm test -- --run src/auth/lib/services/auth.service.test.ts
npm run typecheck:integration
npm run test:integration -- playwright/tests/auth/oauth-confirmation.spec.ts --project=chromium
```

Omit the service command when no service test is added. Run the new Playwright
scenarios independently and together, then run the auth group to detect shared
authentication and loader regressions:

```bash
npm run test:integration -- playwright/tests/auth --project=chromium
npx playwright test --list
```

Then run repository checks:

```bash
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Coordinate a system-E2E check in the separate E2E suite for the real Google
redirect, server-side state validation, cookie issuance, and final dashboard
session. Do not reproduce that live-provider journey in this repository.

## Completion Criteria

- OAuth completion never trusts or stores a bearer token supplied by a client
  URL.
- The backend redirects without an access token, and the frontend establishes
  authenticated state only through the server-verified refresh exchange.
- Missing, malformed, denied, and rejected callbacks terminate with safe,
  localized feedback and do not leave an indefinite loader.
- Every callback outcome replaces sensitive or stale history, and Back cannot
  replay completion.
- The completion operation runs once under React Strict Mode.
- Pending completion exposes one `main` landmark, a page-owned busy state, and a
  specific polite status announcement.
- Playwright protects pending, success, rejection, invalid-input,
  legacy-token-injection, history, and accessibility behavior without a live
  identity provider.
- Focused tests plus structure, stories, lint, integration typecheck, and build
  pass, or unrelated failures are documented.
