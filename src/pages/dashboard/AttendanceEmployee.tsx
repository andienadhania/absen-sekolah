import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import type { AttendanceEmployee } from '../../types';

export default function AttendanceEmployeePage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AttendanceEmployee[]>([]);
  const [isAlreadyPresent, setIsAlreadyPresent] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [profile]);

  async function fetchHistory() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);

      // Check if already present today
      const today = new Date().toISOString().split('T')[0];
      const presentToday = data?.some(a => a.date === today);
      setIsAlreadyPresent(presentToday || false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAttendance(status: AttendanceEmployee['status']) {
    if (!profile) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('attendance_employees').insert({
        user_id: profile.id,
        status,
        date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;
      await fetchHistory();
      setIsAlreadyPresent(true);
    } catch (err: any) {
      alert(err.message || 'Gagal melakukan absensi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Absensi Karyawan</h2>
          <p className="text-gray-500">Rekam kehadiran harian Anda di sini</p>
        </div>
        <div className="bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Action */}
        <section className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-wider">Status Kehadiran Hari Ini</h3>
            
            {isAlreadyPresent ? (
              <div className="text-center py-10 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-bold text-green-700 text-sm">Sudah Absen</h4>
                <p className="text-[10px] text-green-600/80 font-medium mt-1">Terima kasih atas dedikasi Anda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => handleAttendance('Hadir')}
                  disabled={loading}
                  className="w-full group p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-rose-50/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-slate-800">Hadir</p>
                      <p className="text-[10px] text-slate-400">Masuk tepat waktu</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-all" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {['Izin', 'Sakit'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => handleAttendance(s as any)}
                      disabled={loading}
                      className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-500 text-xs uppercase"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* History Table */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Log Absensi Terbaru</h3>
              <button className="text-primary text-xs font-bold uppercase tracking-wider">Unduh PDF</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="px-6 py-4">Tanggal & Jam</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Info</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{new Date(h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(h.created_at).toLocaleTimeString('id-ID')}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          h.status === 'Hadir' ? "bg-green-100 text-green-700" :
                          h.status === 'Alpha' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {h.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300">
                        <AlertCircle className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
