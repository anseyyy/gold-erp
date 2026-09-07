"use client";

import React from "react";
import {
    ArrowUp,
    ArrowDown,
    WalletCards,
} from "lucide-react";

function IdrTopCards({
    totalCredit = 0,
    totalDebit = 0,
    balance = 0,
}) {
    const formatIDR = (value) =>
        Number(value || 0).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const cards = [
        {
            title: "Total Credit",
            subtitle: "Total from Sell Transactions",
            value: totalCredit,
            icon: ArrowUp,
            iconStyle: "bg-emerald-100 text-emerald-600",
            cardStyle: "border-emerald-100 bg-emerald-50/40",
            valueStyle: "text-emerald-600",
        },
        {
            title: "Total Debit",
            subtitle: "Total from Buy Transactions",
            value: totalDebit,
            icon: ArrowDown,
            iconStyle: "bg-rose-100 text-rose-500",
            cardStyle: "border-rose-100 bg-rose-50/40",
            valueStyle: "text-rose-500",
        },
        {
            title: "IDR Balance",
            subtitle: "Credit − Debit",
            value: balance,
            icon: WalletCards,
            iconStyle: "bg-indigo-100 text-indigo-600",
            cardStyle: "border-indigo-100 bg-indigo-50/40",
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

                            {/* Left */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-700">
                                    {card.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {card.subtitle}
                                </p>

                                <p
                                    className={`mt-4 text-2xl font-bold tracking-tight ${card.valueStyle}`}
                                >
                                    Rp {formatIDR(card.value)}
                                </p>
                            </div>

                            {/* Icon */}
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconStyle}`}
                            >
                                <Icon size={19} strokeWidth={2} />
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default IdrTopCards;