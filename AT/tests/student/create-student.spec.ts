import { pageTest as test, expect } from '@fixtures/pages.fixture';
import {buildStudentData} from '@test-data/student.data'

test.describe('create-student.spec', () => {
  const user = buildStudentData();

  test('STU-01: Student added successfully', async ({ studentPage }) => {

    await studentPage.openCreateForm();
    await studentPage.fillStudentForm(user);
    await studentPage.save();
  });
});
