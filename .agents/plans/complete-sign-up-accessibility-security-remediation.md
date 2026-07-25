# Complete Sign-Up Accessibility, Security, and Test Remediation Plan

## Goal

Fix the confirmed completion-state, browser-history, and accessibility issues in
`src/auth/pages/complete-signup.tsx` and the shared full-page loader it composes.
Add focused shared-component and Playwright browser-integration coverage at the
ownership boundaries defined by the repository testing rules.

This plan does not implement the fixes. Preserve unrelated staged and
working-tree changes while implementing it.

## Confirmed Issues

1. A missing or empty `token` query parameter leaves the user on a full-page
   loader forever because the page neither verifies nor exits that state.
2. Success and failure navigation push a new history entry instead of replacing
   the verification URL. This retains the email-verification credential in
   browser history; after a failed verification, Back can revisit the URL and
   submit the token again.
3. The page has no `main` landmark, and `FullPageLoader` exposes only an image
   named "Purple Ledger". It does not programmatically announce that email
   verification is in progress.
4. The loader's non-essential scale/pulse animation runs indefinitely and has
   no reduced-motion fallback.
5. There is no component test for `FullPageLoader` and no browser-integration
   coverage for the complete-sign-up route, request contract, redirects,
   history behavior, or loading accessibility.

## Scope

Expected implementation files:

- `src/auth/pages/complete-signup.tsx`
- `src/auth/i18n/locales/en/auth.json`
- `src/shared/components/full-page-loader/full-page-loader.tsx`
- `src/shared/components/full-page-loader/full-page-loader.stories.tsx`
- `src/shared/components/full-page-loader/full-page-loader.test.tsx`
- `src/shared/components/full-page-loader/types.ts`
- `src/shared/components/full-page-loader/index.ts`
- `playwright/tests/auth/complete-sign-up.spec.ts`

Conditional files required if `FullPageLoader` receives a required accessible
label:

- `src/auth/pages/oauth-confirmation.tsx`
- `src/auth/components/access-token-manager/access-token-manager.container.tsx`
- `src/_app/containers/error-boundary.tsx`
- `src/shared/i18n/locales/en/shared.json`
- Tests or stories owned by those consumers when their observable behavior
  changes

Do not add a Testing Library test for `CompleteSignUpPage`; page composition,
routing, browser history, and network interception belong in Playwright. Do not
call the live API or email system from this repository's integration suite.

## Implementation Order

### Phase 1: Make every token state terminate

Update `CompleteSignUpPage` to read the token from router-owned search params and
handle missing input before attempting verification.

- Treat both an absent token and `?token=` as an invalid verification link.
- Do not call `verifyEmail` for either invalid-token case.
- Show a localized, actionable error such as "This verification link is
  invalid. Request a new link or sign up again."
- Replace the current history entry with `/auth/signup` after showing the
  feedback, following the page's existing API-failure destination.
- Keep the existing one-call guard so React Strict Mode does not duplicate the
  verification request.
- Keep API errors flowing through `useApiErrorHandler`.

Add flat, meaning-based `snake_case` keys to the auth namespace for the invalid
link and verification-in-progress messages. Extract render-only translations
immediately before JSX; translations used only by effect handlers may remain
local to the handler.

### Phase 2: Remove the token-bearing URL from history

Use replacement navigation after every terminal verification outcome.

- On success, navigate to `/dashboard` with `{ replace: true }`.
- On API failure, navigate to `/auth/signup` with `{ replace: true }`.
- Use the same replacement behavior for a missing or empty token.
- Preserve the success toast and the existing authentication state established
  by `authService.verifyEmail`.
- Do not copy the token into local storage, component state, toast content,
  logging, test names, or observability metadata.

Replacement navigation is the frontend-owned mitigation here. The backend must
continue to enforce token expiry, one-time use, and replay resistance; do not
treat browser-history cleanup as the server-side security boundary.

### Phase 3: Give the verification state accessible semantics

Render the complete-sign-up route as a semantic page and make
`FullPageLoader` communicate its purpose.

- Wrap the route content in a `main` landmark.
- Mark the verification region busy while the request is pending.
- Give `FullPageLoader` an explicit accessible-label contract rather than using
  the logo's alt text as a loading message.
- Expose a polite `status` with visible or screen-reader-only text such as
  "Verifying your email".
- Treat the logo image as decorative (`alt=""`) once the status text supplies
  the accessible name.
- Avoid adding an assertive live region; verification starts automatically and
  does not require interruption of the current screen-reader announcement.

Prefer a required `label` prop on `FullPageLoader` so every use communicates the
operation in progress. Put its props contract in `types.ts`, re-export the type
from `index.ts`, update the story, and update every existing consumer with an
owned localized label. If implementation evidence supports a default instead,
the default must still be localized and consumers with a more specific operation
must override it.

### Phase 4: Respect reduced-motion preferences

Update the loader animation without changing the global animation token unless
other consumers require it.

- Add a `motion-reduce` variant that removes the scale/pulse animation.
- Keep the static logo visible when animation is disabled.
- Do not make the accessible status depend on animation.
- Verify that the fixed overlay still covers the viewport at narrow widths and
  does not introduce horizontal overflow.

## Test Plan

### FullPageLoader component tests

Create `full-page-loader.test.tsx` using Testing Library and import the public
component through `@/shared/components/full-page-loader`.

- Render with a representative label and assert a `status` is exposed with that
  accessible name or text.
- Assert the logo is decorative and is not exposed as a competing "Purple
  Ledger" image announcement.
- Assert the busy/status semantics remain present when custom native container
  props or class names are supplied, if the final public contract supports
  them.

Do not test Tailwind implementation details beyond a focused reduced-motion
class assertion if no user-observable runtime assertion is practical in jsdom.
Keep the reduced-motion behavior documented in the Storybook story and verify it
manually in a browser.

### Complete sign-up Playwright integration tests

Create `playwright/tests/auth/complete-sign-up.spec.ts` and import `test` and
`expect` from `@integration/fixtures/test`.

Register the verification interception before navigating because the request is
issued on page mount. Keep one-off route responses and locators in the spec
unless later auth specs create genuine reuse.

Cover these independent scenarios:

1. **Pending state**
   - Hold the intercepted response open.
   - Navigate to `/auth/signup/complete?token=<encoded-test-token>`.
   - Assert one `main` landmark is present and busy.
   - Assert a polite status announces "Verifying your email".
   - Assert the verification request is issued exactly once under the
     application's React Strict Mode composition.
   - Release the response in test cleanup so no route promise is left pending.

2. **Successful verification**
   - Fulfill the verification endpoint with a deterministic access token.
   - Intercept the dashboard's first-party profile and accounting-entity
     requests before navigation, following the existing sign-in spec.
   - Assert the request is `POST`, its query contains exactly the supplied
     token, and it has no token-bearing request body.
   - Assert the success toast and final `/dashboard` URL.
   - Assert the authenticated state expected from the frontend verification
     workflow without decoding or relying on a production token.

3. **API rejection**
   - Return a representative API error from the verification endpoint.
   - Assert the localized error toast and final `/auth/signup` URL.
   - Start from a known auth page, use Back after the redirect, and assert the
     token-bearing completion URL is not restored and the verification request
     count remains one.

4. **Missing token**
   - Navigate to `/auth/signup/complete`.
   - Assert the invalid-link feedback and replacement navigation to
     `/auth/signup`.
   - Assert no verification request is made.

5. **Empty token**
   - Navigate to `/auth/signup/complete?token=`.
   - Assert the same invalid-link outcome and no verification request.

6. **Reduced motion**
   - Emulate `reducedMotion: 'reduce'` before navigation.
   - Hold the request pending and assert the status remains visible while the
     logo has no active scale/pulse animation, using computed style rather than
     a screenshot-only assertion.

Use a non-secret sentinel such as `integration-verification-token` in the spec.
Never use a real verification link, shared account, inbox, or live identity
provider.

### Lower-level auth tests

No new unit test is required for `useVerifyEmail` solely because the page calls
it; the hook is a thin React Query adapter. No new auth-service test is required
unless implementation changes the service contract or token persistence
behavior. If either layer changes, add a focused Vitest test at that owner
instead of duplicating it in the page spec.

## Verification

Run focused checks first:

```bash
npm test -- --run src/shared/components/full-page-loader/full-page-loader.test.tsx
npm run typecheck:integration
npm run test:integration -- playwright/tests/auth/complete-sign-up.spec.ts --project=chromium
```

Run the new scenarios independently and together, then run the existing auth
group to catch shared-loader and authentication regressions:

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

If the required loader label changes other consumers, run their focused tests
and manually inspect OAuth confirmation, application initialization, and the
delayed error fallback with normal and reduced motion.

## Completion Criteria

- Missing and empty tokens never leave the user in an indefinite loading state
  and never issue a verification request.
- Every terminal path replaces the token-bearing history entry.
- A failed verification cannot be replayed by pressing Back in the tested
  browser flow.
- The pending page exposes one `main` landmark, a busy state, and a specific
  polite status announcement.
- The loader logo is decorative and its motion stops when reduced motion is
  requested without hiding the loading status.
- The successful request contract, dashboard redirect, API-error redirect, and
  one-request Strict Mode behavior are protected by Playwright.
- Focused Vitest and Playwright tests plus structure, stories, lint, typecheck,
  and build pass, or unrelated failures are documented.
