import { expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { MESSAGE } from "@constants/messages";
import { RegisterPage } from '@pages/RegisterPage';
export class LoginAssertion {

    constructor(private registerPage: RegisterPage){}
    async verifyRegisterSuccess() {
    await expect(this.registerPage.toast).toHaveText("Register successfully");    
  }
    

}

