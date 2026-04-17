import { test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { ProductsPage } from "../pages/ProductsPage";

test.describe("Swiftcart Cart", () => {
  test("should add product to cart", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.expectProductsVisible();
    await productsPage.addFirstProductToCart();
    await cartPage.openCart();
    await cartPage.expectCartHasAtLeastOneItem();
  });
});
