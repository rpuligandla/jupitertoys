import { test, expect } from "../fixtures/pageFixture";
import { shoppingItems } from "../../data/test-data";

/**
 * Shopping Cart Test Suite
 * Tests product selection, cart calculation, and price verification
 */
test.describe("Shopping Cart - Test Suite", () => {
  test.beforeEach(async ({ homePage, shopPage }) => {
    // Step 1: Navigate to shop page
    await homePage.navigate();
    await homePage.goToShop();
    await shopPage.waitForPageLoad();
  });
  /**
   * Test Case 3: Shopping Cart Verification
   * Steps:
   * 1. Buy specified products:
   *    - 2 Stuffed Frog
   *    - 5 Fluffy Bunny
   *    - 3 Valentine Bear
   * 2. Navigate to cart page
   * 3. Verify subtotal for each product is correct
   * 4. Verify price for each product
   * 5. Verify that total = sum(sub totals)
   */
  test("TC-003: Verify shopping cart prices and totals", async ({
    homePage,
    shopPage,
    cartPage,
  }) => {
    // Setup: Store product prices for verification
    const productPrices: { [key: string]: number } = {};

    // Get all products and their prices
    await shopPage.getAllProducts();

    // Get prices for products we're buying
    for (const item of shoppingItems) {
      try {
        const price = await shopPage.getProductPrice(item.name);
        productPrices[item.name] = price;
      } catch (error) {
        throw error;
      }
    }

    // Add products to cart
    for (const item of shoppingItems) {
      try {
        await shopPage.addProductToCart(item.name, item.quantity);
      } catch (error) {
        throw error;
      }
    }

    // Step 2: Navigate to cart page
    await homePage.goToCart();
    await cartPage.waitForPageLoad();

    // Step 3: Verify subtotal for each product
    for (const item of shoppingItems) {
      try {
        const expectedPrice = productPrices[item.name];
        const verified = await cartPage.verifyProductSubtotal(
          item.name,
          expectedPrice,
          item.quantity,
        );
        await expect(verified).toBe(true);
      } catch (error) {
        throw error;
      }
    }

    // Step 4: Verify prices for each product
    const cartItems = await cartPage.getCartItems();

    for (const cartItem of cartItems) {
      const expectedPrice = productPrices[cartItem.name];
      if (expectedPrice) {
        await expect(
          Math.abs(cartItem.price - expectedPrice),
        ).toBeLessThanOrEqual(0.01);
      }
    }

    // Step 5: Verify total equals sum of subtotals
    const cartTotal = await cartPage.getCartTotal();
    const expectedTotal = await cartPage.calculateExpectedTotal();
    await expect(Math.abs(cartTotal - expectedTotal)).toBeLessThanOrEqual(0.01);

    // Additional verification
    const totalsMatch = await cartPage.verifyTotalEqualsSubtotalSum();
    await expect(totalsMatch).toBe(true);
  });

  /**
   * Test Case 4: Cart Operations (Additional Coverage)
   * Tests cart navigation and item retrieval
   */
  test("TC-004: Cart page navigation and item retrieval", async ({
    homePage,
    shopPage,
    cartPage,
  }) => {
    await shopPage.addProductToCart("Stuffed Frog", 1);

    await homePage.goToCart();
    await cartPage.waitForPageLoad();

    // Verify cart is populated
    const itemCount = await cartPage.getItemCount();
    await expect(itemCount).toBeGreaterThan(0);

    // Get and log cart contents
    await cartPage.getCartItems();
  });
});
