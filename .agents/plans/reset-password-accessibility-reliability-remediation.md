# Reset Password Accessibility, Reliability, and Test Remediation Plan

## Goal

Fix the confirmed bugs, accessibility violations, responsive layout issues, and missing test coverage in `src/auth/pages/reset-password.tsx` and `src/auth/components/reset-password-form/reset-password-form.tsx`. Add comprehensive component tests (`reset-password-form.test.tsx`) and Playwright browser-integration test coverage (`playwright/tests/auth/reset-password.spec.ts`).

This plan documents the remediation and testing strategy. It does not implement the fixes. Preserve unrelated staged and working-tree changes while executing it.

---

## Confirmed Issues

### Bugs & Reliability

1. **P2 — Form submission lacks a single-flight guard during pending mutation.**
   `ResetPasswordPage` passes `handleSubmit` directly to `ResetPasswordForm`. Although `loading={isPending}` disables the submit button once state propagates, the handler lacks a single-flight guard. Pressing Enter repeatedly before re-render can trigger concurrent `resetPassword` mutations with the same payload.
2. **P2 — Missing or malformed token state is unhandled.**
   The page extracts `token` via `searchParams.get('token') ?? ''`. When `token` is missing or invalid, `authService.decodeToken('')` returns `null`, leaving `email` empty. The form remains fully interactive for password input. Submitting with an empty token sends an invalid request payload to the API instead of validating or presenting an invalid/missing token warning.
3. **P3 — Back to sign in navigation link is missing.**
   Users who land on `/auth/reset-password` by accident, via expired link, or after completing password reset have no direct link to navigate back to `/auth/signin`.

### Accessibility (a11y) Violations

4. **P2 — Page lacks a `<main>` landmark.**
   `ResetPasswordPage` wraps its content in a generic `<div className="flex h-screen items-center justify-center">` without a `<main>` element, preventing assistive technology users from navigating directly to the page's primary region.
5. **P2 — Form controls lack programmatic error associations (`aria-invalid`, `aria-describedby`, `data-invalid`).**
   In `ResetPasswordForm`, when validation fails on `password` or `confirmPassword`, the `PasswordInput` controls do not set `aria-invalid="true"` or `aria-describedby` pointing to the error message. `FieldError` does not assign a stable `id`, and `Field` does not receive `data-invalid`.
6. **P2 — Heading typography line height (`text-2xl/4`) causes text clipping.**
   The level-one heading uses `text-2xl/4` (24px font size with 16px line height). A line height smaller than font size clips text rendering, particularly when browser font size is scaled or zoomed.
7. **P2 — Page uses fixed height wrapper (`h-screen`) and fixed minimum width (`min-w-xs`), causing overflow on small viewports.**
   `h-screen` without vertical scroll allowance or padding causes content clipping on short viewports. `min-w-xs` (20rem / 320px) without responsive bounds forces horizontal scrollbars on 320px viewports or zoomed interfaces.
8. **P3 — Duplicated accessible name on brand logo link.**
   The brand `Link` contains an `<img>` with `alt="Purple Ledger Limited"` AND a `<span className="sr-only">Purple Ledger Limited.</span>`, causing screen readers to announce "Purple Ledger Limited Purple Ledger Limited." twice.
9. **P3 — Missing HTML `autocomplete` attributes on input controls.**
   `PasswordInput` fields lack `autoComplete="new-password"`, and the disabled email `Input` lacks `autoComplete="email"`.
10. **P3 — Missing `aria-busy` attribute on form during pending submission.**
    The form does not signal in-flight status via `aria-busy="true"` on the form or container while `isPending` is active.

### Missing Tests

11. **P2 — Missing component test suite (`reset-password-form.test.tsx`).**
    `src/auth/components/reset-password-form/` has no unit or component test file. Validation rules (min 8 chars, number required, special character required, matching passwords, required fields), field error wiring (`aria-invalid`, `aria-describedby`), disabled state when loading, and submit callback payloads are unverified in isolation.
12. **P2 — Missing Playwright browser-integration test spec (`playwright/tests/auth/reset-password.spec.ts`).**
    There is no integration spec for `/auth/reset-password`. Route loading, JWT token decoding, empty/malformed token handling, form validation, single-flight submission, API success navigation to `/dashboard`, API failure handling, accessibility landmark/heading structure, and 320px responsive reflow are untested.

---

## Scope

### Files to Modify

- [MODIFY] [reset-password.tsx](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/pages/reset-password.tsx)
- [MODIFY] [reset-password-form.tsx](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/components/reset-password-form/reset-password-form.tsx)
- [MODIFY] [types.ts](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/components/reset-password-form/types.ts)
- [MODIFY] [index.ts](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/components/reset-password-form/index.ts)
- [MODIFY] [auth.json](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/i18n/locales/en/auth.json) (if new translation keys are needed)

### New Files to Create

- [NEW] [reset-password-form.test.tsx](file:///Users/osahon/work/purple-ledger/code/pl-web/src/auth/components/reset-password-form/reset-password-form.test.tsx)
- [NEW] [reset-password.spec.ts](file:///Users/osahon/work/purple-ledger/code/pl-web/playwright/tests/auth/reset-password.spec.ts)

---

## Implementation Order

### Phase 1: Fix Single-Flight Guard, Token Validation, and Navigation Link

Refactor `ResetPasswordPage` to enforce request guards and handle edge cases:

- Add single-flight guard to `handleSubmit` so that secondary submit attempts while `isPending` is active are ignored.
- Validate `token` presence on page load. If `token` is missing or invalid, display an accessible error alert and disable form submission, or prompt the user to request a new reset link.
- Add a "Back to sign in" navigation link pointing to `/auth/signin` with accessible contrast (`text-purple-600` or equivalent theme-safe link token).

### Phase 2: Correct Form Component Accessibility and ARIA Associations

Refactor `ResetPasswordForm` to adhere to WCAG accessibility standards:

- Pass stable `id` attributes to `FieldError` components (e.g. `password-error`, `confirmPassword-error`).
- Set `aria-invalid={Boolean(getErrorMessage('password'))}` and `aria-describedby="password-error"` on `PasswordInput` when an error is present.
- Set `aria-invalid={Boolean(getErrorMessage('confirmPassword'))}` and `aria-describedby="confirmPassword-error"` on confirm password input.
- Pass `data-invalid={Boolean(getErrorMessage('field'))}` to the owning `Field` containers.
- Add `autoComplete="new-password"` to both password inputs and `autoComplete="email"` to the email input.
- Set `aria-busy={loading}` on the `<form>` or wrapping container when `loading` is true.
- Disable password input fields when `loading` is true.

### Phase 3: Correct Page Landmark, Brand Link, and Responsive Layout

Update layout and markup structure in `ResetPasswordPage`:

- Replace the outer `<div>` with a `<main className="flex min-h-svh flex-col items-center justify-center p-4">` landmark.
- Update brand logo `<img>` to have `alt=""` and keep `purple_ledger_limited` as the sole accessible name inside `<span className="sr-only">`.
- Fix heading styling from `text-2xl/4` to `text-2xl/8` or `text-2xl font-bold tracking-tight` with proper line height to eliminate font clipping.
- Replace `min-w-xs` with `w-full max-w-sm` to allow smooth reflow down to 320px viewports without horizontal overflow.

### Phase 4: Create Component Test Suite (`reset-password-form.test.tsx`)

Add Vitest + React Testing Library component tests covering `ResetPasswordForm`:

- Render component with email and submit handler.
- Verify disabled email field displays the passed email and has `autoComplete="email"`.
- Test validation schema: submit empty form and check required error messages on password and confirmPassword.
- Test password criteria: enter password under 8 chars, missing numbers, missing special chars, and mismatching confirm password.
- Verify `aria-invalid="true"` and `aria-describedby` error ID link when validation fails.
- Test successful submission: enter valid matching password and confirm password, submit form, and assert `onSubmit` was called with `{ password, confirmPassword }`.
- Test loading state: pass `loading={true}`, assert submit button and inputs are disabled and form has `aria-busy="true"`.

### Phase 5: Create Playwright Integration Test Suite (`reset-password.spec.ts`)

Add Playwright integration spec `playwright/tests/auth/reset-password.spec.ts`:

- Test page structure: verify `<main>` landmark, level-one heading ("Reset your password"), and exact brand link.
- Test missing/invalid token: navigate to `/auth/reset-password` without `token` query param and verify handling/error state.
- Test form validation: enter invalid password/mismatch and assert `aria-invalid`, `aria-describedby`, and error text.
- Test single-flight submit and loading state: route `**/api/v1/auth/reset-password` with response gate, submit form, attempt duplicate submission, verify single POST request with token and password, and verify busy/disabled states.
- Test successful password reset: mock 200 OK from API, submit valid values, verify toast notification and navigation to `/dashboard`.
- Test API failure handling: mock 400/500 API error, submit form, verify error handling via toast/form error and that form state is preserved.
- Test "Back to sign in" navigation link: click link and assert URL `/auth/signin`.
- Test 320px viewport reflow: set 320x568 viewport, assert `document.documentElement.scrollWidth <= 320` and all controls are visible and clickable.

---

## Test Plan

### Component Tests (`src/auth/components/reset-password-form/reset-password-form.test.tsx`)

```typescript
// Test scenarios to implement:
1. 'renders disabled email field with autocomplete="email"'
2. 'shows validation errors and sets aria-invalid and aria-describedby when submitting empty form'
3. 'validates password min length, number, and special character rules'
4. 'validates that password and confirmPassword must match'
5. 'calls onSubmit with form values when valid'
6. 'disables inputs and button and sets aria-busy when loading is true'
```

### Browser Integration Tests (`playwright/tests/auth/reset-password.spec.ts`)

```typescript
// Test scenarios to implement:
1. 'renders main landmark, level-one heading, brand link, and back-to-signin link'
2. 'handles missing token parameter gracefully'
3. 'associates validation errors with input via aria-invalid and aria-describedby'
4. 'gates request, disables controls, and sends exactly one POST request on submit'
5. 'resets password successfully and navigates to /dashboard'
6. 'handles API error without clearing entered form state'
7. 'reflows at 320px viewport without horizontal scroll'
```

---

## Verification

### Focused Test Commands

```bash
# Run component tests
npm test -- --run src/auth/components/reset-password-form/reset-password-form.test.tsx

# Run Playwright integration tests
npm run test:integration -- playwright/tests/auth/reset-password.spec.ts --project=chromium
```

### Repository Verification Checks

```bash
npm run typecheck:integration
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

---

## Completion Criteria

- [ ] `ResetPasswordPage` includes a `<main>` landmark and valid `<h1 className="text-2xl/8 font-bold tracking-tight">` heading without text clipping.
- [ ] Brand link has a single, accurate accessible name without duplication.
- [ ] Single-flight submit guard prevents concurrent API requests during pending mutation.
- [ ] Missing or invalid reset tokens are handled gracefully with accessible user feedback.
- [ ] `PasswordInput` controls expose `autoComplete="new-password"`, `aria-invalid`, `aria-describedby`, and link to stable `FieldError` IDs.
- [ ] Email control exposes `autoComplete="email"`.
- [ ] Form exposes `aria-busy` when `loading` is true.
- [ ] "Back to sign in" navigation link is present and accessible.
- [ ] Layout reflows at 320px viewport width without horizontal scrollbars or element clipping.
- [ ] `reset-password-form.test.tsx` passes with 100% assertion coverage for form states and validation.
- [ ] `playwright/tests/auth/reset-password.spec.ts` passes all integration scenarios on Chromium.
- [ ] All repository checks (`typecheck:integration`, `check:structure`, `check-stories`, `lint`, `build`) pass cleanly.
