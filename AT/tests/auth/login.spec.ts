import { test, expect } from '@playwright/test';


// Hai test bên dưới phụ thuộc thứ tự (đăng ký trước, login sau dùng chung user)
// nên chạy serial để tránh race condition khi fullyParallel đang bật ở config.
test.describe.serial('Login', () => {
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

  test('AUTH-01: Đăng nhập bằng tài khoản vừa đăng ký thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const studentPage = new StudentPage(page);

    await loginPage.open(ENV.baseURL);
    await loginPage.login(registerData.username, registerData.password);

    await studentPage.expectLoaded(registerData.fullname);
  });
});
