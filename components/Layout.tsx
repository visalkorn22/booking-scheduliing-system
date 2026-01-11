
import React, { useState } from 'react';
import { UserRole, Notification, Location } from '../types';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Calendar, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  Briefcase,
  Users,
  Bell,
  ChevronDown,
  Zap,
  Shield,
  Languages,
  Check,
  MapPin,
  Building
} from 'lucide-react';
import { NotificationTray } from './NotificationTray';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  notifications: Notification[];
  locations: Location[];
  selectedLocationId: string;
  onLocationChange: (id: string) => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onMarkNotifRead: (id: string) => void;
  onClearNotifs: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  notifications,
  locations,
  selectedLocationId,
  onLocationChange,
  onLogout, 
  activeTab, 
  setActiveTab,
  onMarkNotifRead,
  onClearNotifs
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard', roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER] },
    { id: 'bookings', icon: Calendar, labelKey: 'my_bookings', roles: [UserRole.CUSTOMER] },
    { id: 'schedule', icon: Calendar, labelKey: 'schedule', roles: [UserRole.STAFF] },
    { id: 'services', icon: Briefcase, labelKey: 'offerings', roles: [UserRole.ADMIN, UserRole.CUSTOMER] },
    { id: 'locations', icon: Building, labelKey: 'Directory (Sites)', roles: [UserRole.ADMIN] },
    { id: 'customers', icon: Users, labelKey: 'directory', roles: [UserRole.ADMIN] },
    { id: 'staff', icon: Briefcase, labelKey: 'staff_team', roles: [UserRole.ADMIN] },
    { id: 'payments', icon: CreditCard, labelKey: 'financials', roles: [UserRole.ADMIN] },
    { id: 'profile', icon: UserCircle, labelKey: 'system_prefs', roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'US' },
    { code: 'km', label: 'ភាសាខ្មែរ', flag: 'KH' },
    { code: 'zh', label: '中文', flag: 'CN' },
  ];

  const activeLocation = locations.find(l => l.id === selectedLocationId);

  // Dynamic font class based on language
  const fontClass = language === 'km' ? 'font-khmer' : language === 'zh' ? 'font-chinese' : 'font-en';

  return (
    <div className={`flex h-screen bg-slate-50/50 overflow-hidden font-transition text-slate-900 ${fontClass}`}>
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-all duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-8 py-10">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100">D</div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">DataBook</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 scrollbar-hide overflow-y-auto">
            {filteredMenu.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold rounded-2xl transition-all ${
                    isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={20} />
                  {item.labelKey === 'Directory (Sites)' ? 'Locations' : t(item.labelKey)}
                </button>
              );
            })}
          </nav>

          <div className="p-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={100} /></div>
               <h4 className="text-sm font-bold mb-6">Premium Control</h4>
               <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">Upgrade Center</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 z-40 sticky top-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 text-slate-500 bg-slate-50 rounded-2xl">
              <Menu size={20} />
            </button>
            
            {(user.role === UserRole.ADMIN || user.role === UserRole.STAFF) && (
              <div className="relative">
                <button 
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl group transition-all"
                >
                  <MapPin size={18} className="text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Global Context</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">{selectedLocationId === 'ALL' ? 'All Locations' : activeLocation?.name}</p>
                  </div>
                  <ChevronDown size={16} className={`text-indigo-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLocationOpen && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => { onLocationChange('ALL'); setIsLocationOpen(false); }}
                      className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-all ${selectedLocationId === 'ALL' ? 'bg-indigo-50' : ''}`}
                    >
                      <span className="text-sm font-bold text-slate-900">All Locations</span>
                      {selectedLocationId === 'ALL' && <Check size={16} className="text-indigo-600" />}
                    </button>
                    {locations.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => { onLocationChange(loc.id); setIsLocationOpen(false); }}
                        className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 border-t border-slate-50 transition-all ${selectedLocationId === loc.id ? 'bg-indigo-50' : ''}`}
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{loc.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{loc.city}</p>
                        </div>
                        {selectedLocationId === loc.id && <Check size={16} className="text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl group hover:bg-indigo-50 transition-all">
                <Languages size={18} className="text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-black text-slate-700 uppercase">{language}</span>
                <ChevronDown size={14} className={`text-slate-300 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-indigo-50 group"
                    >
                      <span className="text-sm font-bold text-slate-900">{lang.label}</span>
                      {language === lang.code && <Check size={16} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('profile')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border-2 border-transparent group-hover:border-indigo-600 transition-all uppercase">
                {user.fullName[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;