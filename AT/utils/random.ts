import { faker } from '@faker-js/faker';


export function uniqueSuffix(length = 6): string {
  return faker.string.alphanumeric(length);
}

export function uniquePhoneVN(): string {
  return '09' + faker.string.numeric(8);
}
