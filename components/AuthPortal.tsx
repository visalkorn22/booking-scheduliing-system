
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Github, Chrome, Eye, EyeOff, CheckCircle, Smartphone } from 'lucide-react';
import { UserRole } from '../types';

interface AuthPortalProps {
  onLogin: (role: UserRole) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Supabase Auth Delay
    setTimeout(() => {
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) onLogin(UserRole.ADMIN);
      else if (lowerEmail.includes('staff')) onLogin(UserRole.STAFF);
      else onLogin(UserRole.CUSTOMER);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-en">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] mb-4">
            D
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-1">DataBook <span className="text-indigo-500">Elite</span></h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Authorized Access Only</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111111]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Tab Selection */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-white/5">
            <button 
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'LOGIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('SIGNUP')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'SIGNUP' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'SIGNUP' && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Identity Tag (Name)</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Legal Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600 font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Institutional Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@organization.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Password</label>
                {mode === 'LOGIN' && <button type="button" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Recovery</button>}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:border-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600 font-bold"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'LOGIN' && (
              <div className="flex items-center gap-2 px-1">
                <button 
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-white/20'}`}
                >
                  {rememberMe && <CheckCircle size={12} className="text-white" />}
                </button>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Remember Credentials</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'LOGIN' ? 'Authorize Session' : 'Initialize Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-x-0 h-px bg-white/5"></div>
              <span className="relative px-4 bg-[#111111] text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Global Providers</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-bold hover:bg-white/10 transition-all group">
                <Chrome size={18} className="text-slate-500 group-hover:text-white transition-colors" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-bold hover:bg-white/10 transition-all group">
                <Github size={18} className="text-slate-500 group-hover:text-white transition-colors" /> Github
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 text-slate-600">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-indigo-500" /> 
            SSL AES-256
          </div>
          <div className="hidden md:block w-1 h-1 bg-slate-800 rounded-full"></div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Smartphone size={14} className="text-indigo-500" /> 
            MFA Supported
          </div>
        </div>
      </div>
    </div>
  );
};
