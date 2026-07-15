import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOGIN_SELECTORS } from '@constants/selectors/pages/login.page';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByPlaceholder('Nhập tên đăng nhập');
  private readonly passwordInput = this.page.getByPlaceholder('Nhập mật khẩu');
  private readonly loginButton = this.page.locator('.btn-login');
  pageTitle = this.page.getByText(LOGIN_SELECTORS.title);

  constructor(page: Page) {
    super(page);
  }

  async open(baseURL: string) {
    await this.goto(baseURL);
    await expect(this.pageTitle).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.clickAndWait(this.loginButton);
  }
}
