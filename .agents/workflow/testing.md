# Testing Workflow

## Goal

Choose the test runner and isolation boundary from the ownership layer under
test.

## Test Matrix

| Owner               | Runner                   | Boundary                                               | Location                         |
| ------------------- | ------------------------ | ------------------------------------------------------ | -------------------------------- |
| Component           | Vitest + Testing Library | Real component tree                                    | Colocated `*.test.tsx`           |
| Component container | Vitest + Testing Library | Real presentation; mocked external systems when needed | Colocated `*.test.tsx`           |
| Dialog              | Playwright               | Running app with controlled API outcomes               | `e2e/tests/integration/dialogs/` |
| Page                | Playwright               | Running app with controlled API outcomes               | `e2e/tests/integration/pages/`   |
| Route               | Playwright               | Full application and test-system journey               | `e2e/tests/routes/`              |

The current `playwright.config.ts` recursively discovers `e2e/tests`, so these
directories work without adding Playwright projects. Existing specs outside
these directories are legacy-compatible; use this placement for new tests.

## Component Tests

1. Render the public component through its barrel.
2. Use real owned child components and hooks.
3. Supply deterministic props and providers.
4. Interact through accessible labels and roles.
5. Assert visible outcomes and callback payloads.
6. Do not add module mocks.

Run a focused component test:

```bash
npm test -- --run src/<feature>/components/<name>/<name>.test.tsx
```

## Container Tests

1. Render the container with its real presentational component.
2. Mock only external hooks, services, navigation, storage, or notifications
   required to isolate orchestration.
3. Cover success, pending, empty, and failure states owned by the container.
4. Assert user-visible outcomes and external-boundary calls.

Run a focused container test with the same Vitest command used for components.

## Dialog and Page Integration Tests

1. Place the spec under `e2e/tests/integration/dialogs/` or
   `e2e/tests/integration/pages/`.
2. Navigate to the application state that renders the dialog or page.
3. Use the real page, dialog, form, providers, router, and portal behavior.
4. Intercept first-party API calls with `page.route()` only to make integration
   scenarios deterministic.
5. Fulfill representative loading, success, validation, and failure responses.
6. Assert visible browser behavior, retained form state, dismissal, and
   reopening where relevant.
7. Do not mock React modules or replace owned UI.

Run a focused integration spec:

```bash
npm run test:e2e:run -- e2e/tests/integration/dialogs/<name>.spec.ts --project=chromium
```

## Route End-to-End Tests

1. Place the spec under `e2e/tests/routes/<feature>/`.
2. Enter through the route or real application navigation.
3. Use real first-party API/test-system boundaries for the journey under test.
4. Cover authorization, navigation, persistence, and the route's critical user
   outcome.
5. Stub only third-party systems that are outside the product boundary or
   unsafe/non-deterministic in the test environment.

Run a focused route spec:

```bash
npm run test:e2e:run -- e2e/tests/routes/<feature>/<route>.spec.ts --project=chromium
```

## Final Verification

Run focused tests first. Then run the applicable broader checks:

```bash
npm test -- --run
npm run test:e2e:run -- --project=chromium
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Report checks that cannot run because the required backend, account fixtures,
environment variables, or external test systems are unavailable.
