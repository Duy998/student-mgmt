import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { ENV } from './constants/env';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  globalSetup:require.resolve('./config/global.setup'),
  globalTeardown:require.resolve('./config/global.teardown'),
  // ==============================
  // Global Timeout
  // ==============================
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  // ==============================
  // Run
  // ==============================
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // ==============================
  // Reporter
  // ==============================
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  // ==============================
  // Shared Settings
  // ==============================
  use: {
    baseURL: ENV.ui.baseUrl,
    // headless: process.env.CI ? true : false,

    // viewport: {
    //   width: 1920,
    //   height: 1080,
    // },
    trace: 'on-first-retry',
    // Chỉ giữ video/screenshot khi fail để tránh phình dung lượng artifact trên CI.
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  // ==============================
  // Browsers
  // ==============================
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
    // TODO: mở rộng sang firefox/webkit khi cần test cross-browser thật sự,
    // hiện tại app chỉ được yêu cầu support Chrome nên chỉ chạy 1 project.
  ],

  // Bỏ comment khi có script khởi động app + health-check, để CI tự start app
  // trước khi chạy test thay vì yêu cầu app đã chạy sẵn thủ công.
  // webServer: {
  //   command: 'npm run start --prefix ../student-mgmt-app',
  //   url: process.env.BASE_URL ?? 'http://localhost:5500/',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
  // ==============================
  // Output Folder
  // ==============================
  outputDir: 'test-results/',
});
