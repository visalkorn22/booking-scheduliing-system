
import React from 'react';
import { X, Bell, Info, CheckCircle2, AlertTriangle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface NotificationTrayProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationTray: React.FC<NotificationTrayProps> = ({ 
  notifications, 
  onClose, 
  onMarkAsRead,
  onClearAll 
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'WARNING': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'ERROR': return <AlertCircle className="text-rose-500" size={18} />;
      default: return <Info className="text-indigo-500" size={18} />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Bell size={16} className="text-indigo-600" /> Broadcast Center
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">{notifications.filter(n => !n.isRead).length} unread signals detected</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClearAll}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Clear All"
          >
            <Trash2 size={16} />
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-all">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="max-h-[450px] overflow-y-auto scrollbar-hide py-2">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`px-8 py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all cursor-pointer relative group ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
              onClick={() => onMarkAsRead(n.id)}
            >
              {!n.isRead && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 rounded-r-full" />
              )}
              <div className="flex gap-4">
                <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{n.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
              <Bell size={32} strokeWidth={1.5} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">All Clear</p>
            <p className="text-[10px] text-slate-300 mt-2">Your network is fully synchronized.</p>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 text-center">
        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Historical Archive</button>
      </div>
    </div>
  );
};
