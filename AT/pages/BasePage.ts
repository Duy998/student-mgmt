import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async clickAndWait(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async expectToastVisible(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}
