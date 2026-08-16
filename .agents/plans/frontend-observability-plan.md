# PL Web Observability Setup Plan

## Goal

Give the deployed `pl-web` Vite SPA production-grade frontend observability:
actionable browser errors with source-mapped releases, sampled browser and API
performance traces connected to Core, privacy-safe diagnostic context, Coolify
container health, external availability monitoring, and owned alerts/runbooks.

This plan is implementation-ready. It intentionally adapts the Core
observability outcome to a browser application instead of copying Core's
server-side OTLP, structured-log, BullMQ, or RabbitMQ instrumentation. Preserve
unrelated staged and working-tree changes in all affected repositories during
implementation.

## Context

`pl-web` is a React 19/Vite 8 single-page application that calls Core through a
generated Axios client. It already depends on `@sentry/react` and has a shared
observability service, a Sentry React error boundary, and a React root error
handler, but the SDK is never initialized. The Vite build also has no Sentry
source-map plugin or release configuration.

Core already uses Sentry for errors/traces, Grafana Cloud for logs/metrics, and
Coolify health checks. Web and Core are deployed separately but share one
browser origin, and they use separate Sentry projects in the same organization.
Core preserves and returns `x-correlation-id`. The separate
`drimsheet-observability` Alloy deployment only selects and labels the Core
container's Docker logs.

Coolify should build `pl-web` as a static Vite application with Nixpacks,
static-site mode enabled, and `dist` as its publish directory. Vite client
configuration is embedded at build time; it is not runtime configuration of
the resulting Nginx container.

## Confirmed Findings

1. **P0 — Existing frontend Sentry calls have no configured client.**
   `src/main.tsx` registers `Sentry.reactErrorHandler()` and
   `src/shared/lib/services/observability.service.ts` calls
   `Sentry.captureException()`, but there is no `Sentry.init()` anywhere in the
   application.
2. **P1 — Production errors cannot be tied reliably to deployed source.**
   `vite.config.ts` has no Sentry Vite plugin or source-map upload, and the
   runtime/build release is not derived from the version in `package.json`.
3. **P1 — React render errors will be double-reported after initialization.**
   `SentryErrorBoundary` captures the exception itself, then the current
   `onError` callback calls `observabilityService.report()` for the same
   exception.
4. **P1 — Core HTTP 500 responses are reported twice across services.**
   Core owns and reports unexpected server failures, while
   `use-api-error-handler.ts` creates a second generic frontend `Server error`
   event for every parsed status 500. The duplicate loses the original stack
   and does not currently include Core's correlation ID.
5. **P1 — The current reporting contract accepts arbitrary context.**
   `observabilityService.report(error, Record<string, unknown>)` can forward
   form, API, identity, financial, or URL data without an allowlist or browser
   privacy scrubber.
6. **P1 — Browser-to-Core trace continuation is not configured.**
   There is no browser tracing integration. Once initialized, Sentry's default
   same-origin propagation can carry the trace into Core without a custom
   `tracePropagationTargets` setting.
7. **P2 — There is no repository-owned web deployment health target or
   observability runbook.** The repository has no static health artifact and
   no documented Sentry, Coolify, source-map, smoke-test, alert, or privacy
   configuration.
8. **P2 — Existing Alloy collection does not include `pl-web`.**
   `drimsheet-observability/alloy/config.alloy` selects
   `DTIMSHEET_CORE_CONTAINER_REGEX` and hard-codes the service label
   `purple-ledger-core`.

## Scope

### Expected Changes

- `pl-web/package.json` and `pl-web/package-lock.json` — add the Sentry Vite
  build plugin and any focused observability scripts needed for repeatable
  verification.
- `pl-web/.env.example` — document the public build-time frontend configuration
  without committing values. The existing `vite/client` types are sufficient;
  runtime validation belongs in the observability config module.
- `pl-web/src/shared/lib/configs/observability.config.ts` and its colocated
  test — validate environment and release, and apply code-owned per-environment
  trace sampling with safe disabled defaults.
- `pl-web/src/shared/lib/services/observability.service.ts` and its colocated
  test — own idempotent SDK initialization, privacy projection, controlled
  manual reporting, and safe API-failure breadcrumbs.
- `pl-web/src/main.tsx` — initialize observability before creating the React
  root and retain the root handler for errors outside a boundary.
- `pl-web/src/_app/index.routes.tsx` — use Sentry's React Router v7 `useRoutes`
  wrapper so transaction names come from route patterns rather than raw URLs.
- `pl-web/src/_app/containers/error-boundary/error-boundary.tsx` and its test —
  retain the fallback/API behavior while removing duplicate manual capture.
- `pl-web/src/shared/lib/api/errors.ts`, `pl-web/src/shared/lib/api/index.ts`,
  and focused tests — distinguish server responses from network/client
  failures and carry the echoed Core correlation ID as bounded diagnostic
  context.
- `pl-web/src/shared/hooks/use-api-error-handler.ts` and its test under
  `src/shared/hooks/__tests__` — stop creating duplicate frontend exceptions
  for Core failures and report only browser-owned unexpected failures.
- `pl-web/vite.config.ts` — generate, upload, and then remove production source
  maps using the same release identifier embedded in the client bundle.
- `pl-web/public/healthz.txt` — provide a dependency-free static health target
  for the web server container.
- `pl-web/src/_app/__docs__/observability.md` and `pl-web/README.md` — document
  ownership, Coolify build/health settings, Sentry variables, alerts, smoke
  tests, privacy canaries, and rollback/disable behavior.
- Sentry, Coolify, and Grafana Cloud configuration — create the frontend
  project, build variables/secrets, internal health check, external synthetic
  check, dashboards/views, notification routes, and alert rules described
  below.

### Conditional Changes

- `drimsheet-observability/compose.yaml`,
  `drimsheet-observability/alloy/config.alloy`, and its README — add a separate
  `pl-web` Docker discovery/log pipeline only if deployed Nginx stdout provides
  an operational signal worth retaining and its request URL, query, client IP,
  and user-agent fields can be removed before Loki export. This is not required
  for browser error/performance monitoring or rollout completion.
- The separate system E2E repository — add a deployed browser-to-Core trace
  check only if that repository already owns cross-service observability smoke
  coverage. Do not put live Core/Sentry assertions in `pl-web` Playwright tests.

### Out of Scope

- Browser OTLP export to the private Alloy endpoint.
- Core's application metrics, structured domain logs, queue metrics, BullMQ
  scrape, or RabbitMQ scrape.
- Shipping console logs or arbitrary client state as a logging pipeline.
- Sentry Session Replay, user feedback capture, product analytics, or raw user
  identity. Replay remains disabled until a separate financial-data privacy
  review approves masking and sampling.
- Host/container CPU and memory monitoring beyond Coolify's existing resource
  monitoring; that remains an infrastructure-wide decision.

## Proposed Approach

### 1. Establish typed, fail-safe frontend telemetry configuration

- Add these public Vite build variables with empty or zero values disabling
  telemetry safely:
  `VITE_APP_ENV` and `VITE_SENTRY_DSN`.
- Accept the same environment vocabulary as Core: `local`, `development`,
  `staging`, `production`, and `test`. Keep trace sampling code-owned: `0` for
  local/test, `1` for development/staging, and `0.10` for production.
- Keep Sentry initialization best-effort and non-throwing so telemetry failure
  cannot stop the SPA from rendering. Make a valid DSN the sole error-reporting
  enablement condition in every environment, including local and test. Keep
  local/test performance trace sampling at `0`.
- Narrow manual report context to an explicit contract such as `source`,
  `operation`, `errorKey`, `statusCode`, and validated `correlationId`; do not
  retain the current arbitrary `Record<string, unknown>` boundary.

### 2. Initialize privacy-safe Sentry error and performance monitoring

- Call one idempotent `observabilityService.initialize()` in `src/main.tsx`
  before `createRoot()`.
- Configure `Sentry.init()` with the DSN, environment, release,
  `sendDefaultPii: false`, a reviewed trace sample rate, and Sentry's React
  Router v7 browser tracing integration. Wrap the existing `useRoutes` call so
  page-load/navigation transactions use normalized route templates.
- Apply `beforeSend`, transaction/span, and breadcrumb controls that preserve
  exception identity, stack frames, debug IDs, release, environment, route
  template, HTTP method/status, trace IDs, safe source/operation/error keys, and
  a validated correlation ID.
- Remove or redact authorization/cookies/tokens, emails and names, user and
  accounting-entity IDs, form/request/response bodies, financial amounts,
  query strings, fragments, raw dynamic paths, DOM input values, and arbitrary
  console/UI breadcrumbs. Do not call `Sentry.setUser()` in the initial
  rollout.
- Keep the root `onUncaughtError` handler. Let `SentryErrorBoundary` perform
  its single built-in capture; use its callback only for existing Axios UI
  handling, not a second `captureException()` call.
- Preserve manual exception reporting for browser-owned failures such as
  LaunchDarkly client synchronization, application parsing, and network/CORS
  failures, using only the narrowed context contract.

### 3. Connect browser requests to Core without duplicate incidents

- Rely on Sentry's default same-origin trace propagation; do not configure a
  custom `tracePropagationTargets` list. Verify the browser sends
  `sentry-trace` and `baggage` on same-origin Core calls and that Core continues
  the trace into its separate Sentry project in the same organization.
- Generate a fresh UUID correlation ID in the browser for every Core request.
  Core must preserve that ID in request context and echo the same value in the
  response header.
- Extract `x-correlation-id` from Axios responses when present and validate it
  as a UUID before attaching it to a safe breadcrumb or browser-owned error.
- Record Core 4xx/5xx outcomes as bounded breadcrumbs/spans, not new frontend
  exceptions. Core remains the error-event owner for server failures. Continue
  to show existing localized UI errors and preserve 401 refresh/sign-out
  behavior.
- Distinguish a received HTTP response from a network/CORS/client parsing
  failure so a missing response can still create an actionable frontend event.
  Respect the existing `report` option rather than reporting every expected
  API rejection.

### 4. Make releases and source maps part of the Coolify build

- Add `@sentry/vite-plugin` after the normal Vite plugins. For every build with
  a non-empty `VITE_SENTRY_DSN`, require `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and
  `SENTRY_PROJECT`. A build skips source-map generation and upload only when
  the DSN is empty.
- Derive the runtime and source-map release from the `name` and `version` in
  `package.json`, shaped as `pl-web@<version>`. Use patch, minor, and major
  package-version bumps as release boundaries, and never deploy different
  client bundles under the same version.
- Generate source maps, upload them from the exact build being deployed, and
  delete `*.map` files from `dist` after a successful upload so they are not
  served publicly.
- Store `SENTRY_AUTH_TOKEN` as a secret, build-only value, preferably using
  Coolify's build-secret support. Never prefix it with `VITE_`, never make it a
  runtime variable, and verify it is absent from the final JavaScript, image
  filesystem, and image history. The browser DSN is public configuration and
  may be embedded in the bundle.
- Fail every Sentry-enabled build when source-map upload fails. A
  runtime SDK/export failure must remain non-fatal to users.

### 5. Configure Coolify health and external availability monitoring

- Deploy with Nixpacks, **Is it a static site?** enabled, `dist` as the publish
  directory, and port `80`. Do not run `vite preview` as the production server.
- Configure Coolify's internal health check for `/healthz.txt`, expected status
  `200`, with startup grace and consecutive-failure thresholds appropriate for
  the generated static Nginx container. Health proves the serving container is
  routable; it must not depend on Core, Sentry, Grafana, or LaunchDarkly.
- Configure a Grafana Cloud Synthetic Monitoring check, or the team's existing
  external uptime service, against the public HTTPS domain. Check DNS/TLS,
  status `200`, and a stable marker from the built `index.html`; this covers the
  public proxy path that the internal Coolify check cannot.
- Do not add frontend application OTLP metrics. Use Sentry browser performance
  for page loads, route navigation, Core HTTP spans, and Web Vitals, and use the
  external check for availability.

### 6. Add operational ownership, alerts, and staged rollout evidence

- Create a separate `pl-web` Sentry project in the same organization as Core so
  frontend ownership, releases, quotas, and alerts remain distinct while
  distributed traces can cross project boundaries.
- Use the code-owned staging trace sample rate `1` for a bounded validation
  window and production rate `0.10`, matching Core's initial cost-safe
  guidance. Adjust through a reviewed, versioned code change after two to four
  weeks of observed volume and latency distributions.
- Route alerts to the same owned notification path as Core initially. Alert on
  new/regressed unhandled frontend issues, sustained frontend error-rate
  increase, external uptime failure, and source-map/release mismatch. Establish
  Web Vital and route/API latency thresholds only after a real baseline exists.
- Document a staging smoke run that verifies:
  the static and public health checks; one source-mapped synthetic browser
  exception; exactly one React-boundary event; a browser navigation
  transaction; browser-to-Core trace continuation; a readable
  `x-correlation-id`; no duplicate frontend event for a synthetic Core 500; and
  alert delivery/recovery.
- Run a privacy canary with synthetic email, token, user/entity IDs, URL query,
  form data, financial amount, and API error payload values. Inspect raw Sentry
  event/transaction JSON and confirm all canaries are absent before production
  sampling is enabled.
- Record project owner, notification destination, sampling rate, retention,
  release, deployment URL, check URL, alert rules, smoke evidence, review date,
  and the disable/rollback procedure in the runbook.

## Test Plan

- **Unit — configuration:** Verify valid and invalid environments, empty DSN
  disablement, environment-derived sample rates, and consistent release selection in
  `src/shared/lib/configs/observability.config.test.ts`.
- **Unit — observability service:** Mock `@sentry/react` and verify one
  idempotent initialization, disabled behavior, non-throwing SDK failures,
  expected integrations/options, context allowlisting, correlation-ID
  validation, and event/span/breadcrumb privacy projections in
  `src/shared/lib/services/observability.service.test.ts`.
- **Component container:** Extend the error-boundary test to verify the fallback
  remains localized and resettable, Axios errors retain their UI path, and a
  non-Axios render failure is not manually captured a second time.
- **Unit/hook — API failures:** Verify correlation-header extraction, HTTP
  response versus network-failure classification, unchanged 401 behavior,
  localized toast/validation behavior, safe breadcrumbs for Core errors, and
  exception capture only for browser-owned/report-enabled failures.
- **Browser integration:** Do not call real Sentry or Core from the repository's
  Playwright suite. Run existing browser integration tests to catch router,
  auth-refresh, and error-UI regressions. Keep the live cross-project trace and
  alert assertions in the documented staging smoke run or existing external
  system E2E suite.

## Verification

Run focused frontend tests first:

```bash
npm test -- --run src/shared/lib/configs/observability.config.test.ts src/shared/lib/services/observability.service.test.ts src/shared/lib/api/errors.test.ts src/shared/hooks/__tests__/use-api-error-handler.test.tsx src/_app/containers/error-boundary/error-boundary.test.tsx
npm run check:structure
npm run lint
npm run build
```

Run the relevant broader frontend regression checks:

```bash
npm run typecheck:integration
npm run test:integration
npm run check-stories
```

Perform one Coolify staging build with a non-empty DSN, Sentry credentials,
and a deliberately bumped package version. Verify the uploaded artifacts in
Sentry against an event from that exact release.
Sentry project access, Coolify deployment access, Grafana synthetic-monitoring
access, notification delivery, and the deployed Core environment are required
for the staging smoke and privacy canary.

## Assumptions

- Web and Core remain separately deployed behind one browser origin, so
  Sentry's default same-origin propagation remains sufficient. Validate the
  public routing shape against the final staging URL.
- A `pl-web` project can be created in Core's existing Sentry organization and
  both projects permit cross-service trace visibility.
- Coolify continues to build the repository from Git using Nixpacks static-site
  mode, and every deployable bundle receives an intentional package-version
  bump.
- The same owner/contact point used for initial Core observability alerts is an
  acceptable initial owner for frontend alerts; record a different owner in
  the runbook if operations assigns one during rollout.

## Risks

- **Sensitive financial or identity data may enter browser telemetry.** Mitigate
  with allowlisted context, aggressive event/span/breadcrumb scrubbing, no
  Replay or user context, synthetic privacy canaries, and raw-event inspection
  before production.
- **A routing change could invalidate same-origin propagation.** Verify the
  deployed browser request URL during staging. If Core ever moves to another
  browser origin, treat explicit trace targets and CORS as a separate reviewed
  infrastructure change.
- **Duplicate Sentry captures can consume quota and confuse ownership.** Let
  Sentry's React boundary capture once and keep Core as owner of server-error
  events; assert both behaviors in focused and staging tests.
- **Incorrect release/source-map pairing makes issues unactionable.** Derive
  both client and upload release from the same `package.json` version, fail
  enabled builds on upload errors, remove public maps only after upload, never
  reuse a version for a different bundle, and verify a synthetic stack frame.
- **Vite variables are immutable after build.** Treat every environment as a
  separate build, mark client variables build-only in Coolify, and document
  redeployment as the configuration-change mechanism.
- **A static health check can pass while the public site or Core is broken.**
  Pair the dependency-free Coolify check with an external HTTPS check and
  browser/Core tracing rather than making container health depend on external
  services.
- **High trace sampling can create cost or performance pressure.** Bound
  staging validation, keep production at `0.10`, monitor ingestion, and revise
  the code-owned policy through a versioned release from measured traffic.

## Completion Criteria

- A production-mode `pl-web` build initializes Sentry exactly once with the
  configured environment, `pl-web@<package version>` release, privacy controls,
  and React Router v7 browser tracing; empty configuration disables telemetry
  without breaking render.
- Source maps from the deployed build are uploaded under the exact release,
  synthetic stack frames resolve to TypeScript/TSX, public `dist` contains no
  `*.map`, and the auth token is absent from client assets and the final image.
- Browser requests to Core carry a client-generated UUID correlation ID and
  trace headers, Core preserves and echoes that ID, the request appears in one
  cross-project trace across the separate Web and Core Sentry projects, and
  auth behavior remains unchanged.
- One React render failure produces one frontend issue, while a Core 500
  produces its Core issue and frontend span/breadcrumb without a duplicate
  generic frontend exception.
- Raw Sentry error and transaction payloads pass the documented privacy canary;
  no token, email, user/entity ID, query, payload, form value, or financial
  amount is present.
- Coolify's `/healthz.txt` check and the public HTTPS synthetic check pass, and
  forced failures deliver and recover through the recorded notification route.
- Focused frontend/Core tests, structure checks, lint, builds, and applicable
  frontend integration tests pass.
- The runbook records ownership, environment values, sampling, release/source
  maps, checks, alerts, smoke evidence, privacy evidence, and disable/rollback
  steps.
- No Core OTLP/queue behavior, user-facing error behavior, authentication
  refresh behavior, or unrelated files are changed.
