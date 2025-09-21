// src/services/excelService.js
import xlsx from 'xlsx';
import path from 'path';

export function parseExcelToJson(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const result = {};
    sheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        result[name] = xlsx.utils.sheet_to_json(sheet, { defval: null });
    });
    return result; // object: sheetName -> array of rows
}