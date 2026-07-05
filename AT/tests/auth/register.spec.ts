import { test, expect } from '@playwright/test';
import { buildRegisterData } from '../../test-data/register.data';
import { ENV } from '../../constants/env';
import { LoginPage} from '../../pages/LoginPage';
import { RegisterPage} from '../../pages/RegisterPage';
import { MESSAGE} from '../../constants/messages';

test.describe.serial('Register', () => {
    const registerData = buildRegisterData();

    test.afterAll(async ({ request }, testInfo) => {

        const loginResponse = await request.post('/api/auth/login', {
        form: {
            grant_type: '',
            username: 'admin',
            password: 'Admin@123',
            scope: '',
            client_id: '',
            client_secret: '',
        },
        });
        expect(loginResponse.ok()).toBeTruthy();
        const { access_token }  = await loginResponse.json();
        console.log(access_token);

        // Dọn dữ liệu user vừa tạo để không ảnh hưởng các lần chạy tiếp theo.
        const response = await request.delete('/api/users/by-username/qa_5RfFjU', {
        headers: {
            Authorization: `Bearer ${ access_token }`,
        },
        });
        console.log(process.env.BASE_URL);
        console.log('Playwright BaseURL:', testInfo.project.use.baseURL);
        console.log('Status:', response.status());
        console.log('Status Text:', response.statusText());
        const body = await response.text();
        console.log('Response Body:', body);
        expect(response.ok()).toBeTruthy();
    });


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
