import { faker } from '@faker-js/faker';
import { STUDENT_FORM_DEFAULTS } from '../constants/messages';
import { uniquePhoneVN } from '../utils/random';
import type { StudentData } from '../pages/StudentPage';

/**
 * Factory sinh dữ liệu học sinh mới, studentId luôn unique để tránh
 * đụng độ "duplicate student code" giữa các lần chạy test song song.
 */
export function buildStudentData(overrides: Partial<StudentData> = {}): StudentData {
  const unique = faker.string.numeric(6);
  return {
    studentId: `STU_${unique}`,
    fullName: faker.person.fullName(),
    dateOfBirth: '2005-01-15',
    gender: STUDENT_FORM_DEFAULTS.gender,
    email: faker.internet.email().toLowerCase(),
    phoneNumber: uniquePhoneVN(),
    address: faker.location.streetAddress(),
    className: STUDENT_FORM_DEFAULTS.className,
    averageScore: '8.6',
    status: STUDENT_FORM_DEFAULTS.status,
    ...overrides,
  };
}
