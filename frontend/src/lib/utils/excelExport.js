import ExcelJS from 'exceljs';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Creates a beautifully styled worksheet in an ExcelJS workbook.
 */
function createStyledWorksheet(workbook, sheetTitle, items, meta = {}) {
  const worksheet = workbook.addWorksheet(sheetTitle, {
    views: [{ showGridLines: true }],
  });

  const activeModuleName = meta.module || 'ALL MODULES';
  const periodText = meta.period || 'All Time';
  const filterCount = items.length;

  // Calculate Summary Metrics
  const totalPure = items.reduce((acc, i) => acc + (Number(i.pure) || 0), 0);
  const totalIdr = items.reduce((acc, i) => acc + (Number(i.totalIdr) || 0), 0);
  const totalUsdt = items.reduce((acc, i) => {
    const val = Number(i.totalDollar || i.amount || 0);
    return acc + (i.payment === 'IDR' || i.currency === 'IDR' ? 0 : val);
  }, 0);

  // ----------------------------------------------------
  // ROW 1: BANNER TITLE
  // ----------------------------------------------------
  worksheet.mergeCells('A1:K1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'GOLD STOCK ERP — SPREADSHEET MASTER REPORT';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } }; // Deep Emerald
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 36;

  // ----------------------------------------------------
  // ROW 2: METADATA SUBTITLE
  // ----------------------------------------------------
  worksheet.mergeCells('A2:K2');
  const subCell = worksheet.getCell('A2');
  subCell.value = `Module: ${activeModuleName.toUpperCase()}  |  Period: ${periodText}  |  Total Records: ${filterCount}  |  Generated: ${new Date().toLocaleString()}`;
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF047857' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }; // Soft Light Emerald
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 22;

  // ROW 3: Blank spacing
  worksheet.getRow(3).height = 8;

  // ----------------------------------------------------
  // ROWS 4 & 5: KPI SUMMARY CARDS
  // ----------------------------------------------------
  // Card 1: Pure Gold (Cols B..C)
  worksheet.mergeCells('B4:C4');
  worksheet.getCell('B4').value = 'TOTAL PURE GOLD';
  worksheet.getCell('B4').font = { size: 9, bold: true, color: { argb: 'FF78350F' } };
  worksheet.getCell('B4').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };

  worksheet.mergeCells('B5:C5');
  worksheet.getCell('B5').value = `${formatNumber(totalPure)} g`;
  worksheet.getCell('B5').font = { size: 13, bold: true, color: { argb: 'FFB45309' } };
  worksheet.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('B5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };

  // Card 2: Total IDR (Cols E..F)
  worksheet.mergeCells('E4:F4');
  worksheet.getCell('E4').value = 'TOTAL IDR AMOUNT';
  worksheet.getCell('E4').font = { size: 9, bold: true, color: { argb: 'FF1E1B4B' } };
  worksheet.getCell('E4').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('E4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };

  worksheet.mergeCells('E5:F5');
  worksheet.getCell('E5').value = formatIDR(totalIdr);
  worksheet.getCell('E5').font = { size: 13, bold: true, color: { argb: 'FF4338CA' } };
  worksheet.getCell('E5').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('E5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };

  // Card 3: Total USDT (Cols H..I)
  worksheet.mergeCells('H4:I4');
  worksheet.getCell('H4').value = 'TOTAL USDT AMOUNT';
  worksheet.getCell('H4').font = { size: 9, bold: true, color: { argb: 'FF064E3B' } };
  worksheet.getCell('H4').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('H4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };

  worksheet.mergeCells('H5:I5');
  worksheet.getCell('H5').value = formatUSD(totalUsdt);
  worksheet.getCell('H5').font = { size: 13, bold: true, color: { argb: 'FF047857' } };
  worksheet.getCell('H5').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('H5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };

  worksheet.getRow(4).height = 18;
  worksheet.getRow(5).height = 24;

  // ROW 6: Blank spacing
  worksheet.getRow(6).height = 12;

  // ----------------------------------------------------
  // ROW 7: TABLE HEADERS
  // ----------------------------------------------------
  const headers = [
    '#',
    'Module',
    'Entry Type',
    'Date',
    'Customer / Remarks',
    'Scrap / Touch',
    'Pure Gold (g)',
    'Payment',
    'Total IDR',
    'Total USDT',
    'Notes',
  ];

  const headerRow = worksheet.getRow(7);
  headerRow.height = 28;

  headers.forEach((hdr, idx) => {
    const colNumber = idx + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = hdr;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } }; // Dark Emerald
    cell.alignment = {
      vertical: 'middle',
      horizontal: idx === 0 || idx === 2 || idx === 3 || idx === 7 ? 'center' : (idx === 6 || idx === 8 || idx === 9 ? 'right' : 'left'),
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF022C22' } },
      bottom: { style: 'medium', color: { argb: 'FF022C22' } },
      left: { style: 'thin', color: { argb: 'FF065F46' } },
      right: { style: 'thin', color: { argb: 'FF065F46' } },
    };
  });

  // ----------------------------------------------------
  // ROWS 8+: DATA ROWS
  // ----------------------------------------------------
  const startDataRow = 8;
  items.forEach((item, index) => {
    const rowNum = startDataRow + index;
    const row = worksheet.getRow(rowNum);
    row.height = 22;

    const isEven = index % 2 === 0;
    const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC'; // Light zebra tint

    const rowData = [
      index + 1,
      item.module || activeModuleName,
      (item.entryType || item.type || 'N/A').toUpperCase(),
      formatDate(item.date),
      item.customer || item.reason || item.customerName || 'General',
      item.scrap ? `${formatNumber(item.scrap)}g (${item.touch || 0}%)` : '—',
      Number(item.pure || 0),
      (item.payment || item.currency || 'USDT').toUpperCase(),
      Number(item.totalIdr || 0),
      Number(item.totalDollar || item.amount || 0),
      item.notes || item.description || item.reason || '',
    ];

    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };

      // Formatting per column
      if (cIdx === 0) {
        // Row Number
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF64748B' } };
      } else if (cIdx === 2) {
        // Entry Type
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10, bold: true };
      } else if (cIdx === 3 || cIdx === 7) {
        // Date / Payment
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (cIdx === 6) {
        // Pure Gold (Numeric format)
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0.00" g"';
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFB45309' } };
      } else if (cIdx === 8) {
        // Total IDR (Numeric format)
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '"Rp "#,##0';
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF4338CA' } };
      } else if (cIdx === 9) {
        // Total USDT (Numeric format)
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '"$"#,##0.00';
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF047857' } };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      // Thin crisp cell border
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  // ----------------------------------------------------
  // BOTTOM SUMMARY TOTAL ROW (LIVE FORMULAS)
  // ----------------------------------------------------
  const lastDataRow = items.length > 0 ? startDataRow + items.length - 1 : startDataRow;
  const summaryRowIndex = lastDataRow + 1;
  const summaryRow = worksheet.getRow(summaryRowIndex);
  summaryRow.height = 28;

  // Merge A..F for Summary Title Label
  worksheet.mergeCells(`A${summaryRowIndex}:F${summaryRowIndex}`);
  const labelCell = worksheet.getCell(`A${summaryRowIndex}`);
  labelCell.value = 'MASTER TOTALS (=SUM FORMULA):';
  labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  labelCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // Set borders for merged cells A..F
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach((col) => {
    worksheet.getCell(`${col}${summaryRowIndex}`).border = {
      top: { style: 'medium', color: { argb: 'FF047857' } },
      bottom: { style: 'double', color: { argb: 'FF022C22' } },
      left: { style: 'thin', color: { argb: 'FF064E3B' } },
      right: { style: 'thin', color: { argb: 'FF064E3B' } },
    };
  });

  // Cell G: Pure Gold Live Formula =SUM(G8:Glast)
  const gCell = summaryRow.getCell(7);
  if (items.length > 0) {
    gCell.value = { formula: `SUM(G8:G${lastDataRow})`, result: totalPure };
  } else {
    gCell.value = 0;
  }
  gCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFBBF24' } };
  gCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  gCell.alignment = { horizontal: 'right', vertical: 'middle' };
  gCell.numFmt = '#,##0.00" g"';
  gCell.border = {
    top: { style: 'medium', color: { argb: 'FF047857' } },
    bottom: { style: 'double', color: { argb: 'FF022C22' } },
    left: { style: 'thin', color: { argb: 'FF064E3B' } },
    right: { style: 'thin', color: { argb: 'FF064E3B' } },
  };

  // Cell H: Payment / Row Count Formula =COUNTA(A8:Alast)
  const hCell = summaryRow.getCell(8);
  if (items.length > 0) {
    hCell.value = { formula: `COUNTA(A8:A${lastDataRow})`, result: items.length };
  } else {
    hCell.value = 0;
  }
  hCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFE2E8F0' } };
  hCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  hCell.alignment = { horizontal: 'center', vertical: 'middle' };
  hCell.numFmt = '0" Rows"';
  hCell.border = {
    top: { style: 'medium', color: { argb: 'FF047857' } },
    bottom: { style: 'double', color: { argb: 'FF022C22' } },
    left: { style: 'thin', color: { argb: 'FF064E3B' } },
    right: { style: 'thin', color: { argb: 'FF064E3B' } },
  };

  // Cell I: Total IDR Live Formula =SUM(I8:Ilast)
  const iCell = summaryRow.getCell(9);
  if (items.length > 0) {
    iCell.value = { formula: `SUM(I8:I${lastDataRow})`, result: totalIdr };
  } else {
    iCell.value = 0;
  }
  iCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFA5B4FC' } };
  iCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  iCell.alignment = { horizontal: 'right', vertical: 'middle' };
  iCell.numFmt = '"Rp "#,##0';
  iCell.border = {
    top: { style: 'medium', color: { argb: 'FF047857' } },
    bottom: { style: 'double', color: { argb: 'FF022C22' } },
    left: { style: 'thin', color: { argb: 'FF064E3B' } },
    right: { style: 'thin', color: { argb: 'FF064E3B' } },
  };

  // Cell J: Total USDT Live Formula =SUM(J8:Jlast)
  const jCell = summaryRow.getCell(10);
  if (items.length > 0) {
    jCell.value = { formula: `SUM(J8:J${lastDataRow})`, result: totalUsdt };
  } else {
    jCell.value = 0;
  }
  jCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF6EE7B7' } };
  jCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  jCell.alignment = { horizontal: 'right', vertical: 'middle' };
  jCell.numFmt = '"$"#,##0.00';
  jCell.border = {
    top: { style: 'medium', color: { argb: 'FF047857' } },
    bottom: { style: 'double', color: { argb: 'FF022C22' } },
    left: { style: 'thin', color: { argb: 'FF064E3B' } },
    right: { style: 'thin', color: { argb: 'FF064E3B' } },
  };

  // Cell K: Notes blank fill
  const kCell = summaryRow.getCell(11);
  kCell.value = '';
  kCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
  kCell.border = {
    top: { style: 'medium', color: { argb: 'FF047857' } },
    bottom: { style: 'double', color: { argb: 'FF022C22' } },
    left: { style: 'thin', color: { argb: 'FF064E3B' } },
    right: { style: 'thin', color: { argb: 'FF064E3B' } },
  };

  // ----------------------------------------------------
  // AUTO-FIT COLUMN WIDTHS
  // ----------------------------------------------------
  headers.forEach((hdr, colIdx) => {
    let maxLen = hdr ? hdr.length : 10;
    const colNumber = colIdx + 1;

    worksheet.eachRow({ includeEmpty: false }, (row, rIdx) => {
      // Only consider table header & data rows (row 7 to lastDataRow)
      if (rIdx >= 7 && rIdx <= lastDataRow) {
        const cell = row.getCell(colNumber);
        let valStr = '';
        if (cell.value !== null && cell.value !== undefined) {
          if (typeof cell.value === 'object' && cell.value.result !== undefined) {
            valStr = String(cell.value.result);
          } else {
            valStr = String(cell.value);
          }
        }
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      }
    });

    const column = worksheet.getColumn(colNumber);
    column.width = Math.min(Math.max(maxLen + 5, 12), 48);
  });

  return worksheet;
}

/**
 * Triggers Excel workbook download in browser
 */
async function downloadWorkbook(workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Main export function for Current Active View
 */
export async function exportToExcel(filteredItems, meta = {}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GoldStock ERP System';
  workbook.created = new Date();

  const sheetName = (meta.module || 'Master_Spreadsheet')
    .substring(0, 31)
    .replace(/[:\\/?*\[\]]/g, '_');

  createStyledWorksheet(workbook, sheetName, filteredItems, meta);

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `GoldStockERP_${meta.module || 'Spreadsheet'}_${timestamp}.xlsx`;
  await downloadWorkbook(workbook, filename);
}

/**
 * Export Full ERP Multi-Sheet Workbook
 */
export async function exportFullErpWorkbook(rawDataset, periodText = 'All Time') {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GoldStock ERP System';
  workbook.created = new Date();

  const { buys, sells, expenses, usdt, idr } = rawDataset;

  const allItems = [...(buys || []), ...(sells || []), ...(expenses || []), ...(usdt || []), ...(idr || [])];

  const sheetsToCreate = [
    { name: 'All ERP Records', items: allItems, moduleName: 'All ERP Records' },
    { name: 'Buy Orders', items: buys || [], moduleName: 'Buy Orders' },
    { name: 'Sell Orders', items: sells || [], moduleName: 'Sell Orders' },
    { name: 'Expenses', items: expenses || [], moduleName: 'Expenses' },
    { name: 'USDT Account', items: usdt || [], moduleName: 'USDT Account' },
    { name: 'IDR Account', items: idr || [], moduleName: 'IDR Account' },
  ];

  sheetsToCreate.forEach((sheet) => {
    createStyledWorksheet(workbook, sheet.name, sheet.items, {
      module: sheet.moduleName,
      period: periodText,
    });
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `GoldStockERP_MASTER_WORKBOOK_${timestamp}.xlsx`;
  await downloadWorkbook(workbook, filename);
}
