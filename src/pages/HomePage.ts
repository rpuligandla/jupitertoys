import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Home Page Object
 * Represents the home page of the PlanIT application
 */
export class HomePage extends BasePage {
  // Main navigation links
  private readonly navMenu = "ul.nav";

  // Constructor to initialize the HomePage with the Playwright Page object
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   * @returns Promise that resolves when the navigation is complete
   */
  async navigate(): Promise<void> {
    await this.goto("/");
    await this.waitForPageLoad();
  }

  /**
   * Click on Contact navigation link
   * @returns Promise that resolves when the navigation is complete
   */
  async goToContact(): Promise<void> {
    await this.page
      .locator(this.navMenu)
      .first()
      .getByRole("link", { name: "Contact", exact: true })
      .click();
    await this.page.waitForURL("**/#/contact", { timeout: 10000 });
  }

  /**
   * Click on Shop navigation link
   * @returns Promise that resolves when the navigation is complete
   */
  async goToShop(): Promise<void> {
    await this.page
      .locator(this.navMenu)
      .first()
      .getByRole("link", { name: "Shop", exact: true })
      .click();
    await this.page.waitForURL("**/#/shop", { timeout: 10000 });
    await this.page.locator("li.product").first().waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  /**
   * Click on Cart navigation link
   * @returns Promise that resolves when the navigation is complete
   */
  async goToCart(): Promise<void> {
    await this.page
      .locator(this.navMenu)
      .nth(1)
      .getByRole("link", { name: /^Cart/i })
      .click();
    await this.page.waitForURL("**/#/cart", { timeout: 10000 });
  }

  /**
   * Check if page is loaded
   * @returns Promise that resolves to true if the page is loaded, otherwise false
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.page
        .locator(this.navMenu)
        .first()
        .getByRole("link", { name: "Contact", exact: true })
        .isVisible();
      return isVisible;
    } catch {
      return false;
    }
  }
}
