"use client";

import React from "react";
import {
    Calculator,
    ArrowRightLeft,
    TrendingUp,
    CircleDollarSign,
} from "lucide-react";

function CalculaterDesign({
    rate,
    usdt,
    idr,
    quantity,
    buyRate,
    sellRate,
    buyCost,
    sellRevenue,
    profit,
    onRateChange,
    onUsdtChange,
    onIdrChange,
    onQuantityChange,
    onBuyRateChange,
    onSellRateChange,
}) {
    const formatNumber = (value) => {
        if (!value) return "0.00";

        return Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="w-full space-y-5">

            {/* ================= PAGE HEADER ================= */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Calculator size={19} />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                            Calculator
                        </h1>

                        <p className="mt-0.5 text-sm text-slate-400">
                            Calculate USDT, IDR conversion and profit.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= CURRENCY CONVERTER ================= */}
            <div className="border border-slate-200 bg-white">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">
                            USDT ↔ IDR Converter
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Convert between USDT and Indonesian Rupiah.
                        </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <ArrowRightLeft size={16} />
                    </div>
                </div>

                {/* Body */}
                <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto_1fr] md:items-end">

                    {/* Rate */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                            Exchange Rate
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) =>
                                    onRateChange(e.target.value)
                                }
                                placeholder="Enter rate"
                                className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                IDR / USDT
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden h-11 w-10 items-center justify-center md:flex">
                        <ArrowRightLeft
                            size={17}
                            className="text-slate-300"
                        />
                    </div>

                    {/* Empty spacing mobile */}
                    <div className="md:hidden" />

                    {/* USDT / IDR */}
                    <div className="grid gap-3 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-600">
                                USDT
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={usdt}
                                    onChange={(e) =>
                                        onUsdtChange(e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 pr-16 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-500">
                                    USDT
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-600">
                                IDR
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={idr}
                                    onChange={(e) =>
                                        onIdrChange(e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 pr-14 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                    IDR
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* ================= PROFIT CALCULATOR ================= */}
            <div className="border border-slate-200 bg-white">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">
                            Profit / Loss Calculator
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Preview your trading profit before recording.
                        </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <TrendingUp size={16} />
                    </div>

                </div>

                {/* Inputs */}
                <div className="grid gap-4 p-5 sm:grid-cols-3">

                    {/* Quantity */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                            Quantity
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    onQuantityChange(e.target.value)
                                }
                                placeholder="0.00"
                                className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 pr-16 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                USDT
                            </span>
                        </div>
                    </div>

                    {/* Buy Rate */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                            Buy Rate
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                value={buyRate}
                                onChange={(e) =>
                                    onBuyRateChange(e.target.value)
                                }
                                placeholder="0.00"
                                className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 pr-14 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                IDR
                            </span>
                        </div>
                    </div>

                    {/* Sell Rate */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                            Sell Rate
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                value={sellRate}
                                onChange={(e) =>
                                    onSellRateChange(e.target.value)
                                }
                                placeholder="0.00"
                                className="h-11 w-full border border-slate-200 bg-slate-50/50 px-3 pr-14 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                IDR
                            </span>
                        </div>
                    </div>

                </div>

                {/* Results */}
                <div className="grid border-t border-slate-100 sm:grid-cols-3">

                    {/* Buy Cost */}
                    <div className="border-b border-slate-100 px-5 py-5 sm:border-b-0 sm:border-r">
                        <p className="text-xs font-medium text-slate-400">
                            Buy Cost
                        </p>

                        <p className="mt-2 text-lg font-semibold text-slate-800">
                            Rp {formatNumber(buyCost)}
                        </p>
                    </div>

                    {/* Sell Revenue */}
                    <div className="border-b border-slate-100 px-5 py-5 sm:border-b-0 sm:border-r">
                        <p className="text-xs font-medium text-slate-400">
                            Sell Revenue
                        </p>

                        <p className="mt-2 text-lg font-semibold text-slate-800">
                            Rp {formatNumber(sellRevenue)}
                        </p>
                    </div>

                    {/* Profit */}
                    <div
                        className={`px-5 py-5 ${
                            profit >= 0
                                ? "bg-emerald-50/40"
                                : "bg-rose-50/40"
                        }`}
                    >
                        <p className="text-xs font-medium text-slate-400">
                            Gross Profit / Loss
                        </p>

                        <p
                            className={`mt-2 flex items-center gap-2 text-lg font-bold ${
                                profit >= 0
                                    ? "text-emerald-600"
                                    : "text-rose-500"
                            }`}
                        >
                            <CircleDollarSign size={18} />

                            Rp {formatNumber(Math.abs(profit))}
                        </p>

                        <p
                            className={`mt-1 text-[11px] font-medium ${
                                profit >= 0
                                    ? "text-emerald-500"
                                    : "text-rose-400"
                            }`}
                        >
                            {profit >= 0
                                ? "Positive return"
                                : "Negative return"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CalculaterDesign;