import { Page, Locator } from "@playwright/test";

/**
 * Base Page Object class providing common functionality for all pages
 * Implements the Page Object Model pattern for maintainable test code
 */
export class BasePage {
  readonly page: Page;

  /**
   * Initialize the page object with the Playwright Page instance
   * @param page - Playwright Page object for browser interaction
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page URL
   * @param url - Relative or absolute URL to navigate to (default: current URL)
   */
  async goto(url: string = ""): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for page load state to ensure the page is fully loaded before interactions
   * Uses "networkidle" to wait until there are no network connections for at least 500ms
   * @param timeout - Maximum time to wait for page load (default: 30000ms)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
  }

  /**
   * Get element by selector/locator
   * @param selector - CSS or XPath selector for the element
   * @returns Locator object for the element
   */
  protected getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Click element
   * @param selector - CSS or XPath selector for the element
   * @param options - Optional click options (e.g., delay)
   */
  async click(selector: string, options?: { delay?: number }): Promise<void> {
    const element = this.getElement(selector).first();
    await element.waitFor({ state: "visible", timeout: 10000 });
    await element.click(options);
  }

  /**
   * Fill text in input field
   * @param selector - CSS or XPath selector for the input field
   * @param text - Text to fill in the input field
   */
  async fillText(selector: string, text: string): Promise<void> {
    const element = this.getElement(selector);
    await element.waitFor({ state: "visible", timeout: 10000 });
    await element.clear();
    await element.fill(text, { timeout: 10000 });
  }

  /**
   * Get text from element
   * @param selector - CSS or XPath selector for the element
   * @returns Text content of the element
   */
  async getText(selector: string): Promise<string> {
    const element = this.getElement(selector);
    await element.waitFor({ state: "visible", timeout: 10000 });
    const text = await element.textContent();
    return text || "";
  }

  /**
   * Check if element is visible
   * @param selector - CSS or XPath selector for the element
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    const element = this.getElement(selector);
    return element.isVisible().catch(() => false);
  }

  /**
   * Get element count
   * @param selector - CSS or XPath selector for the elements
   * @returns Number of elements matching the selector
   */
  async getElementCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  /**
   * Select dropdown option by value
   * @param selector - CSS or XPath selector for the dropdown element
   * @param value - Value of the option to select
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.getElement(selector).selectOption(value);
  }

  /**
   * Get page title
   * @returns Title of the current page
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns Current URL of the page
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Switch to iframe
   * @param selector - CSS or XPath selector for the iframe element
   * @returns Playwright Page object for the iframe
   */
  getIframe(selector: string): Page {
    return this.page.frameLocator(selector).owner().page()!;
  }
}
