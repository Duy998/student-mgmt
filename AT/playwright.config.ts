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
    // Only keep videos/screenshots on failure to avoid increasing artifact size on CI.
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
// TODO: Extend to firefox/webkit when real cross-browser testing is required.
// Currently, the app only needs to support Chrome, so only one project is configured.
    // {
    //     name: "setup-admin",
    //     testMatch: /admin\.setup\.ts/
    // },
    // {
    //     name: "Admin",
    //     use: {
    //         storageState:
    //             "playwright/.auth/admin.json"
    //     },
    //     dependencies: [
    //         "setup-admin"
    //     ]

    // }
  ],

  // Uncomment when there is an app startup script + health check,
  // so CI can automatically start the app before running tests
  // instead of requiring the app to be started manually beforehand.
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
