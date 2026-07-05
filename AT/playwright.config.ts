import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'on',
    baseURL: 'http://localhost:8000',
    // launchOptions:
    //   args: ['--start-maximized'],
    // },
    // viewport: null,
  },

  /* Configure projects for major browsers */
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

  ],  
  // use: {
  //   baseURL: process.env.BASE_URL ?? 'http://localhost:5500/',
  //   trace: 'on-first-retry',
  //   // Chỉ giữ video khi test fail để tránh phình dung lượng artifact trên CI
  //   video: 'retain-on-failure',
  //   screenshot: 'only-on-failure',
  // },

  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },
  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },
  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },
  // ],

  // Tự động khởi động app trước khi chạy test (bỏ comment và chỉnh command theo app thật)
  // webServer: {
  //   command: 'npm run start --prefix ../student-mgmt-app',
  //   url: process.env.BASE_URL ?? 'http://localhost:3000/',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
