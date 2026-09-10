'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopCards from './components/TopCards';
import ResentSells from './components/ResentSells';
import ResentBuys from './components/ResentBuys';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { dashboardApi, dashboardCardsApi } from '@/lib/api';
import { User, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    todaySalesUsdt: 0,
    todayProfit: 0,
    totalUsdtBalance: 0,
    totalProfit: 0,
    totalExpense: 0,
    totalToGet: 0,
    totalToGive: 0,
    totalGoldBalance: 0,
    totalPureGoldBought: 0,
    totalPureGoldSold: 0,
    toGetByCustomer: [],
    toGiveByCustomer: [],
    recentSells: [],
    recentBuys: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Client Balance Breakdown
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('GET'); // 'GET' | 'GIVE'
  const [modalItems, setModalItems] = useState([]);
  const [modalTotal, setModalTotal] = useState(0);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      dashboardCardsApi.getCardsData(),
      dashboardApi.getSummary(),
    ]).then(([cardsRes, summaryRes]) => {
      if (!active) return;

      const cardsData = cardsRes.status === 'fulfilled' ? cardsRes.value : {};
      const summaryData = summaryRes.status === 'fulfilled' ? summaryRes.value : {};

      setSummary({
        todaySalesUsdt: Number(cardsData.todaySalesUsdt ?? summaryData.todaySalesUsdt ?? 0),
        todayProfit: Number(cardsData.todayProfit ?? summaryData.todayProfit ?? 0),
        totalUsdtBalance: Number(cardsData.totalUsdtBalance ?? summaryData.totalUsdtBalance ?? 0),
        totalProfit: Number(cardsData.totalProfit ?? summaryData.totalProfit ?? 0),
        totalExpense: Number(cardsData.totalExpense ?? summaryData.totalExpense ?? 0),
        totalToGet: Number(summaryData.totalToGet || 0),
        totalToGive: Number(summaryData.totalToGive || 0),
        totalGoldBalance: Number(cardsData.totalGoldBalance ?? summaryData.totalGoldBalance ?? 0),
        totalPureGoldBought: Number(cardsData.totalPureGoldBought ?? summaryData.totalPureGoldBought ?? 0),
        totalPureGoldSold: Number(cardsData.totalPureGoldSold ?? summaryData.totalPureGoldSold ?? 0),
        toGetByCustomer: summaryData.toGetByCustomer || [],
        toGiveByCustomer: summaryData.toGiveByCustomer || [],
        recentSells: summaryData.recentSells || [],
        recentBuys: summaryData.recentBuys || [],
      });
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleCardClick = (type, items, total) => {
    setModalType(type);
    setModalItems(items || []);
    setModalTotal(total || 0);
    setIsModalOpen(true);
  };

  const isGet = modalType === 'GET';
  const modalTitle = isGet
    ? 'Clients Outstanding Balance (Total To Get / Receivables)'
    : 'Clients Unpaid Balance (Total To Give / Payables)';

  return (
    <div className="space-y-6">
      <TopCards summary={summary} isLoading={isLoading} onCardClick={handleCardClick} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResentSells items={summary.recentSells} isLoading={isLoading} />
        <ResentBuys items={summary.recentBuys} isLoading={isLoading} />
      </div>

      {/* Client Balance Breakdown Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {/* Header Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isGet
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">
                {isGet ? 'Total Receivables (To Get)' : 'Total Payables (To Give)'}
              </p>
              <h4 className="text-2xl font-extrabold tracking-tight mt-0.5">
                {formatUSD(modalTotal)}
              </h4>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isGet
                  ? 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200'
              }`}
            >
              {modalItems.length} {modalItems.length === 1 ? 'Client' : 'Clients'}
            </span>
          </div>

          {/* Client List */}
          {modalItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No outstanding balances for {isGet ? 'receivables' : 'payables'}.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1">
              {modalItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {item.customer}
                      </h5>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {item.orderCount} pending {item.orderCount === 1 ? 'order' : 'orders'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                        {formatUSD(item.amount)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isGet ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isGet ? 'To Receive' : 'To Pay'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsModalOpen(false);
                        router.push(`/customer-ledger/${encodeURIComponent(item.customer)}`);
                      }}
                      className="text-xs shrink-0"
                    >
                      <span>Ledger</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}