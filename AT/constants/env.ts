/**
 * Đọc các biến môi trường cho test suite.
 * Có giá trị fallback cho local dev, nhưng nên luôn dùng .env (xem .env.example)
 * để tránh hardcode secret/URL trực tiếp trong source.
 */
export const ENV = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:5500/',
  adminApiSecret: process.env.ADMIN_API_SECRET ?? '8f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9a0',
  testUserPassword: process.env.TEST_USER_PASSWORD ?? '123456',
};
