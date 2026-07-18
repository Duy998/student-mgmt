import { test, expect } from '@fixtures/test.fixture';
import { buildRegisterData } from '@test-data/register.data';
import { ENV } from '@constants/env';
import {UserApi} from '@API/user.api';

test.describe('Login', () => {
  const user = buildRegisterData();

  test.beforeAll(async () => {
    const userApi = new UserApi();
    const response = await userApi.register(user);
    expect(response.ok()).toBeTruthy();
  });

  test.afterAll(async () => {
    const userApi = new UserApi();
    const response = await userApi.deleteByUsername(user.username);
    expect(response.ok()).toBeTruthy();
  });

  test('AUTH-02: Login successful with valid account', async ({ loginPage }) => {

    await loginPage.open(ENV.ui.baseUrl);
    await loginPage.login(user.username, user.password);
    await expect(loginPage.usernameInfo).toBeVisible();
  });
});
