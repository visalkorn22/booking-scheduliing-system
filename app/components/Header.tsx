
import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Languages, Bell } from 'lucide-react';
import { User, Location, Notification } from '../../types';
import { useLanguage, Language } from '../../contexts/LanguageContext';

interface HeaderProps {
  user: User;
  locations: Location[];
  selectedLocationId: string;
  onLocationChange: (id: string) => void;
  notifications: Notification[];
}

export const Header: React.FC<HeaderProps> = ({ 
  user, locations, selectedLocationId, onLocationChange, notifications 
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  
  const activeLocation = locations.find(l => l.id === selectedLocationId);

  return (
    <header className="h-24 flex items-center justify-between px-8 bg-white/70 backdrop-blur-2xl border-b border-slate-100 z-40 sticky top-0">
      <div className="relative">
        <button 
          onClick={() => setIsLocationOpen(!isLocationOpen)}
          className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-2xl transition-all group"
        >
          <MapPin size={18} className="text-indigo-600" />
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Branch Focus</p>
            <p className="text-sm font-bold text-slate-900 leading-none">{selectedLocationId === 'ALL' ? 'Global Portfolio' : activeLocation?.name}</p>
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
        </button>

        {isLocationOpen && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
            <button 
              onClick={() => { onLocationChange('ALL'); setIsLocationOpen(false); }}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 text-sm font-bold"
            >
              All Locations
              {selectedLocationId === 'ALL' && <Check size={16} className="text-indigo-600" />}
            </button>
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => { onLocationChange(loc.id); setIsLocationOpen(false); }}
                className="w-full flex items-center justify-between px-6 py-4 border-t border-slate-50 hover:bg-slate-50 text-sm font-bold"
              >
                {loc.name}
                {selectedLocationId === loc.id && <Check size={16} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{user.role}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-100">
            {user.fullName[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
