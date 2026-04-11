[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

# PurpleLedger

PurpleLedger is an AI-powered, robust, auditable accounting software for companies, sole traders (business name owners), and individuals in Nigeria.\
It's a software for accountants and non-accountants alike.

Accounting-savvy users who want to be in control of everything can create journals, charts of accounts, etc.

Users with no accounting background are not left out. They can also track their income, expenses and taxes. Under the hood, PurpleLedger will use accounting standards to set up their ledgers.\
\
PurpleLedger was created with 💜 and distributed for free by [Osahon Oboite](https://osahon.dev)

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

This repo contains the frontend web application of PurpleLedger. It provides the user interface for the core accounting module, NTA computation and filing integrations, open banking reconciliations, and connects with the backend API.

## Requirements

- Node.js (>=20.18.1 as specified in `package.json`)
- npm or yarn

## Installation

- Clone the repo
- Run `npm install` or `yarn install`
- Copy the environment variables from Doppler (dev) and save them in a `.env` file in the root directory.

### Running the app

- Run `npm run dev` or `yarn dev`
- The app should now be running on `http://localhost:5173` (or the port specified in Vite config/env)

### Testing

Run the test suite:

```bash
npm run test
```

### Linting and Formatting

Lint your code before submitting a PR:

```bash
npm run lint
```

## Documentation

**[Architecture Documentation](docs/README.md)**: A comprehensive guide to the system's architecture, including technical constraints, domain models, and architectural decisions.

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPLv3)](LICENSE).
