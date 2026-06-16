/**
 * Test Data Module
 * Centralized management of test data for consistency and maintainability
 */

export interface ContactFormData {
  forename: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
}

export interface ProductOrder {
  name: string;
  quantity: number;
}

/**
 * Valid contact form data
 */
export const validContactTestData: ContactFormData = {
  forename: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  phone: "0212345678",
  message: "This is a test message for the contact form.",
};

/**
 * Alternative valid contact data for retry tests
 */
export const validContactTestData1: ContactFormData = {
  forename: "Jane",
  surname: "Smith",
  email: "jane.smith@example.com",
  phone: "0298765432",
  message: "Testing contact form submission 2.",
};

export const validContactTestData2: ContactFormData = {
  forename: "Michael",
  surname: "Johnson",
  email: "michael.j@example.com",
  phone: "0311223344",
  message: "Testing contact form submission 3.",
};

export const validContactTestData3: ContactFormData = {
  forename: "Sarah",
  surname: "Williams",
  email: "sarah.w@example.com",
  phone: "0455667788",
  message: "Testing contact form submission 4.",
};

export const validContactTestData4: ContactFormData = {
  forename: "Robert",
  surname: "Brown",
  email: "robert.b@example.com",
  phone: "0499887766",
  message: "Testing contact form submission 5.",
};

/**
 * Array of valid contact data for retry tests
 */
export const validContactTestDataArray = [
  validContactTestData,
  validContactTestData1,
  validContactTestData2,
  validContactTestData3,
  validContactTestData4,
];

/**
 * Shopping cart test data
 */
export const shoppingItems: ProductOrder[] = [
  { name: "Stuffed Frog", quantity: 2 },
  { name: "Fluffy Bunny", quantity: 5 },
  { name: "Valentine Bear", quantity: 3 },
];

/**
 * Success message expected after form submission
 */
export const successMessage = "Thanks for your message!";
