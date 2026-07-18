import { Page } from "@playwright/test";
import { RegisterPage } from "@pages/RegisterPage";
import { MESSAGE } from '@constants/messages';
import { BaseAssertion } from "./BaseAssertion";


export class RegisterAssertion extends BaseAssertion{


    constructor(
      page: Page,
      private registerPage: RegisterPage){
        super(page);
      }
    

    async verifyRegisterSuccess() {
      //await expect(this.registerPage.pageTitle).toBeVisible();
      await this.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    }
    

}

