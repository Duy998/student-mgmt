
function requireEnv(name: string, fallbackForLocalDev?: string): string {
  const value = process.env[name] ?? fallbackForLocalDev;
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". Please create a .env file from .env.example and fill in the actual values.`
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
  testUserAdmin: 'admin',
  testPasswordAdmin: 'Admin@123',
  testPassword: process.env.TEST_USER_PASSWORD ?? '123456',
};

