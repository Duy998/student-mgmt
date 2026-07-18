import * as XLSX from 'xlsx';


export function readExcelAsRows<T = Record<string, unknown>>(filePath: string): T[] {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
}
