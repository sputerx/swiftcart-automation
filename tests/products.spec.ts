import { expect, test } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { testData } from "../utils/testData";

test.describe("Swiftcart Products", () => {
  test("should search products", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();
    await productsPage.searchProduct(testData.searchQuery);
    await productsPage.expectProductsVisible();
    await expect(page).toHaveURL(new RegExp(`q=${testData.searchQuery}`, "i"));
  });

  test("should apply product category filter", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();
    await productsPage.applyCategoryFilter(testData.filterCategory);
    await productsPage.expectProductsVisible();
  });
});
