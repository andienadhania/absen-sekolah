import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, User, Hash, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
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
  const [jurusan, setJurusan] = useState('TKJ');

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isSupabaseConfigured = !(import.meta as any).env.VITE_SUPABASE_URL?.includes('your-project');

    try {
      if (tab === 'login') {
        if (!isSupabaseConfigured) {
          navigate('/app');
          return;
        }

        let authEmail = identifier.trim();
        if (!authEmail.includes('@')) {
          authEmail = `${authEmail.toLowerCase()}@student.smkprima.sch.id`;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (loginError) {
          if (loginError.message.includes('Email not confirmed')) {
            throw new Error('Email belum dikonfirmasi. Periksa kotak masuk atau login sebagai tamu.');
          }
          if (loginError.message.includes('rate limit')) {
            throw new Error('Terlalu banyak percobaan. Silakan tunggu beberapa saat lagi.');
          }
          throw loginError;
        }
        navigate('/app');
      } else {
        if (!isSupabaseConfigured) {
          throw new Error('Konfigurasi Supabase diperlukan untuk pendaftaran baru.');
        }

        let authEmail = identifier.trim();
        if (role === 'siswa' && !authEmail.includes('@')) {
          authEmail = `${authEmail.toLowerCase()}@student.smkprima.sch.id`;
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              name: name.trim(),
              role: role,
              jurusan: role === 'siswa' ? jurusan : null,
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('Email not confirmed')) {
            throw new Error('Pendaftaran sukses! Silakan konfirmasi email Anda.');
          }
          if (signUpError.message.includes('rate limit')) {
            throw new Error('Terlalu banyak percobaan. Harap coba lagi nanti.');
          }
          throw signUpError;
        }
        
        if (authData.user) {
          await supabase.from('users').insert({
            id: authData.user.id,
            email: authEmail,
            name: name.trim(),
            role: role,
            jurusan: role === 'siswa' ? jurusan : null,
          });
        }
        
        navigate('/app');
      }
    } catch (err: any) {
      console.error(err);
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
          <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase bg-slate-100 py-1.5 px-4 rounded-full inline-block">PORTAL AKADEMIK TERPADU</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
          <div className="flex border-b border-slate-50 bg-slate-50/50 p-2">
            <button 
              onClick={() => { setTab('login'); setError(null); }}
              className={cn(
                "flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-2xl",
                tab === 'login' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              MASUK
            </button>
            <button 
              onClick={() => { setTab('register'); setError(null); }}
              className={cn(
                "flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-2xl",
                tab === 'register' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              DAFTAR
            </button>
          </div>

          <form onSubmit={handleAuth} className="p-10 space-y-7">
            <h2 className="text-center font-black text-slate-400 text-[11px] uppercase tracking-[0.2em] mb-4">
              {tab === 'login' ? 'Masuk Aplikasi' : 'Registrasi Akun'}
            </h2>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
                
                {error.includes('belum dikonfirmasi') && (
                  <button 
                    type="button"
                    onClick={() => navigate('/app')}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Lanjutkan sebagai Tamu (Mode Tes)
                  </button>
                )}
              </motion.div>
            )}

            <div className="space-y-5">
              {tab === 'register' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Nama Lengkap</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Ahmad Subagjo"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Peran / Status</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         type="button"
                         onClick={() => setRole('siswa')}
                         className={cn(
                           "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                           role === 'siswa' ? "bg-primary text-white shadow-xl shadow-rose-200" : "bg-slate-50 text-slate-400"
                         )}
                       >
                         Siswa
                       </button>
                       <button
                         type="button"
                         onClick={() => setRole('guru')}
                         className={cn(
                           "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                           role === 'guru' ? "bg-primary text-white shadow-xl shadow-rose-200" : "bg-slate-50 text-slate-400"
                         )}
                       >
                         Staff / Guru
                       </button>
                    </div>
                  </div>

                  {role === 'siswa' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Jurusan</label>
                      <select 
                        value={jurusan}
                        onChange={(e) => setJurusan(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-bold text-slate-600 uppercase tracking-widest appearance-none"
                      >
                        <option value="TKJ">TKJ - Teknik Komputer</option>
                        <option value="DKV">DKV - Desain Visual</option>
                        <option value="AK">AK - Akuntansi</option>
                        <option value="BC">BC - Broadcasting</option>
                        <option value="MPLB">MPLB - Perkantoran</option>
                        <option value="BD">BD - Bisnis Digital</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">
                  {tab === 'login' ? 'Email atau Kode NIS/NUPK' : (role === 'siswa' ? 'Username / NIS' : 'Alamat Email')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={tab === 'login' ? "Email atau Username" : (role === 'siswa' ? "Username Siswa" : "email@sekolah.sch.id")}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Kata Sandi</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-rose-600 shadow-2xl shadow-rose-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-[11px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (tab === 'login' ? 'Masuk Aplikasi' : 'Registrasi Akun')}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-12 text-[11px] text-slate-300 font-black uppercase tracking-[0.3em]">
          INTEGRATED EDUCATION SYSTEM
        </p>
      </motion.div>
    </div>
  );
}
