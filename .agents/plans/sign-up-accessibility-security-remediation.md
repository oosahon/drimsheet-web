# Sign-Up Accessibility, Security, and Test Remediation Plan

## Goal

Fix the confirmed accessibility, UI-integrity, navigation, and responsive-layout
issues in `src/auth/pages/sign-up.tsx` and the components it composes. Add focused
component and browser-integration coverage at the ownership boundary defined by
the repository testing rules.

This plan does not implement the fixes. Preserve the existing staged and
working-tree changes while implementing it.

## Confirmed Issues

1. The Terms of Service and Privacy Policy links target routes that are not
   registered by the application.
2. The user-controlled `?success=true` query parameter can display a false
   account-creation success state.
3. Form validation errors are visible but are not associated with their inputs
   through `aria-invalid` and `aria-describedby`.
4. `min-w-sm` and fixed viewport-height wrappers can cause horizontal overflow
   or clipped content on narrow and zoomed viewports.
5. The normal sign-up view has no `main` landmark or page heading, and the
   success title is not a semantic heading.
6. Existing tests cover the primary happy and failure paths but do not protect
   the behaviors above.

## Scope

Expected implementation files:

- `src/auth/pages/sign-up.tsx`
- `src/auth/components/signup-form/signup-form.tsx`
- `src/auth/components/signup-form/signup-form.test.tsx`
- `src/auth/components/auth-consent/auth-consent.tsx`
- `src/auth/components/auth-consent/auth-consent.test.tsx`
- `playwright/tests/auth/sign-up.spec.ts`
- Auth locale JSON files if a new page-heading translation is required

Conditional files:

- `src/auth/routes/auth.tsx` and new legal-document pages when the documents are
  owned by this application
- `src/auth/layouts/auth-layout.tsx` if page-only layout changes cannot provide
  correct viewport reflow for every auth route
- Other auth-page Playwright specs if `AuthLayout` changes affect their layout

Avoid changing shared `Card`, `Input`, or `Field` APIs unless the sign-up form
cannot implement the required semantics through their existing native-prop
contracts. A shared primitive change would broaden the regression surface and
must include focused shared-component tests.

## Open Product Decision

Resolve the canonical destinations for the Terms of Service and Privacy Policy
before implementing their navigation:

- If Purple Ledger owns the documents inside this SPA, add real pages and
  register their routes.
- If the documents are hosted externally, use normal anchors with the canonical
  HTTPS URLs. If they open in a new tab, include `rel="noopener noreferrer"` and
  communicate the new-window behavior in the accessible name.

Do not add empty placeholder pages or retain links to unmatched routes. Record
the chosen destination in the relevant browser tests.

## Implementation Order

### Phase 1: Make the success state trustworthy

Update `SignUpPage` so the success view is derived from the completed signup
workflow rather than directly from a query parameter.

- Replace `useSearchParams`-derived success with page-owned state that starts as
  `false`.
- Set the state to `true` only after `signup(values)` resolves successfully.
- Do not expose a URL that independently asserts that account creation
  succeeded.
- Keep the current API-error handling and ensure a rejected request leaves the
  form visible with its entered values retained.
- Decide whether the success toast is still useful when the page immediately
  renders an equivalent success status. Remove duplicate feedback if product
  behavior does not require both.

The backend remains responsible for authoritative signup validation,
rate-limiting, duplicate-account handling, and OAuth security. Do not treat
client-side validation or UI state as a security boundary.

### Phase 2: Correct page semantics and responsive layout

Refactor both `SignUpPage` branches around semantic and fluid layout:

- Render the normal view inside a `main` landmark.
- Add one descriptive `h1` to the normal view. Reuse an appropriate translation
  only if its meaning fits a page title; otherwise add a flat `snake_case`
  auth-namespace key to every supported auth locale.
- Render the success title as an `h1` rather than relying on `CardTitle`'s
  default `div` semantics.
- Preserve a useful live status announcement after successful submission
  without causing the entire card to be repeatedly announced.
- Prefer `min-h-svh` over nested fixed `h-screen` wrappers.
- Add horizontal page padding and vertical padding/scroll allowance.
- Keep the content container `w-full max-w-sm`.
- Remove `min-w-sm` from `SignupForm`; use `w-full min-w-0 max-w-full` or the
  smallest equivalent fluid contract.
- Check the first-name/last-name two-column group at narrow widths. Stack it at
  the smallest breakpoint if two usable fields cannot fit without truncation.

If `AuthLayout` must change, use the smallest generic change that benefits all
auth pages and manually inspect sign-in, password-reset, OAuth-confirmation, and
complete-signup routes for regressions.

### Phase 3: Associate validation errors with controls

Keep validation in `signup-form/validation.ts` and update only presentation
semantics in `signup-form.tsx`.

For each field:

- Derive its currently visible error from Formik's `errors` and `touched`
  state.
- Give the rendered `FieldError` a stable, field-specific ID.
- Set `aria-invalid` on the input only while its error is visible.
- Set `aria-describedby` to the error ID only while the corresponding error is
  rendered.
- Set `data-invalid` on the owning `Field`, following the repository's shadcn
  form convention.
- Preserve the existing label/input association, autocomplete values, error
  announcement, and password-visibility behavior.

Avoid duplicating Formik error-selection logic. If the current
`useFieldErrorMessage` contract makes the associations awkward, make the
smallest reusable change in that hook and add a focused hook test.

### Phase 4: Repair legal-document navigation

Implement the product decision recorded above:

- Use application `Link` components only for registered internal routes.
- Use anchors for external documents.
- Keep visible and accessible link names explicit.
- Ensure keyboard activation and browser back navigation behave correctly.

Do not conflate the legal documents with the `/auth` route namespace unless
their ownership and desired URLs require it.

## Test Plan

### SignupForm unit tests

Extend `signup-form.test.tsx` using Testing Library and `userEvent`:

- Submit an empty form and assert every invalid input has
  `aria-invalid="true"`.
- Assert every invalid input's `aria-describedby` points to its rendered error.
- Correct one invalid field and assert its invalid state and error association
  are removed without affecting remaining errors.
- Retain the existing required, email-format, password-rule, successful-payload,
  and loading-state tests.

Use the real `SignupForm`, `PasswordInput`, `Field`, and owned hooks. Do not add
module mocks.

### AuthConsent unit tests

Extend `auth-consent.test.tsx` to assert both legal links resolve to the selected
canonical destinations. If the links are external, also assert the chosen
target and `rel` behavior.

### Sign-up Playwright integration tests

Update `playwright/tests/auth/sign-up.spec.ts`:

- Keep validation, API error, sign-in navigation, and successful request-payload
  coverage.
- Update the successful-signup URL assertion after removing the success query
  parameter.
- Navigate directly to `/auth/signup?success=true` and assert that the form,
  not the success confirmation, is shown.
- Activate both legal-document links and assert the actual destination or
  rendered document, not merely the `href` attribute.
- Assert the page exposes a `main` landmark and a level-one heading in its
  normal and success states.
- Add a narrow-viewport scenario, approximately 320 CSS pixels wide, and assert
  that the document has no horizontal overflow and all form controls remain
  reachable.
- In the narrow-viewport scenario, avoid screenshot-only assertions; verify
  measurable reflow and user-visible reachability.

Register first-party API interception before the triggering action and keep
every scenario independently runnable.

### Shared-component tests

No new tests are required solely because `Card`, `Input`, `Button`, or the
layout-only field primitives render on this page. Add shared tests only if their
public behavior changes during implementation.

## Verification

Run focused checks first:

```bash
npm test -- --run src/auth/components/signup-form/signup-form.test.tsx
npm test -- --run src/auth/components/auth-consent/auth-consent.test.tsx
npm run test:integration -- playwright/tests/auth/sign-up.spec.ts --project=chromium
```

Then run repository checks:

```bash
npm run typecheck:integration
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

If `AuthLayout` or shared primitives change, run all related component tests and
the complete auth Playwright group:

```bash
npm test -- --run src/shared/components
npm run test:integration -- playwright/tests/auth --project=chromium
```

## Completion Criteria

- Direct URL manipulation cannot display an unearned signup-success message.
- Both legal links reach real, approved destinations.
- Every visible field error is programmatically associated with its control.
- Normal and success views each expose a `main` landmark and level-one heading.
- The sign-up experience reflows without horizontal overflow at a 320px
  viewport and remains usable with increased text size or zoom.
- Focused Vitest and Playwright coverage protects each corrected behavior.
- Structure, stories, lint, typecheck, and build checks pass, or unrelated
  failures are documented.
