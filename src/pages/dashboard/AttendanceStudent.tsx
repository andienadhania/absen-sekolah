import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Search, Filter, Loader2, CheckCircle2, UserPlus, Users, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Student, AttendanceStudent } from '../../types';

export default function AttendanceStudentPage() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [search, setSearch] = useState('');

  // Local state for today's attendance to avoid multiple DB calls
  const [todayAttendance, setTodayAttendance] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: stdData, error: stdError } = await supabase.from('students').select('*').order('name');
      if (stdError) throw stdError;
      setStudents(stdData || []);

      const today = new Date().toISOString().split('T')[0];
      const { data: attData, error: attError } = await supabase
        .from('attendance_students')
        .select('student_id, status')
        .eq('date', today);
      
      if (attError) throw attError;
      
      const attMap: Record<string, string> = {};
      attData?.forEach(a => {
        attMap[a.student_id] = a.status;
      });
      setTodayAttendance(attMap);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(studentId: string, status: AttendanceStudent['status']) {
    if (!profile) return;
    setSaving(studentId);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Upsert logic
      const existingStatus = todayAttendance[studentId];
      
      if (existingStatus) {
        const { error } = await supabase
          .from('attendance_students')
          .update({ status, teacher_id: profile.id })
          .eq('student_id', studentId)
          .eq('date', today);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance_students')
          .insert({
            student_id: studentId,
            teacher_id: profile.id,
            status,
            date: today,
          });
        if (error) throw error;
      }

      setTodayAttendance(prev => ({ ...prev, [studentId]: status }));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  const classes = ['Semua Kelas', ...new Set(students.map(s => s.class))];
  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'Semua Kelas' || s.class === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold">Presensi Siswa</h2>
          <p className="text-gray-500">Kelola kehadiran siswa di kelas Anda hari ini</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {['Hari Ini', 'Riwayat'].map((tab) => (
            <button key={tab} className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              tab === 'Hari Ini' ? "bg-primary text-white" : "text-gray-400 hover:text-gray-900"
            )}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="Cari NIS atau Nama Siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          />
        </div>
        <div>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none font-bold text-slate-600 uppercase tracking-wider"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest justify-center">
          <Users className="w-4 h-4" />
          <span>Total: {filteredStudents.length}</span>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Siswa</th>
              <th className="px-6 py-4 text-center">Kehadiran Hari Ini</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={3} className="px-6 py-8">
                  <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                </td>
              </tr>
            )) : filteredStudents.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-400 text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{s.nis} • {s.class}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-1.5">
                    {[
                      { id: 'Hadir', active: 'bg-green-600 text-white shadow-lg shadow-green-100', inactive: 'bg-green-50 text-green-700 hover:bg-green-100' },
                      { id: 'Izin', active: 'bg-amber-500 text-white shadow-lg shadow-amber-100', inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                      { id: 'Sakit', active: 'bg-blue-500 text-white shadow-lg shadow-blue-100', inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                      { id: 'Alpha', active: 'bg-rose-600 text-white shadow-lg shadow-rose-100', inactive: 'bg-rose-50 text-rose-700 hover:bg-rose-100' }
                    ].map((status) => (
                      <button
                        key={status.id}
                        onClick={() => handleStatusChange(s.id, status.id as any)}
                        disabled={saving === s.id}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all min-w-[64px]",
                          todayAttendance[s.id] === status.id ? status.active : status.inactive
                        )}
                      >
                        {saving === s.id && todayAttendance[s.id] === status.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : status.id}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  {todayAttendance[s.id] ? (
                    <div className="flex items-center justify-end gap-2 text-green-600">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Tercatat</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic font-medium">Kosong</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
