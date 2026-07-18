import { Page, expect } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { BaseAssertion } from "./BaseAssertion";
export class LoginAssertion extends BaseAssertion{

    constructor(
      page: Page,
      private loginPage: LoginPage){
        super(page);
    }
    
    async verifyTitleLogin() {
        await this.expectTitleVisible(this.loginPage.pageTitle);
    }

    async verifyLoginSucess() {
        await this.expectTitleVisible(this.loginPage.usernameInfo);
    }


}

