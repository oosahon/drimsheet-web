# Request Password Reset Accessibility, Reliability, and Test Remediation Plan

## Goal

Fix the confirmed request-state, retry, accessibility, responsive-layout, and
test-coverage issues in `src/auth/pages/request-password-reset.tsx` and the
components it composes. Add focused component and browser-integration coverage
at the ownership boundaries defined by the repository testing rules.

This plan does not implement the fixes. Preserve unrelated staged and
working-tree changes while implementing it.

## Confirmed Issues

1. **P2 — A resend replaces the success view with the form while the request is
   pending or fails.** `RequestPasswordResetPage` passes TanStack Query's
   `isSuccess` directly into `RequestPasswordResetForm`. A new mutation changes
   that state to `pending`, so activating Retry unmounts
   `RequestPasswordResetSuccess` and exposes the form again. A failed resend
   leaves the user on the form even though the original reset-link request
   succeeded.
2. **P2 — The form can submit more than one reset request while a request is
   pending.** The button becomes disabled, but the form handler has no
   single-flight guard and the email input remains active. Submitting with Enter
   while the mutation is pending can start another mutation.
3. **P2 — Success is not persistently or semantically communicated.** The only
   explicit success message is a transient toast. The page keeps the
   "Reset your password" heading and initial instructions, while the replacement
   component begins with "Didn't receive it?" and has no success heading,
   status, or description.
4. **P2 — Validation errors are not programmatically associated with the email
   input.** The visible `FieldError` has no stable ID, and the input does not set
   `aria-invalid` or `aria-describedby` when an error is visible.
5. **P2 — The page can overflow or clip at narrow widths, browser zoom, and
   increased text size.** The form has `min-w-xs`, which is 20rem, while the
   page uses an exact `h-screen` wrapper without horizontal or vertical padding.
   The heading also uses a 1rem line height with a 1.5rem font
   (`text-2xl/4`), which can clip text.
6. **P2 — The back-to-sign-in link does not meet normal-text contrast in the
   light theme.** `text-purple-400` on the white background is below the
   required 4.5:1 contrast for the rendered small text.
7. **P3 — The page has no `main` landmark.** Its level-one heading is present,
   but assistive-technology users cannot navigate directly to the page's primary
   content.
8. **P3 — The brand link receives a duplicated accessible name.** The logo has
   non-empty alt text and the link also contains the same visually hidden text,
   causing the accessible name to repeat the company name.
9. **P3 — The email control does not expose its input purpose.** It has
   `type="email"` but no `autocomplete="email"`, reducing browser and assistive
   input support.
10. **P2 — Tests do not cover the composed password-reset request journey.**
    `RequestPasswordResetForm` has no component test and there is no Playwright
    spec for `/auth/forgot-password`. The existing success-component tests cover
    only the countdown, retry callback, and loading flag; they do not protect
    request payloads, API failures, single-flight behavior, success semantics,
    resend state, navigation, landmarks, error associations, or responsive
    reflow.

## Scope

Expected implementation files:

- `src/auth/pages/request-password-reset.tsx`
- `src/auth/components/request-password-reset-form/request-password-reset-form.tsx`
- `src/auth/components/request-password-reset-form/request-password-reset-form.test.tsx`
- `src/auth/components/request-password-reset-form/types.ts`
- `src/auth/components/request-password-reset-form/index.ts`
- `src/auth/components/request-password-reset-form/request-password-reset-form.stories.tsx`
- `src/auth/components/reset-password-request-success/reset-password-request-success.tsx`
- `src/auth/components/reset-password-request-success/reset-password-request-success.container.tsx`
- `src/auth/components/reset-password-request-success/reset-password-request-success.test.tsx`
- `src/auth/components/reset-password-request-success/types.ts`
- `src/auth/components/reset-password-request-success/index.ts`
- `src/auth/components/reset-password-request-success/reset-password-request-success.stories.tsx`
- `src/auth/i18n/locales/en/auth.json`
- `playwright/tests/auth/request-password-reset.spec.ts`

Conditional files:

- `src/auth/layouts/auth-layout.tsx` only if page-local fluid layout cannot
  provide correct reflow
- Other auth Playwright specs only if `AuthLayout` changes affect their layout
- A component-local countdown hook instead of a container if it is the
  narrowest rule-compliant owner for timer lifecycle

Avoid changing shared `Button`, `Input`, `Field`, or `FieldError` APIs. Their
existing native-prop contracts can express the required disabled, busy,
invalid, and described-by semantics. A shared primitive change would broaden
the regression surface and must include focused shared-component tests.

## Implementation Order

### Phase 1: Make the request and resend state explicit

Refactor the page so workflow state is not inferred directly from the current
TanStack Query mutation status.

- Add page-owned state that records the email only after the first reset-link
  request succeeds.
- Render the request form while no email has been successfully submitted.
- Render the success composition after the first successful request and keep it
  rendered while a resend is pending or fails.
- Pass the stored email explicitly to the resend handler. Do not depend on
  Formik state from an unmounted form.
- Keep `isPending` as loading state only; do not use `isSuccess` as durable UI
  history.
- Add a page-owned single-flight guard so submit and resend handlers cannot
  start another request until the current request settles.
- Disable the email control and submit button while pending, and expose the
  pending state with `aria-busy` on the form or its owning region.
- Preserve the entered email after an initial API failure.
- Keep the success view after a resend failure and present the API error without
  falsely claiming that the original successful request was undone.

The backend remains responsible for rate-limiting and for returning an
account-enumeration-safe response. The client-side cooldown and single-flight
guard are interaction protections, not security boundaries.

### Phase 2: Separate pure success UI from countdown orchestration

Bring the success component into line with the repository's presentation and
side-effect boundary while preserving the 30-second retry policy.

- Make `reset-password-request-success.tsx` a pure component that receives the
  remaining seconds, loading state, retry callback, and sign-in destination as
  props.
- Move timer creation, cleanup, and countdown reset into
  `reset-password-request-success.container.tsx` or a narrowly owned
  component-local hook used from an orchestration boundary.
- Reset the countdown when Retry is accepted, and prevent another retry while
  either the countdown or request is active.
- Keep the success UI mounted throughout a resend.
- Keep the declarative sign-in link in the pure component, with its destination
  supplied by the owner.
- Move public props into `types.ts`, export intended public contracts explicitly
  from `index.ts`, and use `*Props` naming without an `I` prefix.

Do not use the client timer as a substitute for server-side rate limiting.

### Phase 3: Provide persistent success semantics

Make the state change understandable without relying on the toast.

- Render the page inside a `main` landmark in both initial and success states.
- Keep exactly one level-one heading and change it to a clear success title,
  such as the existing "Email Sent", after the first successful request.
- Render a persistent success description stating that a password-reset link
  was sent.
- Put the success message in a focused `role="status"`/polite live region so the
  form-to-success transition is announced without making the countdown a live
  region.
- Ensure a successful resend also produces one useful announcement. Prefer
  updating the live status; retain a toast only if it communicates the resend
  without duplicating initial success feedback.
- Keep the generic wording from revealing whether the email belongs to an
  account.

Add or adjust flat `snake_case` keys in every supported auth locale only where
the existing strings do not accurately describe the success and resend states.

### Phase 4: Correct form and brand accessibility

Update the page and form through their existing native-element contracts.

- Derive the visible email error from Formik's `errors` and `touched` state.
- Give the email `FieldError` a stable ID.
- Set `aria-invalid` only while the email error is visible.
- Set `aria-describedby` to the error ID only while that error is rendered.
- Set `data-invalid` on the owning `Field`.
- Add `autoComplete="email"` to the email input.
- Preserve the current label/input association and native email keyboard.
- Make the logo decorative with `alt=""` and keep one visually hidden company
  name as the brand link's accessible name.
- Give the brand link an exact, non-duplicated accessible name.
- Use a light-theme-safe link color for Back to sign in, following the corrected
  auth-page token pattern (`text-purple-600` with an appropriate hover color)
  unless a semantic link token is introduced.

### Phase 5: Correct responsive layout and typography

Use the smallest page-local layout change that reflows at narrow and zoomed
viewports.

- Replace the exact `h-screen` page wrapper with a fluid `min-h-svh` main
  wrapper.
- Add horizontal page padding and vertical padding/scroll allowance.
- Keep the content container `w-full max-w-xs` or `w-full max-w-sm`.
- Remove `min-w-xs` from the form and use `w-full min-w-0 max-w-full`.
- Replace `text-2xl/4` with a line height that is at least the font size and does
  not clip the heading.
- Confirm the logo, heading, form, success content, retry control, and sign-in
  link stay within the viewport at approximately 320 CSS pixels and at increased
  root font size.

If `AuthLayout` must change, use the smallest generic change and run the complete
auth Playwright group to catch regressions.

## Test Plan

### RequestPasswordResetForm component tests

Add `request-password-reset-form.test.tsx` with Testing Library and `userEvent`:

- Submit an empty form and assert the email input has
  `aria-invalid="true"`.
- Assert `aria-describedby` points to the rendered email error.
- Enter an invalid email and assert the email-format error and association.
- Correct the email and assert the invalid state and error association are
  removed.
- Assert the input exposes `autocomplete="email"`.
- Submit a valid email and assert the complete callback payload.
- Render the loading state and assert the form is busy, the email and submit
  controls are disabled, and further keyboard submission does not call the
  callback.

Use the real form, `Input`, `Field`, owned validation, and error hook. Do not add
module mocks.

### RequestPasswordResetSuccess component and container tests

Refactor the existing success tests to use `userEvent` and cover the new
presentation/container split:

- Assert the pure component renders the supplied countdown and disables Retry
  while time remains.
- Assert Retry becomes enabled at zero and emits one callback when activated.
- Assert loading disables Retry independently of the countdown.
- Assert the container advances from 30 to zero and cleans up its timer when
  unmounted.
- Assert an accepted retry resets the countdown to 30.
- Assert the sign-in link has the correct accessible name and destination.
- Keep timer assertions deterministic with fake timers; do not use fixed
  real-time waits.

### Request-password-reset Playwright integration tests

Create `playwright/tests/auth/request-password-reset.spec.ts` and import from
`@integration/fixtures/test`. Register
`**/api/v1/auth/get-password-reset-link` before the action that can call it.

Cover these independently runnable scenarios:

- Load `/auth/forgot-password` and assert one `main`, one level-one initial
  heading, and an exactly named Purple Ledger brand link.
- Submit an empty and malformed email and assert the visible validation message,
  `aria-invalid`, and `aria-describedby` relationship.
- Gate a request, attempt repeated Enter submissions while it is pending, and
  assert exactly one POST with `{ email }`, busy state, and disabled controls.
- Fulfill the initial request and assert the URL remains
  `/auth/forgot-password`, the form is replaced by a success heading and
  persistent live status, and no account-existence detail is exposed.
- Reject the initial request and assert the API error is visible, the form
  remains, and the entered email is retained.
- Advance the retry cooldown with Playwright's clock support, resend, and assert
  the same email payload, one resend request, and that the success view remains
  visible while pending.
- Reject a resend and assert the success view remains visible alongside the
  non-sensitive error feedback.
- Activate Back to sign in and assert navigation to `/auth/signin`.
- Use a viewport around 320 by 568 CSS pixels and assert that all controls and
  links are reachable and `document.documentElement.scrollWidth` does not
  exceed the viewport width.
- Repeat the reflow check with increased root font size or an equivalent zoom
  condition and assert the heading is not clipped.

Use role, label, and text locators. Use web-first assertions and Playwright clock
control rather than `waitForTimeout`.

### Shared-component tests

No new shared-component tests are required if the remediation uses existing
native props on `Button`, `Input`, `Field`, and `FieldError`. Add focused shared
tests only if a shared public contract changes.

## Verification

Run focused checks first:

```bash
npm test -- --run src/auth/components/request-password-reset-form/request-password-reset-form.test.tsx
npm test -- --run src/auth/components/reset-password-request-success/reset-password-request-success.test.tsx
npm run test:integration -- playwright/tests/auth/request-password-reset.spec.ts --project=chromium
```

Then run repository checks:

```bash
npm run typecheck:integration
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

If `AuthLayout` or shared primitives change, run their focused tests and the
complete auth browser-integration group:

```bash
npm test -- --run src/shared/components
npm run test:integration -- playwright/tests/auth --project=chromium
```

Optionally run `npm run test:integration:coverage` after the focused integration
spec passes to confirm the composed route modules are exercised.

## Completion Criteria

- Initial submit and resend each allow at most one in-flight request.
- A resend never replaces a previously earned success view with the request
  form.
- Initial and resend requests send the expected email payload.
- Initial API failure retains the email; resend failure retains the success
  state.
- Successful requests have a persistent, generic, politely announced status.
- The page exposes one `main` landmark and one accurate level-one heading.
- Every visible email error is programmatically associated with its input.
- The email input exposes its autocomplete purpose.
- The brand link has one accessible company name.
- The sign-in link meets normal-text contrast in light and dark themes.
- The route reflows without horizontal overflow or clipped heading text at a
  320px viewport and increased text size.
- Focused Vitest and Playwright coverage protects every corrected behavior.
- Structure, stories, lint, integration typecheck, and build checks pass, or
  unrelated failures are documented.
