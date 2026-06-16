import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Shop Page Object
 * Handles product selection and adding items to cart
 * Provides methods to navigate to the shop page, retrieve product information, and add products to the cart
 * Extends BasePage to inherit common page functionalities
 */
export class ShopPage extends BasePage {
  private readonly productCards = "li.product";

  // Constructor to initialize the ShopPage with the Playwright Page object
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to shop page
   * Navigates to the shop page URL and waits for the page to load
   * @returns Promise that resolves when the navigation and loading is complete
   */
  async navigate(): Promise<void> {
    await this.goto("/#/shop");
    await this.waitForPageLoad();
  }

  /**
   * Wait until shop products are rendered
   * Ensures that the shop page has fully loaded and the product cards are visible before any interactions are attempted
   * @returns Promise that resolves when the product cards are visible
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.page.locator(this.productCards).first().waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  /**
   * Get all products
   * Retrieves the name and price of all products displayed on the shop page
   * Waits for the products to be visible before attempting to read their information
   * Parses the price text to extract numeric values
   * @returns Promise that resolves to an array of products, each containing name and price
   */
  async getAllProducts(): Promise<Array<{ name: string; price: string }>> {
    await this.waitForPageLoad();

    const products: Array<{ name: string; price: string }> = [];
    const cards = this.page.locator(this.productCards);
    const productCount = await cards.count();

    for (let i = 0; i < productCount; i++) {
      const card = cards.nth(i);
      const name =
        (await card.locator("h4").first().textContent())?.trim() || "";
      const cardText = (await card.innerText()).trim();
      const priceMatch = cardText.match(/\$\d+(?:\.\d{2})?/);
      const price = priceMatch ? priceMatch[0] : "";

      if (name && price) {
        products.push({
          name,
          price,
        });
      }
    }

    return products;
  }

  /**
   * Find product by name
   * Searches for a product by name and returns its index in the product list
   * Performed a case-insensitive search to find the product
   * @param productName The name of the product to find
   * @returns Promise that resolves to the index of the product if found, or null if not found
   */
  async findProduct(productName: string): Promise<number | null> {
    const products = await this.getAllProducts();
    const index = products.findIndex((p) =>
      p.name.toLowerCase().includes(productName.toLowerCase()),
    );

    return index === -1 ? null : index;
  }

  /**
   * Add product to cart by name and quantity
   * Finds the product card based on the provided product name and clicks the "Buy" button the specified number of times to add the desired quantity to the cart
   * @param productName The name of the product to add to the cart
   * @param quantity The quantity of the product to add to the cart
   * @returns Promise that resolves when the product has been added to the cart
   */
  async addProductToCart(productName: string, quantity: number): Promise<void> {
    const card = await this.getProductCard(productName);
    const buyButton = card.getByRole("link", { name: "Buy", exact: true });

    for (let i = 0; i < quantity; i++) {
      await buyButton.click();
    }
  }

  /**
   * Get product price
   * Finds the product card based on the provided product name, extracts the price text, and parses it to return a numeric value representing the price of the product
   * @param productName The name of the product to get the price for
   * @returns Promise that resolves to the price of the product as a number
   */
  async getProductPrice(productName: string): Promise<number> {
    const card = await this.getProductCard(productName);
    const cardText = (await card.innerText()).trim();
    const priceMatch = cardText.match(/\$\d+(?:\.\d{2})?/);

    if (!priceMatch) {
      throw new Error(`Price not found for product: ${productName}`);
    }

    return parseFloat(priceMatch[0].replace(/[^\d.]/g, ""));
  }

  /**
   * Get product card by name
   * Finds the product card element based on the provided product name
   * @param productName The name of the product to find
   * @returns Promise that resolves to the product card element
   */
  private async getProductCard(productName: string) {
    await this.waitForPageLoad();

    const cards = this.page.locator(this.productCards);
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const name =
        (await card.locator("h4").first().textContent())?.trim() || "";
      if (name.toLowerCase().includes(productName.toLowerCase())) {
        return card;
      }
    }

    throw new Error(`Product not found: ${productName}`);
  }
}
