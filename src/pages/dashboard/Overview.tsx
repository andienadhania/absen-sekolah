import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  BookOpen,
  Trophy,
  Activity,
  MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Overview() {
  const { profile } = useAuth();
  const isGuru = profile?.role === 'guru' || profile?.role === 'admin';
  const isSiswa = profile?.role === 'siswa';

  const stats = isGuru ? [
    { name: 'Total Siswa', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Kehadiran Hari Ini', value: '94.2%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Ujian Aktif', value: '12 Sesi', icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Rasio Kelulusan', value: '98%', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
  ] : [
    { name: 'Kehadiran Saya', value: '98.5%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Ujian Aktif', value: '3 Mapel', icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Nilai Rata-rata', value: '88.5', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Sikap / Poin', value: '100', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const personalPoin = isSiswa ? 100 : 0;
  const personalTasks = isSiswa ? 4 : (isGuru ? 2 : 0);

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/5 mb-6"
            >
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                {isGuru ? 'Teacher Dashboard' : (isSiswa ? 'Student Dashboard' : 'System Admin')} • SMK Prima v2.4
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
              SELAMAT DATANG, <br />
              <span className="text-primary italic animate-pulse">{profile?.name?.toUpperCase() || 'PENGGUNA'}</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest max-w-lg mb-8">
              Pusat kendali akademik SMK Prima Unggul Tangerang Selatan. Siap mencetak generasi cerdas dan beradab.
            </p>
            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
              <MapPin className="w-4 h-4" /> Tangerang Selatan, Indonesia • {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isSiswa && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl min-w-[240px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Poin Kedisiplinan</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black">{personalPoin}</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Sangat Baik</span>
                </div>
              </div>
            )}
            
            {isGuru && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl min-w-[240px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kehadiran Kelas</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black">94%</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Aktif</span>
                </div>
              </div>
            )}

            <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-rose-900/40">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                {isGuru ? 'Verifikasi Tugas' : 'Tugas Berjalan'}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black">{personalTasks.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-black text-white uppercase bg-white/20 px-2 py-1 rounded-lg">Update</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.name}</p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
              <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info Card */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.25em]">
                {isGuru ? 'Review Tugas Terbaru' : 'Agenda Belajar & Sekolah'}
              </h3>
            </div>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              {isGuru ? 'Buka Portofolio' : 'Lihat Jadwal'}
            </button>
          </div>
          
          <div className="flex-1 p-6">
            {(isGuru ? [
              { title: 'Tugas Dasar Desain - Andi XII TKJ 1', date: '10 Menit Lalu', type: 'PENDING', color: 'bg-rose-50 text-rose-600' },
              { title: 'Kuis Jaringan - Siti X TKJ 2', date: '1 Jam Lalu', type: 'SELESAI', color: 'bg-emerald-50 text-emerald-600' },
              { title: 'Laporan Magang - Budi XI TKJ 1', date: '3 Jam Lalu', type: 'REVIEW', color: 'bg-blue-50 text-blue-600' },
              { title: 'Ujian Bulanan - 24 Siswa', date: 'Kemarin', type: 'REKAP', color: 'bg-slate-50 text-slate-500' },
            ] : [
              { title: 'Matematika - Persamaan Linear', date: 'Pukul 07:30', type: 'KELAS', color: 'bg-emerald-50 text-emerald-600' },
              { title: 'Bahasa Indonesia - Teks Laporan', date: 'Pukul 09:15', type: 'KELAS', color: 'bg-blue-50 text-blue-600' },
              { title: 'Ujian Teori Kejuruan (Produktif)', date: '21 Juni 2026', type: 'PENTING', color: 'bg-rose-50 text-rose-600' },
              { title: 'Workshop Web Development', date: '15 Mei 2026', type: 'INFO', color: 'bg-slate-50 text-slate-500' },
            ]).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 transition-all group relative overflow-hidden">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 text-[10px]">
                    <span className="leading-none">{item.date.split(' ')[0]}</span>
                    <span className="text-[8px] opacity-60 uppercase">{item.date.split(' ')[1]?.substring(0, 3)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-md mt-2 inline-block uppercase tracking-widest", item.color)}>
                      {item.type}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Mini Action Card */}
        <div className="flex flex-col gap-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden h-[320px]">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-primary">System Monitoring</h3>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 group hover:border-primary/50 transition-all">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-2">Server Core</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase tracking-widest">Stable</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">99.9%</span>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-2">Memory usage</p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="w-1/4 h-full bg-primary" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2.1 GB / 8.0 GB</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
            <h3 className="font-black text-slate-800 mb-8 text-[10px] uppercase tracking-[0.3em]">Program Keahlian</h3>
            <div className="grid grid-cols-2 gap-3">
              {['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'].map(j => (
                <div key={j} className="bg-slate-50 p-4 rounded-2xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest text-center hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                  {j}
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200 active:scale-95">
              Info Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
