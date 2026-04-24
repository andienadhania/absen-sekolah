import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, User, Hash, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'login' | 'register';

export default function Login() {
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form states
  const [identifier, setIdentifier] = useState(''); // Email or Username/NIS
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'siswa' | 'guru'>('siswa');
  const [loginRole, setLoginRole] = useState<'siswa' | 'guru'>('siswa');
  const [jurusan, setJurusan] = useState('TKJ');

  const isSupabaseConfigured = 
    (import.meta as any).env.VITE_SUPABASE_URL && 
    !(import.meta as any).env.VITE_SUPABASE_URL.includes('your-project') &&
    !(import.meta as any).env.VITE_SUPABASE_URL.includes('placeholder');

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lowerId = identifier.trim().toLowerCase();
      
      // Auto-detect role from username or use selector
      let finalRole = loginRole;
      if (lowerId === 'guru' || lowerId === 'admin') finalRole = 'guru';
      if (lowerId === 'siswa') finalRole = 'siswa';

      localStorage.setItem('mock_role', finalRole);
      localStorage.setItem('mock_name', identifier || (finalRole === 'guru' ? 'Ibu/Bapak Guru' : 'Siswa SMK Prima'));
      window.location.href = '/app'; 
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm z-50 flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Lobby
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[440px] w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-200 transform hover:rotate-6 transition-transform">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">SMK Prima Unggul</h1>
          <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase bg-slate-100 py-1.5 px-4 rounded-full inline-block">SISTEM DEMO AKADEMIK</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 p-6 text-center border-b border-slate-50">
            <h2 className="font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">
              Mode Demo Terintegrasi
            </h2>
          </div>

          <form onSubmit={handleAuth} className="p-10 space-y-7">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Informasi Demo</p>
              </div>
              <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                Database dinonaktifkan. Anda bisa masuk dengan username apapun. Ketik <span className="text-blue-900 underline font-black">guru</span> untuk panel guru.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider border border-rose-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Masuk Sebagai</label>
                <div className="grid grid-cols-2 gap-3">
                   <button
                     type="button"
                     onClick={() => setLoginRole('siswa')}
                     className={cn(
                       "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       loginRole === 'siswa' ? "bg-primary text-white border-primary shadow-xl shadow-rose-200" : "bg-white text-slate-400 border-slate-100"
                     )}
                   >
                     Siswa
                   </button>
                   <button
                     type="button"
                     onClick={() => setLoginRole('guru')}
                     className={cn(
                       "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       loginRole === 'guru' ? "bg-primary text-white border-primary shadow-xl shadow-rose-200" : "bg-white text-slate-400 border-slate-100"
                     )}
                   >
                     Guru
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">
                  Username Demo
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: guru / siswa"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Kata Sandi</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Bebas (Mode Demo)"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-rose-600 shadow-2xl shadow-rose-200 transition-all uppercase tracking-[0.2em] text-[11px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Panel Kontrol'}
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-[11px] text-slate-300 font-black uppercase tracking-[0.3em]">
          LOCAL DEMO ACTIVE • TANPA KONEKSI DATABASE
        </p>
      </motion.div>
    </div>
  );
}
