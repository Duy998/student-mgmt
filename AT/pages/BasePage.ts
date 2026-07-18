import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async clickAndWait(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async expectToastVisible(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
