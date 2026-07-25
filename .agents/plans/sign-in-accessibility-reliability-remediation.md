# Sign-In Accessibility, Reliability, and Test Remediation Plan

## Goal

Fix the confirmed accessibility, request-state, responsive-layout, and
test-coverage issues in `src/auth/pages/sign-in.tsx` and the composed
`LoginForm`. Add focused component and Playwright browser-integration coverage
at the ownership boundaries defined by the repository testing rules.

This plan does not implement the fixes. Preserve unrelated staged and
working-tree changes while implementing it.

## Confirmed Issues

1. **P2 - Form submission lacks a single-flight guard while login is pending.**
   `SignInPage` passes `handleLogin` directly to `LoginForm`, and
   `LoginForm` leaves the inputs and `<form>` active while `loading` is true.
   The submit button becomes disabled after pending state propagates, but
   pressing Enter or triggering multiple submits before the re-render can start
   concurrent `loginWithEmail` mutations with the same credentials.
2. **P2 - Validation errors are not programmatically associated with the email
   and password controls.** `LoginForm` renders visible `FieldError` elements,
   but the inputs do not set `aria-invalid` or `aria-describedby`, the errors
   have no stable IDs, and the owning `Field` does not expose `data-invalid`.
   Screen-reader users can miss which control a visible error belongs to.
3. **P2 - The sign-in page has no `main` landmark or page heading.**
   `SignInPage` returns generic `div` wrappers and only exposes the logo,
   Google button, form fields, links, and consent copy. Assistive-technology
   users cannot navigate directly to the page's primary region or identify the
   page from a level-one heading.
4. **P2 - The page and form can overflow or clip on narrow, zoomed, or short
   viewports.** `SignInPage` uses an exact `h-screen` centered wrapper without
   padding or scroll allowance, and `LoginForm` uses `min-w-sm`. At a 320 CSS
   pixel viewport or increased browser text size, the form can force horizontal
   overflow and fixed-height centering can clip content vertically.
5. **P2 - The sign-up link does not meet normal-text contrast in the light
   theme.** `text-purple-400` on a white/light background is below WCAG 2.1 AA
   contrast for the rendered small text.
6. **P3 - The brand link has a duplicated accessible name.** The logo image has
   non-empty alt text and the link also contains the same visually hidden brand
   text, causing assistive technologies to announce the company name twice.
7. **P3 - Inputs do not expose their autocomplete purpose.** The email input has
   no `autoComplete="email"`, and the password input has no
   `autoComplete="current-password"`, reducing browser and assistive input
   support on a credential form.
8. **P2 - Tests do not cover the composed sign-in accessibility and reliability
   contract.** `login-form.test.tsx` covers basic validation and submit payload,
   and `playwright/tests/auth/sign-in.spec.ts` covers a happy-path login and API
   failure. They do not protect loading-state disabling, single-flight
   submission, field error associations, autocomplete attributes, landmarks,
   heading structure, exact brand accessible name, sign-up/forgot-password
   navigation, Google redirect, or narrow-viewport reflow.

## Scope

Expected implementation files:

- `src/auth/pages/sign-in.tsx`
- `src/auth/components/login-form/login-form.tsx`
- `src/auth/components/login-form/login-form.test.tsx`
- `src/auth/components/login-form/types.ts`
- `src/auth/components/login-form/index.ts`
- `playwright/tests/auth/sign-in.spec.ts`

Conditional files:

- `src/auth/i18n/locales/en/auth.json` if a new sign-in page heading key is
  needed instead of reusing `sign_in_text`
- `src/auth/layouts/auth-layout.tsx` only if page-local fluid layout cannot
  provide correct reflow for every auth route
- Other auth Playwright specs only if `AuthLayout` changes affect shared auth
  page layout

Avoid changing shared `Button`, `Input`, `PasswordInput`, `Field`, or
`FieldError` APIs unless the existing native-prop contracts cannot express the
required disabled, busy, invalid, and described-by semantics. A shared primitive
change would broaden the regression surface and must include focused
shared-component tests.

## Implementation Order

### Phase 1: Add a request guard and pending semantics

Refactor `SignInPage` and `LoginForm` so a pending login is a real interaction
state, not only button presentation.

- Add page-owned `inFlight` state or another explicit single-flight guard in
  `handleLogin`.
- Return early from `handleLogin` when a login is already pending.
- Keep `useLoginWithEmail().isPending` as mutation state, but derive an
  `isLoading` value from both the mutation and the local guard if both are used.
- Pass `isLoading` to `LoginForm`.
- Set `aria-busy={loading}` on the form.
- Disable the email input, password input, password visibility toggle, and
  submit button while loading.
- Preserve entered credentials when the API rejects the login.
- Keep API error handling through `useApiErrorHandler({ showToast: true })`.

### Phase 2: Correct form accessibility

Update `LoginForm` through the existing shared component native-prop contracts.

- Derive visible `email` and `password` errors from Formik's `errors` and
  `touched` state.
- Give each rendered `FieldError` a stable ID, such as `login-email-error` and
  `login-password-error`.
- Set `aria-invalid` on each input only while its error is visible.
- Set `aria-describedby` to the matching error ID only while that error is
  rendered.
- Set `data-invalid` on each owning `Field`.
- Add `autoComplete="email"` to the email input.
- Add `autoComplete="current-password"` to the password input.
- Keep the current label/input associations, native email keyboard, password
  visibility behavior, and forgot-password link.

### Phase 3: Correct page semantics, brand name, and layout

Make the sign-in route match the remediated auth-page pattern.

- Replace the outer generic wrapper with a `<main>` landmark using
  `min-h-svh`, horizontal padding, vertical padding, and scroll-friendly
  centering.
- Add exactly one level-one heading for the page. Reuse `sign_in_text` only if
  product accepts "Sign In" as the heading; otherwise add a flat `snake_case`
  auth translation key.
- Make the logo image decorative with `alt=""`.
- Keep one visually hidden brand string as the brand link's accessible name,
  without trailing punctuation that changes the exact name.
- Keep the content container `w-full max-w-sm`.
- Replace `LoginForm`'s `min-w-sm` with `w-full min-w-0 max-w-full` or the
  smallest equivalent fluid contract.
- Use a light-theme-safe link color for the sign-up link, following the
  corrected auth-page token pattern (`text-purple-600` with an appropriate hover
  color and dark-mode counterpart) unless a semantic link token is introduced.

### Phase 4: Extend `LoginForm` component tests

Extend `src/auth/components/login-form/login-form.test.tsx` with Testing
Library and `userEvent`.

- Submit an empty form and assert the email and password inputs have
  `aria-invalid="true"`.
- Assert each input's `aria-describedby` points to its rendered error.
- Correct an invalid email and assert the invalid state and error association
  are removed for that field.
- Assert email exposes `autocomplete="email"`.
- Assert password exposes `autocomplete="current-password"`.
- Render `loading={true}` and assert the form is busy, all controls are
  disabled, and keyboard submission does not call `onSubmit`.
- Retain the existing required, invalid-email, and successful-payload coverage.

Use the real `LoginForm`, `PasswordInput`, `Input`, `Field`, owned validation,
and error hook. Do not add module mocks.

### Phase 5: Extend sign-in Playwright integration tests

Update `playwright/tests/auth/sign-in.spec.ts` to cover route-level behavior.

- Assert the page exposes a `main` landmark, a level-one heading, and a brand
  link with the exact accessible name `Purple Ledger Limited`.
- Assert forgot-password navigation reaches `/auth/forgot-password`.
- Assert sign-up navigation reaches `/auth/signup`.
- Assert validation errors associate with the rendered controls via
  `aria-invalid` and `aria-describedby`.
- Gate the login endpoint response, submit valid credentials, attempt duplicate
  submission through Enter and a forced click, and assert exactly one POST with
  the expected payload.
- During the gated request, assert the email input, password input, password
  visibility toggle, and submit button are disabled.
- Keep success-path coverage for navigation to `/dashboard` and authenticated
  app rendering.
- Keep API-failure coverage and assert the form remains visible with the entered
  email preserved.
- Add a Google redirect scenario that clicks "Continue with Google" and asserts
  navigation targets `${VITE_API_URL}/api/v1/auth/google` without calling the
  first-party login endpoint.
- Add a narrow-viewport scenario, approximately 320 CSS pixels wide, and assert
  `document.documentElement.scrollWidth <= window.innerWidth` with all primary
  controls and links visible/reachable.

Register first-party API interception before the interaction that can issue a
request, and keep every scenario independently runnable.

## Verification

Run focused checks first:

```bash
npm test -- --run src/auth/components/login-form/login-form.test.tsx
npm run test:integration -- playwright/tests/auth/sign-in.spec.ts --project=chromium
```

Then run applicable repository checks:

```bash
npm run typecheck:integration
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

If `AuthLayout` or shared primitives change, run the complete auth Playwright
group and the affected shared-component tests.

## Completion Criteria

- [ ] `SignInPage` renders a `<main>` landmark and exactly one level-one
      heading.
- [ ] The brand link has one accurate accessible name without duplicate logo alt
      text.
- [ ] The sign-up link meets light-theme and dark-theme contrast requirements.
- [ ] The page and form reflow at 320 CSS pixels without horizontal overflow or
      clipped content.
- [ ] Login submission is single-flight while pending.
- [ ] Loading state disables all credential controls and exposes `aria-busy`.
- [ ] Email and password validation errors have stable IDs and are associated
      with their inputs through `aria-invalid` and `aria-describedby`.
- [ ] Email and password fields expose correct credential autocomplete
      attributes.
- [ ] `login-form.test.tsx` covers validation associations, autocomplete,
      loading, disabled state, and successful payload.
- [ ] `playwright/tests/auth/sign-in.spec.ts` covers page semantics,
      navigation, single-flight login, API failure, Google redirect, and
      narrow-viewport reflow.
- [ ] Focused tests and repository checks listed above pass.
