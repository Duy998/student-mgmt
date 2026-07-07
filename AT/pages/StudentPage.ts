import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface StudentData {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  className: string;
  averageScore: string;
  status: string;
}

export class StudentPage extends BasePage {
  private readonly pageTitle = this.page.getByText('Quản Lý Học Sinh');
  private readonly addStudentButton = this.page.getByRole('button', { name: 'Thêm Học Sinh' });
  private readonly saveButton = this.page.getByRole('button', { name: 'Lưu' });

  private readonly importButton = this.page.getByRole('button', { name: 'Nhập Excel' });
  private readonly importFileInput = this.page.locator('input[type="file"]');
  private readonly confirmImportButton = this.page.getByRole('button', { name: 'Xác nhận nhập' });

  private readonly exportExcelButton = this.page.getByRole('button', { name: 'Xuất Excel' });
  private readonly exportPdfButton = this.page.getByRole('button', { name: 'Xuất PDF' });

  private readonly studentCodeInput = this.page.locator('#studentCode');
  private readonly fullNameInput = this.page.locator('#fullName');
  private readonly dateOfBirthInput = this.page.locator('#dateOfBirth');
  private readonly genderSelect = this.page.locator('#gender');
  private readonly emailInput = this.page.locator('#email');
  private readonly phoneInput = this.page.locator('#phone');
  private readonly addressInput = this.page.locator('#address');
  private readonly classNameInput = this.page.locator('#className');
  private readonly gpaInput = this.page.locator('#gpa');
  private readonly statusSelect = this.page.locator('#status');

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(loggedInFullname: string) {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.page.getByText(loggedInFullname)).toBeVisible();
  }

  async openCreateForm() {
    await this.clickAndWait(this.addStudentButton);
  }

  async fillStudentForm(data: StudentData) {
    await this.studentCodeInput.fill(data.studentId);
    await this.fullNameInput.fill(data.fullName);
    await this.dateOfBirthInput.fill(data.dateOfBirth);
    await this.genderSelect.selectOption(data.gender);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phoneNumber);
    await this.addressInput.fill(data.address);
    await this.classNameInput.fill(data.className);
    await this.gpaInput.fill(data.averageScore);
    await this.statusSelect.selectOption(data.status);
  }

  async save() {
    await this.clickAndWait(this.saveButton);
  }

  async createStudent(data: StudentData) {
    await this.openCreateForm();
    await this.fillStudentForm(data);
    await this.save();
  }

  /** Kiểm tra học sinh vừa tạo có xuất hiện trong danh sách/bảng */
  async expectStudentInList(studentId: string, fullName: string) {
    const row = this.page.locator('tr', { hasText: studentId });
    await expect(row).toBeVisible();
    await expect(row).toContainText(fullName);
  }

  /** Import danh sách học sinh từ file Excel (.xlsx) */
  async importFromExcel(filePath: string) {
    await this.clickAndWait(this.importButton);
    await this.importFileInput.setInputFiles(filePath);
    await this.clickAndWait(this.confirmImportButton);
  }

  get exportExcelTrigger() {
    return this.exportExcelButton;
  }

  get exportPdfTrigger() {
    return this.exportPdfButton;
  }
}
