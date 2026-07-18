import { faker } from '@faker-js/faker';
import type { RegisterData } from '../pages/RegisterPage';
import { ENV } from '../constants/env';

export function buildRegisterData(overrides: Partial<RegisterData> = {}): RegisterData {
  const unique = faker.string.alphanumeric(6);
  return {
    username: `qa_${unique}`,
    email: `qa_${unique}@example.com`,
    full_name: faker.person.fullName(),
    password: ENV.testPassword,
    ...overrides,
  };
}