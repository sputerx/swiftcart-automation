import { expect, Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterDropdown: Locator;
  readonly categoryCheckbox: Locator;
  readonly productCard: Locator;
  readonly productLink: Locator;
  readonly productCountText: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page
      .getByTestId("search-input")
      .or(page.getByRole("searchbox"))
      .or(page.locator("input[placeholder*='Search']"));
    this.searchButton = page
      .getByTestId("search-submit")
      .or(page.getByRole("button", { name: /search/i }));
    this.filterDropdown = page
      .getByTestId("products-filter")
      .or(page.locator("select[data-testid='category-filter'], select"));
    this.categoryCheckbox = page
      .getByTestId("category-checkbox")
      .or(page.getByRole("checkbox"));
    this.productCard = page
      .getByTestId("product-card")
      .or(page.locator("[data-testid='product-item'], .product-card, [class*='product']"));
    this.productLink = page
      .getByTestId("product-link")
      .or(page.locator("a[href*='/products/']"));
    this.productCountText = page
      .getByTestId("products-count")
      .or(page.getByText(/products?/i));
    this.addToCartButton = page
      .getByTestId("add-to-cart")
      .or(page.getByRole("button", { name: /add to cart/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto("/products");
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.first().fill(query);
    await this.searchInput.first().press("Enter").catch(() => {});
    await expect(this.page).toHaveURL(new RegExp(`q=${query}`, "i"));
  }

  async applyCategoryFilter(category: string): Promise<void> {
    const categoryOption = this.page
      .getByTestId(`filter-${category.toLowerCase()}`)
      .or(this.page.getByRole("checkbox", { name: new RegExp(category, "i") }));
    if (await categoryOption.first().isVisible().catch(() => false)) {
      await categoryOption.first().check().catch(async () => {
        await categoryOption.first().click();
      });
      return;
    }

    if (await this.filterDropdown.first().isVisible().catch(() => false)) {
      await this.filterDropdown.first().selectOption({ label: category }).catch(async () => {
        await this.filterDropdown.first().selectOption({ value: category.toLowerCase() });
      });
    }
  }

  async addFirstProductToCart(): Promise<void> {
    if (await this.productLink.first().isVisible().catch(() => false)) {
      await this.productLink.first().click();
      await expect(this.page).toHaveURL(/\/products\//);
    }

    if (await this.addToCartButton.first().isVisible().catch(() => false)) {
      await this.addToCartButton.first().click();
      return;
    }

    await this.productCard.first().scrollIntoViewIfNeeded();
    const cardButton = this.productCard.first().getByRole("button", { name: /add to cart/i });
    await cardButton.click();
  }

  async expectProductsVisible(): Promise<void> {
    const cardVisible = await this.productCard.first().isVisible().catch(() => false);
    if (cardVisible) {
      await expect(this.productCard.first()).toBeVisible({ timeout: 7000 });
      return;
    }
    await expect(this.productLink.first()).toBeVisible({ timeout: 7000 });
  }
}
