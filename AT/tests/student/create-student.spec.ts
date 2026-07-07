import { test } from '@playwright/test';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { MESSAGE } from '../../constants/messages';
import { buildRegisterData } from '../../test-data/register.data';
import { buildStudentData } from '../../test-data/student.data';
import { LoginPage } from '../../pages/LoginPage';
import { StudentPage } from '../../pages/StudentPage';

test.describe('Student', () => {
  // Dùng một user riêng cho suite này (thay vì hardcode user cố định)
  // để test có thể chạy độc lập, song song, không phụ thuộc dữ liệu của auth spec.
  const user = buildRegisterData();

  test.beforeAll(async ({ request }) => {
    const response = await request.post(API.auth.register, { data: user });
    if (!response.ok()) {
      throw new Error(`Setup failed: cannot register test user. Status: ${response.status()}`);
    }
  });

  test.afterAll(async ({ request }) => {
    await request.delete(API.admin.deleteUser, {
      params: { username: user.username, secret: ENV.adminApiSecret },
    });
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open(ENV.baseURL);
    await loginPage.login(user.username, user.password);
  });

  test('STU-01: Tạo học sinh mới thành công', async ({ page }) => {
    const studentPage = new StudentPage(page);
    const student = buildStudentData();

    await studentPage.expectLoaded(user.fullname);
    await studentPage.createStudent(student);

    await studentPage.expectToastVisible(MESSAGE.STUDENT.createSuccess);
    await studentPage.expectStudentInList(student.studentId, student.fullName);
  });
});
