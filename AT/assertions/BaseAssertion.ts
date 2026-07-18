import { expect, Page } from "@playwright/test";

export class BaseAssertion{

    constructor(protected readonly page: Page) {}

    async expectToastVisible(message: string) {

        await expect(
            this.page.getByText(message)
        ).toBeVisible();

    }

    async expectTitleVisible(title: string) {

        await expect(
            this.page.getByRole("heading", {
                name: title
            })
        ).toBeVisible();

    }

    async expectUrl(url: string) {

        await expect(this.page).toHaveURL(url);

    }

}