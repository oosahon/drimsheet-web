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

We have favored a feature-slice / domain-driven architecture for the frontend to ensure highly cohesive and decoupled features.

Here are the conventions you would find within each domain under `src/` (e.g., `src/auth`, `src/onboarding`):

```text
src/
├─ [domain-name]/
│  ├─ components/  # Domain-specific smart components and complex compositions
│  ├─ hooks/       # Custom hooks (e.g., React Query and form state integration)
│  ├─ routes/      # The actual feature pages and layouts mapped to the router
│  ├─ services/    # API clients (e.g., Axios calls) connecting to backend
│  ├─ types/       # Domain-specific TypeScript types and interfaces
│  └─ ui/          # Purely presentational components tied to the domain
│
└─ shared/         # Shared utilities, global UI components (design system), and cross-domain types
```

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
