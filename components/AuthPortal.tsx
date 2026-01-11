
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Github, Chrome, Eye, EyeOff } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For demo, we auto-assign role based on keywords or default to customer
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) onLogin(UserRole.ADMIN);
      else if (lowerEmail.includes('staff')) onLogin(UserRole.STAFF);
      else onLogin(UserRole.CUSTOMER);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/40">D</div>
          <h1 className="text-3xl font-black text-white tracking-tighter">DataBook</h1>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400 text-sm">{mode === 'LOGIN' ? 'Access your elite management suite.' : 'Join the precision scheduling network.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'SIGNUP' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Legal Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Institutional Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Password</label>
                {mode === 'LOGIN' && <button type="button" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-12 py-3.5 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {mode === 'LOGIN' ? 'Authorize Session' : 'Create Credentials'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Federated Identity</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white text-xs font-bold hover:bg-slate-800 transition-all group">
              <Chrome size={18} className="text-slate-400 group-hover:text-rose-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white text-xs font-bold hover:bg-slate-800 transition-all group">
              <Github size={18} className="text-slate-400 group-hover:text-white" /> Github
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-xs font-medium">
              {mode === 'LOGIN' ? "Don't have an account?" : "Already registered?"}
              <button 
                onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                className="ml-2 text-indigo-400 font-bold hover:underline"
              >
                {mode === 'LOGIN' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-slate-600">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500" /> 
            256-Bit SSL Secured
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-400">Terms</button>
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-400">Privacy</button>
        </div>
      </div>
    </div>
  );
};
