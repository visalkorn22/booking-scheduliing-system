
import React from 'react';
import { Booking, User, Service, BookingStatus } from '../types';
import { formatInTimezone } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, MoreVertical, Clock, ShieldAlert, Sparkles, User as UserIcon } from 'lucide-react';

interface CalendarGridProps {
  bookings: Booking[];
  services: Service[];
  currentUser: User;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_HEIGHT = 80;

// Default Mock Work Day: 9 AM to 6 PM
const WORK_START = 9;
const WORK_END = 18;

export const CalendarGrid: React.FC<CalendarGridProps> = ({ bookings, services, currentUser }) => {
  
  const getPosInGrid = (isoDate: string) => {
    const date = new Date(isoDate);
    const h = date.getHours();
    const m = date.getMinutes();
    // Offset from 8 AM
    return (h - 8) * HOUR_HEIGHT + (m * (HOUR_HEIGHT / 60));
  };

  const getDurationPx = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffMins = (e.getTime() - s.getTime()) / 60000;
    return diffMins * (HOUR_HEIGHT / 60);
  };

  const getBufferPx = (mins: number) => mins * (HOUR_HEIGHT / 60);

  const getStatusColorClasses = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: 
        return {
          main: 'bg-amber-500 border-amber-600 shadow-amber-200/50',
          buffer: 'bg-amber-50/50 border-amber-200/50 text-amber-500',
          indicator: 'bg-amber-500'
        };
      case BookingStatus.CONFIRMED: 
        return {
          main: 'bg-indigo-600 border-indigo-700 shadow-indigo-200/50',
          buffer: 'bg-indigo-50/50 border-indigo-200/50 text-indigo-500',
          indicator: 'bg-indigo-600'
        };
      case BookingStatus.COMPLETED: 
        return {
          main: 'bg-emerald-600 border-emerald-700 shadow-emerald-200/50',
          buffer: 'bg-emerald-50/50 border-emerald-200/50 text-emerald-500',
          indicator: 'bg-emerald-600'
        };
      case BookingStatus.CANCELLED: 
        return {
          main: 'bg-rose-500 border-rose-600 shadow-rose-200/50',
          buffer: 'bg-rose-50/50 border-rose-200/50 text-rose-500',
          indicator: 'bg-rose-500'
        };
      default: 
        return {
          main: 'bg-slate-600 border-slate-700 shadow-slate-200/50',
          buffer: 'bg-slate-50/50 border-slate-200/50 text-slate-500',
          indicator: 'bg-slate-600'
        };
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[750px] animate-in fade-in duration-700">
      <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Weekly Operations</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sync: {currentUser.timezone}</p>
          </div>
          <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
             <button className="p-3 hover:bg-slate-50 border-r border-slate-200 text-slate-400 hover:text-indigo-600 transition-colors"><ChevronLeft size={18} /></button>
             <button className="p-3 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-wrap items-center gap-4 mr-6">
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pending</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confirmed</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Completed</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cancelled</span>
             </div>
             <div className="w-px h-4 bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-lg bg-slate-100 bg-buffer-pattern border border-slate-200"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Buffer Zone</span>
             </div>
           </div>
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">Week</button>
             <button className="px-4 py-2 text-slate-500 rounded-lg text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">Day</button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide flex bg-slate-50/30">
        {/* Time Column */}
        <div className="w-24 border-r border-slate-100 bg-white sticky left-0 z-30 flex-shrink-0">
          <div className="h-14 border-b border-slate-100" />
          {HOURS.map(hour => (
            <div key={hour} className="h-20 border-b border-slate-100 px-4 py-3 text-[10px] font-black text-slate-400 text-right uppercase tracking-tighter">
              <span className="opacity-60">{hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}</span>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        <div className="flex-1 grid grid-cols-7 min-w-[1200px]">
          {DAYS.map((day, dayIdx) => {
            const columnDate = 21 + dayIdx;
            const dayBookings = bookings.filter(b => new Date(b.startTime).getDate() === columnDate);

            return (
              <div key={day} className={`border-r border-slate-100 relative group/col`}>
                <div className="h-14 border-b border-slate-100 flex flex-col items-center justify-center bg-white/90 backdrop-blur sticky top-0 z-20">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</p>
                  <p className={`text-sm font-bold mt-0.5 ${dayIdx === 2 ? 'text-indigo-600' : 'text-slate-900'}`}>{columnDate}</p>
                </div>
                
                {/* Hourly Grid Background + Work Hour Shading */}
                {HOURS.map(hour => {
                  const isOffHours = hour < WORK_START || hour >= WORK_END;
                  return (
                    <div 
                      key={hour} 
                      className={`h-20 border-b border-slate-100/50 relative ${isOffHours ? 'bg-slate-100/40' : 'bg-transparent'}`} 
                    />
                  );
                })}

                {/* Render Actual Bookings + Buffers */}
                {dayBookings.map(booking => {
                  const service = services.find(s => s.id === booking.serviceId);
                  const bufferMins = service?.bufferMinutes || 0;
                  const statusColors = getStatusColorClasses(booking.status);
                  
                  const startY = getPosInGrid(booking.startTime);
                  const height = getDurationPx(booking.startTime, booking.endTime);
                  const bufferH = getBufferPx(bufferMins);

                  return (
                    <div key={booking.id} className="absolute inset-x-1.5 z-10 group/booking" style={{ top: `${startY - bufferH}px` }}>
                      
                      {/* Prep Buffer */}
                      {bufferH > 0 && (
                        <div 
                          className={`w-full bg-buffer-pattern rounded-t-2xl border-x border-t flex items-center justify-center overflow-hidden transition-all duration-300 ${statusColors.buffer}`}
                          style={{ height: `${bufferH}px` }}
                        >
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-0 group-hover/booking:opacity-100 transition-opacity">Prep Zone</span>
                        </div>
                      )}

                      {/* Main Appointment Body */}
                      <div 
                        className={`w-full text-white p-4 shadow-xl relative overflow-hidden transition-all group-hover/booking:scale-[1.02] group-hover/booking:z-50 border-x ${statusColors.main}`}
                        style={{ height: `${height}px`, borderRadius: bufferH > 0 ? '0' : '1.5rem' }}
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/booking:scale-150 transition-transform duration-500">
                          <Sparkles size={40} />
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">{booking.status}</span>
                            <MoreVertical size={14} className="opacity-60 cursor-pointer hover:opacity-100" />
                          </div>
                          <p className="font-black text-xs leading-tight mb-1 truncate">{service?.name}</p>
                          <div className="mt-auto">
                            <p className="text-[9px] font-bold opacity-80 flex items-center gap-1"><Clock size={10} /> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cleanup Buffer */}
                      {bufferH > 0 && (
                        <div 
                          className={`w-full bg-buffer-pattern rounded-b-2xl border-x border-b flex items-center justify-center overflow-hidden transition-all duration-300 ${statusColors.buffer}`}
                          style={{ height: `${bufferH}px` }}
                        >
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-0 group-hover/booking:opacity-100 transition-opacity">Reset Zone</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Current Time Indicator (Only on today, mocked as Wednesday) */}
                {dayIdx === 2 && (
                  <div className="absolute left-0 right-0 h-0.5 bg-rose-500 z-40 flex items-center" style={{ top: '350px' }}>
                    <div className="w-2 h-2 rounded-full bg-rose-500 -ml-1 shadow-sm" />
                    <div className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-r-lg uppercase tracking-widest">Network Live</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
