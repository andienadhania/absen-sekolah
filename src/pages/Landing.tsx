import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Camera, 
  Computer, 
  GraduationCap, 
  Layout, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const JURUSAN = [
  { name: 'TKJ', desc: 'Teknik Komputer dan Jaringan', icon: Computer, color: 'bg-blue-50 text-blue-600' },
  { name: 'DKV', desc: 'Desain Komunikasi Visual', icon: Layout, color: 'bg-purple-50 text-purple-600' },
  { name: 'AK', desc: 'Akuntansi', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'BC', desc: 'Broadcasting', icon: Camera, color: 'bg-rose-50 text-rose-600' },
  { name: 'MPLB', desc: 'Manajemen Perkantoran', icon: Users, color: 'bg-amber-50 text-amber-600' },
  { name: 'BD', desc: 'Bisnis Digital', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-100 selection:text-rose-600">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 transform group-hover:rotate-12 transition-transform duration-500">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-slate-800 leading-none">SMK PRIMA UNGGUL</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Kota Tangerang Selatan</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {['Visi & Misi', 'Jurusan', 'Prestasi', 'Kontak'].map(item => (
                <button key={item} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">{item}</button>
              ))}
            </div>
            <Link 
              to="/login"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:shadow-2xl hover:shadow-rose-300 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Masuk Aplikasi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Floating 3D-like elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[10%] w-32 h-32 bg-primary/10 rounded-3xl blur-2xl -z-10"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[5%] w-48 h-48 bg-rose-200/20 rounded-full blur-3xl -z-10"
        />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 mb-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Penerimaan Siswa Baru: Gelombang 1 Dibuka</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] text-slate-900">
              UNGGUL DALAM <br />
              <span className="text-primary italic relative">
                TEKNOLOGI
                <motion.svg 
                  className="absolute -bottom-4 left-0 w-full"
                  viewBox="0 0 400 30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  <path d="M0,20 Q100,0 200,20 T400,20" fill="none" stroke="currentColor" strokeWidth="4" />
                </motion.svg>
              </span>
              <br />
              MULIA DALAM ADAB
            </h1>

            <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl mb-14 leading-relaxed font-medium">
              SMK Prima Unggul Tangerang Selatan berkomitmen mencetak tenaga kerja profesional yang siap bersaing secara global dengan integritas karakter yang kokoh.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/login" className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:-translate-y-1 transition-all active:scale-95 shadow-2xl shadow-rose-200">
                Akses Portal <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                Company Profile
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Siswa Aktif', value: '1.2k+', icon: Users },
            { label: 'Alumni Sukses', value: '3.5k+', icon: GraduationCap },
            { label: 'Partner Industri', value: '150+', icon: Zap },
            { label: 'Penghargaan', value: '45+', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-200 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">Ekosistem Keunggulan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px]">Enam Program Keahlian dengan Standar Industri Internasional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {JURUSAN.map((j, i) => (
              <motion.div
                key={j.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all group relative cursor-pointer"
              >
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500", j.color)}>
                  <j.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors">{j.name}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{j.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  Detail Program <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-rose-200">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <span className="font-black text-2xl tracking-tighter">SMK PRIMA UNGGUL</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-bold uppercase tracking-wider">
              Jl. Letnan Sutopo No.1, BSD City, Tangerang Selatan. Membentuk masa depan Indonesia melalui pendidikan vokasi berkualitas.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'TW', 'YT'].map(social => (
                <div key={social} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                  {social}
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { title: 'PROFIL', links: ['Tentang Kami', 'Visi Misi', 'Sejarah', 'Struktur Organisasi'] },
              { title: 'AKADEMIK', links: ['Kurikulum', 'Kalender Pendidikan', 'Info Ujian', 'E-Learning'] },
              { title: 'PENDAFTARAN', links: ['PPDB Online', 'Biaya Pendidikan', 'Beasiswa', 'FAQ'] },
            ].map((section, i) => (
              <div key={i} className="space-y-6">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900 border-b-2 border-primary w-fit pb-1">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 SMK PRIMA UNGGUL • SINCE 2010</p>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <Globe className="w-4 h-4" />
            TERAKREDITASI "A" (UNGGUL)
          </div>
        </div>
      </footer>
    </div>
  );
}
