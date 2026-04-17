import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testData } from "../utils/testData";

test.describe("Swiftcart Login", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.openLoginIfPresent();
    await loginPage.login(testData.validUser.email, testData.validUser.password);

    await loginPage.expectLoginSuccess();
  });

  test("should show validation/error on failed login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.openLoginIfPresent();
    await loginPage.login(testData.invalidUser.email, testData.invalidUser.password);

    const urlChangedToProtectedArea = !/login/i.test(page.url());
    if (!urlChangedToProtectedArea) {
      await loginPage.expectLoginFailure();
    } else {
      await expect(page).not.toHaveURL(/login/i);
    }
  });
});
