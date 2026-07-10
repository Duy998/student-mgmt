// config/global.setup.ts

import { chromium } from '@playwright/test';
import { ENV } from '../constants/env';

async function globalSetup() {
  console.log('========== GLOBAL SETUP ==========');

  const browser = await chromium.launch();

  const page = await browser.newPage();

  // Kiểm tra Frontend
  await page.goto(ENV.ui.baseUrl);

  console.log('Frontend is running');

  // Có thể login sẵn

  /*
  await page.fill('#username', ENV.admin.username);

  await page.fill('#password', ENV.admin.password);

  await page.click('button[type=submit]');

  await page.context().storageState({
      path: 'storage/admin.json',
  });
  */

  await browser.close();

  console.log('========== SETUP DONE ==========');
}

export default globalSetup;