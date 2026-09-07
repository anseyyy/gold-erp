"use client";

import React from "react";
import {
    ArrowUp,
    ArrowDown,
    WalletCards,
} from "lucide-react";

const formatUSDT = (value) =>
    `${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} USDT`;

function TopCards({ summary = {} }) {
    const cards = [
        {
            title: "Total Credit",
            subtitle: "Total from Sell Transactions",
            value: summary.totalCredit,
            icon: ArrowUp,
            cardStyle: "border-emerald-100 bg-emerald-50/40",
            iconStyle: "bg-emerald-100 text-emerald-600",
            valueStyle: "text-emerald-600",
        },
        {
            title: "Total Debit",
            subtitle: "Total from Buy Transactions",
            value: summary.totalDebit,
            icon: ArrowDown,
            cardStyle: "border-rose-100 bg-rose-50/40",
            iconStyle: "bg-rose-100 text-rose-500",
            valueStyle: "text-rose-500",
        },
        {
            title: "USDT Balance",
            subtitle: "Credit - Debit",
            value: summary.balance,
            icon: WalletCards,
            cardStyle: "border-indigo-100 bg-indigo-50/40",
            iconStyle: "bg-indigo-100 text-indigo-600",
            valueStyle: "text-indigo-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`relative overflow-hidden rounded-xl border p-5 transition hover:shadow-sm ${card.cardStyle}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-700">
                                    {card.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    {card.subtitle}
                                </p>
                                <p className={`mt-4 text-2xl font-bold tracking-tight ${card.valueStyle}`}>
                                    {formatUSDT(card.value)}
                                </p>
                            </div>
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconStyle}`}>
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