# Playwright Browser Integration Test Setup Plan

## Goal

Introduce Playwright for frontend-owned browser integration tests in this
repository, while keeping full-system end-to-end tests in a separate
repository. Update the repository rules, workflow, skills, and contributor
documentation so future agents and contributors preserve that boundary.

This plan does not implement the setup. Preserve unrelated working-tree
changes during implementation, including the existing deletion of
`.agents/plans/account-creation-dialog.md`.

## Confirmed Boundary

Use three testing layers:

| Layer                   | Runner                                             | Location                            | Boundary                                                                       |
| ----------------------- | -------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| Component and container | Vitest + Testing Library                           | Colocated under `src/`              | Owned component tree with external boundaries mocked only when necessary       |
| Browser integration     | Playwright                                         | This repository under `playwright/` | Running frontend with controlled first-party API responses                     |
| System end-to-end       | Playwright or the external suite's selected runner | Separate repository                 | Deployed frontend, API, database, email, and other real test-system boundaries |

In this repository, Playwright tests may exercise routes, pages, dialogs,
portals, focus behavior, navigation, and browser APIs. They must intercept
first-party API calls that are outside the frontend boundary. They are not
system E2E tests and should not require a live backend, shared test account,
database, or email inbox.

The external E2E repository is responsible for the small set of critical
cross-system journeys and must not be recreated here.

## Current State

- `package.json` has `npm run start:test`, but it does not contain Playwright,
  browser-test scripts, or a Playwright dependency.
- `package-lock.json` is present and must be updated through npm when adding the
  dependency.
- `playwright.config.ts` and the former `e2e/` tests were removed.
- `vite.config.ts` excludes `e2e/**` from Vitest even though the proposed test
  location is `playwright/`.
- `.gitignore` contains both stale `e2e/` artifact paths and current generic
  Playwright artifact paths.
- `.env.test.example` still describes an E2E environment.
- `.agents/rules/testing-rules.md` correctly assigns dialogs and pages to
  Playwright integration tests, but still assigns route journeys to local E2E
  tests.
- `.agents/workflow/testing.md` refers to a nonexistent current
  `playwright.config.ts`, removed `e2e/tests/**` locations, and removed
  `test:e2e*` commands.
- `CONTRIBUTING.md` says all E2E tests live in this repository.
- `create-ui-components` directs dialog and page tests to Playwright but there
  is no repository skill dedicated to authoring or reviewing those tests.
- No CI provider configuration is committed in this repository.

## Structural Decisions

### Test layout

Use a top-level Playwright-owned directory organized by product feature:

```text
playwright.config.ts
tsconfig.playwright.json

playwright/
  tests/
    <feature>/
      <user-outcome>.spec.ts
  fixtures/
    test.ts
  mocks/
    <feature>.mock.ts
  factories/
    <entity>.factory.ts
  pages/
    <workflow>.page.ts
```

Only create support directories when a real consumer exists:

- Put executable test cases in `playwright/tests/<feature>/`.
- Put reusable Playwright fixture extensions in `playwright/fixtures/`.
- Put feature-specific route registration and representative API responses in
  `playwright/mocks/`.
- Put deterministic test-data builders in `playwright/factories/`.
- Put repeated user workflows or locator groups in `playwright/pages/`.
- Do not create a generic `helpers/` or `utils/` dumping ground.
- Keep simple locators and one-off route responses in the owning spec.
- Introduce a page object only after a locator group or workflow has more than
  one consumer. Do not add a base page class.

Playwright support code may import generated API types or other stable
contracts from `src/` with type-only imports. Application code under `src/`
must never import from `playwright/`.

### Naming and commands

Use `integration`, not `e2e`, in local commands:

```text
npm run test:integration
npm run test:integration:ui
npm run test:integration:debug
npm run test:integration:report
npm run typecheck:integration
```

Use `*.spec.ts` only under `playwright/`. Continue using `*.test.ts` and
`*.test.tsx` for Vitest tests under `src/`.

### Browser coverage

Start with the bundled Chromium project:

- Run Chromium for local development and required pull-request coverage.
- Keep the configuration ready for Firefox and WebKit projects, but do not add
  or download them until there is a product or CI requirement.
- Add cross-browser or mobile projects later as an explicit coverage decision,
  not by duplicating every test immediately.

### Environment safety

Add a committed, non-secret `.env.integration` used by Vite's integration mode:

```dotenv
VITE_API_URL=http://127.0.0.1:4000
```

Pointing the API base URL at the local Vite origin ensures that a missed
intercept cannot call a developer, staging, or production backend. Tests must
register expected API routes before the action that triggers them.

Allow local overrides through `.env.integration.local`, keep that file ignored,
and state that integration tests must not depend on secrets. Do not reuse
`.env.test`, which may contain environment-specific E2E values.

## Implementation Order

Update the authoritative rules first because the current route and placement
rules conflict with the intended separation. Then add the test harness, a
representative spec, the authoring skill, and contributor documentation.

## Phase 1: Correct Agent Rules and Workflow

### Update `.agents/rules/testing-rules.md`

- Rename the browser-owned section to cover dialogs, pages, and frontend route
  behavior.
- Define browser integration tests as running the real frontend with
  deterministic first-party API interception.
- State that route-level frontend behavior may be tested here, but complete
  system journeys belong in the external E2E repository.
- Prohibit live first-party backends, shared accounts, inboxes, and mutable
  shared state in this suite.
- Require independent tests, accessible locators, web-first assertions, and no
  arbitrary `waitForTimeout` calls.
- Require route interception before navigation or the triggering action.
- Allow `data-testid` only when role, label, text, or another user-facing
  contract cannot identify the element reliably.
- Clarify that Vitest must not discover or execute Playwright specs.

### Update `.agents/rules/folder-structure.md`

- Add `playwright/` to the permitted top-level shape.
- Document its feature-first `tests/` directory and responsibility-specific
  `fixtures/`, `mocks/`, `factories/`, and `pages/` support directories.
- Require support files to be introduced only when used.
- Keep Playwright artifacts and authentication state out of source
  directories and version control.

### Update `.agents/rules/dependency-rules.md`

- Allow Playwright tests and support code to import stable application
  contracts, especially generated API types.
- Prefer type-only imports when a test needs only a contract.
- Prohibit application and shared source code from importing Playwright tests
  or test support.
- Prohibit browser integration support from becoming a second source of
  production business logic.

### Rewrite `.agents/workflow/testing.md`

- Replace the removed `e2e/tests/**` locations and `test:e2e*` commands.
- Update the test matrix to show the three test layers and the external E2E
  ownership boundary.
- Add a browser integration selection guide:
  - use Vitest for component, hook, mapper, validation, and container contracts;
  - use Playwright here when browser composition or routing is material;
  - use the external suite when the backend or another deployed service is part
    of the behavior under test.
- Define the authoring sequence:
  1. Identify the frontend-owned user outcome.
  2. Inspect the route, page/dialog, generated API contract, and nearby component
     coverage.
  3. Register deterministic API routes before navigation or interaction.
  4. Navigate through the public route.
  5. Interact with accessible locators.
  6. Assert visible state, URL, focus, browser behavior, and submitted request
     payloads where relevant.
  7. Verify that each test passes independently.
- Document fixture, mock, factory, and page-object extraction thresholds.
- Document focused, UI-mode, debug, full-suite, typecheck, and report commands.
- Document generic CI prerequisites without assuming a CI provider:

  ```bash
  npm ci
  npx playwright install --with-deps chromium
  npm run test:integration
  ```

- Document artifact locations and the expectation that CI publishes the HTML
  report and traces on failure.

## Phase 2: Add Playwright and TypeScript Configuration

### Dependencies

Install only the Playwright test package:

```bash
npm install --save-dev @playwright/test
```

Let npm update `package.json` and `package-lock.json`. Do not separately add the
`playwright` package unless an implementation requirement demonstrates that it
is needed.

Install the browser binary locally after dependency installation:

```bash
npx playwright install chromium
```

Use `npx playwright install --with-deps chromium` in Linux CI environments.
Browser binaries must not be committed.

### Add `playwright.config.ts`

Configure:

- `testDir: './playwright/tests'`;
- `testMatch: '**/*.spec.ts'`;
- full test isolation and parallel test files;
- `forbidOnly` in CI;
- zero retries locally and a small CI-only retry count;
- `baseURL: 'http://127.0.0.1:4000'`;
- `trace: 'on-first-retry'`;
- `screenshot: 'only-on-failure'`;
- HTML and terminal-friendly reporters;
- a single `chromium` project using the desktop Chrome device profile;
- `webServer.command: 'npm run start:integration'`;
- `webServer.url: 'http://127.0.0.1:4000'`;
- reuse of an existing server only outside CI.

Keep configuration values deterministic. Do not read secrets or generate
dynamic project names in the config.

### Add `tsconfig.playwright.json`

- Include `playwright.config.ts` and `playwright/**/*.ts`.
- Use Node and Playwright types.
- Preserve the repository's strict TypeScript settings, module resolution, and
  `@/*` source alias.
- Add the config as a project reference in `tsconfig.json` so
  `npm run build` typechecks integration code.
- Add a focused `typecheck:integration` script using
  `tsc -p tsconfig.playwright.json`.

### Update `package.json`

- Add `start:integration` using Vite's `integration` mode on port 4000.
- Add the five integration commands listed in the naming decision.
- Keep `test` mapped to Vitest so existing local and CI behavior does not
  unexpectedly start browsers.
- Do not add browser installation to `postinstall` or `prepare`; installation
  should remain an explicit developer/CI environment step.

### Update Vite and ignored artifacts

- Change the Vitest exclusion in `vite.config.ts` from `e2e/**` to
  `playwright/**`.
- Add `.env.integration` with the safe same-origin API URL.
- Add `.env.integration.local` to `.gitignore`.
- Remove obsolete `e2e/.auth`, `e2e/playwright-report`, and
  `e2e/test-results` ignore entries.
- Retain the root Playwright report, blob report, test result, cache, and auth
  ignores.

## Phase 3: Add One Representative Integration Spec

Add `playwright/tests/auth/login.spec.ts` as the harness proof:

1. Navigate to `/auth/signin` through the running application.
2. Register the `POST **/api/v1/auth/login-with-email` response before the
   submit action.
3. Cover a successful login and assert navigation to `/dashboard`.
4. Cover a rejected login and assert the translated user-visible error while
   remaining on the sign-in route.
5. Assert the submitted request body when that protects the frontend-to-API
   contract.
6. Use labels and roles already exposed by the form.
7. Use awaited Playwright assertions; do not use CSS implementation selectors
   or fixed sleeps.

Keep the first spec self-contained. Extract `playwright/mocks/auth.mock.ts` only
if the two scenarios or a second auth spec would otherwise duplicate material
route-response setup. Do not add fixtures, factories, or page objects merely to
populate the proposed directory structure.

Run the two tests individually and together to confirm that they do not share
cookies, local storage, request state, or ordering assumptions.

## Phase 4: Add and Connect a Playwright Authoring Skill

### Add `.agents/skills/write-playwright-integration-tests/`

Use the `skill-creator` initialization script with `.agents/skills` as the
target and the verb-led name `write-playwright-integration-tests`. Generate:

```text
.agents/skills/write-playwright-integration-tests/
  SKILL.md
  agents/
    openai.yaml
```

Do not add scripts, references, assets, README files, or duplicated testing
rules unless real usage demonstrates a need. The authoritative detail should
remain in `.agents/rules/testing-rules.md` and
`.agents/workflow/testing.md`.

The skill metadata should trigger for creating, refactoring, debugging, or
reviewing Playwright browser integration specs, fixtures, network mocks, test
data factories, page objects, or `playwright.config.ts` in this repository.

The skill body should require the agent to:

1. Read the core repository rules, testing rules, and testing workflow.
2. Inspect `git status` and preserve unrelated work.
3. Confirm that the requested behavior belongs to frontend integration rather
   than system E2E.
4. Inspect the route, UI composition, API client contract, and existing lower
   level tests before writing coverage.
5. Prefer a direct spec, extracting fixtures, mocks, factories, or page objects
   only when reuse or setup complexity justifies them.
6. Register network interception before requests can fire.
7. Use accessible locators, Playwright auto-waiting, and web-first assertions.
8. Keep every spec independently runnable and free of live backend
   dependencies.
9. Run focused tests first, then integration typecheck, lint, build, and the
   applicable repository checks.
10. Inspect traces and reports for failures and report environmental blockers.

Generate `agents/openai.yaml` from the completed skill with:

- display name: `Write Playwright Integration Tests`;
- a 25–64 character description;
- a one-sentence default prompt that explicitly invokes
  `$write-playwright-integration-tests`.

Validate the skill with the skill-creator `quick_validate.py` script. Then use
the new skill to review or make a harmless focused edit to the initial login
spec and confirm that its instructions select the correct boundary, placement,
and commands.

### Update existing agent entry points

- Update `AGENTS.md` to direct Playwright integration work to
  `.agents/skills/write-playwright-integration-tests/SKILL.md` and continue
  directing general test selection to `.agents/workflow/testing.md`.
- Update `.agents/skills/create-ui-components/SKILL.md` so a component task that
  requires dialog, page, or browser integration coverage also uses
  `$write-playwright-integration-tests`.
- Update
  `.agents/skills/create-ui-components/rules/forms-stories-and-tests.md` to
  reference the new skill and the `playwright/tests/<feature>/` location rather
  than referring generically to a Playwright layer.
- Do not duplicate Playwright authoring instructions inside the component
  skill; keep it responsible for deciding when browser coverage is needed and
  delegate the authoring workflow to the new skill.

## Phase 5: Update Contributor Documentation

### Update `CONTRIBUTING.md`

- Replace the statement that E2E tests live under local `e2e/`.
- Document `.test.ts(x)` for Vitest and `playwright/**/*.spec.ts` for browser
  integration.
- State that full-system E2E lives in the separate repository.
- Add the browser installation and integration commands.
- Explain that integration tests use mocked first-party APIs and need no real
  credentials.

### Update `README.md`

- Expand the testing section with separate unit/component and browser
  integration commands.
- Keep setup concise and link contributors to the testing workflow for detailed
  selection guidance.

### Update environment examples

- Remove or rewrite the stale E2E wording in `.env.test.example`.
- Document `.env.integration` and optional `.env.integration.local`.
- Do not place real credentials, shared accounts, inbox tokens, or external E2E
  configuration in the browser integration setup.

## CI Integration Gate

The repository currently has no committed CI provider configuration. Make the
Playwright setup CI-compatible, but do not introduce a provider-specific
workflow without confirming where CI is owned.

Before implementation is considered operational in pull requests, identify the
existing CI system and add these steps there:

1. Install locked npm dependencies.
2. Install Chromium and required OS dependencies.
3. Run `npm run typecheck:integration`.
4. Run `npm run test:integration`.
5. Publish `playwright-report/` and `test-results/` when the job fails.

If CI configuration is intentionally outside this repository, record the exact
required commands in `CONTRIBUTING.md` and report the external pipeline update
as a follow-up rather than silently claiming PR enforcement.

## Verification

Run focused harness checks:

```bash
npm run typecheck:integration
npm run test:integration -- playwright/tests/auth/login.spec.ts --project=chromium
npm run test:integration -- --project=chromium
```

Verify runner separation:

```bash
npm test -- --run
npx playwright test --list
```

The Vitest command must not discover anything under `playwright/`, and the
Playwright list must not discover colocated `src/**/*.test.ts(x)` files.

Run repository checks:

```bash
npm run check:structure
npm run check-stories
npm run lint
npm run build
```

Validate the new skill with the skill-creator validation script. Inspect the
final diff and generated Playwright report, and confirm no browser binaries,
reports, traces, screenshots, auth state, secrets, or unrelated files are
tracked.

## Completion Criteria

- `@playwright/test` is installed once as a development dependency and the npm
  lockfile is updated.
- `playwright.config.ts` starts the Vite integration server and runs isolated
  Chromium tests from `playwright/tests`.
- Integration mode cannot accidentally target a live first-party API.
- Vitest and Playwright discover only their respective test suites.
- The initial login integration spec passes independently and as part of the
  suite without a backend.
- TypeScript, lint, build, structure, stories, and existing Vitest checks pass.
- Reports and runtime artifacts remain ignored.
- Rules and workflow consistently distinguish local browser integration from
  external system E2E.
- `AGENTS.md`, contributor documentation, and the UI component skill point to
  the new Playwright integration skill.
- The new skill has valid frontmatter and UI metadata, passes
  `quick_validate.py`, and contains no unnecessary bundled files.
- CI either runs the integration suite or has a clearly recorded external
  follow-up with exact commands and ownership.

## Non-Goals

- Creating or modifying the external E2E repository.
- Running local integration tests against a live backend, database, mailbox, or
  third-party identity provider.
- Restoring the removed account-based E2E tests.
- Adding Firefox, WebKit, mobile, visual-regression, or component-testing
  projects in the initial setup.
- Migrating existing Vitest component and container coverage to Playwright.
- Building a broad page-object framework before repeated workflows justify it.
