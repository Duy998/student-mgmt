import * as XLSX from 'xlsx';

/**
 * Đọc file .xlsx thành mảng object (mỗi phần tử là 1 dòng, key = tên cột ở header).
 * Dùng để:
 *  - đọc file mẫu test-data/excel/student-import.xlsx trước khi upload (import test)
 *  - đọc lại file vừa export ra để so khớp dữ liệu hiển thị trên UI (export test)
 *
 * Lưu ý: cần cài thêm dependency "xlsx" (`npm install xlsx`) — xem package.json.
 */
export function readExcelAsRows<T = Record<string, unknown>>(filePath: string): T[] {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
}
