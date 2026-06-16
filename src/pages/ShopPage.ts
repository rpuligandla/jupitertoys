import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Shop Page Object
 * Handles product selection and adding items to cart
 * Provides methods to navigate to the shop page, retrieve product information, and add products to the cart
 */
export class ShopPage extends BasePage {
  private readonly productCards = "li.product";

  // Constructor to initialize the ShopPage with the Playwright Page object
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to shop page
   */
  async navigate(): Promise<void> {
    await this.goto("/#/shop");
    await this.waitForPageLoad();
  }

  /**
   * Wait until shop products are rendered
   */
  async waitForShopProducts(): Promise<void> {
    await super.waitForPageLoad();
    await this.page.locator(this.productCards).first().waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  /**
   * Get all products
   */
  async getAllProducts(): Promise<Array<{ name: string; price: string }>> {
    await this.waitForShopProducts();

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
   * Add product to cart by name and quantity
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

  private async getProductCard(productName: string) {
    await this.waitForShopProducts();

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
