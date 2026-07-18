import { faker } from '@faker-js/faker';
import { ENV } from '../constants/env';
import { STUDENT_FORM_DEFAULTS } from './constants';
import type { RegisterData } from '../pages/RegisterPage';
import type { StudentData } from '../pages/StudentPage';




export function buildStudentData(overrides: Partial<StudentData> = {}): StudentData {
  const unique = faker.string.numeric(6);
  return {
    studentId: `STU_${unique}`,
    fullName: faker.person.fullName(),
    dateOfBirth: '2005-01-15',
    gender: STUDENT_FORM_DEFAULTS.gender,
    email: faker.internet.email().toLowerCase(),
    phoneNumber: '09' + faker.string.numeric(8),
    address: faker.location.streetAddress(),
    className: STUDENT_FORM_DEFAULTS.className,
    averageScore: '8.6',
    status: STUDENT_FORM_DEFAULTS.status,
    ...overrides,
  };
}
