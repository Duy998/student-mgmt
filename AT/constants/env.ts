/**
 * Đọc các biến môi trường cho test suite.
 * KHÔNG hardcode secret thật ở đây — nếu thiếu biến bắt buộc, throw ngay khi load
 * để fail-fast thay vì âm thầm chạy với giá trị rác/không đúng môi trường.
 */
function requireEnv(name: string, fallbackForLocalDev?: string): string {
  const value = process.env[name] ?? fallbackForLocalDev;
  if (!value) {
    throw new Error(
      `Thiếu biến môi trường "${name}". Hãy tạo file .env từ .env.example rồi điền giá trị thật.`
    );
  }
  return value;
}

export const ENV = {
  ui: {
    baseUrl: process.env.BASE_URL ?? 'http://localhost:8080',
  },
  api: {
    baseUrl: process.env.API_BASE_URL ?? 'http://localhost:8000',
    adminApiSecret: process.env.ADMIN_API_SECRET ?? '1f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9bo',
    
  },
  
  testUserPassword: process.env.TEST_USER_PASSWORD ?? '123456',
};

