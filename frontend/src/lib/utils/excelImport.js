import ExcelJS from 'exceljs';

/**
 * Smart Header Field Matching Map
 */
const FIELD_ALIASES = {
  module: ['module', 'module name', 'category', 'sheet'],
  entryType: ['entry type', 'type', 'transaction type', 'side', 'action'],
  date: ['date', 'created date', 'transaction date', 'entry date', 'time'],
  customer: ['customer', 'customer / remarks', 'customer name', 'client', 'party', 'reason', 'remarks'],
  scrap: ['scrap', 'scrap (g)', 'scrap weight', 'weight', 'gross weight', 'gross (g)'],
  touch: ['touch', 'touch (%)', 'purity', 'purity (%)', 'karat'],
  pure: ['pure gold', 'pure gold (g)', 'pure (g)', 'pure', 'fine gold'],
  payment: ['payment', 'payment method', 'currency', 'pay mode'],
  totalIdr: ['total idr', 'idr', 'amount idr', 'rp', 'total rp'],
  totalDollar: ['total usdt', 'usdt', 'total dollar', 'usd', 'amount usd', 'amount usdt', 'dollar'],
  notes: ['notes', 'description', 'memo', 'remark', 'details'],
};

/**
 * Helper to match cell header to field name
 */
function matchHeaderToField(headerStr = '') {
  const clean = headerStr.toLowerCase().trim();
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((alias) => clean === alias || clean.includes(alias))) {
      return field;
    }
  }
  return null;
}

/**
 * Clean numeric values from strings (e.g. "$1,200.50" -> 1200.50, "15.5g" -> 15.5)
 */
function parseNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse Excel file buffer or array buffer using ExcelJS
 */
export async function parseExcelFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();

  const isCsv = file.name.endsWith('.csv');

  if (isCsv) {
    const text = new TextDecoder().decode(arrayBuffer);
    return parseCsvText(text);
  }

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No valid worksheet found in the uploaded file.');
  }

  const rawRows = [];
  let headerMap = {};
  let headerRowFound = false;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const values = row.values;
    // values is 1-indexed array from ExcelJS

    if (!headerRowFound) {
      // Find header row by searching for matches
      const possibleMap = {};
      let matches = 0;

      for (let c = 1; c < values.length; c++) {
        const val = String(values[c] || '').trim();
        const matchedField = matchHeaderToField(val);
        if (matchedField) {
          possibleMap[c] = matchedField;
          matches++;
        }
      }

      // If at least 2 fields matched or it's line 1-5, accept header map
      if (matches >= 2 || rowNumber <= 5) {
        headerMap = possibleMap;
        headerRowFound = true;
      }
      return;
    }

    // Process data row
    const itemData = {
      _importId: `imp_${rowNumber}_${Date.now()}`,
      module: 'Imported',
      entryType: 'BUY',
      date: new Date().toISOString().slice(0, 10),
      customer: '',
      scrap: 0,
      touch: 0,
      pure: 0,
      payment: 'USDT',
      totalIdr: 0,
      totalDollar: 0,
      notes: '',
      status: 'valid',
      warnings: [],
    };

    let hasSomeValue = false;

    for (let c = 1; c < values.length; c++) {
      const field = headerMap[c];
      let rawVal = values[c];

      // Handle ExcelJS object cell types (formulas, richText, dates)
      if (rawVal && typeof rawVal === 'object') {
        if (rawVal.result !== undefined) rawVal = rawVal.result;
        else if (rawVal.text !== undefined) rawVal = rawVal.text;
        else if (rawVal instanceof Date) rawVal = rawVal.toISOString().slice(0, 10);
      }

      if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '') {
        hasSomeValue = true;
      }

      if (field) {
        if (field === 'scrap' || field === 'touch' || field === 'pure' || field === 'totalIdr' || field === 'totalDollar') {
          itemData[field] = parseNumber(rawVal);
        } else if (field === 'date') {
          if (rawVal instanceof Date) {
            itemData.date = rawVal.toISOString().slice(0, 10);
          } else if (typeof rawVal === 'string' && rawVal.trim()) {
            const parsedD = new Date(rawVal);
            itemData.date = !isNaN(parsedD.getTime()) ? parsedD.toISOString().slice(0, 10) : itemData.date;
          }
        } else if (field === 'entryType') {
          const typeStr = String(rawVal || '').toUpperCase();
          if (typeStr.includes('SELL')) itemData.entryType = 'SELL';
          else if (typeStr.includes('EXP')) itemData.entryType = 'EXPENSE';
          else if (typeStr.includes('CRED')) itemData.entryType = 'CREDIT';
          else if (typeStr.includes('DEB')) itemData.entryType = 'DEBIT';
          else itemData.entryType = 'BUY';
        } else {
          itemData[field] = String(rawVal || '').trim();
        }
      }
    }

    if (!hasSomeValue) return;

    // Auto calculate pure gold if scrap & touch exist but pure is 0
    if (itemData.pure === 0 && itemData.scrap > 0 && itemData.touch > 0) {
      itemData.pure = parseFloat(((itemData.scrap * itemData.touch) / 100).toFixed(3));
    }

    // Validation checks
    if (!itemData.customer && !itemData.notes) {
      itemData.warnings.push('No customer name or remarks specified');
    }
    if (itemData.pure === 0 && itemData.totalIdr === 0 && itemData.totalDollar === 0) {
      itemData.status = 'warning';
      itemData.warnings.push('Zero pure gold weight and zero total amount');
    }

    rawRows.push(itemData);
  });

  return rawRows;
}

/**
 * Fallback parser for CSV text
 */
function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headerCells = parseCsvLine(lines[0]);
  const headerMap = {};
  headerCells.forEach((cell, idx) => {
    const field = matchHeaderToField(cell);
    if (field) headerMap[idx] = field;
  });

  const parsed = [];
  for (let r = 1; r < lines.length; r++) {
    const cells = parseCsvLine(lines[r]);
    const itemData = {
      _importId: `imp_csv_${r}_${Date.now()}`,
      module: 'Imported CSV',
      entryType: 'BUY',
      date: new Date().toISOString().slice(0, 10),
      customer: '',
      scrap: 0,
      touch: 0,
      pure: 0,
      payment: 'USDT',
      totalIdr: 0,
      totalDollar: 0,
      notes: '',
      status: 'valid',
      warnings: [],
    };

    cells.forEach((val, idx) => {
      const field = headerMap[idx];
      if (field) {
        if (['scrap', 'touch', 'pure', 'totalIdr', 'totalDollar'].includes(field)) {
          itemData[field] = parseNumber(val);
        } else {
          itemData[field] = val;
        }
      }
    });

    if (itemData.pure === 0 && itemData.scrap > 0 && itemData.touch > 0) {
      itemData.pure = parseFloat(((itemData.scrap * itemData.touch) / 100).toFixed(3));
    }

    parsed.push(itemData);
  }

  return parsed;
}
