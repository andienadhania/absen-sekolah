import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Search, Filter, Download, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AttendanceRecap() {
  const { profile } = useAuth();
  const [type, setType] = useState<'siswa' | 'karyawan'>('siswa');
  const isSiswa = profile?.role === 'siswa';

  if (isSiswa) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Kehadiran Saya</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Rekam jejak kedisiplinan belajar di SMK Prima</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Hadir', value: '142', sub: 'Hari', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Sakit / Izin', value: '03', sub: 'Hari', color: 'bg-amber-50 text-amber-600' },
            { label: 'Alpha', value: '00', sub: 'Hari', color: 'bg-slate-50 text-slate-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.25em]">Riwayat Absensi Terakhir</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Waktu Masuk</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-600">
                  {[
                    { date: '24 Apr 2026', time: '06:45', status: 'HADIR', badge: 'bg-emerald-50 text-emerald-600' },
                    { date: '23 Apr 2026', time: '06:55', status: 'HADIR', badge: 'bg-emerald-50 text-emerald-600' },
                    { date: '22 Apr 2026', time: '07:10', status: 'TERLAMBAT', badge: 'bg-amber-50 text-amber-600' },
                    { date: '21 Apr 2026', time: '-', status: 'IZIN', badge: 'bg-blue-50 text-blue-600' },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 uppercase tracking-tighter">{row.date}</td>
                      <td className="px-6 py-5 font-mono">{row.time}</td>
                      <td className="px-6 py-5">
                        <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest", row.badge)}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400">Tercatat Sistem</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold">Rekapitulasi Absensi</h2>
          <p className="text-gray-500">Laporan kehadiran periode harian & bulanan</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setType('siswa')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              type === 'siswa' ? "bg-primary text-white" : "text-gray-400 hover:text-gray-900"
            )}
          >
            Siswa
          </button>
          <button 
            onClick={() => setType('karyawan')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              type === 'karyawan' ? "bg-primary text-white" : "text-gray-400 hover:text-gray-900"
            )}
          >
            Karyawan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-6">Filter Periode</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bulan</label>
                <select className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-600 outline-none appearance-none">
                  <option>April 2026</option>
                  <option>Maret 2026</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                <select className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-600 outline-none appearance-none">
                  <option>Keseluruhan</option>
                  <option>Hanya Alpha</option>
                </select>
              </div>
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-gray-200">
                <ArrowRight className="w-4 h-4" /> Tampilkan Data
              </button>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-white primary-gradient shadow-lg shadow-primary/20">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Download className="w-5 h-5" /> Ekspor Laporan
            </h4>
            <p className="text-xs text-white/70 leading-relaxed font-medium mb-6">
              Unduh laporan absensi dalam format EXCEL atau PDF untuk keperluan administrasi sekolah.
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
              Download .XLSX
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan nama..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none"
                />
              </div>
            </div>
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold italic tracking-tight">Pilih filter untuk melihat rekapitulasi absensi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
