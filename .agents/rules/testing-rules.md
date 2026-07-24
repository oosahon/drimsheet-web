# Testing Rules

## Goal

Test each ownership layer at the boundary it is responsible for.

## Components

- Test components with Vitest, Testing Library, and `userEvent`.
- Use real owned child components and hooks.
- Do not use module mocks in component tests.
- Use deterministic providers, fixtures, and browser-platform shims when the
  runtime requires them.
- Assert user-visible behavior, accessibility, callbacks, and validation
  outcomes rather than implementation details.

## Component Containers

- Test component containers with Vitest and Testing Library.
- Render the real presentational component owned by the container.
- Mock external hooks, services, navigation, storage, notifications, or other
  system boundaries only when necessary.
- Assert the orchestration contract between the external boundary and rendered
  component.

## Dialogs and Pages

- Test dialogs and pages with Playwright integration tests.
- Exercise the running application, real composed components, browser portals,
  focus behavior, and user interaction.
- Control external API outcomes with Playwright network interception when the
  scenario requires deterministic success or failure.
- Cover loading, success, failure, retained input, dismissal, and reopening
  behavior when relevant.
- Do not replace owned forms or components with mocks.
- Do not add Testing Library unit tests for dialogs or pages.

## Routes

- Test routes with Playwright end-to-end tests.
- Enter through routing or application navigation.
- Exercise the complete user journey across the real application and test
  system boundaries.
- Do not intercept first-party APIs whose integration is part of the journey
  under test.

## Placement and Commands

Follow `.agents/workflow/testing.md` for test locations, Playwright separation,
and focused verification commands.
