import { MESSAGE } from '@constants/messages';
import { BaseAssertion } from "./BaseAssertion";


export class RegisterAssertion extends BaseAssertion{

    async verifyRegisterSuccess() {
      await this.expectToastVisible(MESSAGE.AUTH.registerSuccess);
    }
    

}

