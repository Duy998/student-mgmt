
import { test as base, expect} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';

export { expect };
export const test = base.extend<{

    loginPage: LoginPage;
    registerPage: RegisterPage;

}>({

    loginPage: async ({ page }, use) => {
        const login = new LoginPage(page);
        await use(login);
    },

    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    } 

});