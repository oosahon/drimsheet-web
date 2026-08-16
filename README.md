[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

# Drimsheet

Drimsheet is an AI-powered, robust, auditable accounting software for companies, sole traders (business name owners), and individuals in Nigeria.\
It's a software for accountants and non-accountants alike.

Accounting-savvy users who want to be in control of everything can create journals, charts of accounts, etc.

Users with no accounting background are not left out. They can also track their income, expenses and taxes. Under the hood, Drimsheet will use accounting standards to set up their ledgers.\
\
Drimsheet was created with 💜 and distributed for free by [Osahon Oboite](https://osahon.dev)

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the app](#running-the-app)
  - [Testing](#testing)
  - [Linting and Formatting](#linting-and-formatting)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Introduction

This repo contains the frontend web application of Drimsheet. It provides the user interface for the core accounting module, NTA computation and filing integrations, open banking reconciliations, and connects with the backend API.

## Requirements

- Node.js (>=20.18.1 as specified in `package.json`)
- npm or yarn

## Installation

- Clone the repo
- Run `npm install` or `yarn install`
- Copy the environment variables from Doppler (dev) and save them in a `.env` file in the root directory.
- Use [`.env.example`](.env.example) as the public/build-time variable reference. Local development does not require Sentry credentials.

### Running the app

- Run `npm run dev` or `yarn dev`
- The app should now be running on `http://localhost:5173` (or the port specified in Vite config/env)

### Testing

Run component and module tests:

```bash
npm run test
```

Install Chromium once, then run browser integration tests:

```bash
npx playwright install chromium
npm run typecheck:integration
npm run test:integration
```

Use `npm run test:integration:ui` for Playwright UI mode. Browser integration
tests run the real frontend with controlled API responses and do not require a
live backend or credentials. Full-system E2E tests live in a separate
repository.

Generate application code coverage for the Playwright journeys with:

```bash
npm run test:integration:coverage
```

Open `coverage/playwright/index.html` to inspect the source report.

See [the testing workflow](.agents/workflow/testing.md) for test selection,
placement, focused commands, and CI requirements.

### Linting and Formatting

Lint your code before submitting a PR:

```bash
npm run lint
```

## Documentation

**[Architecture Documentation](docs/README.md)**: A comprehensive guide to the system's architecture, including technical constraints, domain models, and architectural decisions.

**[Frontend Observability Operations](src/_app/__docs__/observability.md)**:
Sentry configuration, privacy controls, source maps, Coolify health, external
availability checks, alert ownership, staging smoke tests, and rollback.

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPLv3)](LICENSE).
