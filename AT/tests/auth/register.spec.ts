import { test, expect } from '@playwright/test';
import { buildRegisterData } from '@test-data/register.data';
import { ENV } from '@constants/env';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { MESSAGE } from '@constants/messages';
import {UserApi} from '@API/UserApi';

test.describe('Register', () => {
  const registerData = buildRegisterData();

  test.afterAll(async () => {
    const userApi = new UserApi();
    const response = await userApi.deleteByUsername(registerData.username);
    expect(response.ok()).toBeTruthy();
  });

  test('AUTH-01: Đăng ký tài khoản mới thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.open(ENV.ui.baseUrl);
    await registerPage.openFromLogin();
    await registerPage.register(registerData);
    await registerPage.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    await expect(page.getByText('Quản lý Học sinh')).toBeVisible();
  });
});
