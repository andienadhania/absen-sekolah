import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { 
  Home, 
  UserCheck, 
  Users, 
  FileText, 
  BookOpen, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X,
  Settings,
  GraduationCap,
  Calendar,
  Bell,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import Overview from './dashboard/Overview';
import AttendanceEmployee from './dashboard/AttendanceEmployee';
import AttendanceStudent from './dashboard/AttendanceStudent';
import Students from './dashboard/Students';
import UserManagement from './dashboard/UserManagement';
import ExamList from './dashboard/ExamList';
import StudentResults from './dashboard/StudentResults';
import AttendanceRecap from './dashboard/AttendanceRecap';

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = profile?.role;

  const MENU_ITEMS = [
    { name: 'Dashboard', icon: Home, path: '/app', roles: ['admin', 'guru', 'tenaga', 'siswa'] },
    { name: 'Absensi Karyawan', icon: UserCheck, path: '/app/absensi-karyawan', roles: ['admin', 'guru', 'tenaga'] },
    { name: 'Absensi Siswa', icon: Calendar, path: '/app/absensi-siswa', roles: ['admin', 'guru'] },
    { name: 'Kehadiran Saya', icon: FileText, path: '/app/rekap-absensi', roles: ['siswa'] },
    { name: 'Rekap Absensi', icon: FileText, path: '/app/rekap-absensi', roles: ['admin', 'guru'] },
    { name: 'Data Siswa', icon: Users, path: '/app/data-siswa', roles: ['admin', 'guru'] },
    { name: 'User Management', icon: Settings, path: '/app/user-management', roles: ['admin'] },
    { name: 'Ujian Online', icon: BookOpen, path: '/app/ujian', roles: ['admin', 'guru', 'siswa'] },
    { name: 'Hasil Ujian', icon: GraduationCap, path: '/app/nilai', roles: ['admin', 'guru', 'siswa'] },
  ].filter(item => item.roles.includes(role || ''));

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-80 bg-slate-900 text-white z-50 transform transition-all duration-500 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full shadow-none"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/20">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <div className="leading-tight">
                <h1 className="font-black text-lg tracking-tighter uppercase">SMK PRIMA</h1>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Portal Digital</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Main Menu</p>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 group relative overflow-hidden",
                  location.pathname === item.path 
                    ? "bg-primary text-white shadow-xl shadow-rose-900/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform duration-500 group-hover:scale-110", location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-primary")} />
                {item.name}
                {location.pathname === item.path && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-full translate-x-1" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer (Profile Summary) */}
          <div className="p-6">
            <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary text-xl border border-primary/20">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Signed in as</p>
                  <p className="font-black text-xs truncate uppercase tracking-tight">{profile?.name || 'Academic User'}</p>
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">{role}</p>
                </div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 text-slate-500 hover:bg-slate-50 rounded-2xl lg:hidden transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 group transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white focus-within:border-primary/20">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Cari data, ujian, atau lapor..." 
                className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-400 w-64 uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Server Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Active System</span>
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-100 hidden lg:block" />

            <div className="flex items-center gap-3">
              <button className="p-3 text-slate-400 hover:text-primary hover:bg-rose-50 rounded-2xl transition-all relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white" />
              </button>
              <button 
                onClick={signOut}
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary shadow-xl shadow-slate-200 hover:shadow-rose-300 transition-all active:scale-95 group"
              >
                Logout <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
          <div className="max-w-7xl mx-auto mb-20">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/absensi-karyawan" element={<AttendanceEmployee />} />
              <Route path="/absensi-siswa" element={<AttendanceStudent />} />
              <Route path="/rekap-absensi" element={<AttendanceRecap />} />
              <Route path="/data-siswa" element={<Students />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/ujian" element={<ExamList />} />
              <Route path="/nilai" element={<StudentResults />} />
            </Routes>
          </div>
          
          {/* Breadcrumb / Page Title */}
          <div className="fixed bottom-10 right-10 z-20 pointer-events-none">
            <div className="bg-slate-900 text-white/50 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-xl border border-white/10 shadow-2xl">
              SMK PRIMA UNGGUL • {MENU_ITEMS.find(i => i.path === location.pathname)?.name || 'OVERVIEW'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
