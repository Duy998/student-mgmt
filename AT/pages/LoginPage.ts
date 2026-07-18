import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOGIN_SELECTORS } from '@constants/selectors/pages/login.page';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByLabel(LOGIN_SELECTORS.usernameInput);
  private readonly passwordInput = this.page.getByLabel(LOGIN_SELECTORS.passwordInput);
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' })
  pageTitle = this.page.getByRole("heading", {name: LOGIN_SELECTORS.title});
  usernameInfo = this.page.getByRole("heading", {name: LOGIN_SELECTORS.usernameInfo});

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
