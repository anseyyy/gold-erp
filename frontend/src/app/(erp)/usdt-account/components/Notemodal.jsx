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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <StickyNote size={18} />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Add Note
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Transaction {transaction.reference}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Transaction info */}
                    <div className="mb-5 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Customer
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                {transaction.customer}
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Amount
                            </p>

                            <p
                                className={`mt-1 text-sm font-semibold ${
                                    transaction.type === "Credit"
                                        ? "text-emerald-600"
                                        : "text-rose-500"
                                }`}
                            >
                                {transaction.amount} USDT
                            </p>
                        </div>
                    </div>

                    {/* Note */}
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Note
                    </label>

                    <textarea
                        autoFocus
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write a note for this transaction..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
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