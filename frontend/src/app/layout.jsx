import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'GoldStockERP - Financial & Operations Management',
  description: 'Production-style Gold & Financial ERP application for gold trading, liquidity, and partner accounting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
