--- SKILL.md ---
name: e2e-testing
description: >
  Creating and running end-to-end Playwright tests for the Jupiter Toys project.
  Use this skill when: (1) writing or debugging Playwright tests,
  (2) defining page fixtures, (3) improving selector strategy, (4) running Playwright in local or CI environments.
---

# Jupiter Toys Playwright Testing

## When to Use This Skill

| Scenario                       | Use this repo |
| ------------------------------ | ------------- |
| Contact form validation        | ✅            |
| Shopping cart calculations     | ✅            |
| Browser compatibility checks   | ✅            |
| Page object and fixture design | ✅            |

## Running Tests

```bash
npm install
npx playwright install

# All tests
npm test

# Contact suite
npm run test:contact

# Shopping suite
npm run test:shopping

# Headed browser mode
npm run test:headed

# Playwright UI mode
npm run test:ui
npm run test:debug

# Single browser project
npx playwright test --project=chromium
npx playwright test src/tests/contact.spec.ts --project=firefox
```

## Project Structure

```text
src/
  fixtures/
    pageFixture.ts
  pages/
    BasePage.ts
    HomePage.ts
    ContactPage.ts
    ShopPage.ts
    CartPage.ts
  tests/
    contact.spec.ts
    shopping-cart.spec.ts
data/
  test-data.ts
playwright.config.ts
package.json
tsconfig.json
```

## Quick Start

This repo uses page fixtures in `src/fixtures/pageFixture.ts` to instantiate page objects.

```typescript
import { test, expect } from "../fixtures/pageFixture";

test("Contact page shows validation errors", async ({ contactPage }) => {
  await contactPage.goto();
  await contactPage.submitEmptyForm();
  await expect(contactPage.requiredFieldError()).toBeVisible();
});
```

## Fixture Pattern

This project uses test-scoped page fixtures by default.

- Keep fixtures focused on creating page objects and shared test state.
- Prefer per-test fixtures unless there is a strong runtime or resource reason to share state across tests.
- Avoid module-level mutable state.
- Keep assertions in specs; page objects should expose actions and selectors.

### Page Fixture Guidance

```typescript
import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

export const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
```

### Test File Guidance

- Use `test.describe` for related scenarios.
- Keep each test isolated so it can run independently.
- Use `test.beforeEach` for common navigation or setup.
- Avoid `test.describe.serial` unless serial ordering is explicitly required.

## Browser and CI Settings

The current `playwright.config.ts` defines:

- `chromium`, `firefox`, and `webkit` projects
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'on'`
- `retries: 2` in CI, `0` locally
- `workers: 1` in CI, `4` locally

## Test Design

- Prefer selectors such as `page.getByTestId(...)` or `page.getByRole(...)`.
- Avoid brittle selectors like `page.locator('.btn-primary')` in specs.
- Keep helper methods in `src/pages` and test flow in `src/tests`.
- Use explicit page object methods instead of embedding UI details in specs.

## Environment Variables

This repository supports the following optional environment variables:

- `BASE_URL` — defaults to `http://jupiter.cloud.planittesting.com/`
- `TIMEOUT` — default Playwright timeout in milliseconds
- `HEADLESS` — set `false` to run headed browsers locally

## Reference

See `README.md` for repository-level setup, browser project usage, and GitHub Actions expectations.
