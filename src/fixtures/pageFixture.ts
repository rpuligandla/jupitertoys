import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ContactPage } from "../pages/ContactPage";
import { ShopPage } from "../pages/ShopPage";
import { CartPage } from "../pages/CartPage";

/**
 * Custom Fixtures for Page Objects
 * Provides automatic instantiation and dependency injection of page objects
 * Scope: test (new instance per test)
 */
type PageFixtures = {
  homePage: HomePage;
  contactPage: ContactPage;
  shopPage: ShopPage;
  cartPage: CartPage;
};

/**
 * Extending the base test with page fixtures
 * Each fixture is an async function that creates an instance of the page object and yields it to the test
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
    // Optional: cleanup after test
  },

  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await use(contactPage);
  },

  shopPage: async ({ page }, use) => {
    const shopPage = new ShopPage(page);
    await use(shopPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
});

export { expect } from "@playwright/test";
