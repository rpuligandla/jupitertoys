import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Contact Page Object
 * Handles form validation, submission, and error message verification
 * Includes methods to fill form fields, submit the form, and check for success or error messages
 * Utilizes Playwright's locator strategies to interact with form elements and messages
 * Waits for asynchronous submission feedback before checking final state
 */
export class ContactPage extends BasePage {
  // Form field labels/roles
  private readonly forenameLabel = "Forename *";
  private readonly surnameLabel = "Surname";
  private readonly emailLabel = "Email *";
  private readonly phoneLabel = "Telephone";
  private readonly messageLabel = "Message *";

  // Inline validation messages
  private readonly requiredErrorTexts = [
    "Forename is required",
    "Email is required",
    "Message is required",
  ] as const;
  private readonly successMessage = ".alert-success";
  private readonly sendingFeedbackTitle = "Sending Feedback";
  private readonly successTextPattern = /Thanks/i;

  // Initialize ContactPage with Playwright Page object
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to contact page
   * Waits for page load to ensure the form is ready for interaction
   * @returns Promise that resolves when navigation and loading is complete
   */
  async navigate(): Promise<void> {
    await this.goto("/#/contact");
    await this.waitForPageLoad();
  }

  /**
   * Click submit button
   * Triggers form submission and any associated validation or asynchronous operations
   * @returns Promise that resolves when the click action is complete
   */
  async clickSubmit(): Promise<void> {
    await this.page.getByRole("link", { name: "Submit" }).click();
  }

  /**
   * Get all error messages
   * Checks for the presence and visibility of each required field error message
   * @returns Promise that resolves to an array of visible error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const errors: string[] = [];

    for (const text of this.requiredErrorTexts) {
      const errorLocator = this.page.getByText(text, { exact: true });
      if (
        (await errorLocator.count()) > 0 &&
        (await errorLocator.first().isVisible())
      ) {
        errors.push(text);
      }
    }

    return errors;
  }

  /**
   * Check if error messages are visible
   * @returns Promise that resolves to true if any error messages are visible, otherwise false
   */
  async hasErrorMessages(): Promise<boolean> {
    const forenameError = this.page.getByText("Forename is required", {
      exact: true,
    });
    return (
      (await forenameError.count()) > 0 &&
      (await forenameError.first().isVisible())
    );
  }

  /**
   * Get success message
   * Waits for any asynchronous submission feedback to complete before checking for success message
   * Checks for success message using both text pattern and specific selector to ensure reliability
   * @returns Promise that resolves to the success message text if visible, otherwise an empty string
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForSubmissionToComplete();

    const successTextLocator = this.page
      .getByText(this.successTextPattern)
      .first();
    if ((await successTextLocator.count()) > 0) {
      return (await successTextLocator.textContent())?.trim() || "";
    }

    await this.page.waitForSelector(this.successMessage, { timeout: 15000 });
    return this.getText(this.successMessage);
  }

  /**
   * Check if success message is visible
   * Waits for any asynchronous submission feedback to complete before checking for success message
   * Checks for success message using both text pattern and specific selector to ensure reliability
   * @returns Promise that resolves to true if success message is visible, otherwise false
   */
  async hasSuccessMessage(): Promise<boolean> {
    await this.waitForSubmissionToComplete();

    const successTextLocator = this.page
      .getByText(this.successTextPattern)
      .first();
    if ((await successTextLocator.count()) > 0) {
      return successTextLocator.isVisible();
    }

    return this.isVisible(this.successMessage).catch(() => false);
  }

  /**
   * Wait for async submission modal to finish before checking final state
   * @returns Promise that resolves when the submission modal is hidden
   */
  private async waitForSubmissionToComplete(): Promise<void> {
    const sendingHeading = this.page.getByRole("heading", {
      name: this.sendingFeedbackTitle,
    });

    if ((await sendingHeading.count()) > 0) {
      await sendingHeading.first().waitFor({ state: "hidden", timeout: 20000 });
    }
  }

  /**
   * Fill forename
   * @param forename - The forename to fill in the form
   * @returns Promise that resolves when the action is complete
   */
  async fillForename(forename: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: this.forenameLabel })
      .fill(forename);
  }

  /**
   * Fill surname
   * @param surname - The surname to fill in the form
   * @returns Promise that resolves when the action is complete
   */
  async fillSurname(surname: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: this.surnameLabel })
      .fill(surname);
  }

  /**
   * Fill email
   * @param emailAddress - The email address to fill in the form
   * @returns Promise that resolves when the action is complete
   */
  async fillEmail(emailAddress: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: this.emailLabel })
      .fill(emailAddress);
  }

  /**
   * Fill phone
   * @param phoneNumber - The phone number to fill in the form
   * @returns Promise that resolves when the action is complete
   */
  async fillPhone(phoneNumber: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: this.phoneLabel })
      .fill(phoneNumber);
  }

  /**
   * Fill message
   * @param messageText - The message to fill in the form
   * @returns Promise that resolves when the action is complete
   */
  async fillMessage(messageText: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: this.messageLabel })
      .fill(messageText);
  }

  /**
   * Fill all form fields
   * @param data - Object containing all form field values
   * @returns Promise that resolves when all fields have been filled
   */
  async fillAllFields(data: {
    forename: string;
    surname: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<void> {
    await this.fillForename(data.forename);
    await this.fillSurname(data.surname);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.fillMessage(data.message);
  }

  /**
   * Submit form with all required fields
   * @param data - Object containing all form field values
   * @returns Promise that resolves when the form has been submitted
   */
  async submitForm(data: {
    forename: string;
    surname: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<void> {
    await this.fillAllFields(data);
    await this.clickSubmit();
  }

  /**
   * Clear all form fields
   * @returns Promise that resolves when all fields have been cleared
   */
  async clearForm(): Promise<void> {
    await this.page.getByRole("textbox", { name: this.forenameLabel }).clear();
    await this.page.getByRole("textbox", { name: this.surnameLabel }).clear();
    await this.page.getByRole("textbox", { name: this.emailLabel }).clear();
    await this.page.getByRole("textbox", { name: this.phoneLabel }).clear();
    await this.page.getByRole("textbox", { name: this.messageLabel }).clear();
  }

  /**
   * Get all field values
   * @returns Promise that resolves to an object containing all form field values
   */
  async getFormValues(): Promise<{
    forename: string;
    surname: string;
    email: string;
    phone: string;
    message: string;
  }> {
    const forename = await this.page
      .getByRole("textbox", { name: this.forenameLabel })
      .inputValue();
    const surname = await this.page
      .getByRole("textbox", { name: this.surnameLabel })
      .inputValue();
    const emailValue = await this.page
      .getByRole("textbox", { name: this.emailLabel })
      .inputValue();
    const phoneValue = await this.page
      .getByRole("textbox", { name: this.phoneLabel })
      .inputValue();
    const messageValue = await this.page
      .getByRole("textbox", { name: this.messageLabel })
      .inputValue();

    return {
      forename: forename || "",
      surname: surname || "",
      email: emailValue || "",
      phone: phoneValue || "",
      message: messageValue || "",
    };
  }
}
