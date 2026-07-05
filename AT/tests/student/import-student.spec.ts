import { test, expect } from '@playwright/test';
import { ENV } from '../utils/env';
import { MESSAGE } from '../utils/constants';
import { buildRegisterData } from '../utils/test-data';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { StudentPage } from '../pages/StudentPage';

// Hai test bên dưới phụ thuộc thứ tự (đăng ký trước, login sau dùng chung user)
// nên chạy serial để tránh race condition khi fullyParallel đang bật ở config.
test.describe.serial('Authentication', () => {
  const registerData = buildRegisterData();

  test.afterAll(async ({ request }) => {
    // Dọn dữ liệu user vừa tạo để không ảnh hưởng các lần chạy tiếp theo.
    const response = await request.delete('/api/admin/delete-user', {
      params: {
        username: registerData.username,
        secret: ENV.adminApiSecret,
      },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('AUTH-01: Đăng ký tài khoản mới thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.open(ENV.baseURL);
    await registerPage.openFromLogin();
    await registerPage.register(registerData);

    await registerPage.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    await expect(page.getByText('Student Management')).toBeVisible();
  });

  test('AUTH-02: Đăng nhập bằng tài khoản vừa đăng ký thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const studentPage = new StudentPage(page);

    await loginPage.open(ENV.baseURL);
    await loginPage.login(registerData.username, registerData.password);

    await studentPage.expectLoaded(registerData.fullname);
  });
});
