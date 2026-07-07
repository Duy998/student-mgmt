import { test, expect } from '@playwright/test';
import path from 'path';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { buildRegisterData } from '../../test-data/register.data';
import { LoginPage } from '../../pages/LoginPage';
import { StudentPage } from '../../pages/StudentPage';
import { readExcelAsRows } from '../../utils/excel';

// File mẫu: test-data/excel/student-import.xlsx — chứa sẵn danh sách học sinh
// dùng để test tính năng "Nhập Excel" trên UI.
const IMPORT_FILE = path.resolve(__dirname, '../../test-data/excel/student-import.xlsx');

test.describe('Import Student from Excel', () => {
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

  test('IMP-01: Nhập danh sách học sinh từ file Excel thành công', async ({ page }) => {
    const studentPage = new StudentPage(page);
    const rows = readExcelAsRows<{ studentId: string; fullName: string }>(IMPORT_FILE);
    expect(rows.length).toBeGreaterThan(0);

    await studentPage.expectLoaded(user.fullname);
    await studentPage.importFromExcel(IMPORT_FILE);

    // Verify từng học sinh trong file mẫu đều xuất hiện trên bảng danh sách.
    for (const row of rows) {
      await studentPage.expectStudentInList(row.studentId, row.fullName);
    }
  });
});
