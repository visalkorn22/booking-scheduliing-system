
import React from 'react';
import { 
  LayoutDashboard, Calendar, UserCircle, Briefcase, 
  Users, CreditCard, Building, Shield
} from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  userRole: UserRole;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, activePath, onNavigate }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER] },
    { id: 'bookings', icon: Calendar, label: 'My Bookings', roles: [UserRole.CUSTOMER] },
    { id: 'services', icon: Briefcase, label: 'Services', roles: [UserRole.ADMIN, UserRole.CUSTOMER] },
    { id: 'staff', icon: Users, label: 'Staff Team', roles: [UserRole.ADMIN] },
    { id: 'customers', icon: Shield, label: 'Customers', roles: [UserRole.ADMIN] },
    { id: 'profile', icon: UserCircle, label: 'Profile', roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full hidden lg:flex">
      <div className="px-8 py-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">D</div>
          <span className="text-2xl font-black tracking-tighter">DataBook</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold rounded-2xl transition-all ${
              activePath === item.id ? 'text-indigo-600 bg-indigo-50/50 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={60} /></div>
           <p className="text-[10px] font-black uppercase tracking-widest mb-4">System Status</p>
           <div className="flex items-center gap-2 text-emerald-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Global Live</span>
           </div>
        </div>
      </div>
    </aside>
  );
};
