---
name: write-playwright-integration-tests
description: Create, refactor, debug, or review Playwright browser integration tests in this repository. Use for playwright.config.ts, playwright/**/*.spec.ts, Playwright fixtures, network mocks, test-data factories, page objects, browser routing or dialog coverage, and deciding whether a user journey belongs in frontend integration or the separate system E2E suite.
---

# Write Playwright Integration Tests

Create focused browser coverage for frontend-owned behavior without depending
on a live backend or duplicating the separate system E2E suite.

## Read the rules

Before editing integration tests or configuration:

1. Read `.agents/rules/folder-structure.md`,
   `.agents/rules/dependency-rules.md`,
   `.agents/rules/file-responsibility-rules.md`,
   `.agents/rules/type-naming-rules.md`, and
   `.agents/rules/testing-rules.md`.
2. Read `.agents/workflow/testing.md`.
3. Treat those files as authoritative. Existing or removed E2E files may
   predate the current boundary.

## Select the boundary

- Use Playwright here for routes, pages, dialogs, portals, focus, navigation,
  browser APIs, and composed frontend behavior with controlled first-party API
  responses.
- Keep components, containers, hooks, mappers, services, and validation in
  Vitest unless browser composition is material to the outcome.
- Keep journeys involving the real API, database, email delivery, identity
  provider, or other deployed services in the separate E2E repository.

## Workflow

1. Inspect `git status` and preserve unrelated work.
2. Identify one frontend-owned user outcome.
3. Inspect the public route, page or dialog composition, generated API
   contract, translations, and existing lower-level tests.
4. Start with a direct spec under
   `playwright/tests/<feature>/<user-outcome>.spec.ts`.
5. Import `test` and `expect` from `@integration/fixtures/test` so the spec
   participates in opt-in code coverage.
6. Register network interception before navigation or the interaction that can
   issue the request.
7. Navigate through the public route and use the real application composition.
8. Prefer role, label, text, placeholder, alt text, and title locators. Use a
   test ID only when no user-facing contract is stable.
9. Use awaited web-first assertions and Playwright auto-waiting. Do not use
   fixed sleeps.
10. Assert visible outcomes and the frontend-owned request contract when
    relevant.
11. Run scenarios independently and together to expose shared-state or ordering
    assumptions.

Keep one-off locators and route responses in the owning spec. Extract a fixture,
feature mock, factory, or page object only when reuse or lifecycle complexity
justifies it. Do not create base page classes or generic helper buckets.

## Verification

Run focused checks first:

```bash
npm run typecheck:integration
npm run test:integration -- playwright/tests/<feature>/<name>.spec.ts --project=chromium
npm run test:integration:coverage
```

Then run the applicable broader checks:

```bash
npm run test:integration
npm test -- --run
npm run lint
npm run build
```

Use `npx playwright test --list` to verify runner discovery. Inspect traces and
the HTML report when a browser test fails. Report a missing browser binary or
external CI ownership as an environmental blocker; do not work around it by
calling a live backend.

## Completion checklist

- The behavior belongs to frontend browser integration.
- The spec is feature-owned and independently runnable.
- Expected API calls are intercepted before they can fire.
- No live service, secret, shared account, inbox, or mutable shared state is
  required.
- Locators express accessible or user-visible contracts.
- Assertions use Playwright retrying behavior without fixed sleeps.
- Support abstractions exist only where reuse justifies them.
- The spec uses the coverage-aware integration fixture.
- Focused tests, integration typechecking, and applicable repository checks
  pass.
