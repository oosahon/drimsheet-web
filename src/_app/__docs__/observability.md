# Frontend Observability Operations

## Purpose and ownership

Purple Ledger Web uses a dedicated Sentry project for browser errors and
performance, Coolify for internal serving health, and Grafana Cloud Synthetic
Monitoring (or the team's existing uptime service) for public availability.
Create the frontend Sentry project in the same organization as Core so browser
and Core spans can share a distributed trace while releases, quotas, issue
ownership, and alerts remain separate.

The frontend owns unhandled browser errors, client parsing/setup errors, and
network failures. Core owns unexpected failures after it receives a request. A
Core 4xx/5xx response is a bounded frontend breadcrumb/span, not a second
frontend exception. The first rollout does not enable Session Replay, user
feedback, product analytics, console shipping, `Sentry.setUser()`, or raw user
identity.

Route frontend alerts to the same owned notification path as Core for the
initial rollout. Before production enablement, record the named operator and
contact point in the deployment record below; repository code cannot choose or
validate that external owner.

## Build-time configuration

Vite embeds every `VITE_` value at build time. Changing one requires a new
build and deployment; changing a runtime container variable cannot update an
already-built static bundle.

| Value                           | Consumer                    | Default / failure semantics                                                                                              |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL`                  | Generated Axios client      | Required by the deployed app. Supply the Core origin without `/api/v1`.                                                  |
| `VITE_APP_ENV`                  | Sentry runtime              | `local`; accepts `local`, `development`, `staging`, `production`, or `test`. Invalid falls back to `local` sampling.     |
| `VITE_SENTRY_DSN`               | Sentry runtime/build gate   | Empty disables Sentry. The DSN is public and may be embedded in the bundle.                                              |
| `SENTRY_AUTH_TOKEN`             | Sentry Vite plugin          | Required for every build whose `VITE_SENTRY_DSN` is non-empty. Secret, build-only, and never `VITE_`-prefixed.           |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Sentry Vite plugin          | Required for every build whose `VITE_SENTRY_DSN` is non-empty. Use the dedicated frontend project.                       |
| `package.json` name/version     | Sentry runtime/build plugin | Produces the shared `pl-web@<version>` runtime and source-map release. Bump it for every patch, minor, or major release. |

Copy [`.env.example`](../../../.env.example) for local development. Trace
sampling is code-owned by environment: local/test `0`, development/staging
`1`, and production `0.10`. A valid DSN enables error reporting in every
environment, including local and test; the `0` rate disables performance trace
sampling there, not error events. Review production volume and latency
distributions after two to four weeks; any policy change requires a versioned
build and deployment.

## Coolify static-site and source-map configuration

Configure the application in Coolify as follows:

- build pack: Nixpacks;
- **Is it a static site?**: enabled;
- publish directory: `dist`;
- serving port: `80`;
- build command: `npm run build`;
- health path: `/healthz.txt`;
- expected health status: `200`.

Give the internal health check enough startup grace for the Nixpacks build and
static Nginx container to start, then require multiple consecutive failures
before replacement to avoid routing flaps. The health target contains only the
static marker `ok`; it must not call Core, Sentry, Grafana, or LaunchDarkly.

The build derives the Sentry release directly from `package.json` as
`pl-web@<version>`. Bump the package version for every deployable patch, minor,
or major release; do not deploy different client bundles under the same
version. Treat every environment as a separate build. Store
`SENTRY_AUTH_TOKEN` as a build-only secret, preferably with Coolify
build-secret support. Do not expose it to the runtime container.

When `VITE_SENTRY_DSN` is non-empty, every Vite build:

1. rejects missing plugin credentials;
2. creates hidden source maps from the exact bundle being deployed;
3. uploads them to the configured Sentry project/release; and
4. deletes `dist/**/*.map` only after a successful upload.

The plugin's default error behavior intentionally fails the build if upload
fails. After a staging build, verify no `*.map` remains in `dist`, the deployed
server does not serve a source map, and the auth token is absent from client
assets, the final image filesystem, and image history. A browser SDK/export
failure remains non-fatal to users.

### Verify source-map upload

1. Put a real `VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and
   `SENTRY_PROJECT` in the ignored local `.env`, or configure those values in
   the build environment. The valid DSN enables error reporting for the
   resulting bundle regardless of `VITE_APP_ENV`; local/test builds simply
   keep performance trace sampling at `0`.
2. Run `yarn build`. The build must fail if the plugin cannot authenticate or
   upload; a successful command is the first upload assertion.
3. Confirm the project contains the uploaded artifacts under **Settings →
   Projects → pl-web → Source Maps**, and confirm the release is exactly
   `pl-web@<package.json version>`.
4. Deploy that exact bundle and trigger a fresh staging error from compiled
   application code. Confirm the event shows original TypeScript/TSX frames
   rather than only minified bundle frames.
5. If mapping fails, copy the event ID and run
   `yarn sentry-cli sourcemaps explain <event-id>`. Source maps uploaded after
   an event are not applied retroactively, so always trigger a new event after
   correcting an upload.

The plugin deletes `dist/**/*.map` after uploading, so the absence of local
maps proves only cleanup. Verify the artifacts in Sentry or inspect a fresh
event to prove the upload itself.

## Sentry project and browser-to-Core tracing

Create a `pl-web` browser project in Core's Sentry organization. Keep Sentry's
project-side sensitive-data scrubbing enabled as defense in depth. Configure
issue and trace retention according to the team's reviewed cost policy and
record it below.

Web and Core are deployed separately but share one browser origin. They use
separate Sentry projects in the same organization; project boundaries do not
change browser-origin behavior. Rely on Sentry's default same-origin trace
propagation rather than configuring `tracePropagationTargets`.

The browser generates a fresh UUID correlation ID for every Core request. Core
must preserve it in request context and echo it through `x-correlation-id`.
Verify in a real staging browser that:

- Core requests contain `sentry-trace` and `baggage`;
- the response's `x-correlation-id` is readable by browser JavaScript;
- the correlation ID is a UUID and appears only in bounded diagnostic context;
- browser navigation and Core server spans appear in one cross-project trace;
- a Core 500 creates one Core issue plus a frontend breadcrumb/span, not a generic frontend issue.

## Public availability and alerts

Create an external HTTPS synthetic check against the public application domain.
Validate DNS, TLS, status `200`, and the stable
`<title>PurpleLedger</title>` marker from `index.html`. The external check covers
the public proxy path that Coolify's internal `/healthz.txt` check cannot.

Use the shared Core notification route initially and configure:

- immediate notification for a new or regressed unhandled frontend issue;
- a sustained frontend error-rate increase alert, with the threshold recorded after staging volume is known;
- public synthetic-check failure and recovery notification; and
- a deployment gate or notification when the deployed release has unresolved source maps.

Do not establish Web Vital or route/API latency alert thresholds until two to
four weeks of representative production data establishes a baseline. Sentry
browser performance owns page loads, navigation, Core HTTP spans, and Web
Vitals. Do not add frontend OTLP metrics.

## Staging smoke test

Use synthetic data only and save links/screenshots or exported evidence for
each result:

1. Request the container `/healthz.txt` endpoint and the public HTTPS synthetic check; both return `200`.
2. Trigger one synthetic browser exception and verify its stack resolves to the original TypeScript/TSX and exact release.
3. Trigger one React-boundary failure and verify exactly one frontend event plus the localized, resettable fallback.
4. Navigate between routes and verify a sampled transaction uses route patterns rather than raw URLs.
5. Make a browser-to-Core request and verify one cross-project trace, sent trace headers, and a readable valid correlation ID.
6. Trigger a synthetic Core 500 and verify it produces no duplicate generic frontend exception.
7. Force and recover the synthetic availability check and each enabled alert; verify both delivery and recovery notifications.

Do not put live Core or Sentry assertions in this repository's Playwright suite.
The local suite must continue to use intercepted first-party APIs.

## Privacy canary

Before production sampling is enabled, exercise browser errors, route
transactions, and Core failures with unique synthetic values for an email,
person name, authorization token, user ID, accounting-entity ID, URL query and
fragment, form field, API request/response body, and financial amount. Inspect
raw Sentry error and transaction JSON, not only the rendered issue UI.

Every canary value must be absent. Confirm that only exception type and stack
frames, debug IDs, release/environment, normalized route, HTTP method/status,
trace IDs, safe source/operation/error keys, and a validated correlation ID
remain. Fix the earliest leaking boundary and repeat the canary before raising
sampling.

## Disable and rollback

- Set `VITE_SENTRY_DSN` to empty and rebuild/redeploy to disable all browser telemetry.
- To disable tracing while retaining error monitoring, change the environment's code-owned sample rate to `0`, bump the package version, and rebuild/redeploy.
- Roll back to the previous Coolify deployment if instrumentation affects browser behavior; the static health target remains dependency-free.
- Keep the source-map upload build gate enabled whenever the runtime DSN is enabled. Do not deploy an enabled release with unresolved maps.

## Deployment record

Complete this table in the team's operations system for every enabled
environment and link it from the change/deployment record:

| Field                     | Recorded value |
| ------------------------- | -------------- |
| Environment / public URL  |                |
| Sentry project / owner    |                |
| Notification destination  |                |
| Trace sample rate         |                |
| Sentry retention          |                |
| Release / package version |                |
| Coolify health check URL  |                |
| External check URL        |                |
| Enabled alert rules       |                |
| Smoke-test evidence       |                |
| Privacy-canary evidence   |                |
| Review date               |                |
| Disable/rollback owner    |                |
