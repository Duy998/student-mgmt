import { test, expect } from '@playwright/test';
import { buildRegisterData } from '../../test-data/register.data';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { LoginPage } from '../../pages/LoginPage';
import { StudentPage } from '../../pages/StudentPage';

test.describe('Login', () => {
  const user = buildRegisterData();

  // Tạo sẵn user qua API — test này chỉ verify hành vi LOGIN, không nên
  // phụ thuộc vào luồng UI register (đó là trách nhiệm của register.spec.ts).
  test.beforeAll(async ({ request }) => {
    const response = await request.post(API.auth.register, { data: user });
    if (!response.ok()) {
      throw new Error(`Setup thất bại: không tạo được user test. Status: ${response.status()}`);
    }
  });

  test.afterAll(async ({ request }) => {
    const response = await request.delete(API.admin.deleteUser, {
      params: { username: user.username, secret: ENV.adminApiSecret },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('AUTH-02: Đăng nhập bằng tài khoản hợp lệ thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const studentPage = new StudentPage(page);

    await loginPage.open(ENV.baseURL);
    await loginPage.login(user.username, user.password);

    await studentPage.expectLoaded(user.fullname);
  });
});
