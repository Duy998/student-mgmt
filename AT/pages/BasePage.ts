import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage chứa các hành vi/assert dùng chung cho mọi Page Object.
 * Mọi Page Object cụ thể nên extends class này thay vì lặp lại code.
 */
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
