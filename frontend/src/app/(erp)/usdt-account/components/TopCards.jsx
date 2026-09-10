"use client";

import React from "react";
import {
    ChartNoAxesCombined,
    ReceiptText,
    WalletCards,
} from "lucide-react";

const formatUSDT = (value) =>
    `${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} USDT`;

function TopCards({ summary = {}, isLoading = false }) {
    const cards = [
        {
            title: "USDT Balance",
            subtitle: "Sell credits - buys - expenses",
            value: summary.balance,
            icon: WalletCards,
            cardStyle: "border-[#E8EAF0] dark:border-slate-800 bg-white dark:bg-slate-900",
            iconStyle: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60",
            valueStyle: "text-emerald-600 dark:text-emerald-400",
        },
        {
            title: "Total Profit",
            subtitle: "Sell credits - buy costs",
            value: summary.totalProfit,
            icon: ChartNoAxesCombined,
            cardStyle: "border-[#E8EAF0] dark:border-slate-800 bg-white dark:bg-slate-900",
            iconStyle: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60",
            valueStyle: "text-indigo-600 dark:text-indigo-400",
        },
        {
            title: "Total Expense",
            subtitle: "USDT expenses",
            value: summary.totalExpense,
            icon: ReceiptText,
            cardStyle: "border-[#E8EAF0] dark:border-slate-800 bg-white dark:bg-slate-900",
            iconStyle: "bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-800/60",
            valueStyle: "text-rose-500 dark:text-rose-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`relative overflow-hidden rounded-xl border p-5 transition hover:border-slate-300 dark:hover:border-slate-700 ${card.cardStyle}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {card.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                                    {card.subtitle}
                                </p>
                                <p className={`mt-4 text-2xl font-bold tracking-tight ${card.valueStyle}`}>
                                    {isLoading ? "Loading..." : formatUSDT(card.value)}
                                </p>
                            </div>
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}>
                                <Icon size={19} strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TopCards;