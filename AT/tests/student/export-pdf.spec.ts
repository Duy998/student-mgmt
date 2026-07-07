import { test, expect } from '@playwright/test';
import fs from 'fs';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { buildRegisterData } from '../../test-data/register.data';
import { buildStudentData } from '../../test-data/student.data';
import { LoginPage } from '../../pages/LoginPage';
import { StudentPage } from '../../pages/StudentPage';
import { downloadFileAfterClick } from '../../utils/download';

test.describe('Export Student List to PDF', () => {
  const user = buildRegisterData();
  const student = buildStudentData();

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

  test('EXP-02: Xuất danh sách học sinh ra file PDF thành công', async ({ page }) => {
    const studentPage = new StudentPage(page);

    await studentPage.createStudent(student);
    await studentPage.expectStudentInList(student.studentId, student.fullName);

    const filePath = await downloadFileAfterClick(page, studentPage.exportPdfTrigger);

    expect(filePath.toLowerCase()).toMatch(/\.pdf$/);
    const stats = fs.statSync(filePath);
    expect(stats.size, 'File PDF export ra không được rỗng').toBeGreaterThan(0);
  });
});
