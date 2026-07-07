import { Download, Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Bấm vào locator kích hoạt tải file (nút "Xuất Excel"/"Xuất PDF") và trả về
 * đường dẫn file đã lưu trên đĩa để các bước sau đọc/verify nội dung.
 *
 * Dùng chung cho mọi test export, tránh mỗi spec tự viết lại logic
 * page.waitForEvent('download') riêng lẻ.
 */
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
    throw new Error(`Download thất bại: ${failure}`);
  }
}
