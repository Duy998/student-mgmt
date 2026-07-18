import { test as setup, expect } from "@playwright/test";

setup("Login Admin", async ({ page }) => {

    await page.goto("/login");

    await page.getByLabel("Username").fill("admin");

    await page.getByLabel("Password").fill("123456");

    await page.getByRole("button", {
        name: "Login"
    }).click();

    await expect(page).toHaveURL("/dashboard");

    await page.context().storageState({

        path: "playwright/.auth/admin.json"

    });

});