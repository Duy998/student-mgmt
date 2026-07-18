
import { test as base, expect} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { StudentPage } from '@pages/StudentPage'
import { ENV } from '@constants/env';
export { expect };
export const pageTest = base.extend<{

    loginPage: LoginPage;
    registerPage: RegisterPage;
    studentPage: StudentPage;

}>({

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open(ENV.ui.baseUrl);
        await loginPage.login(ENV.testUserAdmin, ENV.testPasswordAdmin);
        await use(loginPage);
    },

    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    studentPage: async ({ page, loginPage }, use) => {
        await use(new StudentPage(page));
    } 
});