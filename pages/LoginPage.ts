import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginLink: Locator;
  readonly loginErrorMessage: Locator;
  readonly loginSuccessIndicator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page
      .getByTestId("login-email")
      .or(page.locator('input[type="email"], input[name="email"]'));
    this.passwordInput = page
      .getByTestId("login-password")
      .or(page.locator('input[type="password"], input[name="password"]'));
    this.loginButton = page
      .getByTestId("login-submit")
      .or(page.getByRole("button", { name: /log in|login|sign in/i }));
    this.loginLink = page
      .getByTestId("nav-login")
      .or(page.getByRole("button", { name: /log in|login|sign in/i }))
      .or(page.getByRole("link", { name: /log in|login|sign in/i }));
    this.loginErrorMessage = page
      .getByTestId("login-error")
      .or(page.locator(".error, .alert-error, [role='alert']"));
    this.loginSuccessIndicator = page
      .getByTestId("account-menu")
      .or(page.locator("[data-auth='logged-in']"))
      .or(page.getByText(/welcome|my account|logout|sign out/i));
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async openLoginIfPresent(): Promise<void> {
    if (await this.loginLink.first().isVisible().catch(() => false)) {
      await this.loginLink.first().click();
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.first().fill(email);
    await this.passwordInput.first().fill(password);
    await this.loginButton.first().click();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.loginSuccessIndicator.first()).toBeVisible({ timeout: 7000 });
  }

  async expectLoginFailure(): Promise<void> {
    await expect(this.loginErrorMessage.first()).toBeVisible({ timeout: 7000 });
  }
}
