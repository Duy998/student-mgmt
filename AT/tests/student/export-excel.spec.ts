import { test, expect } from '@playwright/test';
import { ENV } from '../../constants/env';
import { API } from '../../constants/url';
import { buildRegisterData } from '../../test-data/register.data';
import { buildStudentData } from '../../test-data/student.data';
import { LoginPage } from '../../pages/LoginPage';
import { StudentPage } from '../../pages/StudentPage';
import { downloadFileAfterClick } from '../../utils/download';
import { readExcelAsRows } from '../../utils/excel';

test.describe('Export Student List to Excel', () => {
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

  test('EXP-01: Xuất danh sách học sinh ra file Excel thành công', async ({ page }) => {
    const studentPage = new StudentPage(page);

    // Tạo trước 1 học sinh để chắc chắn file export có dữ liệu để verify.
    await studentPage.createStudent(student);
    await studentPage.expectStudentInList(student.studentId, student.fullName);

    const filePath = await downloadFileAfterClick(page, studentPage.exportExcelTrigger);
    const rows = readExcelAsRows<{ studentId: string; fullName: string }>(filePath);

    const exportedRow = rows.find((r) => r.studentId === student.studentId);
    expect(exportedRow, 'Học sinh vừa tạo phải có mặt trong file Excel export ra').toBeTruthy();
    expect(exportedRow?.fullName).toBe(student.fullName);
  });
});
