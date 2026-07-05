import { faker } from '@faker-js/faker';
import type { RegisterData } from '../pages/RegisterPage';
import { ENV } from '../constants/env';
/**
 * Factory sinh dữ liệu user đăng ký mới, mỗi lần gọi là một username/email
 * không trùng (dựa trên timestamp + random của faker).
 * Tránh lỗi "Username already registered" khi chạy test nhiều lần liên tiếp.
 */
export function buildRegisterData(overrides: Partial<RegisterData> = {}): RegisterData {
  const unique = faker.string.alphanumeric(6);
  return {
    username: `qa_${unique}`,
    email: `qa_${unique}@example.com`,
    fullname: faker.person.fullName(),
    password: ENV.testUserPassword,
    ...overrides,
  };
}