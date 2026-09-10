"use client";

import React from "react";
import { X, StickyNote } from "lucide-react";

function Notemodal({
    isOpen,
    transaction,
    note,
    setNote,
    onClose,
    onSave,
}) {
    if (!isOpen || !transaction) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/80 px-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-colors text-slate-900 dark:text-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <StickyNote size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Add Note
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                Transaction {transaction.reference}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Transaction info */}
                    <div className="mb-5 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Customer
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                {transaction.customer}
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Amount
                            </p>

                            <p
                                className={`mt-1 text-sm font-semibold ${
                                    transaction.type === "Credit"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-500 dark:text-rose-400"
                                }`}
                            >
                                {transaction.amount} USDT
                            </p>
                        </div>
                    </div>

                    {/* Note */}
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Note
                    </label>

                    <textarea
                        autoFocus
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write a note for this transaction..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-300 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!note.trim()}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notemodal;