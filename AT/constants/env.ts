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
  baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:8080/',
  adminApiSecret: requireEnv('ADMIN_API_SECRET'),
  testUserPassword: process.env.TEST_USER_PASSWORD ?? '123456',
};
