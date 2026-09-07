"use client";

import React, { useState } from "react";
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    StickyNote,
} from "lucide-react";
import Notemodal from "./Notemodal";

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return [
        String(date.getUTCDate()).padStart(2, "0"),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        date.getUTCFullYear(),
    ].join("-");
};

function UsdtTransaction({ transactions = [], isLoading = false, error = "" }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [noteModal, setNoteModal] = useState(null);
    const [note, setNote] = useState("");
    const [transactionNotes, setTransactionNotes] = useState({});

    const handleAddNote = (transaction) => {
        setActiveMenu(null);
        setNoteModal(transaction);
        setNote(transactionNotes[transaction.id] || "");
    };

    const handleCloseNote = () => {
        setNoteModal(null);
        setNote("");
    };

    const handleSaveNote = () => {
        setTransactionNotes((currentNotes) => ({
            ...currentNotes,
            [noteModal.id]: note.trim(),
        }));
        handleCloseNote();
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">

            {isLoading && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">
                    Loading USDT transactions...
                </p>
            )}

            {!isLoading && error && (
                <p className="px-5 py-8 text-center text-sm text-rose-500">
                    {error}
                </p>
            )}

            {!isLoading && !error && transactions.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">
                    No USDT transactions yet.
                </p>
            )}

            {/* ================= DESKTOP TABLE ================= */}
            {!isLoading && !error && transactions.length > 0 && <div className="hidden min-w-[1050px] overflow-x-auto md:block">
                <table className="w-full border-collapse">

                    {/* Header */}
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70">

                            <th className="w-[55px] px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                #
                            </th>

                            <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Date
                            </th>

                            <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Type
                            </th>

                            <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Amount (USDT)
                            </th>

                            <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Customer
                            </th>

                            <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Source
                            </th>

                            <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Reference
                            </th>

                            <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Balance (USDT)
                            </th>

                            <th className="w-[70px] px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Action
                            </th>

                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {transactions.map((transaction) => {

                            const isCredit = transaction.type === "Credit";

                            return (
                                <tr
                                    key={transaction.id}
                                    className="group border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50/50"
                                >

                                    {/* Number */}
                                    <td className="px-5 py-4 text-sm font-medium text-slate-400">
                                        {transaction.id}
                                    </td>

                                    {/* Date */}
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700">
                                        {formatDate(transaction.date)}
                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isCredit
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-rose-50 text-rose-500"
                                                }`}
                                        >
                                            {isCredit ? (
                                                <ArrowUp
                                                    size={13}
                                                    strokeWidth={2.5}
                                                />
                                            ) : (
                                                <ArrowDown
                                                    size={13}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                            {transaction.type}
                                        </span>
                                    </td>

                                    {/* Amount */}
                                    <td
                                        className={`px-4 py-4 text-right font-semibold tabular-nums ${isCredit
                                            ? "text-emerald-600"
                                            : "text-rose-500"
                                            }`}
                                    >
                                        {transaction.amount}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-4 py-4 text-sm text-slate-700">
                                        {transaction.customer}
                                    </td>

                                    {/* Source */}
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">
                                        {transaction.source}
                                    </td>

                                    {/* Reference */}
                                    <td className="px-4 py-4">
                                        <span className="font-mono text-xs font-medium text-slate-500">
                                            {transaction.reference}
                                        </span>

                                        {transactionNotes[transaction.id] && (
                                            <p
                                                className="mt-1 max-w-[180px] truncate text-xs text-slate-400"
                                                title={transactionNotes[transaction.id]}
                                            >
                                                <span className="font-medium text-slate-500">
                                                    Note:
                                                </span>{" "}
                                                {transactionNotes[transaction.id]}
                                            </p>
                                        )}
                                    </td>

                                    {/* Balance */}
                                    <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-700">
                                        {transaction.balance}
                                    </td>

                                    {/* Action */}
                                    <td className="relative px-4 py-4 text-center">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveMenu(
                                                    activeMenu === transaction.id
                                                        ? null
                                                        : transaction.id
                                                )
                                            }
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {/* Action Menu */}
                                        {activeMenu === transaction.id && (
                                            <div className="absolute right-4 top-12 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-lg shadow-slate-200/50">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAddNote(transaction)
                                                    }
                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <StickyNote
                                                        size={16}
                                                        className="text-indigo-500"
                                                    />

                                                    Add Note
                                                </button>

                                            </div>
                                        )}

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>}

            {/* ================= MOBILE ================= */}
            {!isLoading && !error && transactions.length > 0 && <div className="divide-y divide-slate-100 md:hidden">

                {transactions.map((transaction) => {

                    const isCredit = transaction.type === "Credit";

                    return (
                        <div
                            key={transaction.id}
                            className="relative p-4"
                        >

                            {/* Top */}
                            <div className="flex items-start justify-between">

                                <div>

                                    <div className="mb-2 flex items-center gap-2">

                                        <span className="text-xs text-slate-400">
                                            #{transaction.id}
                                        </span>

                                        <span className="text-sm font-medium text-slate-700">
                                            {formatDate(transaction.date)}
                                        </span>

                                    </div>

                                    <p className="text-sm font-medium text-slate-800">
                                        {transaction.customer}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {transaction.source} ·{" "}
                                        {transaction.reference}
                                    </p>

                                    {transactionNotes[transaction.id] && (
                                        <p
                                            className="mt-2 max-w-[240px] truncate text-xs text-slate-500"
                                            title={transactionNotes[transaction.id]}
                                        >
                                            <span className="font-medium">
                                                Note:
                                            </span>{" "}
                                            {transactionNotes[transaction.id]}
                                        </p>
                                    )}

                                </div>

                                {/* Action */}
                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveMenu(
                                                activeMenu === transaction.id
                                                    ? null
                                                    : transaction.id
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {activeMenu === transaction.id && (
                                        <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddNote(transaction)
                                                }
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                <StickyNote
                                                    size={16}
                                                    className="text-indigo-500"
                                                />

                                                Add Note
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* Bottom */}
                            <div className="mt-4 flex items-end justify-between">

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isCredit
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-rose-50 text-rose-500"
                                        }`}
                                >
                                    {isCredit ? (
                                        <ArrowUp size={12} />
                                    ) : (
                                        <ArrowDown size={12} />
                                    )}

                                    {transaction.type}
                                </span>

                                <div className="text-right">

                                    <p
                                        className={`text-base font-semibold tabular-nums ${isCredit
                                            ? "text-emerald-600"
                                            : "text-rose-500"
                                            }`}
                                    >
                                        {transaction.amount} USDT
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Balance: {transaction.balance}
                                    </p>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>}

            {/* ================= FOOTER ================= */}
            {!isLoading && !error && transactions.length > 0 && <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs font-medium text-slate-400">
                    Showing 1 to {transactions.length} of {transactions.length} transactions
                </p>

                <div className="flex items-center gap-1.5">

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-600"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50"
                    >
                        <ChevronRight size={16} />
                    </button>

                </div>

            </div>}

            <Notemodal
                isOpen={Boolean(noteModal)}
                transaction={noteModal}
                note={note}
                setNote={setNote}
                onClose={handleCloseNote}
                onSave={handleSaveNote}
            />

        </div>
    );
}

export default UsdtTransaction;