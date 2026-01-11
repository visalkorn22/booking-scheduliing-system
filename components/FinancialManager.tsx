
import React, { useState, useMemo } from 'react';
import { Booking, PaymentStatus } from '../types';
import { 
  DollarSign, 
  CreditCard, 
  RefreshCcw, 
  Download, 
  Filter, 
  Search, 
  ChevronDown, 
  FileText,
  Calendar,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { StatCard } from './DashboardWidgets';

interface FinancialManagerProps {
  bookings: Booking[];
}

export const FinancialManager: React.FC<FinancialManagerProps> = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalDue = bookings.reduce((sum, b) => sum + (b.totalPrice - b.paidAmount), 0);
  const paidCount = bookings.filter(b => b.paymentStatus === PaymentStatus.PAID).length;
  const successRate = bookings.length > 0 ? ((paidCount / bookings.length) * 100).toFixed(1) : "0.0";

  const filteredTransactions = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.customerId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleExport = () => {
    // Mock export functionality
    const headers = "Transaction ID,Gateway,Amount,Paid,Status,Date\n";
    const rows = filteredTransactions.map(b => 
      `${b.id},${b.id.includes('b1') ? 'ABA' : 'Stripe'},${b.totalPrice},${b.paidAmount},${b.paymentStatus},${b.createdAt}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Accumulated Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+14.2%" icon={DollarSign} color="bg-emerald-500" />
        <StatCard label="Pending Receivables" value={`$${totalDue.toLocaleString()}`} trend="-2.4%" icon={CreditCard} color="bg-rose-500" />
        <StatCard label="Settlement Success" value={`${successRate}%`} icon={RefreshCcw} color="bg-indigo-500" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ledger & Transaction History</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Audit and track all financial settlements within the network.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search ID or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all w-64"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Filter size={14} /> 
                {statusFilter === 'ALL' ? 'All Statuses' : statusFilter}
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter by status</p>
                  </div>
                  {['ALL', ...Object.values(PaymentStatus)].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status as any); setIsFilterOpen(false); }}
                      className="w-full px-5 py-3 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors capitalize"
                    >
                      {status.toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Entity</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Gateway</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Settlement Amount</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(booking => (
                <tr key={booking.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 font-mono text-xs uppercase tracking-tighter">#TXN-{booking.id.toUpperCase()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Customer Ref: {booking.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                        booking.id.includes('b1') 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100/50' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-100/50'
                      }`}>
                        {booking.id.includes('b1') ? 'ABA PAYWAY' : 'STRIPE GLOBAL'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <ArrowUpRight size={14} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">${booking.paidAmount.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Total: ${booking.totalPrice}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        booking.paymentStatus === PaymentStatus.PAID ? 'bg-emerald-500' : 
                        booking.paymentStatus === PaymentStatus.PARTIAL ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        booking.paymentStatus === PaymentStatus.PAID ? 'text-emerald-700' : 
                        booking.paymentStatus === PaymentStatus.PARTIAL ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-xs">{new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                        Receipt
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
              <CreditCard size={32} />
            </div>
            <p className="text-slate-500 font-bold">No transactions found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
              className="mt-4 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Reset All Search Parameters
            </button>
          </div>
        )}

        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredTransactions.length} of {bookings.length} system entries
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
