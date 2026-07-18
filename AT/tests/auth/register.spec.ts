import { test, expect } from '@fixtures/test.fixture';
import { buildRegisterData } from '@test-data/register.data';
import { ENV } from '@constants/env';
import { MESSAGE } from '@constants/messages';
import {UserApi} from '@API/user.api';

test.describe('Register', () => {
  const registerData = buildRegisterData();

  test.afterAll(async () => {
    const userApi = new UserApi();
    const response = await userApi.deleteByUsername(registerData.username);
    expect(response.ok()).toBeTruthy();
  });

  test('AUTH-01: New account registration successful', async ({ loginPage,registerPage }) => {
    await loginPage.open(ENV.ui.baseUrl);
    await registerPage.openFromLogin();
    await registerPage.register(registerData);
    await registerPage.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    await expect(loginPage.pageTitle).toBeVisible();
  });
});
