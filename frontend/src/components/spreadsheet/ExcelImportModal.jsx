'use client';

import React, { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { parseExcelFile } from '@/lib/utils/excelImport';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';

export default function ExcelImportModal({ isOpen, onClose, onImportSuccess, targetModule = 'all' }) {
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [destinationModule, setDestinationModule] = useState(targetModule === 'all' ? 'buy' : targetModule);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    await processFile(selectedFile);
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setErrorMsg('');
    setIsParsing(true);
    try {
      const rows = await parseExcelFile(selectedFile);
      if (!rows || rows.length === 0) {
        setErrorMsg('No data rows found in the selected Excel file.');
        setParsedRows([]);
      } else {
        setParsedRows(rows);
      }
    } catch (err) {
      console.error('Failed to parse Excel file:', err);
      setErrorMsg(err.message || 'Failed to read or parse Excel file. Please ensure it is a valid .xlsx or .csv document.');
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await processFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveRow = (index) => {
    setParsedRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    // Apply destination module tags to imported items
    const moduleLabelMap = {
      buy: 'Buy Order',
      sell: 'Sell Order',
      expense: 'Expense',
      usdt: 'USDT Account',
      idr: 'IDR Account',
      'podiyana-buy': 'Podiyana Buy',
      'podiyana-sell': 'Podiyana Sell',
    };

    const finalRows = parsedRows.map((item) => ({
      ...item,
      module: moduleLabelMap[destinationModule] || item.module || 'Imported Order',
    }));

    onImportSuccess(finalRows);
    onClose();
  };

  const totalPureGold = parsedRows.reduce((acc, r) => acc + (r.pure || 0), 0);
  const totalIdr = parsedRows.reduce((acc, r) => acc + (r.totalIdr || 0), 0);
  const totalUsdt = parsedRows.reduce((acc, r) => acc + (r.totalDollar || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Excel / CSV Spreadsheet"
      size="2xl"
    >
      <div className="space-y-5 text-slate-800 dark:text-slate-100 text-xs">
        {/* Upload Zone */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Click to upload or drag & drop Excel / CSV file
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Supports <span className="font-mono text-emerald-600 font-bold">.xlsx, .xls, .csv</span> formats
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsing Indicator */}
        {isParsing && (
          <div className="p-8 text-center space-y-2">
            <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-300">
              Parsing Excel sheet structure & validating columns...
            </p>
          </div>
        )}

        {/* Parsed File Control Header */}
        {file && !isParsing && parsedRows.length > 0 && (
          <div className="space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{file.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Parsed {parsedRows.length} records | Pure: {formatNumber(totalPureGold)}g | IDR: {formatIDR(totalIdr)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Import To:</label>
                  <select
                    value={destinationModule}
                    onChange={(e) => setDestinationModule(e.target.value)}
                    className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="buy">Buy Orders</option>
                    <option value="sell">Sell Orders</option>
                    <option value="expense">Expenses</option>
                    <option value="usdt">USDT Account</option>
                    <option value="idr">IDR Account</option>
                    <option value="podiyana-buy">Podiyana Buy</option>
                    <option value="podiyana-sell">Podiyana Sell</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setParsedRows([]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                >
                  Change File
                </button>
              </div>
            </div>

            {/* Validation KPI Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                  Total Records
                </span>
                <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
                  {parsedRows.length} Rows
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                  Total Pure Gold
                </span>
                <p className="text-sm font-extrabold text-amber-900 dark:text-amber-100 mt-0.5 font-mono">
                  {formatNumber(totalPureGold)} g
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">
                  Total Amount (IDR)
                </span>
                <p className="text-sm font-extrabold text-indigo-900 dark:text-indigo-100 mt-0.5 font-mono">
                  {formatIDR(totalIdr)}
                </p>
              </div>
            </div>

            {/* Parsed Preview Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[750px] font-mono text-[11px]">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-bold uppercase sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2 text-center w-10">#</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Customer / Remarks</th>
                    <th className="p-2 text-right">Pure Gold</th>
                    <th className="p-2 text-right">Total IDR</th>
                    <th className="p-2 text-right">Total USDT</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center w-10">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {parsedRows.map((row, idx) => (
                    <tr key={row._importId || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{row.entryType}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-400">{row.date}</td>
                      <td className="p-2 font-bold text-slate-900 dark:text-slate-100">
                        {row.customer || row.reason || 'General'}
                      </td>
                      <td className="p-2 text-right font-bold text-amber-600 dark:text-amber-400">
                        {row.pure ? `${formatNumber(row.pure)}g` : '—'}
                      </td>
                      <td className="p-2 text-right font-bold text-indigo-600 dark:text-indigo-400">
                        {row.totalIdr ? formatIDR(row.totalIdr) : '—'}
                      </td>
                      <td className="p-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {row.totalDollar ? `$${row.totalDollar.toFixed(2)}` : '—'}
                      </td>
                      <td className="p-2 text-center">
                        {row.status === 'warning' ? (
                          <span
                            title={row.warnings.join(', ')}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          >
                            <AlertTriangle className="w-3 h-3" /> Warning
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {parsedRows.length > 0 && (
            <Button
              variant="emerald"
              icon={ArrowRight}
              onClick={handleConfirmImport}
              disabled={isParsing}
            >
              Confirm Import ({parsedRows.length} Rows)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
