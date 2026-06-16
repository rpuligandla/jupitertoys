# Playwright Tests

Simple Playwright + TypeScript test framework for:

- Contact form scenarios
- Shopping cart calculations

The framework is intentionally minimal:

- Playwright test runner
- Page objects under src/pages
- Test specs under src/tests
- Shared test data in data/test-data.ts

## Requirements

- Node.js 18+
- npm 8+

## Setup

```bash
npm install
npx playwright install
```

Optional environment variables:

```env
BASE_URL=http://jupiter.cloud.planittesting.com/
TIMEOUT=30000
HEADLESS=true
```

## Run Tests

```bash
# All tests
npm test

# Contact suite
npm run test:contact

# Shopping suite
npm run test:shopping

# UI mode
npm run test:ui

# Headed mode
npm run test:headed

# Debug mode
npm run test:debug

# Open report
npm run test:report
```

## GitHub Actions

This repository includes a GitHub Actions workflow at `.github/workflows/web-test.yml`.

The workflow runs on `push` and `pull_request` events targeting `main`, and can also be started manually using `workflow_dispatch`.

It performs the following steps:

- checks out the repository
- sets up Node.js using `actions/setup-node`
- installs dependencies with `npm ci`
- installs Playwright browsers with `npx playwright install --with-deps`
- disables debug logging for CI
- runs the Playwright test suite with `npm test`
- uploads `test-results/` and `playwright-report/` as workflow artifacts

Artifacts are retained for 30 days by default, with the Playwright report artifact kept for 7 days.

## Project Structure

```text
planit/
├── src/
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── home.page.ts
│   │   ├── contact.page.ts
│   │   ├── shop.page.ts
│   │   └── cart.page.ts
│   └── tests/
│       ├── contact.spec.ts
│       └── shopping-cart.spec.ts
├── data/
│   └── test-data.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Design Notes

- Tests use plain @playwright/test (test, expect) for clarity.
- Page objects provide reusable UI actions only.
- Assertions stay in spec files so each test remains explicit and readable.
- Config defaults to one browser (chromium) for simpler local execution.

## Covered Scenarios

1. Contact page validation messages:

- Submit empty form
- Validate errors
- Fill mandatory fields
- Validate errors are gone

2. Contact page successful submission:

- Fill mandatory fields
- Submit form
- Validate success message
- Executed 5 times

3. Shopping cart verification:

- Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear
- Verify item price
- Verify item subtotal
- Verify total equals sum of subtotals

## Notes

- This repo is currently local-first and does not include CI workflow files.
- If needed, CI can be added later with a minimal Playwright workflow.
