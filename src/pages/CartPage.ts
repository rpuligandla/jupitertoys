import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Cart Page Object
 * Handles cart operations including verification of prices, subtotals, and totals
 */
export class CartPage extends BasePage {
  // Selectors
  private readonly cartRows = "table.table tbody tr";

  /**
   * Initialize CartPage with Playwright Page object
   * @param page 
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   * Waits for page load and cart table to be visible before proceeding
    * @returns Promise that resolves when navigation and loading is complete
   */
  async navigate(): Promise<void> {
    await this.goto("/#/cart");
    await this.waitForPageLoad();
  }

  /**
   * Wait for cart page shell and any existing rows to render
   * Ensures that the cart table is visible before any interactions are attempted
   * @returns Promise that resolves when the cart table is visible
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.page.locator("table.table").first().waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  /**
   * Get all cart items
   * @returns Promise that resolves to an array of cart items, each containing name, price, quantity, and subtotal
   * Waits for cart rows to be present before attempting to read item details
   * Parses price and subtotal text to extract numeric values
   * Handles both input fields and static text for quantity
   */
  async getCartItems(): Promise<
    Array<{
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>
  > {
    await this.waitForRowsIfPresent();

    const items = [];
    const rowCount = await this.getElementCount(this.cartRows);

    for (let i = 0; i < rowCount; i++) {
      const row = this.page.locator(this.cartRows).nth(i);

      const name = await row.locator("td:first-child").textContent();
      const priceText = await row.locator("td:nth-child(2)").textContent();
      const quantityInput = row.locator("td:nth-child(3) input");
      const quantityText =
        (await quantityInput.count()) > 0
          ? await quantityInput.first().inputValue()
          : await row.locator("td:nth-child(3)").textContent();
      const subtotalText = await row.locator("td:nth-child(4)").textContent();

      if (name && priceText && quantityText && subtotalText) {
        items.push({
          name: name.trim(),
          price: this.parsePrice(priceText),
          quantity: parseInt(quantityText.trim(), 10),
          subtotal: this.parsePrice(subtotalText),
        });
      }
    }

    return items;
  }

  /**
   * Get item from cart by name
   * @param productName - Name of the product to search for
   * @returns Promise that resolves to the cart item if found, otherwise null
   */
  async getCartItem(productName: string): Promise<{
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  } | null> {
    const items = await this.getCartItems();
    return (
      items.find((i) =>
        i.name.toLowerCase().includes(productName.toLowerCase()),
      ) || null
    );
  }

  /**
   * Get cart total amount
   * @returns Promise that resolves to the total amount in the cart
   */
  async getCartTotal(): Promise<number> {
    const totalText =
      (await this.page
        .locator("text=/Total:\\s*\\d+(?:\\.\\d+)?/")
        .first()
        .textContent()
        .catch(() => "")) || "";

    return this.parsePrice(totalText);
  }

  /**
   * Calculate expected total from items
   * @returns Promise that resolves to the expected total amount
   */
  async calculateExpectedTotal(): Promise<number> {
    const items = await this.getCartItems();
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    return Math.round(total * 100) / 100;
  }

  /**
   * Verify subtotal for product
   * Checks if the cart item for the given product name has the expected price, quantity, and subtotal
   * @param productName - Name of the product to verify
   * @param expectedPrice - Expected price of the product
   * @param expectedQuantity - Expected quantity of the product
   * @returns Promise that resolves to true if verification passes, otherwise false
   */
  async verifyProductSubtotal(
    productName: string,
    expectedPrice: number,
    expectedQuantity: number,
  ): Promise<boolean> {
    const item = await this.getCartItem(productName);

    if (!item) {
      return false;
    }

    const expectedSubtotal = expectedPrice * expectedQuantity;
    return (
      item.price === expectedPrice &&
      item.quantity === expectedQuantity &&
      Math.abs(item.subtotal - expectedSubtotal) < 0.01
    );
  }

  /**
   * Verify total equals sum of subtotals
   * @returns Promise that resolves to true if the total matches the sum of subtotals, otherwise false
   */
  async verifyTotalEqualsSubtotalSum(): Promise<boolean> {
    const cartTotal = await this.getCartTotal();
    const expectedTotal = await this.calculateExpectedTotal();
    return Math.abs(cartTotal - expectedTotal) < 0.01;
  }

  /**
   * Get number of items in cart
   * Waits for cart rows to be present before counting
   * @returns Promise that resolves to the number of items in the cart
   */
  async getItemCount(): Promise<number> {
    await this.waitForRowsIfPresent();
    return this.getElementCount(this.cartRows);
  }

  /**
   * Waits for cart rows to be present before proceeding
   * @returns Promise that resolves when cart rows are present
   */
  async waitForRowsIfPresent(): Promise<void> {
    await this.page
      .waitForFunction(
        () => {
          const rows = document.querySelectorAll("table.table tbody tr");
          return rows.length > 0;
        },
        { timeout: 10000 },
      )
      .catch(() => undefined);
  }

  /**
   * Helper method to parse price from text
   * @param text - Text containing the price
   * @returns Parsed price as a number
   */
  private parsePrice(text: string): number {
    const match = text.match(/\$?([\d.]+)/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    return 0;
  }
}
