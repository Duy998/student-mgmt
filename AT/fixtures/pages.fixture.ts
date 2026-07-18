
import { test as base, expect} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { StudentPage } from '@pages/StudentPage'
import { ENV } from '@constants/env';
import { RegisterAssertion } from '@assertions/RegisterAssertion'
import { LoginAssertion } from '@assertions/LoginAssertion';
import { StudentAssertion } from '@assertions/StudentAssertion';

export { expect };
export const pageTest = base.extend<{

    loginPage: LoginPage;
    registerPage: RegisterPage;
    studentPage: StudentPage;
    registerAssertion: RegisterAssertion;
    loginAssertion: LoginAssertion;
    studentAssertion: StudentAssertion;
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

    registerAssertion: async ({page }, use) => {
        await use(new RegisterAssertion(page ));
    }, 

    loginAssertion: async ({page, loginPage }, use) => {
        await use(new LoginAssertion(page ,loginPage));
    }, 
    studentAssertion: async ({page, studentPage }, use) => {
        await use(new StudentAssertion(page ,studentPage));
    }, 
    studentPage: async ({ page, loginPage }, use) => {
        await use(new StudentPage(page));
    } 
});