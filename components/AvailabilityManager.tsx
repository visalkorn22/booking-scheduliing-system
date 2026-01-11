
import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Save, Info, AlertCircle, RefreshCcw } from 'lucide-react';
import { Booking, BookingStatus, Service } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface AvailabilityManagerProps {
  bookings: Booking[];
  services: Service[];
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ bookings, services }) => {
  const [rules, setRules] = useState([
    { id: '1', day: 'Monday', start: '09:00', end: '17:00' },
    { id: '2', day: 'Tuesday', start: '09:00', end: '17:00' },
    { id: '3', day: 'Wednesday', start: '09:00', end: '12:00' },
    { id: '4', day: 'Wednesday', start: '13:00', end: '18:00' },
  ]);

  const addRule = () => {
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      day: 'Monday',
      start: '09:00',
      end: '17:00'
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const timeToPct = (time: string) => {
    const date = new Date(time);
    const h = date.getHours();
    const m = date.getMinutes();
    return ((h * 60 + m) / (24 * 60)) * 100;
  };

  const timeStrToPct = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-amber-500';
      case BookingStatus.CONFIRMED: return 'bg-indigo-600';
      case BookingStatus.COMPLETED: return 'bg-emerald-600';
      case BookingStatus.CANCELLED: return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/50 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Availability Timeline</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Status-coded bookings overlaid on shift rules.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Pending', color: 'bg-amber-500' },
              { label: 'Confirmed', color: 'bg-indigo-600' },
              { label: 'Completed', color: 'bg-emerald-600' },
              { label: 'Cancelled', color: 'bg-rose-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                <div className={`w-1.5 h-1.5 rounded-full ${s.color}`}></div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {DAYS.map((day, dayIdx) => {
              const dayRules = rules.filter(r => r.day === day);
              // Mock: Show bookings for a specific day (e.g. Wednesday is 2)
              const dayBookings = day === 'Wednesday' ? bookings : [];

              return (
                <div key={day} className="group">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">{day}</span>
                  </div>
                  <div className="h-8 bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200/50 shadow-inner">
                    {/* Shift Blocks */}
                    {dayRules.map(rule => (
                      <div 
                        key={rule.id}
                        className="absolute top-0 bottom-0 bg-white/60 border-x border-slate-200"
                        style={{ 
                          left: `${timeStrToPct(rule.start)}%`, 
                          width: `${timeStrToPct(rule.end) - timeStrToPct(rule.start)}%` 
                        }}
                      />
                    ))}
                    
                    {/* Booking Blocks */}
                    {dayBookings.map(booking => {
                      const startPct = timeToPct(booking.startTime);
                      const endPct = timeToPct(booking.endTime);
                      return (
                        <div 
                          key={booking.id}
                          className={`absolute top-1 bottom-1 rounded-md shadow-sm border border-black/10 transition-transform group-hover:scale-y-110 ${getStatusColor(booking.status)}`}
                          style={{ 
                            left: `${startPct}%`, 
                            width: `${Math.max(1, endPct - startPct)}%` 
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm"><Info size={20} /></div>
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-tight">Timeline Legend</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                The white spans indicate your <strong>Active Duty</strong> hours. Status-colored blocks represent booked client sessions. 
                Overlaps or bookings outside active duty require administrative review.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Shift Configuration</h3>
          <button 
            onClick={addRule}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus size={16} /> New Shift
          </button>
        </div>

        <div className="p-8 space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-200 transition-all group shadow-sm hover:shadow-md">
              <div className="w-full md:w-48">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Operational Day</label>
                <select 
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  value={rule.day}
                  onChange={(e) => setRules(rules.map(r => r.id === rule.id ? {...r, day: e.target.value} : r))}
                >
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              
              <div className="flex gap-4 flex-1 w-full md:w-auto">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Shift Start</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="time" 
                      value={rule.start} 
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? {...r, start: e.target.value} : r))}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Shift End</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="time" 
                      value={rule.end} 
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? {...r, end: e.target.value} : r))}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 md:pt-0">
                 <button 
                  onClick={() => deleteRule(rule.id)}
                  className="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            <Save size={18} /> Commit Ledger Update
          </button>
        </div>
      </div>
    </div>
  );
};
