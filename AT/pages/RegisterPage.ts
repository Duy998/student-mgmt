import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegisterData {
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export class RegisterPage extends BasePage {
  private readonly registerLink = this.page.getByText('Đăng ký ngay');
  private readonly registerTitle = this.page.getByText('Tạo tài khoản');

  private readonly fullnameInput = this.page.getByLabel('Họ và tên');
  private readonly usernameInput = this.page.getByRole('textbox', {name: 'Tên đăng nhập'});
  private readonly emailInput = this.page.getByRole('textbox', {name: 'Email'});
  private readonly passwordInput = this.page.getByRole('textbox', {name: 'Mật khẩu'});
  private readonly submitButton = this.page.getByRole('button', { name: 'Đăng ký' });

  constructor(page: Page) {
    super(page);
  }

  async openFromLogin() {
    await this.clickAndWait(this.registerLink);
    await expect(this.registerTitle).toBeVisible();
  }

  async register(data: RegisterData) {
    await this.fullnameInput.fill(data.fullname);
    await this.usernameInput.fill(data.username);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.clickAndWait(this.submitButton);
  }
}
