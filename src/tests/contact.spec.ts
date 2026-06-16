import { test, expect } from "../fixtures/pageFixture";
import {
  validContactTestData,
  validContactTestDataArray,
} from "../../data/test-data";

test.beforeEach(async ({ homePage, contactPage }) => {
  // Step 1: Navigate to contact page
  await homePage.navigate();
  await homePage.goToContact();
  await contactPage.waitForPageLoad();
});

/**
 * Contact Form Test Cases
 * Validates form error handling and successful submission
 */
test.describe("Contact Form - Test Suite", () => {
  /**
   * Test Case 1: Form Validation
   * Steps:
   * 1. Navigate to contact page
   * 2. Click submit button without filling form
   * 3. Verify error messages are displayed
   * 4. Populate mandatory fields
   * 5. Verify error messages disappear
   */
  test("TC-001: Validate form error messages and clear on population", async ({
    page,
    contactPage,
  }) => {
    // Step 2: Click submit button without filling form
    await contactPage.clickSubmit();
    await page.waitForTimeout(1000);

    // Step 3: Verify error messages are displayed
    const hasErrors = await contactPage.hasErrorMessages();
    expect(hasErrors).toBe(true);

    const errorMessages = await contactPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);

    // Step 4: Populate mandatory fields
    await contactPage.fillAllFields(validContactTestData);

    // Step 5: Verify error messages disappear
    await page.waitForTimeout(500);
    const hasErrorsAfter = await contactPage
      .hasErrorMessages()
      .catch(() => false);
    expect(hasErrorsAfter).toBe(false);
  });

  /**
   * Test Case 2: Form Submission Success
   * Steps:
   * 1. Navigate to contact page
   * 2. Populate mandatory fields
   * 3. Click submit button
   * 4. Verify successful submission message
   * Run this test 5 times to ensure 100% pass rate
   */
  test.describe("TC-002: Contact Form Submission Success - Retry Test", () => {
    // Run this test 5 times with different data sets
    validContactTestDataArray.forEach((testData, index) => {
      test(`Attempt ${index + 1} of 5`, async ({ contactPage }) => {
        // Step 2: Populate mandatory fields
        await contactPage.fillAllFields(testData);

        // Step 3: Click submit button
        await contactPage.clickSubmit();

        // Step 4: Verify successful submission message
        const hasSuccess = await contactPage.hasSuccessMessage();
        expect(hasSuccess).toBe(true);

        const message = await contactPage.getSuccessMessage();
        expect(message).toContain("Thanks");
      });
    });
  });

  /**
   * Test Case 3: Form Field Validation (Additional Coverage)
   * Tests individual field behaviors
   */
  test("TC-003: Individual field validation", async ({
    homePage,
    contactPage,
  }) => {
    // Navigate to contact page
    await homePage.navigate();
    await homePage.goToContact();

    // Test clearing and refilling
    await contactPage.fillForename("John");
    let currentValues = await contactPage.getFormValues();
    await expect(currentValues.forename).toBe("John");

    await contactPage.clearForm();
    currentValues = await contactPage.getFormValues();
    expect(currentValues.forename).toBe("");
  });
});
