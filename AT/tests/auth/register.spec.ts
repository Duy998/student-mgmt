import { test, expect } from '@playwright/test';
import { buildRegisterData } from '../../test-data/register.data';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { MESSAGE } from '../../constants/messages';

test.describe('Register', () => {
  const registerData = buildRegisterData();

  // test.afterAll(async ({ request }) => {

  //   const response = await request.delete(API.admin.deleteUser, {
  //     params: {
  //       username: registerData.username,
  //       secret: ENV.adminApiSecret,
  //     },
  //   });
  //   expect(response.ok()).toBeTruthy();
  // });

  test('AUTH-01: Đăng ký tài khoản mới thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.open(ENV.baseURL);
    await registerPage.openFromLogin();
    await registerPage.register(registerData);

    await registerPage.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    await expect(page.getByText('Quản lý Học sinh')).toBeVisible();
  });
});
