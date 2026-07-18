import { Page } from "@playwright/test";
import { StudentPage } from "@pages/StudentPage";
import { MESSAGE } from '@constants/messages';
import { BaseAssertion } from "./BaseAssertion";


export class StudentAssertion extends BaseAssertion{


    constructor(
      page: Page,
      private studentPage: StudentPage){
        super(page);
      }
    
    async verifyStudentSuccess() {
      await this.expectToastVisible(MESSAGE.STUDENT.createSuccess);
    }
    

}

