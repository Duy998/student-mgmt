import { Download, Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';


export async function downloadFileAfterClick(
  page: Page,
  trigger: Locator,
  saveDir = 'test-results/downloads'
): Promise<string> {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    trigger.click(),
  ]);

  fs.mkdirSync(saveDir, { recursive: true });
  const filePath = path.join(saveDir, download.suggestedFilename());
  await download.saveAs(filePath);
  return filePath;
}

export async function assertDownloadSucceeded(download: Download) {
  const failure = await download.failure();
  if (failure) {
    throw new Error(`Download failed: ${failure}`);
  }
}
