
import React from 'react';
import { TrendingUp, TrendingDown, Users, CalendarCheck, DollarSign } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: React.ElementType;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon: Icon, color }) => {
  const isPositive = trend?.startsWith('+');
  
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={28} className={color.replace('bg-', 'text-')} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="space-y-1">
    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">{subtitle}</p>}
  </div>
);
