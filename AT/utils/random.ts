import { faker } from '@faker-js/faker';

/**
 * Helper sinh chuỗi/định danh ngẫu nhiên dùng chung, tách riêng khỏi các factory
 * nghiệp vụ (test-data/*.data.ts) vì đây là tiện ích kỹ thuật thuần tuý, không
 * gắn với domain object nào.
 */
export function uniqueSuffix(length = 6): string {
  return faker.string.alphanumeric(length);
}

export function uniquePhoneVN(): string {
  return '09' + faker.string.numeric(8);
}
