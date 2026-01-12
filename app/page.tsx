
import React from 'react';
import { User, BookingStatus } from '../types';
import { INITIAL_BOOKINGS } from '../constants';
import { StatCard, SectionTitle } from '../components/DashboardWidgets';
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { AnalyticsChart } from '../components/AnalyticsChart';

interface DashboardProps {
  user: User;
  locationId: string;
}

export default function DashboardPage({ user, locationId }: DashboardProps) {
  const revenueData = [
    { day: 'MON', value: 1200 }, { day: 'TUE', value: 1900 },
    { day: 'WED', value: 1500 }, { day: 'THU', value: 2100 },
    { day: 'FRI', value: 2400 }, { day: 'SAT', value: 1800 },
    { day: 'SUN', value: 1300 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Performance Monitoring</p>
        <SectionTitle 
          title={`Executive Dashboard`} 
          subtitle={`Current Session: ${user.fullName} | Focus: ${locationId === 'ALL' ? 'Global Portfolio' : 'Local Branch'}`} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Live Sessions" value={INITIAL_BOOKINGS.length.toString()} trend="+12.5%" icon={Calendar} color="bg-indigo-600" />
        <StatCard label="Pending Approval" value="3" icon={Clock} color="bg-amber-500" />
        <StatCard label="Projected Yield" value="$4,850" trend="+8.2%" icon={DollarSign} color="bg-emerald-500" />
        <StatCard label="Satisfaction" value="4.92" trend="+0.1" icon={Star} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnalyticsChart data={revenueData} />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Calendar size={120} /></div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">System Intelligence</h4>
            <p className="text-xl font-bold leading-tight mb-6">"Based on current trends, Friday evening slots are likely to reach 100% capacity within 4 hours."</p>
            <button className="w-fit px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Optimize Slots</button>
          </div>
        </div>
      </div>
    </div>
  );
}
