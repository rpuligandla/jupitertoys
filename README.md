# PlanIT Playwright Tests

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
