import { useState } from 'react';
import { Calendar, Search, Filter, Download, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AttendanceRecap() {
  const [type, setType] = useState<'siswa' | 'karyawan'>('siswa');

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
