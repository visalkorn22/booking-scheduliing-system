import React from 'react';
// Fix: Renamed User icon to UserIcon and imported User type from types to resolve conflict
import { LogOut, Shield, Zap, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import { SectionTitle } from '../../components/DashboardWidgets';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: ProfileProps) {
  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-12">
      <div className="flex items-center justify-between">
        <SectionTitle title="System Identity" subtitle="Manage your security clearance and institutional profile." />
        <button 
          onClick={onLogout}
          className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
        >
          <LogOut size={16} /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center font-black text-4xl mb-6 mx-auto">
            {user.fullName[0]}
          </div>
          <h4 className="text-center text-xl font-bold text-slate-900">{user.fullName}</h4>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized {user.role}</p>
          
          <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-slate-400 uppercase tracking-widest">Clearance ID</span>
              <span className="font-mono font-bold">#{user.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-slate-400 uppercase tracking-widest">Sync Protocol</span>
              <span className="font-bold">{user.timezone}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700"><Shield size={100} /></div>
            <div className="relative z-10">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">Encryption Status</h5>
              <p className="text-2xl font-bold mb-4">Your connection is secured with AES-256 and Multi-Factor Authentication.</p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Audit Security Logs</button>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Rotate Keys</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
