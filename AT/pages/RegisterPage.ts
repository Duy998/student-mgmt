import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegisterData {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export class RegisterPage extends BasePage {
  private readonly registerLink = this.page.getByText('Sign up now');
  private readonly registerTitle = this.page.getByText('Create Account');

  private readonly fullnameInput = this.page.getByLabel('Fullname');
  private readonly usernameInput = this.page.getByRole('textbox', {name: 'Username'});
  private readonly emailInput = this.page.getByRole('textbox', {name: 'Email'});
  private readonly passwordInput = this.page.getByRole('textbox', {name: 'Password'});
  private readonly submitButton = this.page.getByRole('button', { name: 'Register' });

  constructor(page: Page) {
    super(page);
  }

  async openFromLogin() {
    await this.clickAndWait(this.registerLink);
    await expect(this.registerTitle).toBeVisible();
  }

  async register(data: RegisterData) {
    await this.fullnameInput.fill(data.full_name);
    await this.usernameInput.fill(data.username);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.clickAndWait(this.submitButton);
  }
}
