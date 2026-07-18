# Contributing to Purple Ledger Web

This document provides guidelines for contributing to the web frontend project to ensure a smooth workflow and high-quality code.

## Table of Contents

- [Design Pattern](#design-pattern)
  - [Domain-Driven Features Structure](#domain-driven-features-structure)
- [Working with Money](#working-with-money)
- [Git Workflow](#git-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Feature Branches](#feature-branches)
  - [Commit Messages & Pull Requests](#commit-messages--pull-requests)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)

## Design Pattern

### Domain-Driven Features Structure

We use a feature-first, domain-driven architecture to keep related code cohesive and easy to reason about. Each feature owns its UI, hooks, routing, and feature-specific business logic, while `src/shared/` holds reusable code that is not owned by one domain.

The agent rules in [`.agents/rules/folder-structure.md`](./.agents/rules/folder-structure.md), [`.agents/rules/dependency-rules.md`](./.agents/rules/dependency-rules.md), and [`.agents/rules/file-responsibility-rules.md`](./.agents/rules/file-responsibility-rules.md) are the source of truth for layout and import boundaries.

Here is the target structure under `src/`:

```text
src/
├─ _app/                     # App bootstrap, providers, root styles, and route wiring
├─ [feature]/
│  ├─ __docs__/              # Feature documentation, decisions, and diagrams
│  ├─ components/            # Pure presentation components
│  │  └─ [component]/
│  │     ├─ [component].tsx
│  │     ├─ [component].stories.tsx
│  │     ├─ [component].test.tsx
│  │     ├─ [component].container.tsx
│  │     ├─ types.ts
│  │     ├─ validation.ts
│  │     └─ index.ts
│  ├─ hooks/                 # Feature-scoped UI and API hooks
│  ├─ pages/                 # Page composition and orchestration
│  ├─ layouts/               # Feature-specific reusable layouts
│  ├─ dialogs/               # Dialog orchestration and side effects
│  ├─ lib/                   # Services, mappers, helpers, utilities, adapters
│  └─ routes/                # Route definitions that render pages only
│
└─ shared/
   ├─ components/            # Reusable design-system and UI building blocks
   │  ├─ icons/
   │  └─ [component]/
   ├─ hooks/                 # Reusable hooks shared across features
   ├─ layouts/               # Reusable layout primitives
   ├─ lib/                   # Shared services, helpers, mappers, and utilities
   └─ configs/               # Shared configuration data
```

## Design Principles

- Keep components pure unless they explicitly need side effects.
- Put orchestration in pages, dialogs, or containers, not in reusable UI components.
- Keep business logic in hooks or `lib/`, not in presentation files.
- Prefer feature-local code first, then promote to `shared/` only when reuse is real and stable.
- Keep route files thin: routes should map URLs to pages and nothing more.

## Working with Money

- **Always use minor units**: Never use fractional values for money internally. Keep calculations strictly in minor units, matching the backend entity constraints.
- Format for display only at the final presentation layer using the designated shared formatting utilities.

## Git Workflow

To maintain a clean and organized codebase, please follow these strict git workflow guidelines.

### Branching Strategy

- **`development`**: This is the main branch for development. All contributor Pull Requests (PRs) should be merged into `development`.
- **`staging`**: This branch is for pre-release testing. Code from the `development` branch is merged here.
- **`main`**: This is the production branch. Only the `staging` branch and hotfix branches are merged here.

### Feature Branches

- **Source**: Every new branch must be created off the `development` branch.
- **Target**: Every update must be submitted as a PR to the `development` branch.
- **Naming Convention**:
  - Branches should be named using the format: `<type>/<description-with-hyphens>/<optional-issue-id>`
  - **Types**: `feat`, `fix`, `chore`, `refactor`, `test`, `doc`
  - **Examples**:
    - `feat/add-accounts-endpoint/49494`
    - `fix/login-error/49494`

### Commit Messages & Pull Requests

We enforce a specific commit message format to generate clean changelogs and track history effectively.

- **Format**:
  ```text
  <type>(<domain>): <short description> <optional-id>
  ```
- **Rules**:
  - Pull request titles should also have the commit message structure.
  - PRs must be squashed and merged.
- **Examples**:
  - `feat(accounts): add view to present account list 3442`
  - `test(auth): improves smoke test`

## Testing

Our project follows these guidelines for testing:

- **Test Proximity**: Test files should be kept near their test subjects.
- **`__tests__` (`.test.tsx` / `.test.ts`)**: Used for isolated unit tests (e.g., testing hooks, utilities, or simple UI components without heavy context dependencies).
- **`__specs__` (`.spec.tsx` / `.spec.ts`)**: Used for integration tests where Context providers, routing, or significant DOM/user interactions are being tested.
- **End-to-End (E2E) Tests**: All E2E testing covers core user flows to verify application resilience.

## Reporting Bugs

If you find a bug, please create a ticket for it on our [GitHub Issues page](https://github.com/purple-ledger/purple-ledger-web/issues).
Before opening a new issue, please search existing issues to see if it has already been reported.

- **Requirement**: Every bug report must have a corresponding ticket.
- **Format**: The ticket must clearly specify:
  1.  **Expected Behaviour**: What should happen.
  2.  **Current Behaviour**: What is actually happening.
